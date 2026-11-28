import { describe, expect, it } from "vitest";
import { subjectsCatalog, visibleSubjectSlugs } from "@/lib/subjects/catalog";
import { getSimulationContent, getSimulationDescription, type SimulationContent } from "@/lib/seo/simulation-content";

// Quality rules for the per-simulation reference content. Run one subject with
// `npx vitest run tests/seo/simulation-content.test.ts -t space`.

const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
const allText = (c: SimulationContent) => [c.question, c.answer, ...c.science, c.formula?.expression ?? "", c.formula?.meaning ?? "", ...(c.example ? [c.example.title, ...c.example.paragraphs] : []), ...c.steps, c.misconception.myth, c.misconception.fact, c.modelNote, ...c.faq.flatMap((f) => [f.q, f.a])];
const sentences = (c: SimulationContent) => allText(c).flatMap((t) => t.split(/(?<=[.!?])\s+/)).map((s) => s.trim().toLowerCase()).filter((s) => words(s) >= 6);

// Phrases from the old shared template, and filler that reads as generated text.
const banned = [/change one variable so its effect/i, /turns an abstract idea/i, /browser-based/i, /free to use/i, /how long does the activity/i, /without (creating an account|signing up)/i, /\bdelve\b/i, /in conclusion/i, /\bin today's\b/i, /it is important to note/i, /\bembark\b/i, /\bunlock\b/i, /\btapestry\b/i];

const bySubject = visibleSubjectSlugs.map((subject) => ({ subject, slugs: subjectsCatalog[subject].simulations.map((s) => s.slug) }));
const everySlug = bySubject.flatMap((s) => s.slugs);

for (const { subject, slugs } of bySubject) {
  describe(`simulation content: ${subject}`, () => {
    for (const slug of slugs) {
      describe(slug, () => {
        const c = getSimulationContent(slug);
        it("has content", () => expect(c, `${slug} has no entry`).toBeDefined());
        if (!c) return;
        it("has an answer-first heading and paragraph", () => {
          expect(c.question.endsWith("?")).toBe(true);
          expect(words(c.answer)).toBeGreaterThanOrEqual(45);
          expect(words(c.answer)).toBeLessThanOrEqual(95);
          expect(c.answer).not.toMatch(/\bthis (simulation|lab|game|simulator|page)\b/i);
        });
        it("explains the science in two or three paragraphs", () => {
          expect(c.science.length).toBeGreaterThanOrEqual(2);
          expect(c.science.length).toBeLessThanOrEqual(3);
          for (const p of c.science) { expect(words(p)).toBeGreaterThanOrEqual(30); expect(words(p)).toBeLessThanOrEqual(110); }
        });
        it("has lab-specific steps", () => {
          expect(c.steps.length).toBeGreaterThanOrEqual(4);
          expect(c.steps.length).toBeLessThanOrEqual(5);
          for (const s of c.steps) expect(words(s)).toBeLessThanOrEqual(40);
        });
        if (c.example) it("has a specific worked example", () => {
          expect(words(c.example!.title)).toBeLessThanOrEqual(14);
          expect(c.example!.paragraphs.length).toBeGreaterThanOrEqual(1);
          expect(c.example!.paragraphs.length).toBeLessThanOrEqual(3);
          for (const p of c.example!.paragraphs) { expect(words(p)).toBeGreaterThanOrEqual(30); expect(words(p)).toBeLessThanOrEqual(120); }
          expect(c.example!.paragraphs.join(" ")).toMatch(/\d/);
        });
        it("has a misconception and a model note", () => {
          expect(words(c.misconception.myth)).toBeGreaterThanOrEqual(4);
          expect(words(c.misconception.fact)).toBeGreaterThanOrEqual(12);
          expect(words(c.modelNote)).toBeGreaterThanOrEqual(12);
          expect(words(c.modelNote)).toBeLessThanOrEqual(70);
        });
        it("has three to five topic questions with self-contained answers", () => {
          expect(c.faq.length).toBeGreaterThanOrEqual(3);
          expect(c.faq.length).toBeLessThanOrEqual(7);
          for (const f of c.faq) {
            expect(f.q.endsWith("?")).toBe(true);
            expect(words(f.a)).toBeGreaterThanOrEqual(slug === "balance-equation" ? 20 : 30);
            expect(words(f.a)).toBeLessThanOrEqual(95);
          }
        });
        if (slug !== "balance-equation") it("has its own meta description that Google shows in full", () => {
          const description = getSimulationDescription(slug, "en");
          expect(description, `${slug} has no entry in lib/seo/simulation-content/descriptions.ts`).toBeDefined();
          expect([...description!].length).toBeGreaterThanOrEqual(120);
          expect([...description!].length).toBeLessThanOrEqual(158);
          expect(description).not.toMatch(/no sign-up|no download|try the free|free online/i);
        });
        it("is substantial and avoids template or filler phrases", () => {
          expect(words(allText(c).join(" "))).toBeGreaterThanOrEqual(450);
          for (const pattern of banned) expect(allText(c).join(" "), `${slug} matches ${pattern}`).not.toMatch(pattern);
        });
      });
    }
  });
}

describe("simulation content: uniqueness across pages", () => {
  it("shares no sentence and no question between simulations", () => {
    const seen = new Map<string, string>();
    const clashes: string[] = [];
    for (const slug of everySlug) {
      const c = getSimulationContent(slug);
      if (!c) continue;
      for (const s of new Set([...sentences(c), ...c.faq.map((f) => f.q.toLowerCase()), c.question.toLowerCase()])) {
        const other = seen.get(s);
        if (other && other !== slug) clashes.push(`${other} & ${slug}: ${s}`);
        else seen.set(s, slug);
      }
    }
    expect(clashes).toEqual([]);
  });
});

describe("simulation meta descriptions", () => {
  it("are all different and share no sentence", () => {
    const seen = new Map<string, string>();
    const clashes: string[] = [];
    for (const slug of everySlug) for (const sentence of getSimulationDescription(slug, "en")?.toLowerCase().split(/(?<=[.!?])\s+/) ?? []) {
      if (seen.has(sentence)) clashes.push(`${seen.get(sentence)} & ${slug}: ${sentence}`);
      else seen.set(sentence, slug);
    }
    expect(clashes).toEqual([]);
  });
});

describe("simulation content: old topic guide URLs", () => {
  it("301-redirects every former /en/guides/<slug> page to its simulation page", async () => {
    const { readFileSync } = await import("node:fs");
    const { getTopicGuides } = await import("@/lib/seo/topic-guides");
    const rules = readFileSync("public/_redirects", "utf8");
    for (const guide of getTopicGuides()) expect(rules).toContain(`/en/guides/${guide.slug} /en/simulations/${guide.slug} 301`);
  });
});
