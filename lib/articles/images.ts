import type { ArticleSlug } from "./catalog";

type ArticleImage = {
  src: string;
  smallSrc: string;
  socialSrc: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

function illustration(file: string, alt: string, caption: string): ArticleImage {
  return {
    src: `/images/articles/${file}.webp`,
    smallSrc: `/images/articles/${file}-640.webp`,
    socialSrc: `/images/articles/${file}-social.webp`,
    width: 1200,
    height: 800,
    alt,
    caption,
  };
}

export const articleImages: Record<ArticleSlug, ArticleImage> = {
  "what-are-interactive-learning-simulations": illustration("interactive-learning-classroom-wide", "Wide classroom illustration of a teacher and students discussing a cart simulation.", "Discuss a prediction before testing the model. AI-generated editorial illustration."),
  "how-virtual-science-labs-work": illustration("virtual-science-lab-over-shoulder", "Over-the-shoulder illustration of a student investigating gas pressure on a laptop in a computer lab.", "Connect control settings, numerical outputs, and a scientific explanation. AI-generated editorial illustration."),
  "virtual-labs-vs-traditional-labs": illustration("virtual-and-physical-labs-side-view", "Side-view illustration of a teacher comparing a physical pendulum with a laptop model in a science lab.", "Compare what a model predicts with what physical measurements can show. AI-generated editorial illustration."),
  "educational-simulations-for-self-study": illustration("simulation-self-study-window-profile", "Desk-level profile illustration of a student in a navy hijab studying a pendulum model by an arched window.", "Write a prediction, test it, then explain the relationship without the screen. AI-generated editorial illustration."),
  "why-visual-learning-helps-science": illustration("visual-science-community-workshop", "High-angle illustration of two learners connecting a cart sketch, force arrow, and graph on a whiteboard.", "Connect diagrams, words, and calculations to explain the same relationship. AI-generated editorial illustration."),
  "how-to-create-a-digital-science-notebook": illustration("digital-science-notebook-overhead", "Overhead illustration of student hands organizing a digital science notebook with a table, graph, and paper notes.", "Keep the question, settings, results, and interpretation together. AI-generated editorial illustration."),
  "how-students-use-ai-to-understand-science": illustration("science-study-bedroom-overhead", "Overhead illustration of a student's hands comparing a physics cart, notebook, and laptop at an attic desk.", "Connect an explanation to a prediction you can test. AI-generated editorial illustration."),
  "ai-tutors-vs-interactive-simulations": illustration("tutoring-and-simulations-over-shoulder", "Over-the-shoulder illustration of a student comparing tutoring on a laptop with a tablet gas simulation.", "Use conversation to clarify an idea and a simulation to investigate its predictions. AI-generated editorial illustration."),
  "check-ai-generated-science-answers": illustration("science-answer-check-library-profile", "Side-profile illustration of a student checking a reference book along a library reading table.", "Compare a claim with a source and an independent calculation. AI-generated editorial illustration."),
  "how-teachers-use-ai-to-prepare-science-lessons": illustration("science-lesson-preparation", "Illustration of a teacher in an ochre cardigan planning a pendulum lesson in an empty science classroom.", "Plan the learning objective, investigation, and assessment together. AI-generated editorial illustration."),
  "use-ai-to-create-science-practice-questions": illustration("science-practice-at-home-room-wide", "Wide room illustration of a student in a lavender hijab practicing science at a dining table, seen from a doorway.", "Attempt the question before checking the worked answer. AI-generated editorial illustration."),
};
