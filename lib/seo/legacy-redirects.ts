// Relative import: the Worker bundle imports this file and does not use the "@/" alias.
import { legacyExamPrepRedirect } from "../exam-prep/study";

// Page sets retired in the November 2026 thin-content clean-up (mock exam sets included) (for AdSense and Google quality).
// Their files are no longer exported, so requests for them reach the Worker, which sends a 301 to
// the place the content now lives. Kept as one pure function so tests can check every rule.

const moleculePage = /^\/en\/molecules\/([a-z0-9-]{1,80})\/?$/;
const mockExamPage = /^\/en\/mock-exams\/([a-z0-9-]{1,40})\/?$/;
const worksheetPage = /^\/en\/guides\/([a-z0-9-]{1,80})\/(?:mission|how-to-measure)\/?$/;

/** The new address for a retired URL, or null when the path was not retired. */
export function legacyRedirect(pathname: string): string | null {
  // Every molecule now opens inside the VSEPR chart page.
  const molecule = moleculePage.exec(pathname);
  if (molecule) return `/en/molecules#${molecule[1]}`;
  // The two-trial challenge and measurement guide moved onto the lab's own page.
  const worksheet = worksheetPage.exec(pathname);
  if (worksheet) return `/en/simulations/${worksheet[1]}#investigation`;
  // Practice sets open inside the signed-in mock exam area.
  const mock = mockExamPage.exec(pathname);
  if (mock) return `/en/mock-exams?exam=${mock[1]}`;
  return legacyExamPrepRedirect(pathname);
}
