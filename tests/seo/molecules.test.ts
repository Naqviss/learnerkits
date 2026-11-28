import { describe, expect, it } from "vitest";
import { molecules } from "@/lib/simulations/chemistry/model";
import { classMistake, coreMoleculeSlugs, getMoleculeReference, getVseprClasses, lewisSteps, moleculeCopy, moleculeReferences } from "@/lib/seo/molecules";
import sitemap from "@/app/sitemap";
import MoleculesPage, { generateMetadata } from "@/app/[locale]/molecules/page";
import { moleculeDetails } from "@/lib/seo/molecule-details";
import { legacyRedirect } from "@/lib/seo/legacy-redirects";
import { moleculeImageAlt, moleculeImageSvg } from "@/lib/seo/molecule-image";
import { renderToStaticMarkup } from "react-dom/server";
import { moleculeAbout } from "@/lib/seo/molecule-about";
import { bondLengths } from "@/lib/simulations/chemistry/bondLengths";

describe("molecule reference data", () => {
  it("covers every lab molecule with a real name and a unique URL-safe slug", () => {
    expect(moleculeReferences).toHaveLength(molecules.length);
    for (const m of moleculeReferences) {
      expect(m.name).not.toBe(m.formula);
      expect(m.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
    expect(new Set(moleculeReferences.map((m) => m.slug)).size).toBe(moleculeReferences.length);
  });
  it("derives textbook VSEPR facts", () => {
    const water = getMoleculeReference("water-h2o")!;
    expect(water).toMatchObject({ shape: "Bent", electronGeometry: "Tetrahedral", axe: "AX₂E₂", hybridization: "sp³", polarity: "Polar" });
    expect(getMoleculeReference("ammonia-nh3")).toMatchObject({ axe: "AX₃E", shape: "Trigonal pyramidal", polarity: "Polar" });
    expect(getMoleculeReference("carbon-dioxide-co2")).toMatchObject({ electronGeometry: "Linear", hybridization: "sp", polarity: "Nonpolar" });
    expect(getMoleculeReference("xenon-tetrafluoride-xef4")).toMatchObject({ axe: "AX₄E₂", electronGeometry: "Octahedral", polarity: "Nonpolar" });
    expect(getMoleculeReference("xenon-difluoride-xef2")).toMatchObject({ electronGeometry: "Trigonal bipyramidal", polarity: "Nonpolar" });
    expect(getMoleculeReference("ammonium-ion-nh4")).toMatchObject({ isIon: true, polarity: "Ion" });
    expect(getMoleculeReference("mercury-ii-chloride-hgcl2")).toBeDefined();
    expect(getMoleculeReference("permanganate-ion-mno4")?.hybridization).toBeUndefined();
  });
  it("groups the chart by electron domains and keeps FAQ answers specific", () => {
    const classes = getVseprClasses();
    expect(classes.map((c) => c.domains)).toEqual([...classes.map((c) => c.domains)].sort((a, b) => a - b));
    expect(classes).toHaveLength(13);
    const faq = moleculeCopy(getMoleculeReference("water-h2o")!).faq;
    expect(faq.map((f) => f.q)).toContain("Is H₂O polar or nonpolar?");
    expect(faq.every((f) => f.a.includes("H₂O") || f.a.includes("Water"))).toBe(true);
  });
  it("adds sourced background, Lewis bookkeeping and a class-specific mistake", () => {
    expect(Object.keys(moleculeAbout).length).toBeGreaterThanOrEqual(100);
    for (const [formula, entry] of Object.entries(moleculeAbout)) {
      expect(moleculeReferences.some((m) => m.formula === formula), formula).toBe(true);
      expect(entry.source).toMatch(/^https:\/\//);
      expect(entry.about.split(/\s+/).length, formula).toBeGreaterThanOrEqual(70);
    }
    for (const [formula, entry] of Object.entries(bondLengths)) {
      expect(moleculeReferences.some((m) => m.formula === formula), formula).toBe(true);
      expect(entry.source).toMatch(/^https:\/\//);
    }
    expect(lewisSteps(getMoleculeReference("water-h2o")!)?.total).toBe(8);
    expect(lewisSteps(getMoleculeReference("sulfate-ion-so4")!)?.total).toBe(32);
    expect(lewisSteps(getMoleculeReference("xenon-tetrafluoride-xef4")!)?.total).toBe(36);
    expect(lewisSteps(getMoleculeReference("permanganate-ion-mno4")!)).toBeUndefined();
    expect(moleculeReferences.every((m) => classMistake(m))).toBe(true);
  });
});

describe("molecule search images", () => {
  it("draws every molecule with one atom per position, its lone pairs, and escaped text", () => {
    for (const m of moleculeReferences) {
      const svg = moleculeImageSvg(m);
      expect(svg, m.slug).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="1200" height="800"/);
      expect(svg.match(/fill="url\(#atom-/g), m.slug).toHaveLength(m.bondingPairs + 1);
      expect(svg.match(/<ellipse /g) ?? [], m.slug).toHaveLength(m.lonePairs);
      expect(svg, m.slug).not.toMatch(/NaN|undefined|Infinity/);
      expect(svg.replace(/<[^>]+>/g, ""), m.slug).not.toMatch(/[<>]/);
    }
    expect(moleculeImageSvg(getMoleculeReference("sulfur-tetrafluoride-sf4")!)).toContain("&lt;90°");
    expect(moleculeImageAlt(getMoleculeReference("mercury-ii-chloride-hgcl2")!)).toContain("(mercury(II) chloride)");
    expect(moleculeImageAlt(getMoleculeReference("sulfate-ion-so4")!)).toMatch(/^Ball-and-stick model of SO4 2- \(sulfate ion\)/);
  });
});

describe("VSEPR chart page", () => {
  it("is the only molecule page in the sitemap and lists every molecule in its own table", async () => {
    const listed = sitemap().map((entry) => new URL(entry.url).pathname).filter((path) => path.startsWith("/en/molecules"));
    expect(listed).toEqual(["/en/molecules"]);
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "en" }) });
    expect(metadata.alternates?.canonical).toBe("https://www.learnerkits.com/en/molecules");
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
    const html = renderToStaticMarkup(await MoleculesPage({ params: Promise.resolve({ locale: "en" }) }));
    for (const m of moleculeReferences) expect(html, m.slug).toContain(`href="#${m.slug}"`);
    expect(html).not.toContain('href="/en/molecules/');
    expect(html).toContain("Why lone pairs squeeze bond angles");
    expect(html).toContain(classMistake(getMoleculeReference("water-h2o")!)!);
    // The per-molecule details load only when a dialog opens; they are not in the page HTML.
    expect(html).not.toContain(moleculeAbout["CH₄"].about);
  });

  it("describes every molecule in the page's structured data and offers a textbook filter", async () => {
    const html = renderToStaticMarkup(await MoleculesPage({ params: Promise.resolve({ locale: "en" }) }));
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
    const items = blocks.find((block) => block.mainEntity?.["@type"] === "ItemList").mainEntity.itemListElement;
    expect(items).toHaveLength(moleculeReferences.length);
    const sf4 = items.find((entry: { item: { "@id": string } }) => entry.item["@id"].endsWith("#sulfur-tetrafluoride-sf4")).item;
    expect(sf4).toMatchObject({ "@type": "DefinedTerm", alternateName: "SF4", termCode: "AX₄E" });
    expect(sf4.description).toMatch(/^SF4 \(sulfur tetrafluoride\) has a seesaw molecular geometry/);
    expect(sf4.description).toContain("sp³d hybridization");
    // Every row has a "View 3D" button and shows the plain formula students type.
    expect(html.match(/>View 3D</g)).toHaveLength(moleculeReferences.length);
    expect(html).toContain(">SF4</small>");
    expect(html).toContain("Textbook examples only");
    expect(coreMoleculeSlugs.size).toBe(40);
    for (const slug of coreMoleculeSlugs) expect(getMoleculeReference(slug), slug).toBeDefined();
    expect(new Set([...coreMoleculeSlugs].map((slug) => { const m = getMoleculeReference(slug)!; return `${m.axe}|${m.shape}`; })).size).toBe(getVseprClasses().length);
  });

  it("writes at least 800 words of its own above the table", async () => {
    const html = renderToStaticMarkup(await MoleculesPage({ params: Promise.resolve({ locale: "en" }) }));
    const prose = html.slice(0, html.indexOf('id="all-molecules"')).replace(/<script[^>]*>.*?<\/script>/gs, "").replace(/<table.*?<\/table>/gs, "").replace(/<[^>]+>/g, " ");
    expect(prose.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(800);
  });

  it("opens each molecule with its details and sends the old molecule URLs to it", () => {
    const water = moleculeDetails("water-h2o")!;
    expect(water.lewis?.steps.length).toBeGreaterThan(3);
    expect(water.about?.text).toBe(moleculeAbout["H₂O"].about);
    expect(water.polarity).toContain("H₂O is polar");
    expect(moleculeDetails("not-a-molecule")).toBeUndefined();
    expect(legacyRedirect("/en/molecules/water-h2o")).toBe("/en/molecules#water-h2o");
    expect(legacyRedirect("/en/guides/food-chain-simulator/mission")).toBe("/en/simulations/food-chain-simulator#investigation");
    expect(legacyRedirect("/en/guides/food-chain-simulator/how-to-measure")).toBe("/en/simulations/food-chain-simulator#investigation");
    expect(legacyRedirect("/en/molecules")).toBeNull();
    expect(legacyRedirect("/en/guides/environmental-city-builder")).toBeNull();
  });
});
