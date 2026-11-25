"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function MobileNav({ children }: { children: ReactNode }) {
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function dismiss(event: PointerEvent) {
      const element = menu.current;
      if (element?.open && !element.contains(event.target as Node)) element.open = false;
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);

  return <details className="mobileNav" ref={menu} onKeyDown={(event) => {
    if (event.key === "Escape" && event.currentTarget.open) {
      event.currentTarget.open = false;
      event.currentTarget.querySelector("summary")?.focus();
    }
  }} onClickCapture={(event) => {
    const link = event.target instanceof Element && event.target.closest("a[href]");
    if (!link) return;
    event.currentTarget.open = false;
  }}>
    <summary aria-label="Navigation menu"><span/><span/><span/></summary>
    <div>{children}</div>
  </details>;
}
