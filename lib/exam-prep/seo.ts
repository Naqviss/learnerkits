import { getBoard, getLevel, getSubject, isVerified, liveSubjects, type Course } from "@/lib/exam-prep/catalog";

export const examPrepSeo = {
  title: "Science Exam Prep by Exam Board",
  description: "Prepare for Cambridge, Edexcel, AQA and IB science exams with structured lessons, interactive labs, topic checks, AI help and saved activity progress.",
  answer: "LearnerKits is a complete science learning and exam-preparation platform organised by board, qualification, subject and syllabus topic. Students can learn in a supported language, explore concepts interactively, check their understanding, save supported activity progress and ask a topic-aware AI tutor for help.",
  faqs: [
    {
      q: "Which exam boards can I revise with on LearnerKits?",
      a: "LearnerKits has pathways for Cambridge International, Pearson Edexcel, AQA and the International Baccalaureate, plus a board-neutral route for other curricula. Published syllabus coverage varies by board and level, and previews are clearly labelled.",
    },
    {
      q: "Which exam-prep subjects are available?",
      a: "Physics, Chemistry, Biology and Mathematics exam-prep lessons are available for every board. Physics and Chemistry topics link to interactive labs; Biology and Mathematics labs are in development. Each course is organised into syllabus topics so you can revise the part of the specification you need.",
    },
    {
      q: "How does interactive exam preparation work?",
      a: "Choose your board, qualification and subject. Read the concise concept explanation, use the linked interactive lab where one is available, answer a check question and continue to exam-paper practice.",
    },
    {
      q: "Can LearnerKits help when I do not understand a topic?",
      a: "Yes. Premium learners can ask the AI science tutor questions inside a simulation. The tutor receives the current simulation and topic context, while interactive controls let every learner test the idea visually.",
    },
    {
      q: "Does LearnerKits save my learning progress?",
      a: "Supported activities and subject notebooks save completed missions, evidence and scores in the current browser. This on-device progress does not yet sync automatically across browsers or devices.",
    },
    {
      q: "Is LearnerKits affiliated with an exam board?",
      a: "No. LearnerKits is an independent learning platform. Exam-board names identify the relevant curriculum, while the lessons, simulations and practice materials are original LearnerKits resources.",
    },
  ],
} as const;

type BoardSeo = {
  title: string;
  description: string;
  lead: string;
  overview: string;
};

const boardSeo: Record<string, BoardSeo> = {
  cambridge: {
    title: "Cambridge IGCSE & A Level Science Exam Prep",
    description: "Revise Cambridge IGCSE, AS and A Level science with syllabus lessons, interactive labs, topic checks, AI help and saved activity progress.",
    lead: "Prepare for Cambridge science exams by moving from the exact qualification and subject you study to a focused syllabus topic, interactive lab and practice task.",
    overview: "Choose IGCSE, O Level, AS Level or A Level. Verified LearnerKits pathways currently include Cambridge IGCSE Physics and Chemistry, plus AS and A Level Physics; other pathways are clearly marked as previews until their syllabus mapping is verified.",
  },
  pearson: {
    title: "Edexcel International A Level Physics Exam Prep",
    description: "Prepare for Edexcel International AS and A Level Physics by unit with lessons, interactive labs, topic checks, AI help and activity progress.",
    lead: "Revise Pearson Edexcel science through a clear path from qualification to unit, concept lesson, interactive experiment and practice question.",
    overview: "Choose International GCSE, GCSE, International AS or International A Level. Verified LearnerKits coverage currently focuses on Pearson Edexcel International AS and International A Level Physics, organised around Units 1–6.",
  },
  aqa: {
    title: "AQA GCSE & A Level Physics Exam Prep",
    description: "Revise AQA GCSE and A Level Physics by specification topic with lessons, interactive labs, topic checks, AI help and saved activity progress.",
    lead: "Prepare for AQA Physics by selecting GCSE, AS or A Level and revising one specification topic at a time with explanations, experiments and practice.",
    overview: "Choose GCSE, AS Level or A Level. Verified LearnerKits pathways currently cover AQA GCSE Physics and A Level Physics; AS and Chemistry pathways remain labelled previews until their syllabus mapping is verified.",
  },
  ib: {
    title: "IB Diploma Physics SL & HL Exam Prep",
    description: "Prepare for IB Diploma Physics at SL or HL with theme-based lessons, interactive labs, topic checks, AI help and saved activity progress.",
    lead: "Revise IB Diploma Physics through its themes, using short explanations and interactive models to connect equations with observable behaviour.",
    overview: "Choose Diploma Programme Standard Level or Higher Level. LearnerKits organises verified Physics coverage around the five IB themes: space, time and motion; particulate matter; waves; fields; and nuclear and quantum physics.",
  },
};

export function getBoardSeo(boardId: string) {
  const board = getBoard(boardId);
  if (!board) return undefined;
  return boardSeo[boardId] ?? {
    title: `${board.name} Science Exam Prep`,
    description: `Prepare for ${board.name} science exams with topic-based Physics, Chemistry, Biology and Mathematics revision, interactive labs and practice questions.`,
    lead: `Prepare for ${board.name} science exams with focused lessons, interactive experiments and practice.`,
    overview: `Choose the ${board.name} qualification and subject that match your course.`,
  };
}

export function verifiedBoardCourses(boardId: string): Course[] {
  const board = getBoard(boardId);
  if (!board) return [];
  return board.levels.flatMap((level) => liveSubjects
    .map((subject) => ({ board: boardId, level: level.id, subject: subject.id }))
    .filter(isVerified));
}

export function readableCourseName(course: Course) {
  const level = getLevel(course.board, course.level)?.name.replace(" · ", " ") ?? course.level;
  const subject = getSubject(course.subject)?.name ?? course.subject;
  return `${level} ${subject}`;
}

export function boardFaqs(boardId: string) {
  const board = getBoard(boardId);
  if (!board) return [];
  const verified = verifiedBoardCourses(boardId);
  const coverage = verified.length
    ? `Current verified pathways are ${verified.map(readableCourseName).join(", ")}. Preview pathways are labelled separately so students can distinguish them from checked syllabus mappings.`
    : "The current pathways are illustrative previews. They are clearly labelled and will remain excluded from search indexing until their syllabus mappings have been checked.";
  const levels = board.levels.map((level) => level.name.replace(" · ", " ")).join(", ");
  return [
    {
      q: `What ${board.short} exam-prep courses are available?`,
      a: coverage,
    },
    {
      q: `Which ${board.short} levels can I browse?`,
      a: `You can browse ${levels}. Select your level first, then choose Physics, Chemistry, Biology or Mathematics to see the available topic sequence.`,
    },
    {
      q: `How should I use LearnerKits for ${board.short} revision?`,
      a: "Start with the topic you are studying, read the concise explanation, use the linked interactive lab where available, answer the check question and then practise with the relevant paper or mock-exam material.",
    },
    {
      q: `Are these official ${board.short} resources?`,
      a: `No. LearnerKits is independent and is not affiliated with or endorsed by ${board.name}. The board name identifies the curriculum; the learning and practice resources are original LearnerKits materials.`,
    },
    {
      q: `Can I get AI help while revising ${board.short} topics?`,
      a: "Premium learners can open the AI science tutor inside a simulation and ask questions with the current topic context. AI answers can be wrong, so important facts should still be checked with a teacher or trusted source.",
    },
    {
      q: "Where is my activity progress saved?",
      a: "Supported missions, evidence and scores are saved in the current browser. They can be lost if browser data is cleared and do not currently sync automatically to another device.",
    },
  ];
}
