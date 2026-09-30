import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import sitemap from "@/app/sitemap";
import SimulationPage, { generateMetadata, generateStaticParams } from "@/app/[locale]/simulations/[slug]/page";
import { ChemistryTopics } from "@/components/subjects/chemistry/ChemistryTopics";
import { SimulationGuide } from "@/components/seo/SimulationGuide";
import { courseLabs } from "@/lib/simulations/chemistry/course/catalog";
import { subjectsCatalog, getSimulationCard } from "@/lib/subjects/catalog";
import { getSimulationGuide } from "@/lib/seo/simulation-guides";
import { locales } from "@/lib/i18n/config";

describe("chemistry discovery and indexability",()=>{
 it("publishes every new lab in static routes, sitemap, metadata and topic links",async()=>{
  const paths=generateStaticParams().map(p=>p.slug),entries=sitemap();
  const html=renderToStaticMarkup(<ChemistryTopics locale="en" subject={subjectsCatalog.chemistry}/>);
  for(const lab of courseLabs){
   expect(paths).toContain(lab.slug);
   for(const locale of locales)expect(entries.some(p=>p.url.endsWith(`/${locale}/simulations/${lab.slug}`))).toBe(true);
   expect(html).toContain(`/en/simulations/${lab.slug}`);
   const metadata=await generateMetadata({params:Promise.resolve({locale:"en",slug:lab.slug})});
   expect(metadata.title).toContain(lab.title);
   const simulation=getSimulationCard(lab.slug)!;
   const guide=getSimulationGuide("en",subjectsCatalog.chemistry,simulation);
   expect(guide.investigateBody).toBe(lab.explanation);
   expect(guide.steps).toEqual(lab.steps);
  }
 });
 it("excludes the hidden element hunt from listings, sitemap, route generation and direct access",async()=>{
  expect(getSimulationCard("periodic-table-hunt")).toBeUndefined();
  expect(sitemap().some(p=>p.url.includes("periodic-table-hunt"))).toBe(false);
  expect(generateStaticParams().some(p=>p.slug==="periodic-table-hunt")).toBe(false);
  await expect(SimulationPage({params:Promise.resolve({locale:"en",slug:"periodic-table-hunt"})})).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
 });
 it("keeps classroom role sections out of the public experiment guide",()=>{
  const html=renderToStaticMarkup(<SimulationGuide locale="en" subject={subjectsCatalog.chemistry} simulation={getSimulationCard("atomic-structure")!}/>);
  expect(html).not.toContain("classroomGuide");
  expect(html).toContain("simulationGuidePublic");
 });
});
