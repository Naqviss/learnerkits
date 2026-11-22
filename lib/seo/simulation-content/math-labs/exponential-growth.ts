import type { SimulationContent } from "../types";

// Numbers below are checked in tests/simulations/math-exponential-growth.test.ts against
// lib/simulations/mathematicsLabs/growth.ts. Control and readout names match ExponentialGrowthLab.tsx.

export const card = {
  slug: "exponential-growth",
  title: "Exponential vs Linear Growth Lab",
  concepts: "Exponential growth · linear growth · compound interest · doubling time",
  difficulty: "Intermediate" as const,
  duration: "8–12 min",
  kind: "Graph lab",
  outcome: "Compare a plan that adds a fixed deposit with one that grows by a percentage, and find when the exponential plan pulls ahead.",
  seoTarget: "exponential vs linear growth",
  visualMode: "graph" as const,
};

export const description = "Race a savings plan that adds $50 a year against one growing 5% a year. Watch equal doubling times appear and find the year exponential growth wins.";

export const es = {
  title: "Laboratorio de crecimiento exponencial y lineal",
  outcome: "Compara un plan que suma un depósito fijo con otro que crece un porcentaje y descubre cuándo el plan exponencial toma la delantera.",
  concepts: "Crecimiento exponencial · crecimiento lineal · interés compuesto · tiempo de duplicación",
  kind: "Laboratorio de gráficas",
};

export const content: SimulationContent = {
  question: "What is the difference between linear and exponential growth?",
  answer: "Linear growth adds the same amount in every time step, while exponential growth multiplies by the same factor. A $500 balance that gains $50 a year reaches $1,500 after 20 years. The same $500 growing 5% a year, compounded annually, reaches only about $1,327 by then, yet it passes the linear plan in year 27, because each year's 5% is taken from a larger balance.",
  science: [
    "A linear quantity follows y = a + d·t: it starts at a and rises by d each step, so its graph is a straight line and the year-to-year differences never change. An exponential quantity follows y = a·(1 + r)ᵗ: each year’s value is the previous one times 1 + r, so the ratios stay fixed while the differences keep growing.",
    "Because the factor is fixed, an exponential quantity always needs the same time to double, whatever its size. That time is ln 2 ÷ ln(1 + r). At 7% a year it is 10.2 years, and the rule of 72 gives a close estimate, 72 ÷ 7 ≈ 10.3. After three doublings the balance is eight times the start, which takes about 30.7 years at 7%.",
    "Savings accounts, loans and credit-card debt compound in exactly this way, which is why debt left unpaid can balloon. Bacteria dividing in a dish, early stages of an epidemic and the spread of a viral video show the same pattern until a limit, such as food or susceptible people, slows them down.",
  ],
  formula: { expression: "L(t) = a + d·t, E(t) = a·(1 + r)ᵗ, doubling time = ln 2 ÷ ln(1 + r)", meaning: "a is the starting amount, d the fixed yearly deposit, r the yearly growth rate as a decimal and t the number of years. The rule of 72 estimates the doubling time as 72 ÷ the rate in percent." },
  steps: [
    "Keep Starting amount at $500, Yearly deposit (Plan L) at $50 and Growth rate (Plan E) at 5%. Predict which plan is ahead after 20 years, then press Play timeline.",
    "Compare the Plan L · year 20 and Plan E · year 20 readouts, then raise Years shown to 30 and find the green marker where Plan E overtakes.",
    "Read the table under the graph: Plan L changes by + $50 every year, while Plan E changes by × 1.05 and its dollar increase grows.",
    "Set Growth rate (Plan E) to 7% and compare the Doubling time readout with the rule-of-72 estimate beside it.",
    "Drag the white handle along the Years axis and check that the violet doubling markers are spaced equally in time.",
  ],
  misconception: { myth: "A plan that is ahead early will stay ahead.", fact: "A fixed yearly deposit can lead for decades, but any percentage growth eventually overtakes it, because the exponential plan’s yearly gain keeps increasing while the linear gain stays the same size." },
  modelNote: "Interest is added once a year and nothing is withdrawn, so the dots are year-end balances and the curve joins them. Rates run from 1% to 20% and there is no inflation, tax or fee. Real accounts often compound monthly, which gives slightly more than the yearly figure.",
  faq: [
    { q: "How do you tell linear and exponential growth apart in a table?", a: "Look at how the values change from one step to the next. If you subtract and always get the same number, the growth is linear. If you divide each value by the one before and always get the same ratio, the growth is exponential. For example, 100, 110, 121, 133.1 grows by a constant factor of 1.1." },
    { q: "What is the rule of 72?", a: "The rule of 72 is a quick way to estimate how long an amount takes to double at a steady percentage rate: divide 72 by the rate. At 6% a year, money doubles in about 72 ÷ 6 = 12 years. The exact answer, ln 2 ÷ ln 1.06, is 11.9 years, so the shortcut is close for everyday rates." },
    { q: "What is compound interest?", a: "Compound interest is interest paid on both the original deposit and on the interest already earned. $1,000 at 10% a year becomes $1,100 after one year, $1,210 after two and $1,331 after three, because each year’s interest is worked out on a bigger balance. After 20 years it reaches about $6,727." },
    { q: "Does exponential growth always beat linear growth?", a: "In the long run, yes, as long as the growth rate is positive. A linear plan with a large deposit can stay ahead for a long time: $1,000 growing 5% a year only overtakes $1,000 plus $100 a year in year 27. Raising the rate to 8% brings the crossover forward to year 7." },
    { q: "Why is the doubling time constant in exponential growth?", a: "Every year the amount is multiplied by the same factor, so the number of years needed to multiply it by 2 does not depend on where you start. Going from $500 to $1,000 takes as long as going from $4,000 to $8,000, which is why doubling markers on an exponential graph sit at equal time intervals." },
  ],
};
