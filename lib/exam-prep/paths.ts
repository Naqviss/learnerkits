import { boards, canonicalTopicCourse, coursePath, courses, getSyllabus, isBoardIndexable, isLevelIndexable, isVerified, topicPath } from "./catalog";
import { getPapers } from "./papers";
import { practicalKinds } from "./practical";

/** Indexable Exam Prep paths (no locale prefix) for the sitemap. Illustrative mappings are left out. */
export const examPrepIndexablePaths: string[] = [
  "/exam-prep",
  "/exam-prep/any-board",
  ...boards.filter((board) => isBoardIndexable(board.id)).map((board) => `/exam-prep/${board.id}`),
  ...boards.flatMap((board) => board.levels.filter((level) => isLevelIndexable(board.id, level.id)).map((level) => `/exam-prep/${board.id}/${level.id}`)),
  ...courses.filter(isVerified).flatMap((course) => [
    coursePath(course),
    ...getSyllabus(course).filter((topic) => !canonicalTopicCourse(course, topic)).map((topic) => topicPath(course, topic)),
    ...(getPapers(course) ? [`${coursePath(course)}/papers`] : []),
  ]),
  ...practicalKinds.map((kind) => `/exam-prep/practicals/${kind}`),
];
