"use client";

import { useEffect, useRef, useState } from "react";

const sections = [
  ["simulation", "Simulation"],
  ["guide", "Guide"],
  ["measurements", "Measurements"],
  ["missions", "Missions"],
] as const;

export function SimulationSectionNav() {
  const [active, setActive] = useState("simulation");
  const pendingTarget = useRef<string | null>(null);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectSection = (id: string) => {
    pendingTarget.current = id;
    setActive(id);
    if (pendingTimer.current) clearTimeout(pendingTimer.current);
    // Keep the clicked tab selected while the browser performs its smooth
    // anchor scroll. The scroll spy otherwise briefly re-selects every
    // section that the viewport passes, which looks like a visual jerk.
    pendingTimer.current = setTimeout(() => {
      pendingTarget.current = null;
      pendingTimer.current = null;
    }, 2500);
  };

  useEffect(() => {
    const targets = sections
      .map(([id]) => document.getElementById(id))
      .filter((target): target is HTMLElement => Boolean(target));
    if (!targets.length) return;

    const update = () => {
      const offset = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--simulation-sticky-offset")) || 124;
      const pending = pendingTarget.current;
      if (pending) {
        const target = document.getElementById(pending);
        const anchorTop = offset + 18;
        if (target && Math.abs(target.getBoundingClientRect().top - anchorTop) > 12) return;
        pendingTarget.current = null;
        if (pendingTimer.current) clearTimeout(pendingTimer.current);
        pendingTimer.current = null;
      }
      let current = targets[0].id;
      for (const target of targets) {
        if (target.getBoundingClientRect().top <= offset + 24) current = target.id;
      }
      setActive(current);
    };
    update();
    const cancelPending = () => {
      pendingTarget.current = null;
      if (pendingTimer.current) clearTimeout(pendingTimer.current);
      pendingTimer.current = null;
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("wheel", cancelPending, { passive: true });
    window.addEventListener("touchstart", cancelPending, { passive: true });
    window.addEventListener("keydown", cancelPending);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("wheel", cancelPending);
      window.removeEventListener("touchstart", cancelPending);
      window.removeEventListener("keydown", cancelPending);
      if (pendingTimer.current) clearTimeout(pendingTimer.current);
    };
  }, []);

  return <nav className="simulationSectionNav" aria-label="Simulation page sections">
    <div className="container">
      {sections.map(([id, label]) => <a
        key={id}
        href={`#${id}`}
        aria-current={active === id ? "location" : undefined}
        onClick={() => selectSection(id)}
      >{label}</a>)}
    </div>
  </nav>;
}
