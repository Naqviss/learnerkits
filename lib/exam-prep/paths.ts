import { boards, canonicalTopicCourse, coursePath, courses, examPrepHubsIndexed, getSyllabus, isBoardIndexable, isLevelIndexable, isVerified, topicLessonsIndexed, topicPath } from "./catalog";
import { getPapers } from "./papers";
import { practicalKinds } from "./practical";

/** Board, level, course and papers pages for verified syllabi (no locale prefix). Illustrative mappings are left out. */
export const examPrepHubPaths: string[] = [
  ...boards.filter((board) => isBoardIndexable(board.id)).map((board) => `/exam-prep/${board.id}`),
  ...boards.flatMap((board) => board.levels.filter((level) => isLevelIndexable(board.id, level.id)).map((level) => `/exam-prep/${board.id}/${level.id}`)),
  ...courses.filter(isVerified).flatMap((course) => [coursePath(course), ...(getPapers(course) ? [`${coursePath(course)}/papers`] : [])]),
];

/** Topic lessons for verified syllabi, without the repeats whose canonical is an earlier level's lesson. */
export const examPrepTopicPaths: string[] = courses.filter(isVerified).flatMap((course) => getSyllabus(course).filter((topic) => !canonicalTopicCourse(course, topic)).map((topic) => topicPath(course, topic)));

/** Exam Prep paths open to Google, for the sitemap. Hubs and lessons only appear while their switch is on. */
export const examPrepIndexablePaths: string[] = [
  "/exam-prep",
  "/exam-prep/any-board",
  ...(examPrepHubsIndexed ? examPrepHubPaths : []),
  ...(topicLessonsIndexed ? examPrepTopicPaths : []),
  ...practicalKinds.map((kind) => `/exam-prep/practicals/${kind}`),
];
