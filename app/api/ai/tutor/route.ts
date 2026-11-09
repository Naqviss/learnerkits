import { handleTutor } from "@/lib/ai/tutor";

// Next.js development runtime. Workers AI is only bound in the Worker (`npm run preview`), so
// `npm run dev` needs an OpenAI-compatible provider (AI_BASE_URL, AI_API_KEY, AI_MODEL) to answer.
export async function POST(request: Request) {
  return handleTutor(request, {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    AI_BASE_URL: process.env.AI_BASE_URL,
    AI_API_KEY: process.env.AI_API_KEY,
    AI_MODEL: process.env.AI_MODEL,
    AI_DAILY_LIMIT: process.env.AI_DAILY_LIMIT,
    PADDLE_TEST_MODE: process.env.PADDLE_TEST_MODE,
  });
}
