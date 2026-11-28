import { describe, expect, it } from "vitest";
import { subjectGuides, type SubjectGuide } from "@/lib/seo/subject-guides";
import { getSimulationContent, simulationContentSlugs, type SimulationContent } from "@/lib/seo/simulation-content";
import { subjectsCatalog, visibleSubjectSlugs, type SubjectSlug } from "@/lib/subjects/catalog";

// The English subject-page guides replace blocks every subject shared word for word, so each must be
// substantial, written for its subject alone, and share no sentence with another page's content.

const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
const guideText = (g: SubjectGuide) => [g.heading, g.intro, ...g.sections.flatMap((s) => [s.title, s.body])];
const splitSentences = (texts: string[]) => texts.flatMap((t) => t.split(/(?<=[.!?])\s+/)).map((s) => s.trim().toLowerCase()).filter((s) => words(s) >= 6);
const contentText = (c: SimulationContent) => [c.question, c.answer, ...c.science, c.formula?.expression ?? "", c.formula?.meaning ?? "", ...(c.example ? [c.example.title, ...c.example.paragraphs] : []), ...c.steps, c.misconception.myth, c.misconception.fact, c.modelNote, ...c.faq.flatMap((f) => [f.q, f.a])];

// Words each guide needs so its subject page reaches 840 words of its own (2026-11-28 audit).
const targets: Record<string, number> = { space: 640, chemistry: 605, physics: 595, geography: 585, "environmental-science": 580, mathematics: 535 };
const banned = [/free to use/i, /no sign-up/i, /without (creating an account|signing up)/i, /browser-based/i, /\bengaging\b/i, /learning journey/i, /\bunlock\b/i, /\bdelve\b/i, /\bembark\b/i, /in conclusion/i, /it is important to note/i, /turns an abstract idea/i];

describe("subject page guides", () => {
  it("exists for every visible subject except none", () => {
    for (const subject of Object.keys(targets)) expect(subjectGuides[subject as SubjectSlug], subject).toBeDefined();
    for (const subject of visibleSubjectSlugs) if (subject in targets) expect(subjectGuides[subject]).toBeDefined();
  });

  for (const [subject, target] of Object.entries(targets)) {
    describe(subject, () => {
      const guide = subjectGuides[subject as SubjectSlug]!;
      const labSlugs = new Set(subjectsCatalog[subject as SubjectSlug].simulations.map((sim) => sim.slug));

      it("links only this subject's labs and every one of them", () => {
        const linked = new Set(guide.sections.flatMap((s) => s.labs));
        for (const slug of linked) expect(labSlugs.has(slug), `${slug} is not a ${subject} lab`).toBe(true);
        for (const slug of labSlugs) expect(linked.has(slug), `${slug} is not linked`).toBe(true);
      });

      it("keeps the intro and sections within their lengths", () => {
        expect(words(guide.intro)).toBeGreaterThanOrEqual(50);
        expect(words(guide.intro)).toBeLessThanOrEqual(140);
        expect(guide.sections.length).toBeGreaterThanOrEqual(4);
        expect(guide.sections.length).toBeLessThanOrEqual(7);
        for (const s of guide.sections) {
          expect(words(s.body), s.title).toBeGreaterThanOrEqual(60);
          expect(words(s.body), s.title).toBeLessThanOrEqual(160);
          expect(s.body, s.title).toMatch(/\d/);
        }
      });

      it(`has at least ${target} words and no filler phrases`, () => {
        const text = guideText(guide).join(" ");
        expect(words(text)).toBeGreaterThanOrEqual(target);
        for (const pattern of banned) expect(text, `${subject} matches ${pattern}`).not.toMatch(pattern);
      });
    });
  }

  it("uses no heading twice across subjects", () => {
    const headings = Object.values(subjectGuides).flatMap((g) => [g!.heading, ...g!.sections.map((s) => s.title)]).map((h) => h.toLowerCase());
    expect(new Set(headings).size).toBe(headings.length);
  });

  it("shares no sentence between guides or with any simulation page", () => {
    const seen = new Map<string, string>();
    const clashes: string[] = [];
    for (const [subject, guide] of Object.entries(subjectGuides)) for (const sentence of new Set(splitSentences(guideText(guide!)))) {
      const other = seen.get(sentence);
      if (other && other !== subject) clashes.push(`${other} & ${subject}: ${sentence}`);
      else seen.set(sentence, subject);
    }
    for (const slug of simulationContentSlugs()) for (const sentence of splitSentences(contentText(getSimulationContent(slug)!))) {
      const subject = seen.get(sentence);
      if (subject) clashes.push(`${subject} guide & ${slug}: ${sentence}`);
    }
    expect(clashes).toEqual([]);
  });
});
