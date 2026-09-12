import { G0 } from "./constants";

export const massFlowRate = (thrust: number, isp: number) => thrust / (isp * G0);
export const deltaV = (isp: number, initialMass: number, finalMass: number) => {
  if (initialMass <= 0 || finalMass <= 0 || finalMass > initialMass) return 0;
  return isp * G0 * Math.log(initialMass / finalMass);
};
