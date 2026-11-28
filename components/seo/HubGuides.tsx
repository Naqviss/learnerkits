import Link from "next/link";
import { articles } from "@/lib/articles";
import { articleCategories, articleKind } from "@/lib/articles/catalog";
import { investigationSlugs } from "@/lib/simulations/practical/investigations";
import { subjectsCatalog, visibleSubjectSlugs } from "@/lib/subjects/catalog";

// English guide text for the three hub pages (/simulations, /subjects, /articles). Each is written for
// its own page: hubs used to be mostly lab or article cards repeated elsewhere, with ~250–310 words of
// their own (2026-11-28 clean-up for AdSense). Counts and grade bands come from the catalogs.

const names: Record<string, string> = { space: "space", physics: "physics", geography: "geography and Earth science", "environmental-science": "environmental science", chemistry: "chemistry", mathematics: "mathematics" };
const list = (items: string[]) => items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
const labTitle = (slug: string) => visibleSubjectSlugs.flatMap((subject) => subjectsCatalog[subject].simulations).find((sim) => sim.slug === slug)?.title ?? slug;
const LabLink = ({ slug }: { slug: string }) => <Link href={`/en/simulations/${slug}`}>{labTitle(slug)}</Link>;

export function SimulationLibraryGuide() {
  const counts = visibleSubjectSlugs.map((slug) => `${subjectsCatalog[slug].simulations.length} in ${names[slug] ?? slug} (${subjectsCatalog[slug].gradeBand.toLowerCase()})`);
  const total = visibleSubjectSlugs.reduce((sum, slug) => sum + subjectsCatalog[slug].simulations.length, 0);
  return <section className="hubGuide" aria-labelledby="library-guide-heading">
    <h2 id="library-guide-heading">How the lab library is organized</h2>
    <p>The library holds {total} labs: {list(counts)}. Each one is a self-contained model that runs in the browser, so you can open them in any order. The search box matches titles, concepts and the outcome a lab is built around, which helps when you know the idea you need (“buoyancy”, “carrying capacity”, “unit circle”) but not the name of the lab.</p>
    <h3>Three ways a lab works</h3>
    <p>Some labs are 3D models you turn and zoom to see a structure from every side, such as <LabLink slug="moon-phases-3d" />, <LabLink slug="plate-tectonics-3d" /> or <LabLink slug="molecular-geometry-3d" />. Others are experiments with controls and live readouts, where you change one quantity and measure the effect, as in <LabLink slug="gas-law-lab" /> or <LabLink slug="pendulum-physics" />. The rest are challenges with a goal to reach, like landing in <LabLink slug="mars-landing-challenge" /> or holding a load in <LabLink slug="bridge-builder-challenge" />. {investigationSlugs.length} of the labs also end with a two-trial investigation: two settings to compare, readings to record and a check of your evidence.</p>
    <h3>What every lab page adds to the model</h3>
    <p>Below each lab is a written guide for that lab alone. It opens with the main question the topic raises and a short answer, then gives steps that name the lab’s actual controls and readouts, the science behind what you see, and one common misconception with its correction. Many pages work through an example with real numbers from the model. A model note says what the simulation includes and what it leaves out, and the date shows when the guide was last checked.</p>
    <h3>Choosing where to start</h3>
    <p>If you are following a course, start from a subject page, where labs are grouped by topic with notes on which to try first. If you have a homework question, search for the concept and use the lab whose outcome matches it. Teachers can project a lab, send its link, or attach it to a lesson plan in the Teacher Kit, and supported labs remember completed missions in the browser. Every lab page also lists the concepts its model covers, which makes it quick to check a lab against a line in your syllabus before planning a lesson around it.</p>
    <h3>Labs that work best in pairs</h3>
    <p>Several labs are built to follow one another. <LabLink slug="projectile-lab" /> shows how angle and speed set the range; <LabLink slug="projectile-target-simulator" /> then asks you to hit a fixed spot and find the second angle that lands in the same place. <LabLink slug="seismic-wave-lab" /> turns the gap between P- and S-wave arrivals into a distance, which <LabLink slug="earthquake-epicenter-finder" /> needs at three stations. <LabLink slug="neutralization-station" /> adds base to acid step by step, and <LabLink slug="titration-simulator" /> uses the same reaction to measure an unknown concentration. <LabLink slug="moon-phases-3d" /> before <LabLink slug="solar-eclipse-3d" /> explains why an eclipse needs a new moon, and <LabLink slug="pendulum-physics" /> before <LabLink slug="pendulum-wave" /> explains why longer strings fall behind.</p>
    <h3>What a model can and cannot show</h3>
    <p>Every lab simplifies the real system so one relationship stands out: the gas in the gas-law lab is ideal, the orbit labs hold the star still and ignore the pull of other planets, and the herd model in the reserve lab leaves out drought, predators and seasonal movement. Treat a reading as the model’s prediction, compare it with a textbook value when one is quoted, and read the model note before drawing a conclusion. If a result looks wrong, the <Link href="/en/contact">contact form</Link> has a science-correction option.</p>
  </section>;
}

