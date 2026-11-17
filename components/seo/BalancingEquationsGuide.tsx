import Link from "next/link";
import { balancedEquationsByCategory, balancedEquations, balancingAnswer, balancingMethod, balancingMistakes, balancingSeo, balancingWorkedExamples } from "@/lib/seo/balancing-equations";

const updated = new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(balancingSeo.updated));

// English reference section for the balancing-equations lab: the answer first, then the method,
// worked examples, common mistakes, and every equation in the game with its balanced answer.
export function BalancingEquationsGuide() {
  const total = balancedEquations().length;
  return <section className="container topicGuidePage balancingGuide" aria-labelledby="balancing-guide-title">
    <article>
      <header className="topicGuideHero">
        <span className="eyebrow">Chemistry reference · Updated {updated}</span>
        <h2 id="balancing-guide-title">How to balance chemical equations</h2>
        <p className="topicGuideLead">{balancingAnswer}</p>
      </header>
      <div className="topicGuideBody">
        <section className="topicGuideSection">
          <span className="eyebrow">Method</span>
          <h2>Balancing chemical equations step by step</h2>
          <ol>{balancingMethod.map((step) => <li key={step}>{step}</li>)}</ol>
        </section>
        {balancingWorkedExamples.map((example) => <section className="topicGuideSection" key={example.title}>
          <span className="eyebrow">Worked example</span>
          <h3>{example.title}</h3>
          <p>Start with the unbalanced equation: <b className="balancingEquation">{example.start}</b></p>
          <ol>{example.steps.map((step) => <li key={step}>{step}</li>)}</ol>
          <p>Balanced: <b className="balancingEquation">{example.result}</b></p>
        </section>)}
        <section className="topicGuideSection">
          <span className="eyebrow">Avoid these</span>
          <h2>Common mistakes when balancing equations</h2>
          <ul>{balancingMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul>
        </section>
        <section className="topicGuideSection">
          <span className="eyebrow">Answers</span>
          <h2>{total} balanced chemical equations with answers</h2>
          <p>These are the equations in the game above, from simple combustion and decomposition to ionic equations and redox half-equations. Try each one in the game before checking its answer here.</p>
          {balancedEquationsByCategory().map((group) => <div className="balancingTableWrap" key={group.category}>
            <table className="balancingTable">
              <caption>{group.category}</caption>
              <thead><tr><th scope="col">Reaction</th><th scope="col">Unbalanced</th><th scope="col">Balanced equation</th></tr></thead>
              <tbody>{group.equations.map((equation) => <tr key={equation.index}><th scope="row">{equation.name}</th><td>{equation.unbalanced}</td><td><b>{equation.balanced}</b></td></tr>)}</tbody>
            </table>
          </div>)}
        </section>
        <section className="topicGuideSection">
          <span className="eyebrow">Next</span>
          <h2>Use a balanced equation</h2>
          <p>The coefficients of a balanced equation are mole ratios. Use them in the <Link href="/en/simulations/limiting-reagent">Limiting Reagent Challenge</Link> to work out which reactant runs out first, or see where balancing fits in the <Link href="/en/subjects/chemistry">chemistry labs</Link>.</p>
        </section>
        <aside className="topicGuideModelNote">
          <strong>How answers are checked</strong>
          <p>Every answer on this page comes from the game&rsquo;s equation bank and is tested automatically: each element and the total charge match on both sides, and the coefficients are the smallest whole numbers.</p>
          <Link href="/en/editorial-policy">Read our editorial policy →</Link>
        </aside>
      </div>
    </article>
  </section>;
}
