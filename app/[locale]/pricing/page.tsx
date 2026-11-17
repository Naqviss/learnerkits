import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PremiumCta } from "@/components/premium/PremiumCta";
import { isLocale } from "@/lib/i18n/config";
import { premiumPrice } from "@/lib/premium/copy";
import { localizedMetadata } from "@/lib/seo/metadata";
import styles from "./pricing.module.css";

const teacherPlans = [
  { name: "Teacher Kit Starter", seats: "Up to 10 students", price: "$9", note: "For a small class or tutoring group" },
  { name: "Teacher Kit Classroom", seats: "Up to 30 students", price: "$19", note: "For teachers managing several classes" },
  { name: "Teacher Kit School", seats: "Up to 500 students", price: "$49", note: "For a department or school" },
];
const studentPlanEnabled = process.env.NEXT_PUBLIC_PREMIUM_ENABLED === "true";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (raw !== "en") return {};
  return localizedMetadata("en", "/pricing", "LearnerKits Plans and Pricing", studentPlanEnabled ? "Compare Free Explorer, Student Plus and Teacher Kit plans for science learning and teaching." : "Explore free science learning and Teacher Kit plans for classrooms.", { englishOnly: true });
}

export function generateStaticParams() { return [{ locale: "en" }]; }

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" || !isLocale(locale)) notFound();

  return <main className={`container ${styles.page}`}>
    <header className={styles.hero}>
      <span className="eyebrow">LearnerKits plans</span>
      <h1>Choose how you learn or teach.</h1>
      <p>{studentPlanEnabled ? "Explore science for free, add more study support with Student Plus, or bring your classes together with Teacher Kit." : "Explore science for free or bring your classes together with Teacher Kit."}</p>
    </header>

    <section className={styles.section} aria-labelledby="student-plans">
      <div className={styles.sectionHead}>
        <div><span className="eyebrow">For students</span><h2 id="student-plans">Learn at your pace</h2></div>
        <p>{studentPlanEnabled ? "Start exploring for free. Upgrade when you want a tutor and more exam practice." : "Interactive simulations and starter mock exams are free to explore."}</p>
      </div>
      <div className={`${styles.studentGrid} ${!studentPlanEnabled ? styles.singleStudentPlan : ""}`}>
        <article className={styles.card}>
          <span className={styles.planLabel}>Free Explorer</span>
          <h3>Free</h3>
          <p className={styles.summary}>A hands-on starting point for science learning.</p>
          <ul>
            <li>Core science simulations and learning activities</li>
            <li>Starter mock exams</li>
            <li>Explore without an account</li>
          </ul>
          <Link className="button" href="/en/simulations">Explore for free</Link>
        </article>
        {studentPlanEnabled && <article className={`${styles.card} ${styles.featured}`}>
          <span className={styles.planLabel}>Student Plus</span>
          <h3><strong>{premiumPrice.current}</strong><span>/month for 6 months</span></h3>
          <p className={styles.summary}>Then {premiumPrice.regular}/month. Cancel anytime.</p>
          <ul>
            <li>AI science tutor in simulations, with up to 40 questions a day</li>
            <li>Ad-free learning</li>
            <li>Premium mock exam practice sets with unlimited attempts</li>
            <li>Interactive simulations and guided learning</li>
            <li>Progress saved in your browser; exam history saved to your account when signed in</li>
          </ul>
          <PremiumCta locale="en" />
          <small className={styles.fine}>Billed monthly in USD through Paddle. Taxes may apply. <Link href="/en/premium">Full plan details</Link>.</small>
        </article>}
      </div>
    </section>

    <section className={styles.section} aria-labelledby="teacher-plans">
      <div className={styles.sectionHead}>
        <div><span className="eyebrow">For teachers</span><h2 id="teacher-plans">Teacher Kit</h2></div>
        <p>Monthly plans are based on the number of students across all your classes.</p>
      </div>
      <div className={styles.teacherGrid}>
        {teacherPlans.map((plan) => <article className={styles.card} key={plan.name}>
          <span className={styles.planLabel}>{plan.name}</span>
          <h3><strong>{plan.price}</strong><span>/month</span></h3>
          <p className={styles.seats}>{plan.seats}</p>
          <p className={styles.summary}>{plan.note}</p>
          <ul>
            <li>Multiple classes and student rosters</li>
            <li>AI-assisted lesson planning and whole-subject kits</li>
            <li>Assignments, submissions and marking</li>
            <li>Class insights and resource exports</li>
          </ul>
          <Link className="button" href="/en/contact">Ask about this plan</Link>
        </article>)}
      </div>
      <p className={styles.note}>Teacher Kit pricing is arranged directly with our team for now. Student seats are counted once per student across your classes.</p>
    </section>

    <section className={styles.footerCta}>
      <div><h2>Ready to get started?</h2><p>Explore the free science library or see what Teacher Kit can do for your classes.</p></div>
      <div className={styles.actions}><Link className="button primary" href="/en/simulations">Explore simulations</Link><Link className="button" href="/en/teacher-kit">Explore Teacher Kit</Link></div>
    </section>
  </main>;
}