export function SubjectsIndexGuide() {
  return <section className="hubGuide" aria-labelledby="subjects-guide-heading">
    <h2 id="subjects-guide-heading">How the six subjects connect</h2>
    <p>The subjects are split for browsing, but the ideas cross between them constantly. A force or an energy change met in physics comes back as an orbit in space, a seismic wave in geography, or a reaction rate in chemistry. Following an idea across subjects is one of the quickest ways to see that it is a general rule rather than a fact to memorize.</p>
    <h3>From a thrown ball to an orbit</h3>
    <p>Start with <LabLink slug="newtons-laws-force-lab" /> to see that a net force changes velocity. <LabLink slug="projectile-lab" /> then shows gravity bending a path into a parabola. Launch faster and the path curves around the planet instead of meeting the ground, which is the step <LabLink slug="escape-velocity" /> takes, and <LabLink slug="keplers-laws-orbit" /> shows how that same pull shapes an ellipse.</p>
    <h3>Following carbon from air to ocean</h3>
    <p><LabLink slug="carbon-cycle-simulator" /> tracks where carbon dioxide goes once it is released. Part of it dissolves in seawater, and <LabLink slug="ocean-acidification-simulator" /> follows the carbonate chemistry as the water’s pH falls. <LabLink slug="acid-base-ph" /> in chemistry explains the pH scale behind that change, where each whole unit is a tenfold change in hydrogen-ion concentration.</p>
    <h3>Why the ground shakes, and what follows</h3>
    <p><LabLink slug="plate-tectonics-3d" /> shows plates moving at different kinds of boundary. When stress is released, <LabLink slug="seismic-wave-lab" /> shows P- and S-waves arriving at different times, and <LabLink slug="earthquake-epicenter-finder" /> uses that gap at three stations to locate the source. Under the sea the same event can lift the water above it, and <LabLink slug="tsunami-3d" /> follows the wave as it speeds across deep water and grows over the shallow shelf.</p>
    <h3>Mathematics underneath all of it</h3>
    <p>The maths labs are the tools the science labs rely on. Vectors from <LabLink slug="vector-lab" /> describe every force and velocity in the physics labs; the curve in <LabLink slug="exponential-growth" /> is the one behind early population growth; and the tangent slope in <LabLink slug="derivative-tangent" /> is what a rate of change means, whether it is speed, reaction rate or warming per decade.</p>
    <h3>A first lab in each subject</h3>
    <p>Each subject has at least one lab that assumes no earlier topic. In space, <LabLink slug="moon-phases-3d" /> needs only the idea that sunlight falls on one half of the Moon. In physics, <LabLink slug="newtons-laws-force-lab" /> starts from a single push on a single cart. For Earth science, <LabLink slug="plate-tectonics-3d" /> lets you set up each kind of plate boundary and predict the landform before it forms. In chemistry, <LabLink slug="states-of-matter-3d" /> heats particles from a solid at −20 °C to a gas at 120 °C. In mathematics, <LabLink slug="vector-lab" /> adds two arrows on a grid. Environmental science has no lab marked beginner, but <LabLink slug="greenhouse-effect-simulator" /> is the one to open first: the energy imbalance it shows from doubling carbon dioxide sits behind most of the other climate labs.</p>
    <h3>Building a sequence across subjects</h3>
    <p>For a project or a revision week, pick one idea and follow it through two or three subjects rather than finishing one subject at a time. Start with the lab that shows the idea most simply, move to one where it explains something larger, and finish with one where you have to use it to reach a goal. Write one sentence after each lab about what carried over from the one before. That short note is often the clearest evidence that the idea has been understood rather than memorized.</p>
    <h3>Grade bands are a guide, not a limit</h3>
    <p>Each subject shows a suggested grade band, from grades 5–12 in mathematics to grades 8–12 in chemistry, and individual labs carry their own difficulty. A younger student can usually run a model and describe what changes; an older one should be able to explain why and use the numbers.</p>
  </section>;
}

