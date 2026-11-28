// Page-specific English reference content for one simulation page. Every field is written for that
// lab alone: Google's September 2026 spam update demoted this site for templated pages, so nothing
// here may be shared word-for-word between simulations (tests/seo/simulation-content.test.ts checks).
export type SimulationContent = {
  /** The main question a learner searches for, used as the heading above `answer`. Ends with "?". */
  question: string;
  /** Answer-first paragraph (45–95 words). Self-contained, so a search engine or AI assistant can quote it alone. */
  answer: string;
  /** Two or three paragraphs explaining the science: the mechanism, the key relationship, a real-world example. */
  science: string[];
  /** Optional key relationship, written with Unicode symbols, and what it means. */
  formula?: { expression: string; meaning: string };
  /** Four or five steps that name this lab's real controls and readouts. */
  steps: string[];
  /**
   * Optional worked example with real numbers taken from this lab's model: a specific setting, the
   * reading it gives and how to reason from it. Title is specific to the page (never a shared heading).
   */
  example?: { title: string; paragraphs: string[] };
  /** One common misconception and its correction. */
  misconception: { myth: string; fact: string };
  /** What this model includes and what it simplifies or leaves out. */
  modelNote: string;
  /** Three to five questions learners search for about the topic, each answered on its own. */
  faq: { q: string; a: string }[];
};

/** Date the simulation reference content was last reviewed; used for dateModified and the visible "Updated" label. */
export const simulationContentUpdated = "2026-11-21";
