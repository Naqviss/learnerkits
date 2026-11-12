"use client";
import { useEffect, useMemo, useState } from "react";
import { mockBanks, mockExams, type MockQuestion } from "@/lib/mock-exams/catalog";
import { download, kitModule, lessonOutline, paperSections, starterTopics, wordDocument } from "@/lib/classroom/templates";
import type { KitData, KitModule, LessonData, PaperData, PaperQuestion, QuestionData, TeachingItem } from "@/lib/classroom/types";
import { boards, Field, formatDate, formValue, labs, labTitle, levels, Select, subjects, type TeacherContext } from "./shared";
import styles from "./classroom.module.css";

type Props = TeacherContext & { onAssign: (itemId: string) => void };
const emptyLesson: LessonData & { id?: string; title: string } = { title: "", board: boards[0], level: "AS Level", subject: "Physics", topic: "", duration: 45, objective: "", outline: "", labSlugs: [], videos: [] };
const word = "application/msword";
const fileName = (title: string) => `LearnerKits ${title.replace(/[^\w\- ]+/g, "").trim().slice(0, 60) || "resource"}.doc`;

export function LessonsTab({ state, act, notify, onAssign }: Props) {
  const [draft, setDraft] = useState(emptyLesson);
  const [labSearch, setLabSearch] = useState("");
  const [drafting, setDrafting] = useState(false);
  const lessons = state.items.filter((item) => item.kind === "lesson");
  const set = (patch: Partial<typeof emptyLesson>) => setDraft((current) => ({ ...current, ...patch }));
  const labNames = draft.labSlugs.map(labTitle);
  const shownLabs = labs.filter((lab) => draft.labSlugs.includes(lab.slug) || lab.title.toLowerCase().includes(labSearch.toLowerCase())).slice(0, 40);

  const template = () => {
    if (!draft.topic.trim()) return notify("Enter a syllabus topic first.");
    set({ outline: lessonOutline({ topic: draft.topic.trim(), duration: draft.duration, labNames }) });
  };
  const aiDraft = async () => {
    if (!draft.topic.trim()) return notify("Enter a syllabus topic first.");
    setDrafting(true);
    const result = await act("generateLesson", { topic: draft.topic, board: draft.board, level: draft.level, subject: draft.subject, duration: draft.duration, objective: draft.objective, labNames });
    setDrafting(false);
    if (result && typeof result.outline === "string") { set({ outline: result.outline }); notify("AI draft ready. Review and edit it before saving."); }
    else set({ outline: draft.outline || lessonOutline({ topic: draft.topic.trim(), duration: draft.duration, labNames }) });
  };
  const save = async () => {
    const { id, title, ...data } = draft;
    const saved = await act("saveItem", { id, kind: "lesson", title: title.trim() || `${draft.topic.trim() || "Science"} lesson`, data }, "Lesson saved.");
    if (saved) setDraft(emptyLesson);
  };

  return <div className={styles.grid2}>
    <section className={styles.panel}>
      <div className={styles.between}><h2>{draft.id ? "Edit lesson" : "Build a lesson"}</h2>{draft.id && <button type="button" className={`${styles.btn} ${styles.small}`} onClick={() => setDraft(emptyLesson)}>New lesson</button>}</div>
      <p>Choose a topic and resources, draft a timed plan, then edit every line before you save.</p>
      <div className={styles.form}>
        <Field label="Lesson title" full><input value={draft.title} maxLength={140} placeholder="e.g. Forces and acceleration" onChange={(event) => set({ title: event.target.value })} /></Field>
        <Field label="Board"><Select name="board" options={boards} value={draft.board} onChange={(board) => set({ board })} /></Field>
        <Field label="Level"><Select name="level" options={levels} value={draft.level} onChange={(level) => set({ level })} /></Field>
        <Field label="Subject"><Select name="subject" options={subjects} value={draft.subject} onChange={(subject) => set({ subject })} /></Field>
        <Field label="Length (minutes)"><input type="number" min={10} max={240} value={draft.duration} onChange={(event) => set({ duration: Number(event.target.value) || 45 })} /></Field>
        <Field label="Syllabus topic" full><input value={draft.topic} maxLength={120} placeholder="e.g. Newton's second law" onChange={(event) => set({ topic: event.target.value })} /></Field>
        <Field label="Learning objective" full><textarea value={draft.objective} maxLength={1000} placeholder="What should students be able to explain or do?" onChange={(event) => set({ objective: event.target.value })} /></Field>
        <div className={`${styles.field} ${styles.full}`}>
          <span>LearnerKits simulations ({draft.labSlugs.length} selected)</span>
          <input type="search" value={labSearch} placeholder="Search simulations…" aria-label="Search simulations" onChange={(event) => setLabSearch(event.target.value)} />
          <div className={styles.checks}>{shownLabs.map((lab) => <label key={lab.slug} className={styles.check}><input type="checkbox" checked={draft.labSlugs.includes(lab.slug)} onChange={(event) => set({ labSlugs: event.target.checked ? [...draft.labSlugs, lab.slug].slice(0, 12) : draft.labSlugs.filter((slug) => slug !== lab.slug) })} /><span>{lab.title}</span></label>)}</div>
        </div>
        <Field label="Video links (https, one per line)" full><textarea value={draft.videos.join("\n")} placeholder="https://…" onChange={(event) => set({ videos: event.target.value.split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 8) })} /></Field>
        <Field label="Lesson plan" full><textarea style={{ minHeight: 190 }} value={draft.outline} maxLength={6000} placeholder="Draft a plan below, or write your own." onChange={(event) => set({ outline: event.target.value })} /></Field>
      </div>
      <div className={styles.row} style={{ marginTop: 14 }}>
        <button type="button" className={`${styles.btn} ${styles.primary}`} disabled={drafting} onClick={aiDraft}>{drafting ? "Drafting…" : "✦ Draft with AI"}</button>
        <button type="button" className={styles.btn} onClick={template}>Use template</button>
        <button type="button" className={styles.btn} disabled={!draft.outline.trim()} onClick={save}>Save lesson</button>
      </div>
      <p className={styles.hint}>AI drafts are a starting point. Check them against your syllabus before teaching.</p>
    </section>
    <section className={styles.panel}>
      <div className={styles.between}><h2>Saved lessons</h2><span className={styles.badge}>{lessons.length}</span></div>
      {lessons.length ? <div className={styles.rows}>{lessons.map((item) => {
        const lesson = item.data as LessonData;
        return <div key={item.id} className={styles.item}>
          <div><h3>{item.title}</h3><p>{lesson.subject} · {lesson.duration} min · {lesson.labSlugs?.length ?? 0} simulations · updated {formatDate(item.updated_at)}</p></div>
          <div className={styles.row}>
            <button type="button" className={`${styles.btn} ${styles.small}`} onClick={() => setDraft({ ...emptyLesson, ...lesson, id: item.id, title: item.title })}>Edit</button>
            <button type="button" className={`${styles.btn} ${styles.small}`} onClick={() => download(fileName(item.title), wordDocument(item.title, [{ heading: "Objective", body: lesson.objective }, { heading: "Lesson plan", body: lesson.outline }, { heading: "Simulations", body: (lesson.labSlugs ?? []).map((slug) => `${labTitle(slug)} — https://www.learnerkits.com/en/simulations/${slug}`).join("\n") }, { heading: "Videos", body: (lesson.videos ?? []).join("\n") }]), word)}>Word</button>
            <button type="button" className={`${styles.btn} ${styles.small} ${styles.primary}`} onClick={() => onAssign(item.id)}>Assign</button>
            <button type="button" className={`${styles.btn} ${styles.small} ${styles.danger}`} onClick={() => { if (confirm(`Delete "${item.title}"? Assignments that use it are removed too.`)) void act("deleteItem", { id: item.id }, "Lesson deleted."); }}>Delete</button>
          </div>
        </div>;
      })}</div> : <div className={styles.empty}>No lessons yet. Build your first one on the left.</div>}
    </section>
  </div>;
}

