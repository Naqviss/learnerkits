"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

// `subject` items filter the simulation library; "" clears the filter. `divider` starts a new group.
type Item = { href: string; label: string; detail?: string; subject?: string; divider?: boolean };

export function NavDropdown({ icon, label, items }: { icon?: string; label: string; items: Item[] }) {
  const [open, setOpen] = useState(false);
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
      {items.map((item) => <Link href={item.href} key={item.href} className={`${item.subject ? `subject-${item.subject} navDropdownSubject` : ""}${item.divider ? " navDropdownDivider" : ""}`} onClick={() => {
        setOpen(false);
        // Already on the library page: a hash-only navigation does not remount it, so tell it directly.
        if (item.subject !== undefined) window.dispatchEvent(new CustomEvent("sim-library-subject", { detail: item.subject }));
      }}>
        <strong>{item.subject && <i aria-hidden="true"/>}{item.label}</strong>{item.detail && <small>{item.detail}</small>}
      </Link>)}
    </div>}
  </div>;
}
