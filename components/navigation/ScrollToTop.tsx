"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Next.js keeps the scroll position when the new page is still in the viewport (ours always is,
// right under the sticky nav), so page changes could land mid-page. Jump to the top instead,
// unless the link targets an in-page anchor.
export function ScrollToTop() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