type BankQuestion = PaperQuestion & { subject: string; custom?: string };

export function PapersTab({ state, act, notify, onAssign }: Props) {
  const [subject, setSubject] = useState("Physics");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [managedBank, setManagedBank] = useState<BankQuestion[]>([]);
  const [managedBankLoaded, setManagedBankLoaded] = useState(false);
  useEffect(() => {
    let live = true;
    Promise.all(mockExams.map(async (exam) => {
      const response = await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "questions", examId: exam.id }) });
      if (!response.ok) return null;
      const result = await response.json() as { questions: MockQuestion[] };
      return result.questions.map((question) => ({ ...question, subject: question.subject }));
    })).then((banks) => {
      if (!live || banks.some((bank) => bank === null)) return;
      setManagedBank(banks.flatMap((bank) => bank ?? [])); setManagedBankLoaded(true);
    }).catch(() => {});
    return () => { live = false; };
  }, []);
  const defaultBank = useMemo(() => Object.values(mockBanks).flat().map((question) => ({ id: question.id, topic: question.topic, q: question.q, options: question.options, answer: question.answer, why: question.why, lab: question.lab, subject: question.subject })), []);
  const globalBank = managedBankLoaded ? managedBank : defaultBank;
  const bank = useMemo<BankQuestion[]>(() => [
    ...state.items.filter((item) => item.kind === "question").map((item) => { const data = item.data as QuestionData; return { ...data, id: `custom-${item.id}`, custom: item.id }; }),
    ...globalBank,
  ], [state.items, globalBank]);
  const shown = bank.filter((question) => question.subject === subject && `${question.topic} ${question.q}`.toLowerCase().includes(search.toLowerCase()));
  const chosen = selected.map((id) => bank.find((question) => question.id === id)).filter((question): question is BankQuestion => Boolean(question));
  const papers = state.items.filter((item) => item.kind === "paper");
  const toggle = (id: string, on: boolean) => setSelected((current) => on ? [...current, id].slice(0, 60) : current.filter((value) => value !== id));

  const savePaper = async (form: HTMLFormElement) => {
    if (!chosen.length) return notify("Select at least one question.");
    const data: PaperData = { subject, minutes: Number(formValue(form, "minutes")) || 45, questions: chosen.map(({ id, topic, q, options, answer, why, lab }) => ({ id, topic, q, options, answer, why, lab })) };
    if (await act("saveItem", { kind: "paper", title: formValue(form, "title") || `${subject} practice paper`, data }, "Question paper saved.")) { setSelected([]); form.reset(); }
  };
  const addQuestion = async (form: HTMLFormElement) => {
    const options = [0, 1, 2, 3].map((index) => formValue(form, `option${index}`));
    const data: QuestionData = { subject, topic: formValue(form, "topic"), q: formValue(form, "q"), options, answer: Number(formValue(form, "answer")), why: formValue(form, "why") };
    if (!data.q || !data.topic || options.some((option) => !option)) return notify("Complete the question, topic and all four options.");
    if (await act("saveItem", { kind: "question", title: data.q.slice(0, 120), data }, "Question added to your bank.")) form.reset();
  };

  return <div className={styles.grid2}>
    <section className={styles.panel}>
      <div className={styles.between}><h2>Question bank</h2><span className={styles.badge}>{bank.filter((question) => question.subject === subject).length} {subject} questions</span></div>
      <p>Original LearnerKits practice questions plus your own. These are not official past-paper questions.</p>
      <div className={styles.form}>
        <Field label="Subject"><Select name="subject" options={subjects} value={subject} onChange={(next) => { setSubject(next); setSelected([]); }} /></Field>
        <Field label="Search"><input type="search" value={search} placeholder="Topic or question…" onChange={(event) => setSearch(event.target.value)} /></Field>
      </div>
      <div className={styles.checks} style={{ maxHeight: 420, marginTop: 12 }}>
        {shown.map((question) => <label key={question.id} className={styles.check}>
          <input type="checkbox" checked={selected.includes(question.id)} onChange={(event) => toggle(question.id, event.target.checked)} />
          <span>{question.q}<small>{question.topic}{question.custom ? " · your question" : ""} · Answer: {question.options[question.answer]}</small></span>
          {question.custom && <button type="button" className={`${styles.btn} ${styles.small} ${styles.danger}`} onClick={(event) => { event.preventDefault(); if (confirm("Delete this question from your bank?")) void act("deleteItem", { id: question.custom }, "Question deleted."); }}>Delete</button>}
        </label>)}
        {!shown.length && <div className={styles.empty}>No questions match. Add your own below.</div>}
      </div>
      <details style={{ marginTop: 14 }}>
        <summary className={styles.btn}>＋ Add your own question</summary>
        <form className={styles.form} style={{ marginTop: 12 }} onSubmit={(event) => { event.preventDefault(); void addQuestion(event.currentTarget); }}>
          <Field label="Topic" full><input name="topic" maxLength={120} required /></Field>
          <Field label="Question" full><textarea name="q" maxLength={1000} required /></Field>
          {["A", "B", "C", "D"].map((letter, index) => <Field key={letter} label={`Option ${letter}`}><input name={`option${index}`} maxLength={300} required /></Field>)}
          <Field label="Correct answer"><Select name="answer" options={[["0", "A"], ["1", "B"], ["2", "C"], ["3", "D"]]} defaultValue="0" /></Field>
          <Field label="Worked explanation" full><textarea name="why" maxLength={1500} /></Field>
          <div className={styles.full}><button type="submit" className={`${styles.btn} ${styles.primary}`}>Save question</button></div>
        </form>
      </details>
    </section>
    <section className={styles.panel}>
      <h2>Build a paper</h2>
      <p>{chosen.length} question{chosen.length === 1 ? "" : "s"} selected · {chosen.length} mark{chosen.length === 1 ? "" : "s"} · marked automatically when students submit.</p>
      <form className={styles.form} onSubmit={(event) => { event.preventDefault(); void savePaper(event.currentTarget); }}>
        <Field label="Paper title" full><input name="title" maxLength={140} placeholder="e.g. Forces quick assessment" /></Field>
        <Field label="Time guideline (minutes)"><input name="minutes" type="number" min={5} max={240} defaultValue={45} /></Field>
        <div className={styles.field} style={{ justifyContent: "flex-end" }}><button type="submit" className={`${styles.btn} ${styles.primary}`} disabled={!chosen.length}>Save paper</button></div>
      </form>
      <div className={styles.between} style={{ marginTop: 22 }}><h2>Saved papers</h2><span className={styles.badge}>{papers.length}</span></div>
      {papers.length ? <div className={styles.rows}>{papers.map((item) => {
        const paper = item.data as PaperData;
        return <div key={item.id} className={styles.item}>
          <div><h3>{item.title}</h3><p>{paper.subject} · {paper.questions.length} questions · {paper.minutes} min</p></div>
          <div className={styles.row}>
            <button type="button" className={`${styles.btn} ${styles.small}`} onClick={() => download(fileName(item.title), wordDocument(item.title, paperSections(paper.questions)), word)}>Word</button>
            <button type="button" className={`${styles.btn} ${styles.small} ${styles.primary}`} onClick={() => onAssign(item.id)}>Assign</button>
            <button type="button" className={`${styles.btn} ${styles.small} ${styles.danger}`} onClick={() => { if (confirm(`Delete "${item.title}"? Assignments and submissions that use it are removed too.`)) void act("deleteItem", { id: item.id }, "Paper deleted."); }}>Delete</button>
          </div>
        </div>;
      })}</div> : <div className={styles.empty}>No papers yet. Select questions and save one.</div>}
    </section>
  </div>;
}

