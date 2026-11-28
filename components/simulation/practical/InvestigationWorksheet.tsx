import { TrialCheck } from "./TrialCheck";
import { investigations, type Investigation, type InvestigationSlug } from "@/lib/simulations/practical/investigations";
import { readings } from "@/lib/simulations/practical/investigation-models";
import { studentGuides } from "@/lib/simulations/practical/student-guides";

// The two-trial challenge and measurement guide for an investigation lab, shown on the lab's own page.
// They used to be separate ~140-word pages (/en/guides/<lab>/mission and /how-to-measure), which
// were thin; those URLs now 301 here (#investigation, see lib/seo/legacy-redirects.ts).
export function InvestigationWorksheet({ slug }: { slug: InvestigationSlug }) {
  const guide = studentGuides[slug];
  const config: Investigation = investigations[slug];
  const values = guide.controls.map((control) => readings(slug, control, guide.time)[guide.metric]);
  const settings = guide.controls.map((value) => config.choices?.[value] ?? (value + " " + config.unit).trim());
  const instant = slug === "population-growth-map" ? String(2000 + guide.time) : guide.time + " " + config.clock;
  return <section id="investigation" className="container simulationGuidePanel" aria-labelledby="investigation-title">
    <header><span className="simulationSectionKicker">Two-trial investigation</span><h2 id="investigation-title">{guide.mission}</h2><p>{guide.challenge}</p></header>
    <div className="simulationSteps">
      <h3>Set up the comparison</h3>
      <ol>{settings.map((setting, i) => <li key={setting}><b>{i === 0 ? "A" : "B"}</b><span>Set <strong>{config.control}</strong> to {setting}. At {instant}, record <strong>{values[i].label}</strong> in {values[i].unit || "counts"}.</span></li>)}</ol>
    </div>
    <h3>{guide.measurement}</h3>
    <p>{guide.method}</p>
    <h3>Check your evidence</h3>
    <p>Enter the two readings to the precision shown in the experiment.</p>
    <TrialCheck key={slug} expected={values.map((v) => v.value)} unit={values[0].unit} />
    <details><summary>Show the reference readings</summary><table><caption>{values[0].label} at {instant}</caption><thead><tr><th>Trial</th><th>{config.control}</th><th>Reading</th></tr></thead>
      <tbody>{values.map((v, i) => <tr key={i}><th>{i === 0 ? "A" : "B"}</th><td>{settings[i]}</td><td>{Number(v.value.toFixed(2))} {v.unit}</td></tr>)}</tbody></table></details>
    <h3>Explain your result</h3>
    <p>{guide.explanation}</p>
    <h3>Check your method</h3>
    <p>{guide.caution}</p>
  </section>;
}
