import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { boards, courses, coursePath, courseTitle, getSyllabus, isBoardIndexable, isFreeTopic, isVerified, labs, lessonContent, subjectCode, syllabi, syllabusKey, topicPath } from "@/lib/exam-prep/catalog";
import { getPapers, paperCatalog } from "@/lib/exam-prep/papers";
import { examPrepIndexablePaths } from "@/lib/exam-prep/paths";
import { bestFit, graphPoints, markPractical, practicalKinds, takeReading } from "@/lib/exam-prep/practical";
import { getSimulationCard } from "@/lib/subjects/catalog";
import TopicPage, { generateMetadata, generateStaticParams } from "@/app/[locale]/exam-prep/[board]/[level]/[subject]/[topic]/page";
import CoursePage from "@/app/[locale]/exam-prep/[board]/[level]/[subject]/page";
import PapersPage, { generateStaticParams as paperParams } from "@/app/[locale]/exam-prep/[board]/[level]/[subject]/papers/page";

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
    expect(isVerified({ board: "fbise", level: "ssc1", subject: "physics" })).toBe(false);
    expect(isBoardIndexable("fbise")).toBe(false);
  });

  it("keeps two lessons free per syllabus", () => {
    const topics = getSyllabus(asPhysics);
    expect(topics.filter((topic, index) => isFreeTopic(asPhysics, topic, index)).map((topic) => topic.name)).toEqual(["Kinematics", "Dynamics"]);
    for (const course of courses) expect(getSyllabus(course).filter((topic, index) => isFreeTopic(course, topic, index)), coursePath(course)).toHaveLength(2);
  });

  it("lists only verified, unique pages in the sitemap paths", () => {
    expect(new Set(examPrepIndexablePaths).size).toBe(examPrepIndexablePaths.length);
    expect(examPrepIndexablePaths).toContain("/exam-prep");
    expect(examPrepIndexablePaths).toContain("/exam-prep/cambridge/as/physics/kinematics");
    expect(examPrepIndexablePaths).toContain("/exam-prep/cambridge/as/physics/papers");
    expect(examPrepIndexablePaths).toContain("/exam-prep/practicals/circuit");
    expect(examPrepIndexablePaths.some((path) => path.includes("/fbise") || path.includes("/olevel/") || path.startsWith("/exam-prep/aqa/as"))).toBe(false);
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
    expect(html).toContain("/en/simulations/pendulum-physics");
    expect(html).toContain("part of Premium");
    expect(html).not.toContain(lessonContent.waves.example);
  });

  it("marks illustrative syllabi noindex with a visible notice", async () => {
    const course = { board: "fbise", level: "hssc1", subject: "physics" };
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
});