const moduleFields: [keyof Omit<KitModule, "labSlugs">, string][] = [["objective", "Learning objective"], ["lesson", "Lesson plan"], ["worksheet", "Worksheet"], ["homework", "Homework"], ["quiz", "Quiz"], ["answerKey", "Answer key"], ["rubric", "Marking rubric"]];

function KitEditor({ item, act }: { item: TeachingItem; act: Props["act"] }) {
  const kit = item.data as KitData;
  const [modules, setModules] = useState(kit.modules);
  const [dirty, setDirty] = useState(false);
  const change = (next: KitModule[]) => { setModules(next); setDirty(true); };
  const move = (index: number, by: number) => { const next = [...modules]; const target = index + by; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; change(next); };
  const save = async () => { if (await act("saveItem", { id: item.id, kind: "kit", title: item.title, data: { ...kit, modules } }, "Kit saved.")) setDirty(false); };
  return <>
    <div className={styles.between}>
      <div><h2>{item.title}</h2><p className={styles.hint}>{kit.board} · {kit.level} · {kit.subject} · {modules.length} chapters. Starter outline: check it against your syllabus and exam year.</p></div>
      <div className={styles.row}>
        <button type="button" className={`${styles.btn} ${styles.small}`} onClick={() => change([...modules, kitModule("New topic")])}>＋ Chapter</button>
        <button type="button" className={`${styles.btn} ${styles.small}`} onClick={() => download(fileName(item.title), wordDocument(item.title, modules.flatMap((module, index) => moduleFields.map(([key, label]) => ({ heading: `Chapter ${index + 1}: ${module.topic} — ${label}`, body: module[key] })))), word)}>Word</button>
        <button type="button" className={`${styles.btn} ${styles.small} ${styles.primary}`} disabled={!dirty} onClick={save}>Save changes</button>
      </div>
    </div>
    <div className={styles.rows}>{modules.map((module, index) => <details key={index} className={styles.item} style={{ display: "block" }}>
      <summary style={{ cursor: "pointer", fontWeight: 760 }}>Chapter {index + 1} · {module.topic}</summary>
      <div className={styles.form} style={{ marginTop: 12 }}>
        <Field label="Topic" full><input value={module.topic} maxLength={120} onChange={(event) => change(modules.map((entry, at) => at === index ? { ...entry, topic: event.target.value } : entry))} /></Field>
        {moduleFields.map(([key, label]) => <Field key={key} label={label} full><textarea value={module[key]} onChange={(event) => change(modules.map((entry, at) => at === index ? { ...entry, [key]: event.target.value } : entry))} /></Field>)}
      </div>
      <div className={styles.row} style={{ marginTop: 10 }}>
        <button type="button" className={`${styles.btn} ${styles.small}`} onClick={() => move(index, -1)} disabled={index === 0}>↑ Move up</button>
        <button type="button" className={`${styles.btn} ${styles.small}`} onClick={() => move(index, 1)} disabled={index === modules.length - 1}>↓ Move down</button>
        <button type="button" className={`${styles.btn} ${styles.small}`} onClick={() => void act("saveItem", { kind: "lesson", title: `${kit.subject} · ${module.topic}`, data: { board: kit.board, level: kit.level, subject: kit.subject, topic: module.topic, duration: 45, objective: module.objective, outline: module.lesson, labSlugs: module.labSlugs, videos: [] } }, "Saved to your lessons. Assign it from the Lessons tab.")}>Save as lesson</button>
        <button type="button" className={`${styles.btn} ${styles.small} ${styles.danger}`} onClick={() => { if (confirm("Remove this chapter?")) change(modules.filter((_, at) => at !== index)); }}>Remove</button>
      </div>
    </details>)}</div>
  </>;
}

