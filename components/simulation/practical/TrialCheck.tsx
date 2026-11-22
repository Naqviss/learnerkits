"use client";
import { useState } from "react";

export function TrialCheck({ expected, unit }: { expected: number[]; unit: string }) {
  const [values, setValues] = useState(["", ""]);
  const [feedback, setFeedback] = useState("");
  return <form className="measurementForm" onSubmit={e => {
    e.preventDefault();
    const missed = expected.flatMap((answer, i) =>
      Math.abs(Number(values[i]) - answer) <= 0.005001 ? [] : [i === 0 ? "A" : "B"]);
    setFeedback(missed.length ? "Recheck trial " + missed.join(" and ") + ". Match the control, time and named readout." : "Both readings match. Use them to explain your prediction.");
  }}>
    {values.map((value, i) => <label key={i}>Trial {i === 0 ? "A" : "B"} ({unit || "count"})
      <input required type="number" step="any" value={value} onChange={e => {
        setValues(values.map((entry, index) => index === i ? e.target.value : entry));
        setFeedback("");
      }}/>
    </label>)}
    <button className="button primary">Check my readings</button>
    <p role="status">{feedback}</p>
  </form>;
}
