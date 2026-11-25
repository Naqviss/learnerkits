"use client";

import { findCompounds, inorganicCompounds, organicCompounds } from "@/lib/simulations/chemistry/nomenclature";
import { useState } from "react";

type Example = [formula: string, choices: string[], answer: string, explanation: string, hints: [string, string]];

const inorganic: Example[] = [
  ["NaCl", ["Sodium chloride", "Sodium chlorate"], "Sodium chloride", "Na⁺ is sodium and Cl⁻ is chloride. Name the positive ion first.", ["Na stands for sodium. Read it first.", "Cl is chlorine. In this salt its name ends in -ide."]],
  ["FeCl₃", ["Iron(II) chloride", "Iron(III) chloride"], "Iron(III) chloride", "Three chloride ions contribute a total charge of −3. Iron must be +3, written as (III).", ["The small 3 means there are three chloride ions.", "Each chloride has a charge of −1. Which Roman numeral shows the charge iron needs to balance them?"]],
  ["CO₂", ["Carbon monoxide", "Carbon dioxide"], "Carbon dioxide", "In binary molecular naming, the prefix di- indicates two oxygen atoms.", ["Look at the small number after O.", "Mono- means one. Di- means two."]],
  ["CaCO₃", ["Calcium carbonate", "Calcium carbide"], "Calcium carbonate", "The CO₃²⁻ ion is carbonate. Keep its name when pairing it with calcium.", ["Look for the group CO₃ in the formula.", "CO₃²⁻ is called carbonate. Keep that group name after calcium."]],
];

const organicExamples: Example[] = [
  ["CH₃–CH₂–CH₃", ["Propane", "Propene"], "Propane", "Three carbon atoms give prop-. All carbon–carbon bonds are single, so the ending is -ane.", ["Count the C symbols along the chain.", "Three carbons give prop-. Single bonds give -ane."]],
  ["CH₃–CH(OH)–CH₂–CH₃", ["Butan-1-ol", "Butan-2-ol"], "Butan-2-ol", "Number the four-carbon chain from the end nearest the hydroxyl group. The OH is on carbon 2.", ["Find the carbon holding the OH group.", "Count from each end. Use the smaller number for the position of OH."]],
  ["CH₃–CH(CH₃)–CH₃", ["Butane", "2-Methylpropane"], "2-Methylpropane", "The longest continuous chain has three carbons. The fourth carbon is a methyl branch on carbon 2.", ["Trace the longest path of carbons without visiting one twice.", "The CH₃ in brackets is a methyl branch attached to the middle carbon."]],
  ["CH₂=CH–CH₂–CH₃", ["But-1-ene", "But-2-ene"], "But-1-ene", "Number from the end nearest the double bond. It starts at carbon 1 of a four-carbon chain.", ["Find the double bond marked =.", "Count from the end closest to it. Use the number of the first carbon in the double bond."]],
];

export function NomenclaturePractice({ organic }: { organic: boolean }) {
  const [query, setQuery] = useState("");
  const compounds = organic ? organicCompounds : inorganicCompounds;
  const matches = findCompounds(compounds, query);
  const examples = organic ? organicExamples : inorganic;
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState("");
  const [hintCount, setHintCount] = useState(0);
  const [formula, choices, answer, explanation, hints] = examples[index];
  return <section className="container panel">
    <h2>{organic ? "Name a carbon chain" : "Name a simple salt"}</h2>
    {organic ? <ol>
      <li>Look at <strong>CH₃–CH₃</strong>. Each C stands for one carbon atom. There are two.</li>
      <li>Two carbons give the start <strong>eth-</strong>. The line between them shows a single bond. For this hydrocarbon, use the ending <strong>-ane</strong>.</li>
      <li>Put the parts together and you get <strong>ethane</strong>. Try the same steps below with three carbons.</li>
    </ol> : <ol>
      <li>Look at <strong>KCl</strong>. Split it into its two symbols, K and Cl.</li>
      <li>K is potassium. Keep that name. Cl is chlorine. In this salt, change its ending to get <strong>chloride</strong>.</li>
      <li>Read the names in order and you get <strong>potassium chloride</strong>. Try the same steps below with NaCl.</li>
    </ol>}
    <h2>Practise naming compounds</h2>
    <p>Compound {index + 1} of {examples.length}</p>
    <h3>Which name matches {formula}?</h3>
    {hintCount > 0 && <ol aria-live="polite">{hints.slice(0, hintCount).map(hint => <li key={hint}>{hint}</li>)}</ol>}
    {choice !== answer && hintCount < hints.length && <button type="button" className="libChip" onClick={() => setHintCount(hintCount + 1)}>
      {hintCount ? "Show the next hint" : "Give me a hint"}
    </button>}
    <div className="libFilterRow">
      {choices.map(name => <button type="button" key={name} className="libChip" aria-pressed={choice === name} onClick={() => setChoice(name)}>{name}</button>)}
    </div>
    <p aria-live="polite">{choice && (choice === answer ? "Correct. " : "Try again. ") + explanation}</p>
    {choice === answer && <button type="button" className="button" onClick={() => {
      setIndex((index + 1) % examples.length);
      setChoice("");
      setHintCount(0);
    }}>{index + 1 === examples.length ? "Practise again" : "Next compound"}</button>}
    <h2>Look up a compound</h2>
    <label>Find a name or formula
      <input className="libSearchInput" type="search" value={query} onChange={event => setQuery(event.target.value)}
        placeholder={organic ? "Try ethanol, C2H6O, or CH3CH2OH" : "Try iron(III) chloride or FeCl3"}/>
    </label>
    <p>Type CO2 for CO₂. Match the capital letters in each symbol.{organic && " Two compounds can have the same formula. The structure shows how their atoms connect."}</p>
    <details open={query.trim() ? true : undefined} key={query.trim() ? "search" : "browse"}>
      <summary>{query.trim() ? `Matches in this reference (${matches.length})` : `Browse all ${compounds.length} compounds in this module`}</summary>
      {matches.length ? <ul>{matches.map(compound => <li key={compound.name}><strong>{compound.name}</strong> · {compound.formula}{compound.structure && <> · {compound.structure}</>}</li>)}</ul>
        : <p>No match in this module. Check the spelling and element symbols, or clear the search to browse.</p>}
    </details>
  </section>;
}
