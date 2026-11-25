import { describe, expect, it } from "vitest";
import { findCompounds, inorganicCompounds, organicCompounds } from "@/lib/simulations/chemistry/nomenclature";

describe("student compound lookup", () => {
  it("accepts typed subscripts and condensed structures", () => {
    expect(findCompounds(inorganicCompounds, "Ca(OH)2")[0]?.name).toBe("Calcium hydroxide");
    expect(findCompounds(organicCompounds, "CH3CH2OH")[0]?.name).toBe("Ethanol");
  });

  it("lists both structures in the reference for C2H6O", () => {
    expect(findCompounds(organicCompounds, "C₂H₆O").map(entry => entry.name)).toEqual(["Ethanol", "Methoxymethane"]);
  });

  it("finds common names and shows the full list for an empty query", () => {
    expect(findCompounds(inorganicCompounds, "Baking Soda")[0]?.formula).toBe("NaHCO₃");
    expect(findCompounds(organicCompounds, " ")).toEqual(organicCompounds);
  });
});
