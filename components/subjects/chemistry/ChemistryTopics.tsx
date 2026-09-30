import Link from "next/link";
import { chemistryTopics } from "@/lib/simulations/chemistry/course/catalog";
import type { SubjectDefinition } from "@/lib/subjects/catalog";
import styles from "./course/course.module.css";
export function ChemistryTopics({locale,subject}:{locale:string;subject:SubjectDefinition}) {
 return <section className={`container ${styles.topicDirectory}`} aria-labelledby="chemistry-topics-title"><div><span className="eyebrow">EXPLORE CHEMISTRY BY TOPIC</span><h2 id="chemistry-topics-title">From atoms to living systems</h2><p>Choose a topic, open a model, and change the conditions to see the chemistry respond.</p></div><div className={styles.topicDirectoryGrid}>{chemistryTopics.map((topic,i)=><article key={topic.title}><span>{String(i+1).padStart(2,"0")}</span><h3>{topic.title}</h3><p>{topic.text}</p><ul>{topic.slugs.map(slug=>{const lab=subject.simulations.find(s=>s.slug===slug);return lab?<li key={slug}><Link href={`/${locale}/simulations/${slug}`}>{lab.title} <span aria-hidden="true">↗</span></Link></li>:null;})}</ul></article>)}</div></section>;
}
