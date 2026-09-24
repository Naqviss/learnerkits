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
  "how-students-use-ai-to-understand-science": illustration("science-study-bedroom", "Illustration of a student in a green hoodie testing a physics-cart prediction at an attic bedroom desk.", "Connect an explanation to a prediction you can test. AI-generated editorial illustration."),
  "ai-tutors-vs-interactive-simulations": illustration("tutoring-and-simulations", "Illustration of a student comparing conversational tutoring with a gas-particle simulation in a school makerspace.", "Use conversation to clarify an idea and a simulation to investigate its predictions. AI-generated editorial illustration."),
  "check-ai-generated-science-answers": illustration("science-answer-check", "Illustration of a student checking a science answer against a reference book and calculator in a library.", "Compare a claim with a source and an independent calculation. AI-generated editorial illustration."),
  "how-teachers-use-ai-to-prepare-science-lessons": illustration("science-lesson-preparation", "Illustration of a teacher in an ochre cardigan planning a pendulum lesson in an empty science classroom.", "Plan the learning objective, investigation, and assessment together. AI-generated editorial illustration."),
  "use-ai-to-create-science-practice-questions": illustration("science-practice-at-home", "Illustration of a student in a lavender hijab attempting science questions at a round dining-room table.", "Attempt the question before checking the worked answer. AI-generated editorial illustration."),
};
