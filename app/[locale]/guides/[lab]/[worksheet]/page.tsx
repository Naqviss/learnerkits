import Link from "next/link";
import { notFound } from "next/navigation";
import { TrialCheck } from "@/components/simulation/practical/TrialCheck";
import { jsonLd, localizedMetadata, localizedUrl } from "@/lib/seo/metadata";
import { investigations, investigationSlugs, type Investigation, type InvestigationSlug } from "@/lib/simulations/practical/investigations";
import { readings } from "@/lib/simulations/practical/investigation-models";
import { studentGuides } from "@/lib/simulations/practical/student-guides";

const kinds = ["mission", "how-to-measure"] as const;
type Params = {locale: string; lab: string; worksheet: string};
type Props = {params: Promise<Params>};

export function generateStaticParams() {
  return investigationSlugs.flatMap(lab => kinds.map(worksheet => ({ locale: "en", lab, worksheet })));
}
function worksheetFor({locale, lab, worksheet}: Params) {
  if (locale !== "en" || !Object.hasOwn(studentGuides, lab) || !kinds.some(k => k === worksheet)) notFound();
  const slug = lab as InvestigationSlug;
  const guide = studentGuides[slug];
  const mission = worksheet === "mission";
  return { slug, guide, mission, title: mission ? guide.mission : guide.measurement,
    description: mission ? guide.challenge : guide.method, path: `/guides/${slug}/${worksheet}` };
}
export async function generateMetadata({params}: Props) {
  const {path, title, description} = worksheetFor(await params);
  // Kept out of Google (googlebot noindex; out of the sitemap): each worksheet is ~140 words from one
  // template, and its challenge text repeats the lab page's Missions section. Bing may still list it.
  return localizedMetadata("en", path, title, description, {type:"article", englishOnly:true, googleUnlisted:true});
}
export default async function StudentWorksheet({params}: Props) {
  const {slug,guide,mission,title,description,path} = worksheetFor(await params);
  const config: Investigation = investigations[slug];
  const values = guide.controls.map(control => readings(slug, control, guide.time)[guide.metric]);
  const settings = guide.controls.map(value => config.choices?.[value] ?? (value + " " + config.unit).trim());
  const instant = slug === "population-growth-map" ? String(2000 + guide.time) : guide.time + " " + config.clock;
  const sibling = mission ? "how-to-measure" : "mission";
  const url = localizedUrl("en",path);
  const schema = {"@context":"https://schema.org","@type":"LearningResource",name:title,description,url,inLanguage:"en",isAccessibleForFree:true,
    learningResourceType:mission?"Student investigation":"Measurement guide",educationalUse:mission?"Practice":"Instruction",
    teaches:config.keywords.split(" · "),isPartOf:{"@type":"LearningResource",url:localizedUrl("en","/simulations/"+slug)}};
  return <main className="container topicGuidePage">
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)}/>
    <article className="simulationGuidePanel">
      <header><Link href={`/en/simulations/${slug}`}>{config.title}</Link>
        <h1>{title}</h1><p>{description}</p></header>
      <section className="simulationSteps"><h2>{mission ? "Your two-trial challenge" : "Set up the comparison"}</h2>
        <ol>{settings.map((setting,i)=><li key={setting}><b>{i===0?"A":"B"}</b><span>Set <strong>{config.control}</strong> to {setting}. At {instant}, record <strong>{values[i].label}</strong> in {values[i].unit || "counts"}.</span></li>)}</ol>
        <p><Link className="button primary" target="_blank" rel="noopener" href={`/en/simulations/${slug}#simulation`}>Open experiment in a new tab</Link></p>
      </section>
      {mission ? <><h2>Check your evidence</h2><p>Enter the two readings to the precision shown in the experiment.</p>
        <TrialCheck key={slug} expected={values.map(v=>v.value)} unit={values[0].unit}/>
        <h2>Explain your result</h2><p>{guide.explanation}</p></> :
        <><h2>Worked measurement record</h2><p>Try the comparison yourself before opening the reference readings.</p>
          <details><summary>Show the reference readings</summary><table><caption>{values[0].label} at {instant}</caption><thead><tr><th>Trial</th><th>{config.control}</th><th>Reading</th></tr></thead>
            <tbody>{values.map((v,i)=><tr key={i}><th>{i===0?"A":"B"}</th><td>{settings[i]}</td><td>{Number(v.value.toFixed(2))} {v.unit}</td></tr>)}</tbody></table></details>
          <h2>Check your method</h2><p>{guide.caution}</p></>}
      <p><Link className="textLink" href={`/en/guides/${slug}/${sibling}`}>{mission ? guide.measurement : guide.mission} →</Link></p>
    </article>
  </main>;
}
