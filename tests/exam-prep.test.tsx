import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { boards, courses, coursePath, courseTitle, getSyllabus, isBoardIndexable, isFreeTopic, isVerified, labs, lessonContent, subjectCode, syllabi, syllabusKey, topicPath } from "@/lib/exam-prep/catalog";
import { getPapers, paperCatalog } from "@/lib/exam-prep/papers";
import { buildExam, examLength, generators } from "@/lib/exam-prep/generators";
import { lessonDetail } from "@/lib/exam-prep/lessons";
import { questionBank } from "@/lib/exam-prep/question-bank";
import { tutorPrompt } from "@/lib/ai/tutor";
import { examPrepIndexablePaths } from "@/lib/exam-prep/paths";
import { bestFit, graphPoints, markPractical, practicalKinds, takeReading } from "@/lib/exam-prep/practical";
import { getSimulationCard, visibleSubjectSlugs } from "@/lib/subjects/catalog";
import TopicPage, { generateMetadata, generateStaticParams } from "@/app/[locale]/exam-prep/[board]/[level]/[subject]/[topic]/page";
import CoursePage from "@/app/[locale]/exam-prep/[board]/[level]/[subject]/page";
import PapersPage, { generateStaticParams as paperParams } from "@/app/[locale]/exam-prep/[board]/[level]/[subject]/papers/page";
import ExamPrepPage, { generateMetadata as generateExamPrepMetadata } from "@/app/[locale]/exam-prep/page";
import BoardPage, { generateMetadata as generateBoardMetadata } from "@/app/[locale]/exam-prep/[board]/page";
import AnyBoardPage, { generateMetadata as generateAnyBoardMetadata } from "@/app/[locale]/exam-prep/any-board/page";

const asPhysics = { board: "cambridge", level: "as", subject: "physics" };

