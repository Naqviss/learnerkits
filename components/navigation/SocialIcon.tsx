import type { socialLinks } from "@/lib/social";

const paths = {
  Facebook: "M14 22v-9h3l.5-3.5H14V7.3c0-1 .3-1.8 1.8-1.8h1.9V2.4c-.4-.1-1.5-.2-2.8-.2-2.9 0-4.9 1.8-4.9 5v2.3H7V13h3v9z",
  LinkedIn: "M3 8h4v13H3z M5 2a2.3 2.3 0 1 0 0 4.6A2.3 2.3 0 0 0 5 2z M10 8h3.8v1.8h.1c.5-1 1.8-2.1 3.7-2.1 4 0 4.4 2.6 4.4 6V21h-4v-6.6c0-1.6 0-3.5-2.1-3.5s-2.1 1.7-2.1 3.4V21H10z",
};

export function SocialIcon({ label }: { label: (typeof socialLinks)[number]["label"] }) {
  return <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: "text-bottom", marginInlineEnd: "0.4em" }}>
    <path d={paths[label]} />
  </svg>;
}
