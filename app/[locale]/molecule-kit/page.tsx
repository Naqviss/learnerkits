import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getLocalizedSubject, getLocalizedSubjectName } from "@/lib/i18n/content";
import { breadcrumbJsonLd, faqJsonLd, jsonLd, localizedMetadata, simulationJsonLd, subjectCollectionJsonLd } from "@/lib/seo/metadata";
import { getMoleculeKitCopy, moleculeKitSimSlugs } from "@/lib/seo/molecule-kit-content";
import { getMoleculeReference, getVseprClasses, moleculeReferences } from "@/lib/seo/molecules";

// High-demand lookups featured on the kit page; each links to its English reference page.
const popularMolecules = ["water-h2o", "carbon-dioxide-co2", "methane-ch4", "ammonia-nh3", "sulfur-dioxide-so2", "boron-trifluoride-bf3", "phosphorus-pentachloride-pcl5", "sulfur-hexafluoride-sf6", "xenon-tetrafluoride-xef4", "sulfate-ion-so4"];

// Full molecule index, grouped by VSEPR shape, so every English reference page is linked from the kit.
const allMoleculesCopy: Record<Locale, { title: (n: number) => string; body: string }> = {
  en: { title: (n) => `All ${n} molecules by shape`, body: "Every molecule and ion in the kit, grouped by VSEPR shape. Each one links to a reference page with its molecular geometry, electron geometry, bond angle, polarity, and a rotatable 3D model." },
  es: { title: (n) => `Las ${n} moléculas por forma`, body: "Todas las moléculas e iones del kit, agrupados por forma VSEPR. Cada uno enlaza a una página de referencia (en inglés) con su geometría, ángulo de enlace, polaridad y un modelo 3D." },
  zh: { title: (n) => `按形状列出的全部${n}个分子`, body: "按VSEPR形状分组列出套件中的所有分子和离子。每一项都链接到包含几何形状、键角、极性和3D模型的参考页面（英文）。" },
  ar: { title: (n) => `جميع الجزيئات الـ${n} حسب الشكل`, body: "جميع الجزيئات والأيونات في المجموعة مصنفة حسب شكل VSEPR. يرتبط كل منها بصفحة مرجعية (بالإنجليزية) تتضمن الشكل الهندسي وزاوية الرابطة والقطبية ونموذجًا ثلاثي الأبعاد." },
  pt: { title: (n) => `As ${n} moléculas por forma`, body: "Todas as moléculas e íons do kit, agrupados por forma VSEPR. Cada um leva a uma página de referência (em inglês) com geometria, ângulo de ligação, polaridade e um modelo 3D." },
  fr: { title: (n) => `Les ${n} molécules par forme`, body: "Toutes les molécules et tous les ions du kit, regroupés par forme VSEPR. Chacun renvoie à une fiche de référence (en anglais) avec sa géométrie, son angle de liaison, sa polarité et un modèle 3D." },
  ru: { title: (n) => `Все ${n} молекул по форме`, body: "Все молекулы и ионы набора, сгруппированные по форме VSEPR. Каждая ссылка ведёт на справочную страницу (на английском) с геометрией, валентным углом, полярностью и 3D-моделью." },
  ja: { title: (n) => `形ごとの全${n}分子`, body: "キットのすべての分子とイオンをVSEPRの形ごとにまとめました。各項目から、形・結合角・極性と3Dモデルを載せた参照ページ（英語）に移動できます。" },
  de: { title: (n) => `Alle ${n} Moleküle nach Form`, body: "Alle Moleküle und Ionen des Kits, nach VSEPR-Form gruppiert. Jeder Eintrag führt zu einer Referenzseite (auf Englisch) mit Geometrie, Bindungswinkel, Polarität und 3D-Modell." },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const copy = getMoleculeKitCopy(raw);
  return localizedMetadata(raw, "/molecule-kit", copy.metaTitle, copy.metaDescription, { keywords: copy.keywords });
}

