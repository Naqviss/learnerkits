"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";

export function MoonOrbit({ earthView, moveMoon, pauseOrbit }: {
  earthView: string;
  moveMoon: string;
  pauseOrbit: string;
}) {
  const scene = useRef<HTMLSpanElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const angle = useRef(0);
  const [paused, setPaused] = useState(false);

  function position(degrees: number) {
    angle.current = degrees;
    scene.current?.style.setProperty("--orbit-angle", degrees + "deg");
    scene.current?.style.setProperty("--phase-position", Math.floor(degrees / 3) / 119 * 100 + "%");
    if (slider.current) slider.current.value = String(Math.floor(degrees));
  }

  useEffect(() => {
    const paths = scene.current?.querySelectorAll<SVGPathElement>("svg path");
    paths?.forEach((path) => {
      // Whole cycles keep the ray continuous when the orbit wraps to zero.
      path.style.setProperty("--ray-cycles", String(2 + Math.floor(Math.random() * 4)));
      path.style.setProperty("--ray-offset", Math.random() * 360 + "deg");
      path.style.setProperty("--ray-size", String(.75 + Math.random() * .6));
    });
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous: number | undefined;
    function tick(now: number) {
      if (previous !== undefined) position((angle.current + (now - previous) * 360 / 22000) % 360);
      previous = now;
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame);
      previous = undefined;
      if (!paused && !media.matches && document.documentElement.dataset.motion !== "reduce" && !document.hidden) {
        frame = requestAnimationFrame(tick);
      }
    }
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    media.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [paused]);

  return <>
        <span ref={scene} className={styles.orbitScene} aria-hidden="true">
          <svg className={styles.solarRays} viewBox="0 0 1200 600" preserveAspectRatio="xMinYMid slice" focusable="false">
            <defs>
              <linearGradient id="hero-solar-ray">
                <stop stopColor="#fff2bd" />
                <stop offset=".4" stopColor="#ffbf70" stopOpacity=".85" />
                <stop offset="1" stopColor="#ff944d" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g fill="url(#hero-solar-ray)">
              {[[60, 151, -27, 24], [74, 205, -17, 34], [81, 264, -7, 20],
                [80, 311, 3, 41], [84, 357, 12, 26], [64, 417, 23, 32]].map(([x, y, tilt, length]) => (
                <g key={y} transform={`translate(${x} ${y}) rotate(${tilt}) scale(${length / 60} 1)`}>
                  <path d="M0 -3 C12 -6 18 0 29 -5 S46 -10 55 -7 C64 -4 60 2 52 2 S39 -1 30 4 S10 3 0 4 Z" />
                </g>
              ))}
            </g>
          </svg>
          <span className={styles.phaseInset}><span className={styles.phaseDisk} />{earthView}</span>
          <span className={styles.orbit}><span className={styles.earth} /><span className={styles.moonArm}><span className={styles.moon} /></span></span>
        </span>
    <div className={styles.orbitTools}>
      <label className={styles.orbitSlider}>{moveMoon}
        <input ref={slider} type="range" min="0" max="359" defaultValue="0"
          onChange={(event) => { setPaused(true); position(event.currentTarget.valueAsNumber); }} />
      </label>
      <label className={styles.orbitControl}><input type="checkbox" checked={paused}
        onChange={(event) => setPaused(event.currentTarget.checked)} />{pauseOrbit}</label>
    </div>
  </>;
}
