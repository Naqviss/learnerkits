"use client";

import { useEffect } from "react";

export function HomeMotion() {
  useEffect(() => {
    const root = document.getElementById("home");
    if (!root || !("IntersectionObserver" in window) || !Element.prototype.animate) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const reduce = () => media.matches || document.documentElement.dataset.motion === "reduce";
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (reduce()) continue;
        // Content is visible in the exported HTML, even if JS or observation fails.
        const animation = entry.target.animate([{ transform: "translateY(22px)", opacity: .65 }, { transform: "translateY(0)", opacity: 1 }], { duration: 580, easing: "cubic-bezier(.2,.7,.2,1)" });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: .08 });
    root.querySelectorAll("[data-home-reveal]").forEach((element) => observer.observe(element));
    const cancel = () => { if (reduce()) { animations.forEach((animation) => animation.cancel()); animations.clear(); } };
    media.addEventListener("change", cancel);
    const settings = new MutationObserver(cancel);
    settings.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    return () => { observer.disconnect(); settings.disconnect(); media.removeEventListener("change", cancel); animations.forEach((animation) => animation.cancel()); };
  }, []);
  return null;
}