export default async function MoleculeKitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const copy = getMoleculeKitCopy(locale);
  const chemistryName = getLocalizedSubjectName(locale, "chemistry");
  const chemistry = getLocalizedSubject(locale, "chemistry");
  const kitSimulations = moleculeKitSimSlugs.map((slug) => chemistry.simulations.find((sim) => sim.slug === slug)!);

  const breadcrumb = breadcrumbJsonLd(locale, [
    { name: chemistryName, path: "/subjects/chemistry" },
    { name: copy.title, path: "/molecule-kit" },
  ]);
  const collection = subjectCollectionJsonLd({
    locale,
    path: "/molecule-kit",
    name: copy.title,
    description: copy.metaDescription,
    simulations: kitSimulations.map((sim) => ({ name: sim.title, path: `/simulations/${sim.slug}`, description: sim.outcome })),
  });
  const faq = faqJsonLd(locale, copy.faq);
  const kitApp = simulationJsonLd({
    locale,
    path: "/molecule-kit",
    title: copy.title,
    description: copy.metaDescription,
    subject: chemistryName,
    concepts: ["Valence", "Chemical bonding", "VSEPR theory", "Molecular geometry", "Bond angles", "Lone pairs"],
  });
  const featured = popularMolecules.map((slug) => getMoleculeReference(slug)!);

  return (
    <main className="container topicGuidePage subject-chemistry">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(collection)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faq)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(kitApp)} />
      <header className="topicGuideHero">
        <div className="eyebrow">{chemistryName} · {copy.heroEyebrowSuffix}</div>
        <h1>{copy.title}</h1>
        <p className="topicGuideLead">{copy.lede}</p>
        <div className="topicGuideHeroActions">
          <Link className="button primary" href={`/${locale}/simulations/molecule-builder-3d?from=molecule-kit`}>{copy.ctaPrimary}</Link>
          <Link className="textLink" href={`/${locale}/subjects/chemistry`}>{copy.ctaSecondary(chemistryName)} →</Link>
        </div>
      </header>
      <div className="topicGuideBody">
        <section className="topicGuideSection topicGuideAnswer">
          <span className="eyebrow">{copy.whatEyebrow}</span>
          <h2>{copy.whatTitle}</h2>
          <ul>{copy.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
        </section>
        <section className="topicGuideSection">
          <span className="eyebrow">{copy.kitEyebrow}</span>
          <h2>{copy.kitTitle}</h2>
          <div className="priorityLabGrid">
            {kitSimulations.map((sim) => (
              <article className="priorityLabCard" key={sim.slug}>
                <div className="priorityTop"><span>{sim.kind}</span><b>{sim.difficulty}</b></div>
                <h3>{sim.title}</h3>
                <p>{sim.outcome}</p>
                <div className="simMeta"><span className="pill">{sim.duration}</span>{sim.concepts && <span className="pill">{sim.concepts}</span>}</div>
                <Link className="button subjectButton" href={`/${locale}/simulations/${sim.slug}?from=molecule-kit`}>{copy.openLab} →</Link>
              </article>
            ))}
          </div>
        </section>
        <section className="topicGuideSection">
          <span className="eyebrow">{copy.chart.eyebrow}</span>
          <h2>{copy.chart.title}</h2>
          <p>{copy.chart.body}</p>
          <div className="moleculeKitChart" lang="en">
            {featured.map((m) => <Link key={m.slug} href={`/en/molecules/${m.slug}`}>{m.formula} · {m.name}</Link>)}
          </div>
          <div className="topicGuideHeroActions"><Link className="button subjectButton" href="/en/molecules">{copy.chart.cta} →</Link></div>
        </section>
        {locale === "en" && <section className="topicGuideSection">
          <span className="eyebrow">For teachers</span>
          <h2>Teaching with the Molecule Kit</h2>
          <p>A ready-to-run 45-minute lesson on valence, bonding, and VSEPR shape, with common misconceptions and exit questions.</p>
          <div className="topicGuideHeroActions"><Link className="textLink" href="/en/articles/how-to-teach-molecules-with-a-3d-molecule-kit">How to teach molecules with a 3D molecule kit →</Link></div>
        </section>}
        <section className="topicGuideSection" id="all-molecules">
          <span className="eyebrow">VSEPR</span>
          <h2>{allMoleculesCopy[locale].title(moleculeReferences.length)}</h2>
          <p>{allMoleculesCopy[locale].body}</p>
          {getVseprClasses().map((group) => <div className="moleculeKitGroup" key={`${group.axe}-${group.shape}`} lang="en">
            <h3>{group.shape} <span>{group.axe} · {group.electronGeometry.toLowerCase()} electron geometry · {group.examples.length}</span></h3>
            <div className="moleculeKitChart">{group.examples.map((m) => <Link key={m.slug} href={`/en/molecules/${m.slug}`}>{m.formula} · {m.name}</Link>)}</div>
          </div>)}
        </section>
        <section className="topicGuideSection topicGuideFaq">
          <span className="eyebrow">{copy.faqEyebrow}</span>
          <h2>{copy.faqTitle}</h2>
          {copy.faq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
        </section>
      </div>
    </main>
  );
}
