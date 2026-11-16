"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

// `subject` items filter the simulation library; "" clears the filter. `divider` starts a new group.
type Item = { href: string; label: string; detail?: string; subject?: string; divider?: boolean; children?: Item[] };

export function NavDropdown({ icon, label, items }: { icon?: string; label: string; items: Item[] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent) {
        if (event.key !== "Escape") return;
        setOpen(false);
        root.current?.querySelector("button")?.focus();
      } else if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", close); };
  }, [open]);

  return <div className="navDropdown" ref={root}>
    <button type="button" className="navDropdownToggle" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)}>
      {icon && <span>{icon}</span>}{label}<i aria-hidden="true">▾</i>
    </button>
    {open && <div className="navDropdownPanel" id={panelId}>
      {items.map((item, index) => <div key={item.href} className={item.divider ? "navDropdownDivider" : undefined}>
        {item.children?.length ? <>
          <div className="navDropdownNestedRow">
            <Link href={item.href} className="navDropdownNestedLink" onClick={() => setOpen(false)}><strong>{item.label}</strong>{item.detail && <small>{item.detail}</small>}</Link>
            <button type="button" className="navDropdownExpand" aria-label={`${expanded === item.href ? "Hide" : "Show"} ${item.label} options`} aria-expanded={expanded === item.href} aria-controls={`${panelId}-nested-${index}`} onClick={() => setExpanded((value) => value === item.href ? null : item.href)}>{expanded === item.href ? "⌄" : "›"}</button>
          </div>
          {expanded === item.href && <div className="navDropdownNested" id={`${panelId}-nested-${index}`}>
            {item.children.map((child) => <Link href={child.href} key={child.href} onClick={() => setOpen(false)}><strong>{child.label}</strong>{child.detail && <small>{child.detail}</small>}</Link>)}
          </div>}
        </> : <Link href={item.href} className={item.subject ? `subject-${item.subject} navDropdownSubject` : undefined} onClick={() => {
          setOpen(false);
          if (item.subject !== undefined) window.dispatchEvent(new CustomEvent("sim-library-subject", { detail: item.subject }));
        }}><strong>{item.subject && <i aria-hidden="true"/>}{item.label}</strong>{item.detail && <small>{item.detail}</small>}</Link>}
      </div>)}
    </div>}
  </div>;
}