export function ArticlesGuide() {
  const byCategory = articleCategories.map((category) => ({ ...category, items: articles.filter((article) => article.category === category.name) })).filter((category) => category.items.length);
  const pick = (title: string) => articles.find((article) => article.title === title);
  const ArticleLink = ({ title }: { title: string }) => { const article = pick(title); return article ? <Link href={`/en/articles/${article.slug}`}>{article.title}</Link> : <>{title}</>; };
  const guides = articles.filter((article) => articleKind(article) === "Guide").length;
  return <section className="hubGuide" aria-labelledby="articles-guide-heading">
    <h2 id="articles-guide-heading">What these articles are for</h2>
    <p>There are {articles.length} articles here, {guides === articles.length ? "all of them long-form guides" : `${guides} of them long-form guides`}, in {byCategory.length} groups: {list(byCategory.map((category) => `${category.items.length} on ${category.name.toLowerCase()}`))}. Each takes one question a student or teacher actually has and works through it, usually with an experiment you can run in one of the labs alongside the reading.</p>
    <h3>Science concepts, tested in a lab</h3>
    <p>The science articles explain an idea and then hand it to a model. <ArticleLink title="Why Does the Moon Change Shape? 10 Experiments to Understand It" /> pairs each explanation with a setting to try in the Moon phases lab, and <ArticleLink title="Climate Change Explained With 10 Interactive Experiments" /> does the same across the climate labs. Read a section, predict the result, then run it.</p>
    <h3>Using technology and AI well</h3>
    <p>The other two groups are about how to learn and teach with tools. Some compare options honestly, such as <ArticleLink title="Virtual Labs vs. Real Labs: What Students Actually Learn From Each" />. Others are practical routines: <ArticleLink title="How to Check Whether an AI-Generated Science Answer Is Correct" /> gives a checklist for testing a chatbot’s answer against a source or a simulation, and <ArticleLink title="How to Create a Digital Science Notebook" /> sets out a notebook layout for recording evidence.</p>
    <h3>If you are studying on your own</h3>
    <p><ArticleLink title="How to Use Educational Simulations for Self-Study" /> sets up a routine of predictions, controlled comparisons, retrieval practice and an error log, worked through on a pendulum. <ArticleLink title="The Ultimate Guide to Learning Physics Without Memorizing Formulas" /> shows how units, proportional reasoning and limiting cases let you rebuild a formula instead of recalling it. <ArticleLink title="How Can Students Use AI to Understand Difficult Science Concepts?" /> describes a way to ask a chatbot for an explanation, check what it says, and then test its prediction in a lab.</p>
    <h3>If you teach</h3>
    <p><ArticleLink title="How a 3D Molecule Kit Helps Teachers Teach Molecules, Bonding, and Shape" /> includes a 45-minute lesson plan with the misconceptions to watch for and exit questions. <ArticleLink title="How Teachers Can Use AI to Prepare Science Lessons" /> builds a timed force-lab lesson with differentiation and an exit assessment, and <ArticleLink title="How to Use AI to Create Science Practice Questions" /> uses a question blueprint and answer keys so generated questions can be checked before students see them.</p>
    <h3>Before you choose a tool</h3>
    <p><ArticleLink title="AI Tutor vs Teacher vs Textbook vs Simulation: What Should Students Use?" /> sets out a study session that uses all four for what each does best. <ArticleLink title="AI Tutors vs. Interactive Simulations: How They Differ" /> compares the two on one gas-law investigation, and <ArticleLink title="Virtual Labs vs. Traditional Labs: Differences and Limitations" /> pairs a virtual and a hands-on pendulum lesson so a class can see what each kind of lab teaches.</p>
    <h3>Reading with a lab open</h3>
    <p>The articles work best with the matching lab open in a second tab. Read one section, write down what you expect to happen before you touch a control, and only then run the model. When the result disagrees with your prediction, go back to the paragraph that explains it rather than reading on; that moment of surprise is where most of the learning happens. Keep a note of the setting you used and the reading you got, so you can repeat it later or show it to a teacher. If a reading surprises you twice, change only one control at a time until you can say which one caused the difference.</p>
    <h3>How they are written</h3>
    <p>The articles are AI-assisted and say so on every page. Sources sit beside the claims they support, worked examples are illustrative, and simulation outputs are presented as model predictions rather than measurements. No independent expert review is claimed. If you find an error, each article links to the correction form, and our <Link href="/en/editorial-policy">editorial policy</Link> explains how reports are handled.</p>
  </section>;
}
