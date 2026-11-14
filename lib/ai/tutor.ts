import { isEntitled } from "../billing/entitlement";
import { isLocale, localeNames } from "../i18n/config";
import { resolvePaddle, type PaddleEnv } from "../billing/paddle-config";
import { isSameOrigin, json, readJsonBody, readSubscriptions, rpc, supabaseAdmin, userFromRequest, type SupabaseEnv } from "../server/supabase";

/** Cloudflare Workers AI binding (wrangler.jsonc "ai"), typed loosely to avoid a types package. */
export type AiBinding = { run(model: string, input: Record<string, unknown>): Promise<unknown> };
export type TutorEnv = SupabaseEnv & PaddleEnv & {
  AI?: AiBinding;
  /** Workers AI model id, or the model name for an OpenAI-compatible provider. */
  AI_MODEL?: string;
  /** Optional OpenAI-compatible provider instead of Workers AI (OpenAI, Qwen/DashScope, OpenRouter…). */
  AI_BASE_URL?: string;
  AI_API_KEY?: string;
  /** Tutor questions per subscriber per UTC day. */
  AI_DAILY_LIMIT?: string;
};

// Qwen3 MoE: inexpensive, multilingual, and covered by Workers AI's free daily allocation.
export const defaultWorkersAiModel = "@cf/qwen/qwen3-30b-a3b-fp8";
const defaultDailyLimit = 40;
const maxMessages = 12;
const maxMessageLength = 1_200;

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };
const clip = (value: unknown, max: number) => typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";

/** POST /api/ai/tutor — Premium-only science tutor for the simulation on screen. */
export async function handleTutor(request: Request, env: TutorEnv): Promise<Response> {
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
  if (!isSameOrigin(request)) return json(403, { error: "Please use the tutor on the LearnerKits website." });
  const admin = supabaseAdmin(env);
  const provider = env.AI ? "workers-ai" : env.AI_BASE_URL && env.AI_API_KEY && env.AI_MODEL ? "openai-compatible" : null;
  if (!admin || !provider) return json(503, { error: "The AI tutor is not available yet. Please try again later." });
  const user = await userFromRequest(request, admin);
  if (!user) return json(401, { error: "Please sign in again to use the AI tutor." });
  try {
    if (!(await readSubscriptions(admin, user.id, resolvePaddle(env).mode)).some((row) => isEntitled(row))) return json(402, { error: "The AI tutor is part of LearnerKits Premium." });
  } catch { return json(503, { error: "The AI tutor is not available right now. Please try again later." }); }

  const body = await readJsonBody(request, 40_000);
  const messages = parseMessages(body?.messages);
  if (!body || !messages) return json(400, { error: "Please type a question first." });
  const simulation = (body.simulation && typeof body.simulation === "object" ? body.simulation : {}) as Record<string, unknown>;
  // Exam Prep topic pages send the topic and course instead of a simulation on screen.
  const topic = (body.topic && typeof body.topic === "object" ? body.topic : {}) as Record<string, unknown>;
  const locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : "en";

  const limit = Number.parseInt(env.AI_DAILY_LIMIT ?? "", 10);
  const quota = await rpc(admin, "consume_ai_request", { p_user_id: user.id, p_daily_limit: Number.isFinite(limit) ? limit : defaultDailyLimit }).catch(() => null);
  if (!quota?.ok) return json(503, { error: "The AI tutor is not available right now. Please try again later." });
  if (await quota.json() !== true) return json(429, { error: "You have used today's AI tutor questions. Try again tomorrow." });

  const system = tutorPrompt({
    title: clip(simulation.title, 120),
    subject: clip(simulation.subject, 60),
    concepts: clip(simulation.concepts, 300),
    language: localeNames[locale],
    topic: clip(topic.name, 120),
    course: clip(topic.course, 120),
  });
  try {
    const reply = await runModel(env, [{ role: "system", content: system }, ...messages]);
    if (!reply) return json(502, { error: "The tutor didn't answer. Please try asking again." });
    return json(200, { reply });
  } catch (error) {
    console.error("AI tutor request failed", error);
    return json(502, { error: "The tutor is busy right now. Please try again in a moment." });
  }
}

