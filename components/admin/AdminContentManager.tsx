"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { adminCall } from "./admin-client";
import styles from "./admin.module.css";

type Article = { slug: string; title: string; description: string; category: string; audience: string; body: string; status: "draft" | "published"; published_at: string | null; updated_at: string; builtIn: boolean; managed: boolean };
type Question = { id: string; examId: string; subject: string; topic: string; q: string; options: string[]; answer: number; why: string; lab: string | null; managed: boolean; archived: boolean };
type Content = { articles: Article[]; questions: Question[] };
type ArticleDraft = Partial<Article> & Pick<Article, "slug" | "title" | "description" | "category" | "audience" | "body" | "status">;
type QuestionDraft = Partial<Question> & Pick<Question, "examId" | "topic" | "q" | "options" | "answer" | "why">;

const examLabels: Record<string, string> = { "9702free": "AS Physics · Free sample", "9702premium": "AS Physics · Practice set", "0620free": "IGCSE Chemistry · Free sample", "0620premium": "IGCSE Chemistry · Practice set" };

export function AdminContentManager({ token, onUnauthorized, notify }: { token: string; onUnauthorized: () => void; notify: (message: string) => void }) {
  const [data, setData] = useState<Content | null>(null);
  const [error, setError] = useState("");
  const [section, setSection] = useState<"articles" | "questions">("articles");
  const [articleDraft, setArticleDraft] = useState<ArticleDraft | null>(null);
  const [questionDraft, setQuestionDraft] = useState<QuestionDraft | null>(null);
  const [examId, setExamId] = useState("9702free");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError("");
    const result = await adminCall<Content>(token, "content");
    if (result.ok) setData(result.data);
    else { setError(result.error); if (result.status === 401) onUnauthorized(); }
  }, [token, onUnauthorized]);
  useEffect(() => { void load(); }, [load]);

  const articles = useMemo(() => (data?.articles ?? []).filter((article) => `${article.title} ${article.slug} ${article.category}`.toLowerCase().includes(search.toLowerCase())), [data, search]);
  const questions = useMemo(() => (data?.questions ?? []).filter((question) => question.examId === examId && `${question.topic} ${question.q}`.toLowerCase().includes(search.toLowerCase())), [data, examId, search]);

  const saveArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    setBusy(true);
    const result = await adminCall(token, "saveArticle", values);
    setBusy(false);
    if (!result.ok) { if (result.status === 401) onUnauthorized(); return notify(result.error); }
    notify(values.status === "published" ? "Article published to the website." : "Draft saved."); setArticleDraft(null); await load();
  };

  const saveQuestion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!questionDraft) return;
    const form = new FormData(event.currentTarget);
    const options = String(form.get("options") ?? "").split("\n").map((option) => option.trim()).filter(Boolean);
    setBusy(true);
    const result = await adminCall(token, "saveQuestion", { questionId: questionDraft.id, examId: questionDraft.examId, topic: form.get("topic"), question: form.get("question"), options, answer: Number(form.get("answer")), explanation: form.get("explanation"), lab: form.get("lab") });
    setBusy(false);
    if (!result.ok) { if (result.status === 401) onUnauthorized(); return notify(result.error); }
    notify("Question bank updated. The mock exam now uses this version."); setQuestionDraft(null); await load();
  };

  const removeArticle = async (article: Article) => {
    const action = article.builtIn ? "Restore the original article content" : "Permanently delete this article";
    if (!confirm(`${action}: “${article.title}”?`)) return;
    setBusy(true); const result = await adminCall(token, "deleteArticle", { slug: article.slug }); setBusy(false);
    if (!result.ok) { if (result.status === 401) onUnauthorized(); return notify(result.error); }
    notify(article.builtIn ? "Original article content restored." : "Article deleted."); if (articleDraft?.slug === article.slug) setArticleDraft(null); await load();
  };

  const removeQuestion = async (question: Question) => {
    const action = question.managed && !question.archived ? "Hide this question from the live mock exam" : "Restore the original question";
    if (!confirm(`${action}?`)) return;
    setBusy(true);
    const result = question.archived
      ? await adminCall(token, "restoreQuestion", { questionId: question.id })
      : await adminCall(token, "deleteQuestion", { questionId: question.id, examId: question.examId });
    setBusy(false);
    if (!result.ok) { if (result.status === 401) onUnauthorized(); return notify(result.error); }
    notify(question.archived ? "Question restored." : "Question removed from the live mock exam."); setQuestionDraft(null); await load();
  };

  const startNewArticle = () => setArticleDraft({ slug: "", title: "", description: "", category: "Science Concepts", audience: "Students and teachers", body: "", status: "draft" });
  const startNewQuestion = () => setQuestionDraft({ examId, topic: "", q: "", options: ["", "", "", ""], answer: 0, why: "", lab: null });

  return <div className={styles.dash}>
    <div className={styles.toolbar}><div><span className="eyebrow">Site content</span><h2 style={{ margin: "8px 0 0" }}>Publishing &amp; question banks</h2></div><button type="button" className={styles.action} onClick={() => void load()}>↻ Refresh</button></div>
    {error && <div className={styles.warning}>{error} Apply the new `202611120002_admin_content.sql` migration in Supabase, then refresh.</div>}
    <div className={styles.tabs} role="tablist" aria-label="Content management"><button type="button" role="tab" aria-selected={section === "articles"} onClick={() => { setSection("articles"); setSearch(""); }}>Articles &amp; news</button><button type="button" role="tab" aria-selected={section === "questions"} onClick={() => { setSection("questions"); setSearch(""); }}>Question bank</button></div>

    {section === "articles" && <section className={styles.card}>
      <div className={styles.toolbar}><div><h2>Articles &amp; news</h2><span className={styles.subtle}>Edit published guides or create a new post. Publishing makes it available on the public website.</span></div><button type="button" className={`${styles.action} ${styles.actionPrimary}`} onClick={startNewArticle}>＋ New article</button></div>
      {articleDraft && <form key={articleDraft.slug || "new-article"} className={styles.formCard} onSubmit={saveArticle}>
        <div className={styles.toolbar}><strong>{articleDraft.builtIn ? "Edit website article" : articleDraft.slug ? "Edit article" : "New article"}</strong><button type="button" className={styles.action} onClick={() => setArticleDraft(null)}>Close</button></div>
        <div className={styles.formGrid}><label>URL slug<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={articleDraft.slug} readOnly={articleDraft.builtIn} onChange={(event) => setArticleDraft({ ...articleDraft, slug: event.target.value })} placeholder="what-students-will-learn" /></label><label>Title<input name="title" required maxLength={180} defaultValue={articleDraft.title} key={`${articleDraft.slug}-title`} /></label><label>Category<input name="category" required maxLength={80} defaultValue={articleDraft.category} /></label><label>Audience<input name="audience" required maxLength={80} defaultValue={articleDraft.audience} /></label><label>Search summary<textarea name="description" required maxLength={360} defaultValue={articleDraft.description} /></label><label>Status<select name="status" defaultValue={articleDraft.status}><option value="draft">Draft · hidden from visitors</option><option value="published">Published · visible on site</option></select></label></div>
        <label>Article content<textarea className={styles.long} name="body" required maxLength={60000} defaultValue={articleDraft.body} placeholder="Write in plain text or use the existing article's simple headings, lists and links." /></label>
        <div className={styles.actions}><button className={`${styles.action} ${styles.actionPrimary}`} type="submit" disabled={busy}>{busy ? "Saving…" : "Save article"}</button>{articleDraft.managed && <button className={`${styles.action} ${styles.actionDanger}`} type="button" disabled={busy} onClick={() => { const article = data?.articles.find((item) => item.slug === articleDraft.slug); if (article) void removeArticle(article); }}>{articleDraft.builtIn ? "Restore original" : "Delete article"}</button>}</div>
        <p className={styles.subtle}>Article content is plain text and links. Publishing updates the public articles list and reader. Static search metadata may take a site rebuild to fully refresh.</p>
      </form>}
      <div className={styles.toolbar}><input className={styles.search} aria-label="Search articles" placeholder="Search titles, categories or slugs…" value={search} onChange={(event) => setSearch(event.target.value)} /><span className={styles.subtle}>{articles.length} articles</span></div>
      {articles.length ? <div className={styles.listGrid}>{articles.map((article) => <article className={styles.contentItem} key={article.slug}><div><h3>{article.title}</h3><p>{article.description}</p><div className={styles.itemMeta}><span className={styles.tag}>{article.category}</span><span className={styles.tag}>{article.status}</span><span className={styles.tag}>{article.builtIn ? "Website article" : "New article"}</span></div></div><div className={styles.actions}><button type="button" className={styles.action} onClick={() => setArticleDraft({ ...article })}>Edit</button>{article.managed && <button type="button" className={`${styles.action} ${styles.actionDanger}`} onClick={() => void removeArticle(article)}>{article.builtIn ? "Restore" : "Delete"}</button>}</div></article>)}</div> : <div className={styles.empty}>No article matches this search.</div>}
    </section>}

    {section === "questions" && <section className={styles.card}>
      <div className={styles.toolbar}><div><h2>Mock exam question bank</h2><span className={styles.subtle}>Edit the questions shown to students. Changes go live in the selected mock exam.</span></div><button type="button" className={`${styles.action} ${styles.actionPrimary}`} onClick={startNewQuestion}>＋ Add question</button></div>
      <div className={styles.toolbar}><select className={styles.search} aria-label="Mock exam bank" value={examId} onChange={(event) => { setExamId(event.target.value); setQuestionDraft(null); setSearch(""); }}>{Object.entries(examLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select><input className={styles.search} aria-label="Search questions" placeholder="Search topic or question text…" value={search} onChange={(event) => setSearch(event.target.value)} /><span className={styles.subtle}>{questions.filter((question) => !question.archived).length} live questions</span></div>
      {questionDraft && <form key={`${questionDraft.examId}-${questionDraft.id ?? "new-question"}`} className={styles.formCard} onSubmit={saveQuestion}>
        <div className={styles.toolbar}><strong>{questionDraft.id ? "Edit question" : "Add question"} · {examLabels[questionDraft.examId]}</strong><button type="button" className={styles.action} onClick={() => setQuestionDraft(null)}>Close</button></div>
        <div className={styles.formGrid}><label>Topic<input name="topic" required maxLength={100} defaultValue={questionDraft.topic} /></label><label>Correct answer<select name="answer" defaultValue={String(questionDraft.answer)}>{questionDraft.options.map((_, index) => <option value={index} key={index}>{String.fromCharCode(65 + index)}</option>)}</select></label></div>
        <label>Question<textarea name="question" required maxLength={1200} defaultValue={questionDraft.q} /></label>
        <label>Answer options · one per line<textarea name="options" required defaultValue={questionDraft.options.join("\n")} /></label>
        <label>Explanation shown after marking<textarea name="explanation" required maxLength={2400} defaultValue={questionDraft.why} /></label>
        <label>Related simulation slug · optional<input name="lab" defaultValue={questionDraft.lab ?? ""} placeholder="projectile-lab" /></label>
        <div className={styles.actions}><button className={`${styles.action} ${styles.actionPrimary}`} type="submit" disabled={busy}>{busy ? "Saving…" : "Save question"}</button>{questionDraft.managed && <button className={`${styles.action} ${styles.actionDanger}`} type="button" disabled={busy} onClick={() => { const question = data?.questions.find((item) => item.id === questionDraft.id && item.examId === questionDraft.examId); if (question) void removeQuestion(question); }}>Remove from exam</button>}</div>
      </form>}
      {questions.length ? <div className={styles.listGrid}>{questions.map((question) => <article className={styles.contentItem} key={`${question.examId}-${question.id}`}><div><h3>{question.topic} <span className={styles.tag}>{question.archived ? "hidden" : question.managed ? "edited" : "live"}</span></h3><p>{question.q}</p><div className={styles.itemMeta}><span className={styles.tag}>{question.options.length} options</span><span className={styles.tag}>Answer {String.fromCharCode(65 + question.answer)}</span>{question.lab && <span className={styles.tag}>{question.lab}</span>}</div></div><div className={styles.actions}>{question.archived ? <button type="button" className={styles.action} disabled={busy} onClick={() => void removeQuestion(question)}>Restore</button> : <button type="button" className={styles.action} onClick={() => setQuestionDraft({ ...question })}>Edit</button>}{question.managed && !question.archived && <button type="button" className={`${styles.action} ${styles.actionDanger}`} disabled={busy} onClick={() => void removeQuestion(question)}>Hide</button>}</div></article>)}</div> : <div className={styles.empty}>No questions found in this bank.</div>}
    </section>}
  </div>;
}