describe("exam prep catalog", () => {
  it("links only to simulations that exist", () => {
    for (const lab of Object.values(labs)) expect(getSimulationCard(lab.slug), lab.slug).toBeDefined();
  });

  it("gives every topic a unique URL slug and known lesson content", () => {
    for (const [key, topics] of Object.entries(syllabi)) {
      const slugs = topics.map((topic) => topic.slug);
      expect(new Set(slugs).size, key).toBe(slugs.length);
      for (const topic of topics) {
        expect(topic.slug, topic.name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
        expect(topic.slug).not.toBe("papers");
        expect(lessonContent[topic.content].options[lessonContent[topic.content].answer]).toBeTruthy();
      }
    }
    expect(boards.map((board) => board.id)).not.toContain("practicals");
  });

  it("maps courses to the right syllabus, code and verification status", () => {
    expect(syllabusKey(asPhysics)).toBe("cambridge_as_physics");
    expect(getSyllabus(asPhysics)).toHaveLength(11);
    expect(getSyllabus({ ...asPhysics, level: "a" })).toHaveLength(25);
    expect(getSyllabus({ board: "pearson", level: "ias", subject: "physics" })).toHaveLength(3);
    expect(getSyllabus({ board: "pearson", level: "ial", subject: "physics" })).toHaveLength(6);
    expect(subjectCode(asPhysics)).toBe("9702");
    expect(subjectCode({ board: "aqa", level: "gcse", subject: "physics" })).toBe("8463");
    expect(courseTitle(asPhysics)).toBe("Cambridge AS Level Physics 9702");
    expect(isVerified(asPhysics)).toBe(true);
    expect(isVerified({ board: "cambridge", level: "olevel", subject: "physics" })).toBe(false);
    expect(isVerified({ board: "cambridge", level: "as", subject: "chemistry" })).toBe(false);
    expect(isVerified({ board: "aqa", level: "as", subject: "physics" })).toBe(false);
    expect(isVerified({ board: "cambridge", level: "igcse", subject: "biology" })).toBe(false);
    expect(boards.map((board) => board.id)).toEqual(["cambridge", "pearson", "aqa", "ib"]);
    for (const board of boards) expect(isBoardIndexable(board.id), board.id).toBe(true);
  });

  it("keeps two lessons free per syllabus", () => {
    const topics = getSyllabus(asPhysics);
    expect(topics.filter((topic, index) => isFreeTopic(asPhysics, topic, index)).map((topic) => topic.name)).toEqual(["Kinematics", "Dynamics"]);
    for (const course of courses) expect(getSyllabus(course).filter((topic, index) => isFreeTopic(course, topic, index)), coursePath(course)).toHaveLength(2);
  });

  it("lists only verified, unique pages in the sitemap paths", () => {
    expect(new Set(examPrepIndexablePaths).size).toBe(examPrepIndexablePaths.length);
    expect(examPrepIndexablePaths).toContain("/exam-prep");
    expect(examPrepIndexablePaths).toContain("/exam-prep/any-board");
    expect(examPrepIndexablePaths).toContain("/exam-prep/cambridge/as/physics/kinematics");
    expect(examPrepIndexablePaths).toContain("/exam-prep/cambridge/as/physics/papers");
    expect(examPrepIndexablePaths).toContain("/exam-prep/practicals/circuit");
    expect(examPrepIndexablePaths.some((path) => path.includes("/biology") || path.includes("/maths") || path.includes("/olevel/") || path.startsWith("/exam-prep/aqa/as"))).toBe(false);
    for (const course of courses.filter((item) => !isVerified(item))) expect(examPrepIndexablePaths).not.toContain(coursePath(course));
  });

  it("has verified papers only for the three checked specifications", () => {
    expect(getPapers(asPhysics)?.papers).toHaveLength(5);
    expect(getPapers({ board: "pearson", level: "ias", subject: "physics" })?.papers).toHaveLength(3);
    expect(getPapers({ board: "ib", level: "dp-sl", subject: "physics" })).toBeNull();
    expect(paperCatalog.cambridge9702.map((paper) => paper.marks)).toEqual(["40 marks", "60 marks", "40 marks", "100 marks", "30 marks"]);
    expect(paperParams()).toHaveLength(5);
  });
});

describe("topic explanation, test and tutor", () => {
  // A repeatable stand-in for Math.random.
  const seeded = (seed: number) => () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const contents = Object.keys(lessonContent) as (keyof typeof lessonContent)[];

  it("has an easy explanation and at least five test questions for every lesson", () => {
    for (const id of contents) {
      expect(lessonDetail[id].explain.length, id).toBeGreaterThanOrEqual(3);
      expect(lessonDetail[id].mistake, id).toBeTruthy();
      expect(1 + questionBank[id].length + (generators[id] ? 2 : 0), id).toBeGreaterThanOrEqual(examLength);
      for (const item of questionBank[id]) {
        expect(new Set(item.options).size, item.question).toBe(4);
        expect(item.options[item.answer], item.question).toBeTruthy();
      }
    }
  });

  it("generates calculation questions with four different options", () => {
    for (const [id, make] of Object.entries(generators)) {
      const rand = seeded(id.length * 7919);
      for (let run = 0; run < 40; run++) {
        const item = make(rand);
        expect(new Set(item.options).size, `${id}: ${item.question}`).toBe(4);
        expect(item.answer, id).toBe(0);
        expect(item.question, id).not.toMatch(/NaN|undefined|Infinity/);
        expect(item.options.join(" ") + item.why, id).not.toMatch(/NaN|undefined|Infinity/);
      }
    }
  });

  it("builds a five-question test in a different order each time, keeping the right answer", () => {
    for (const id of contents) {
      const base = lessonContent[id], pool = [{ question: base.question, options: base.options, answer: base.answer, why: base.why }, ...questionBank[id]];
      const first = buildExam(id, pool, seeded(1)), second = buildExam(id, pool, seeded(99));
      expect(first, id).toHaveLength(examLength);
      expect(new Set(first.map((item) => item.question)).size, id).toBe(examLength);
      for (const item of first) {
        const source = pool.find((entry) => entry.question === item.question);
        if (source) expect(item.options[item.answer], item.question).toBe(source.options[source.answer]);
        expect(item.options[item.answer], item.question).toBeTruthy();
      }
      expect(JSON.stringify(first), id).not.toBe(JSON.stringify(second));
    }
  });

  it("tells the AI tutor which exam topic the student is revising", () => {
    const prompt = tutorPrompt({ title: "Kinematics", subject: "Physics", concepts: "v = u + at", language: "English", topic: "Kinematics", course: "Cambridge AS Level Physics 9702" });
    expect(prompt).toContain('revising the exam topic "Kinematics" for Cambridge AS Level Physics 9702');
    expect(prompt).toContain("exam-style question");
    expect(tutorPrompt({ title: "Projectile Lab", subject: "Physics", concepts: "", language: "English" })).toContain('interactive simulation "Projectile Lab"');
  });
});

describe("virtual practicals", () => {
  const all = (kind: "circuit" | "pendulum") => (kind === "circuit" ? [2, 4, 6, 8, 10, 12] : [0.2, 0.4, 0.6, 0.8, 1]).map((setting) => takeReading(kind, setting));

  it("recovers the model resistance and g from the best-fit gradient", () => {
    expect(bestFit(graphPoints("circuit", all("circuit")))!.slope).toBeCloseTo(8, 0);
    expect(4 * Math.PI ** 2 / bestFit(graphPoints("pendulum", all("pendulum")))!.slope).toBeCloseTo(9.81, 0);
    expect(bestFit([{ x: 1, y: 1 }])).toBeNull();
    expect(practicalKinds).toEqual(["circuit", "pendulum"]);
  });

  it("awards 12 marks for complete work and none for an empty attempt", () => {
    expect(markPractical("circuit", { readings: all("circuit"), plotted: true, estimate: "8.1", unit: "ohm", method: "repeat" }).score).toBe(12);
    expect(markPractical("pendulum", { readings: all("pendulum"), plotted: true, estimate: "9.8", unit: "ms2", method: "repeat" }).score).toBe(12);
    expect(markPractical("circuit", { readings: [], plotted: false, estimate: "", unit: "v", method: "" }).score).toBe(0);
    expect(markPractical("circuit", { readings: all("circuit").slice(0, 3), plotted: true, estimate: "20", unit: "ohm", method: "single" }).score).toBe(4);
  });
});

describe("exam prep pages", () => {
  const params = (course: typeof asPhysics, topic: string) => Promise.resolve({ locale: "en", ...course, topic });

  it("prerenders every topic of every course", () => {
    expect(generateStaticParams()).toHaveLength(courses.reduce((sum, course) => sum + getSyllabus(course).length, 0));
  });

  it("renders a free lesson in full with structured data and an SEO title", async () => {
    const html = renderToStaticMarkup(await TopicPage({ params: params(asPhysics, "kinematics") }));
    expect(html).toContain("v = u + at");
    expect(html).toContain("Kinematics explained simply");
    expect(html).toContain(lessonDetail.kinematics.explain[0]);
    expect(html).toContain("Common mistake");
    expect(html).toContain("Try it: interactive simulation");
    expect(html).toContain("Your understanding of this topic");
    expect(html).toContain("Start the topic test");
    expect(html).toContain("Ask the AI tutor about Kinematics");
    expect(html.indexOf("explained simply")).toBeLessThan(html.indexOf("Try it: interactive simulation"));
    expect(html.indexOf("Try it: interactive simulation")).toBeLessThan(html.indexOf("Topic test"));
    expect(html.indexOf("Topic test")).toBeLessThan(html.indexOf("Ask the AI tutor"));
    expect(html).toContain("/en/simulations/projectile-lab");
    expect(html).toContain("LearningResource");
    expect(html).toContain("not affiliated with or endorsed by any exam board");
    const metadata = await generateMetadata({ params: params(asPhysics, "kinematics") });
    expect(metadata.title).toEqual({ absolute: "Kinematics – Cambridge AS Level Physics 9702 | Exam Prep | LearnerKits" });
    expect(metadata.robots).toMatchObject({ index: true });
  });

  it("soft-locks a Premium lesson but keeps the concept and lab link in the HTML", async () => {
    const html = renderToStaticMarkup(await TopicPage({ params: params(asPhysics, "waves") }));
    expect(html).toContain(lessonContent.waves.brief);
    expect(html).toContain(lessonDetail.waves.explain[0]);
    expect(html).not.toContain("Your understanding of this topic");
    expect(html).toContain("/en/simulations/pendulum-physics");
    expect(html).toContain("part of Premium");
    expect(html).not.toContain(lessonContent.waves.example);
  });

  it("marks illustrative syllabi noindex with a visible notice", async () => {
    const course = { board: "cambridge", level: "olevel", subject: "physics" };
    const metadata = await generateMetadata({ params: params(course, getSyllabus(course)[0].slug) });
    expect(metadata.robots).toEqual({ index: false, follow: false });
    const html = renderToStaticMarkup(await CoursePage({ params: Promise.resolve({ locale: "en", ...course }) }));
    expect(html).toContain("Illustrative topic list");
    expect(html).not.toContain("application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"CollectionPage\"");
  });

  it("lists topics with free and Premium badges and links to papers", async () => {
    const html = renderToStaticMarkup(await CoursePage({ params: Promise.resolve({ locale: "en", ...asPhysics }) }));
    for (const topic of getSyllabus(asPhysics)) expect(html).toContain(`/en${topicPath(asPhysics, topic)}`);
    expect(html).toContain("/en/exam-prep/cambridge/as/physics/papers");
    expect(html.match(/>Free</g)).toHaveLength(2);
    const papers = renderToStaticMarkup(await PapersPage({ params: Promise.resolve({ locale: "en", ...asPhysics }) }));
    expect(papers).toContain("Planning, Analysis and Evaluation");
    expect(papers).toContain("/en/exam-prep/practicals/pendulum");
  });

  it("gives the exam-prep hub useful answer content and matching structured data", async () => {
    const html = renderToStaticMarkup(await ExamPrepPage({ params: Promise.resolve({ locale: "en" }) }));
    expect(html).toContain("Revise for your science exam by board and topic");
    expect(html).toContain("How does interactive exam preparation work?");
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toContain('"@type":"BreadcrumbList"');
    expect(html).toContain('"numberOfItems":5');
    const metadata = await generateExamPrepMetadata({ params: Promise.resolve({ locale: "en" }) });
    expect(metadata.title).toBe("Science Exam Prep by Exam Board");
    expect(String(metadata.description).length).toBeGreaterThanOrEqual(100);
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
  });

  it("uses unique board search snippets and indexes only verified board hubs", async () => {
    const titles = new Set<string>();
    for (const board of boards) {
      const metadata = await generateBoardMetadata({ params: Promise.resolve({ locale: "en", board: board.id }) });
      const title = String(metadata.title), description = String(metadata.description);
      expect(title.length, board.id).toBeLessThanOrEqual(60);
      expect(description.length, board.id).toBeGreaterThanOrEqual(100);
      expect(description.length, board.id).toBeLessThanOrEqual(160);
      titles.add(title);
      expect(metadata.robots).toMatchObject({ index: isBoardIndexable(board.id) });
    }
    expect(titles.size).toBe(boards.length);
  });

  it("renders substantive board guidance", async () => {
    const cambridge = renderToStaticMarkup(await BoardPage({ params: Promise.resolve({ locale: "en", board: "cambridge" }) }));
    expect(cambridge).toContain("What can I study for Cambridge?");
    expect(cambridge).toContain("Verified courses available now");
    expect(cambridge).toContain('"@type":"FAQPage"');
  });

  it("gives students from other boards an indexable, honest preparation route", async () => {
    const html = renderToStaticMarkup(await AnyBoardPage({ params: Promise.resolve({ locale: "en" }) }));
    expect(html).toContain("Prepare for exams—even if your board is not listed");
    expect(html).toContain("Can LearnerKits help students from any exam board?");
    expect(html).toContain("Only pages labelled “Published syllabus”");
    for (const subject of visibleSubjectSlugs) expect(html).toContain(`/en/subjects/${subject}`);
    expect(html).toContain(`"numberOfItems":${visibleSubjectSlugs.length}`);
    expect(html).toContain('"@type":"FAQPage"');
    const metadata = await generateAnyBoardMetadata({ params: Promise.resolve({ locale: "en" }) });
    expect(metadata).toMatchObject({ title: "Exam Prep for Any Exam Board", robots: { index: true } });
    expect(String(metadata.description).length).toBeGreaterThanOrEqual(100);
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
  });
});