function parseMessages(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const messages = value.slice(-maxMessages).map((item) => {
    const message = item as { role?: unknown; content?: unknown };
    const content = typeof message.content === "string" ? message.content.trim().slice(0, maxMessageLength) : "";
    return (message.role === "user" || message.role === "assistant") && content ? { role: message.role, content } : null;
  });
  if (messages.some((message) => !message)) return null;
  const valid = messages as ChatMessage[];
  return valid[valid.length - 1].role === "user" ? valid : null;
}

export function tutorPrompt({ title, subject, concepts, language, topic = "", course = "" }: { title: string; subject: string; concepts: string; language: string; topic?: string; course?: string }) {
  const context = topic
    ? `The student is revising the exam topic "${topic}"${course ? ` for ${course}` : ""}${subject ? ` (${subject})` : ""}${concepts ? `. Key ideas: ${concepts}` : ""}.`
    : title
    ? `The student is using the interactive simulation "${title}"${subject ? ` (${subject})` : ""}${concepts ? `. Key ideas: ${concepts}` : ""}.`
    : "The student is exploring LearnerKits science simulations.";
  return [
    topic
      ? "You are the LearnerKits tutor, helping a school student (roughly 14 to 18 years old) prepare for an exam."
      : "You are the LearnerKits science tutor, helping a school student (roughly 10 to 16 years old).",
    context,
    "Guidelines:",
    "- Explain clearly in short paragraphs (usually under 150 words) with simple words and everyday examples.",
    topic
      ? "- Help them think: when asked for practice, give one exam-style question on this topic, wait for their answer, then mark it and explain. Guide the reasoning rather than only giving the final answer. Do not claim to quote real past papers or mark schemes."
      : "- Help them think: suggest something to try or change in the simulation, and ask one follow-up question. For homework, guide the reasoning rather than only giving the final answer.",
    "- Stay on science, mathematics, and learning. Gently bring other topics back to the lesson.",
    "- Never ask for personal information, and tell the student not to share it.",
    "- Do not give instructions for dangerous real-world experiments, weapons, drugs, or self-harm. If a student seems unsafe or upset, encourage them to talk to a trusted adult.",
    "- If you are not sure, say so. Do not invent facts, sources, or numbers.",
    `- Reply in ${language}. Use plain text only: no Markdown headings, tables, or code blocks.`,
    "/no_think",
  ].join("\n");
}

export async function runModel(env: TutorEnv, messages: ChatMessage[], maxTokens = 700): Promise<string> {
  let output: unknown;
  if (env.AI) {
    output = await env.AI.run(env.AI_MODEL || defaultWorkersAiModel, { messages, max_tokens: maxTokens, temperature: 0.4 });
  } else {
    const response = await fetch(`${env.AI_BASE_URL!.replace(/\/+$/, "")}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.AI_API_KEY}` },
      body: JSON.stringify({ model: env.AI_MODEL, messages, max_tokens: maxTokens, temperature: 0.4 }),
      signal: AbortSignal.timeout(45_000),
    });
    if (!response.ok) throw new Error(`AI provider responded ${response.status}: ${(await response.text()).slice(0, 300)}`);
    output = await response.json();
  }
  return extractReply(output);
}

/** Handles both the OpenAI-style `choices` shape and the older Workers AI `{ response }` shape. */
export function extractReply(output: unknown): string {
  const data = output as { choices?: { message?: { content?: unknown } }[]; response?: unknown };
  const text = data?.choices?.[0]?.message?.content ?? data?.response;
  if (typeof text !== "string") return "";
  // Reasoning models may still include their hidden thinking; never show it to students.
  return text.replace(/<think>[\s\S]*?<\/think>/g, "").replace(/^[\s\S]*?<\/think>/, "").trim();
}
