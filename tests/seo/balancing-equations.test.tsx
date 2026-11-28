import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { reactions } from "@/lib/simulations/chemistry/model";
import { balancedEquations, balancingFaq, balancingMethod, balancingSeo, balancingWorkedExamples, formatBalanced } from "@/lib/seo/balancing-equations";
import SimulationPage, { generateMetadata } from "@/app/[locale]/simulations/[slug]/page";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

describe("balancing chemical equations reference", () => {
  it("names every equation in the game", () => {
    const equations = balancedEquations();
    expect(equations).toHaveLength(reactions.length);
    expect(equations.every((equation) => !equation.name.startsWith("Reaction "))).toBe(true);
    expect(new Set(equations.map((equation) => equation.name)).size).toBe(equations.length);
  });

  it("shows only answers that conserve every atom and the charge, in lowest terms", () => {
    for (const reaction of reactions) {
      const label = formatBalanced(reaction);
      const elements = new Set(reaction.atoms.flatMap((atoms) => Object.keys(atoms)));
      for (const element of elements) {
        const total = (from: number, to: number) => reaction.atoms.slice(from, to).reduce((sum, atoms, i) => sum + ((atoms as Record<string, number>)[element] ?? 0) * reaction.solution[from + i], 0);
        expect(total(0, reaction.split), `${label}: ${element}`).toBe(total(reaction.split, reaction.formula.length));
      }
      if ("charges" in reaction && reaction.charges) {
        const charge = (from: number, to: number) => reaction.charges!.slice(from, to).reduce((sum, value, i) => sum + value * reaction.solution[from + i], 0);
        expect(charge(0, reaction.split), `${label}: charge`).toBe(charge(reaction.split, reaction.formula.length));
      }
      expect(reaction.solution.reduce(gcd), label).toBe(1);
    }
  });

  it("formats coefficients the way textbooks write them", () => {
    const byName = Object.fromEntries(balancedEquations().map((equation) => [equation.name, equation.balanced]));
    expect(byName["Water formation"]).toBe("2H₂ + O₂ → 2H₂O");
    expect(byName["Propane combustion"]).toBe("C₃H₈ + 5O₂ → 3CO₂ + 4H₂O");
    expect(byName["Permanganate half-equation"]).toBe("MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O");
  });

  it("worked examples end on the game's own answers", () => {
    const answers = balancedEquations().map((equation) => equation.balanced);
    for (const example of balancingWorkedExamples) expect(answers).toContain(example.result);
  });

  it("gives the page a search title, answer-first content, and matching structured data", async () => {
    const params = Promise.resolve({ locale: "en", slug: "balance-equation" });
    const metadata = await generateMetadata({ params });
    expect(metadata.title).toEqual({ absolute: balancingSeo.title });
    expect(balancingSeo.title.length).toBeLessThanOrEqual(65);
    expect(metadata.description).toBe(balancingSeo.description);
    expect(balancingSeo.description.length).toBeLessThanOrEqual(160);
    expect(metadata.robots).toMatchObject({ index: true });

    const html = renderToStaticMarkup(await SimulationPage({ params: Promise.resolve({ locale: "en", slug: "balance-equation" }) }));
    expect(html).toContain("How to balance chemical equations");
    expect(html).toContain("C₃H₈ + 5O₂ → 3CO₂ + 4H₂O");
    expect(html.match(/<tr>/g)?.length).toBeGreaterThanOrEqual(reactions.length);
    const data = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
    expect(data.find((item) => item["@type"] === "HowTo").step).toHaveLength(balancingMethod.length);
    const faq = data.find((item) => item["@type"] === "FAQPage");
    expect(faq.mainEntity.map((question: { name: string }) => question.name)).toEqual(balancingFaq.map((item) => item.q));
    for (const item of balancingFaq) expect(html).toContain(item.q.replace(/'/g, "&#x27;"));
  });

  it("is not published in other languages while English is the only one", async () => {
    // Spanish is held back (lib/i18n/config.ts), so its URL is a 404 here and a 301 to English in the Worker.
    await expect(SimulationPage({ params: Promise.resolve({ locale: "es", slug: "balance-equation" }) })).rejects.toThrow();
  });
});
