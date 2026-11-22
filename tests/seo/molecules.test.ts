import { describe, expect, it } from "vitest";
import { molecules } from "@/lib/simulations/chemistry/model";
import { classMistake, getMoleculeReference, getVseprClasses, indexedMoleculeReferences, isMoleculeIndexed, lewisSteps, moleculeCopy, moleculeFamily, moleculeReferences, moleculeSearchCopy } from "@/lib/seo/molecules";
import sitemap from "@/app/sitemap";
import MoleculePage, { generateMetadata } from "@/app/[locale]/molecules/[slug]/page";
import { moleculeImageAlt, moleculeImageSvg } from "@/lib/seo/molecule-image";
import { renderToStaticMarkup } from "react-dom/server";
import { moleculeAbout } from "@/lib/seo/molecule-about";
import { bondLengths } from "@/lib/simulations/chemistry/bondLengths";

describe("molecule reference pages", () => {
  it("covers every lab molecule with a real name and a unique URL-safe slug", () => {
    expect(moleculeReferences).toHaveLength(molecules.length);
    for (const m of moleculeReferences) {
      expect(m.name).not.toBe(m.formula);
      expect(m.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
    expect(new Set(moleculeReferences.map((m) => m.slug)).size).toBe(moleculeReferences.length);
  });
  it("opens a core set covering every VSEPR class to search and keeps the rest unlisted", async () => {
    const indexed = indexedMoleculeReferences();
    // Every slug in the core list must be a real page, so a typo cannot silently drop one.
    expect(indexed).toHaveLength(40);
    expect(new Set(indexed.map((m) => `${m.axe}|${m.shape}`)).size).toBe(getVseprClasses().length);
    const listed = sitemap().map((entry) => new URL(entry.url).pathname).filter((path) => path.startsWith("/en/molecules/"));
    expect(listed.sort()).toEqual(indexed.map((m) => `/en/molecules/${m.slug}`).sort());
    for (const m of moleculeReferences) {
      const metadata = await generateMetadata({ params: Promise.resolve({ locale: "en", slug: m.slug }) });
      expect(metadata.alternates?.canonical, m.slug).toBe(`https://www.learnerkits.com/en/molecules/${m.slug}`);
      if (isMoleculeIndexed(m)) expect(metadata.robots, m.slug).toMatchObject({ index: true, follow: true });
      else expect(metadata.robots, m.slug).toEqual({ index: true, follow: true, googleBot: { index: false, follow: true } });
    }
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
  it("writes search titles and descriptions with the plain formula people type", () => {
    expect(moleculeSearchCopy(getMoleculeReference("phosphorus-pentafluoride-pf5")!).title).toBe("PF5 (Phosphorus Pentafluoride) Molecular Geometry & Shape");
    expect(moleculeSearchCopy(getMoleculeReference("ammonia-nh3")!).title).toBe("NH3 (Ammonia) Molecular Geometry, Shape & Bond Angle (3D)");
    expect(moleculeSearchCopy(getMoleculeReference("hydrogen-sulfide-h2s")!).description).toMatch(/^Why is H2S \(hydrogen sulfide\) bent\? .*Lewis structure/);
    expect(moleculeSearchCopy(getMoleculeReference("carbon-dioxide-co2")!).description).toContain("Why is CO2 (carbon dioxide) linear?");
    expect(moleculeSearchCopy(getMoleculeReference("sulfate-ion-so4")!).title).toBe("SO4 2- (Sulfate Ion) Molecular Geometry, Shape & Bond Angle");
    expect(moleculeSearchCopy(getMoleculeReference("nitrate-ion-no3")!).title).toMatch(/^NO3- \(Nitrate Ion\) /);
    // Every page that is open to search carries both the formula and the chemical name in its title.
    for (const m of indexedMoleculeReferences()) expect(moleculeSearchCopy(m).title, m.slug).toContain(`(${m.name.replace(/(^|[\s-])([a-z])/g, (_, gap: string, letter: string) => gap + letter.toUpperCase())})`);
    for (const m of moleculeReferences) {
      const { title, description } = moleculeSearchCopy(m);
      expect(title, m.slug).not.toMatch(/[₀-₉⁰¹²³⁴-⁹]/);
      expect(title.length, title).toBeLessThanOrEqual(60);
      expect(description.length, description).toBeLessThanOrEqual(160);
      expect(description.toLowerCase()).toContain("electron geometry");
    }
  });
  it("adds sourced background, Lewis bookkeeping, family trends, and a class-specific mistake", () => {
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
    expect(moleculeFamily(getMoleculeReference("water-h2o")!).map((m) => m.formula)).toEqual(["H₂O", "H₂S", "H₂Se", "H₂Te"]);
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

  it("gives each molecule page its own image instead of the site logo", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "en", slug: "ammonia-nh3" }) });
    expect(metadata.title).toEqual({ absolute: "NH3 (Ammonia) Molecular Geometry, Shape & Bond Angle (3D)" });
    expect(metadata.openGraph?.images).toEqual([expect.objectContaining({ url: "https://www.learnerkits.com/images/molecules/ammonia-nh3.jpg", width: 1200, height: 630 })]);
    const html = renderToStaticMarkup(await MoleculePage({ params: Promise.resolve({ locale: "en", slug: "ammonia-nh3" }) }));
    expect(html).toContain('src="/images/molecules/ammonia-nh3.svg"');
    expect(html).toContain("NH₃ (ammonia) molecular geometry and shape");
    const resource = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((match) => JSON.parse(match[1])).find((item) => item["@type"]?.includes?.("LearningResource"));
    expect(resource.primaryImageOfPage).toMatchObject({ "@type": "ImageObject", contentUrl: "https://www.learnerkits.com/images/molecules/ammonia-nh3.svg" });
  });
});