export function KitsTab({ state, act }: Props) {
  const kits = state.items.filter((item) => item.kind === "kit");
  const [openId, setOpenId] = useState<string | null>(null);
  const [subject, setSubject] = useState("Physics");
  const [topics, setTopics] = useState(starterTopics.Physics.join("\n"));
  const open = kits.find((item) => item.id === openId) ?? kits[0];
  const create = async (form: HTMLFormElement) => {
    const board = formValue(form, "board"), level = formValue(form, "level");
    const modules = topics.split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 40).map((topic) => kitModule(topic));
    const saved = await act("saveItem", { kind: "kit", title: formValue(form, "title") || `${board} ${level} ${subject} — teaching kit`, data: { board, level, subject, modules } }, `${modules.length} editable chapters created.`);
    const item = saved?.item as TeachingItem | undefined;
    if (item) setOpenId(item.id);
  };
  return <div className={styles.grid2} style={{ gridTemplateColumns: "minmax(0,.8fr) minmax(0,1.2fr)" }}>
    <div className={styles.rows} style={{ marginTop: 0 }}>
      <section className={styles.panel}>
        <h2>Build a whole-subject kit</h2>
        <p>One editable chapter per topic, each with a lesson plan, worksheet, homework, quiz and rubric to adapt.</p>
        <form className={styles.form} onSubmit={(event) => { event.preventDefault(); void create(event.currentTarget); }}>
          <Field label="Board"><Select name="board" options={boards} defaultValue={boards[0]} /></Field>
          <Field label="Level"><Select name="level" options={levels} defaultValue="AS Level" /></Field>
          <Field label="Subject" full><Select name="subject" options={subjects} value={subject} onChange={(next) => { setSubject(next); setTopics((starterTopics[next] ?? []).join("\n")); }} /></Field>
          <Field label="Kit title (optional)" full><input name="title" maxLength={140} /></Field>
          <Field label="Topics, one per line" full><textarea style={{ minHeight: 170 }} value={topics} onChange={(event) => setTopics(event.target.value)} /></Field>
          <div className={styles.full}><button type="submit" className={`${styles.btn} ${styles.primary}`} disabled={!topics.trim()}>Create kit</button></div>
        </form>
        <p className={styles.hint}>The topic list is a starter, not an official specification. Edit it to match your board and exam year.</p>
      </section>
      <section className={styles.panel}>
        <div className={styles.between}><h2>My kits</h2><span className={styles.badge}>{kits.length}</span></div>
        {kits.length ? <div className={styles.rows}>{kits.map((item) => <div key={item.id} className={styles.item}>
          <div><h3>{item.title}</h3><p>{(item.data as KitData).modules.length} chapters · updated {formatDate(item.updated_at)}</p></div>
          <div className={styles.row}>
            <button type="button" className={`${styles.btn} ${styles.small}`} onClick={() => setOpenId(item.id)}>Open</button>
            <button type="button" className={`${styles.btn} ${styles.small} ${styles.danger}`} onClick={() => { if (confirm(`Delete "${item.title}"?`)) void act("deleteItem", { id: item.id }, "Kit deleted."); }}>Delete</button>
          </div>
        </div>)}</div> : <div className={styles.empty}>No kits yet.</div>}
      </section>
    </div>
    <section className={styles.panel}>{open ? <KitEditor key={`${open.id}-${open.updated_at}`} item={open} act={act} /> : <div className={styles.empty}>Your teaching kit will appear here once you create one.</div>}</section>
  </div>;
}
