import Link from "next/link";
import { ArticleFigure } from "./ArticleFigure";

// Deliberately limited editorial syntax: text, links, lists, prompts, subheads,
// registered explanatory figures, and answer disclosures. Raw HTML is never interpreted.
function Inline({ text }: { text: string }) {
  return <>{text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return part;
    const [, label, href] = match;
    if (href.startsWith("/en/")) return <Link href={href} key={index}>{label}</Link>;
    if (href.startsWith("https://")) return <a href={href} key={index}>{label}</a>;
    return label;
  })}</>;
}

export function ArticleBody({ body }: { body: string }) {
  return <>{body.trim().split(/\n\s*\n/).map((block, index) => {
    if (block.startsWith(":::figure ")) return <ArticleFigure key={index} id={block.slice(10).trim()} />;
    if (block.startsWith("### ")) return <h3 key={index}>{block.slice(4)}</h3>;
    if (block.startsWith("> ")) return <blockquote key={index}><span className="eyebrow">Try this prompt</span><p><Inline text={block.slice(2)} /></p></blockquote>;
    if (block.startsWith("- ")) return <ul key={index}>{block.split("\n").map((line) => <li key={line}><Inline text={line.slice(2)} /></li>)}</ul>;
    if (block.startsWith(":::answer ")) {
      const [title, ...lines] = block.split("\n");
      return <details key={index}><summary>{title.slice(10)}</summary><p><Inline text={lines.filter((line) => line !== ":::").join(" ")} /></p></details>;
    }
    return <p key={index}><Inline text={block} /></p>;
  })}</>;
}
