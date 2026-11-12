"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { HomePreviewCopy } from "@/lib/home/content";
import styles from "./home.module.css";

export function HomeStart({ locale, copy: c }: { locale: string; copy: HomePreviewCopy }) {
  const [audience, setAudience] = useState<"learner" | "teacher">("learner");
  const [speed, setSpeed] = useState(8);
  const ball = useRef<SVGCircleElement>(null);
  const flight = useRef<Animation | null>(null);
  const range = speed ** 2 / 9.81; // 45° launch, equal launch/landing height, no air resistance.
  const width = range * 20;
  const height = range * 5;
  const endX = 18 + width;
  const curve = `M18 108 Q${18 + width / 2} ${108 - 2 * height} ${endX} 108`;
  const items = audience === "learner" ? c.learnerPaths : c.teacherPaths;
  const routes = audience === "learner" ? [`/${locale}/subjects`, "/en/exam-prep", "/en/mock-exams"] : ["/en/teacher-kit", "/en/teacher-kit/dashboard", "/en/teacher-kit/dashboard"];
  const launch = () => {
    flight.current?.cancel();
    if (!ball.current?.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "reduce") return;
    const frames = Array.from({ length: 41 }, (_, index) => {
      const t = index / 40;
      return { transform: `translate(${width * (t - 1)}px, ${-4 * height * t * (1 - t)}px)` };
    });
    flight.current = ball.current.animate(frames, { duration: 1100, easing: "linear" });
  };
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cancel = () => { if (media.matches || document.documentElement.dataset.motion === "reduce") flight.current?.cancel(); };
    media.addEventListener("change", cancel);
    const settings = new MutationObserver(cancel);
    settings.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    return () => { flight.current?.cancel(); settings.disconnect(); media.removeEventListener("change", cancel); };
  }, []);

  return <section className={styles.start} aria-labelledby="start-heading">
    <div className={styles.startTop}><span>{c.eyebrow}</span><span className={styles.liveTag}><i aria-hidden="true" />{c.tag}</span></div>
    <div className={styles.preview}>
      <div className={styles.previewTop}><div><span>{c.graph}</span><h2>{c.title}</h2></div><span className={styles.previewSpark} aria-hidden="true">✦</span></div>
      <div className={styles.previewGraph} aria-hidden="true"><svg viewBox="0 0 240 132"><path d="M18 14V108H228M18 68H228M18 28H228M68 14V108M118 14V108M168 14V108M218 14V108" className={styles.graphGrid} /><path className={styles.graphPath} d={curve} /><circle cx="18" cy="108" r="3" fill="#a6baff" /><circle ref={ball} cx={endX} cy="108" r="6" fill="#f4b942" /></svg><output className={styles.rangeReadout}>{range.toFixed(1)}<small>m</small></output></div>
      <p className={styles.modelNote}>{c.model}</p>
      <div className={styles.previewControls}><div className={styles.rangeControl}><label htmlFor="home-speed">{c.label}<b>{speed} m/s</b></label><input id="home-speed" type="range" min="2" max="10" step="1" value={speed} onChange={(event) => { flight.current?.cancel(); setSpeed(Number(event.target.value)); }} aria-describedby="range-result" /></div><button type="button" className={styles.launchButton} onClick={launch}><span aria-hidden="true">↗</span>{c.launch}</button></div>
      <div className={styles.previewFoot}><output id="range-result" htmlFor="home-speed">{c.range}: {range.toFixed(1)} m</output><Link href={`/${locale}/simulations/projectile-lab`}>{c.fullLab} →</Link></div>
    </div>
    <h2 id="start-heading" className={styles.startHeading}>{c.choose}</h2>
    <div className={styles.audienceTabs} role="group" aria-label={c.choose}><button type="button" aria-pressed={audience === "learner"} onClick={() => setAudience("learner")}>{c.learners}</button><button type="button" aria-pressed={audience === "teacher"} onClick={() => setAudience("teacher")}>{c.teachers}</button></div>
    <ul className={styles.paths}>{items.map((item, index) => <li key={item.title}><Link className={styles.path} href={routes[index]} style={{ "--tint": ["var(--home-blue)", "var(--home-indigo)", "var(--home-gold-ink)"][index] } as CSSProperties}><span className={styles.pathIcon} aria-hidden="true">{["✳", "▤", "↗"][index]}</span><span><strong>{item.title}</strong><small>{item.detail}</small></span><span className={styles.pathArrow} aria-hidden="true">↗</span></Link></li>)}</ul>
  </section>;
}
