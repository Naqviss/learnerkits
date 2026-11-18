import { subjectsCatalog, visibleSubjectSlugs } from "@/lib/subjects/catalog";

// Link-preview images (og:image / twitter:image) for pages that have no picture of their own.
// Each card is a 1200×630 JPEG rendered at build time by app/images/share/[file]/route.ts. JPEG,
// not WebP or SVG, because WhatsApp, LinkedIn and some chat apps do not show other formats.
export const shareCardSize = { width: 1200, height: 630 } as const;

export type ShareCard = { key: string; eyebrow: string; title: string; subtitle: string };

const brandCard: ShareCard = {
  key: "learnerkits",
  eyebrow: "Free interactive science",
  title: "Science simulations, virtual labs and exam prep",
  subtitle: "Predict, experiment and explain with free browser labs for space, physics, Earth science, chemistry and more.",
};

const sectionCards: ShareCard[] = [
  { key: "exam-prep", eyebrow: "Exam prep", title: "Science exam prep by exam board", subtitle: "Cambridge, Edexcel, AQA and IB topics with short lessons, interactive labs and practice questions." },
  { key: "mock-exams", eyebrow: "Mock exams", title: "Timed science mock exams", subtitle: "Original exam-style multiple-choice questions with instant marking and worked explanations." },
  { key: "teacher-kit", eyebrow: "Teacher kit", title: "Science lesson planning and classroom tools", subtitle: "Plan lessons, build question papers and set interactive labs for your class." },
  { key: "pricing", eyebrow: "Plans", title: "LearnerKits plans and pricing", subtitle: "Free science simulations for everyone, with Premium tools for learners and teachers." },
  { key: "molecules", eyebrow: "Chemistry reference", title: "VSEPR shapes chart with 3D molecules", subtitle: "Molecular geometry, bond angles, hybridization and polarity, each with a model you can rotate." },
];

const simulationCards = (): ShareCard[] => visibleSubjectSlugs.flatMap((slug) => subjectsCatalog[slug].simulations.map((simulation) => ({
  key: `simulation-${simulation.slug}`,
  eyebrow: `${subjectsCatalog[slug].eyebrow} · ${simulation.kind}`,
  title: simulation.title,
  subtitle: simulation.outcome,
})));

export const shareCards = (): ShareCard[] => [brandCard, ...sectionCards, ...simulationCards()];
export const getShareCard = (key: string) => shareCards().find((card) => card.key === key);
// Article previews: the existing 1200×630 WebP social image, re-encoded as JPEG at build time.
export const articleShareImagePath = (socialSrc: string) => `/images/share/article-${socialSrc.split("/").pop()!.replace(/-social\.webp$/, "")}.jpg`;

// Site-relative paths; lib/seo/metadata.ts adds the origin.
export const shareCardPath = (key: string) => `/images/share/${key}.jpg`;
export const shareCardAlt = (card: ShareCard) => `${card.title}: ${card.subtitle}`;
export const brandShareCard = brandCard;

// Picks the card for an English page path, or undefined to use the default brand card.
export function shareCardForPath(path: string): ShareCard | undefined {
  const [first, second] = path.split("/").filter(Boolean);
  if ((first === "simulations" || first === "guides") && second) return getShareCard(`simulation-${second}`);
  if (!second || first === "exam-prep") return sectionCards.find((card) => card.key === first);
  return undefined;
}

const escapeXml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Greedy word wrap using an average glyph width for Arial; long text ends with an ellipsis.
function wrap(text: string, size: number, maxWidth: number, maxLines: number, bold: boolean) {
  const perChar = size * (bold ? .58 : .52);
  const limit = Math.floor(maxWidth / perChar);
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (next.length <= limit) { line = next; continue; }
    if (line) lines.push(line);
    line = word;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/[\s,.;:–-]+\S*$/, "")}…`;
    return kept;
  }
  return lines;
}

// The LearnerKits mark from public/learnerkits-mark.svg, drawn at 64×64 units.
const mark = `<defs><linearGradient id="mark" x1="5" y1="4" x2="59" y2="60" gradientUnits="userSpaceOnUse"><stop stop-color="#315bd6"/><stop offset="1" stop-color="#5c6ac4"/></linearGradient></defs>`
  + `<rect x="4" y="4" width="56" height="56" rx="17" fill="url(#mark)"/>`
  + `<path d="M12 20.2c6.9-4.3 13.6-4.1 20 .5v24.1c-6.4-4.6-13.1-4.8-20-.5V20.2Z" fill="#fff"/>`
  + `<path d="M44 20.2c-6.9-4.3-13.6-4.1-20 .5v24.1c6.4-4.6 13.1-4.8 20-.5V20.2Z" fill="#e6edff"/>`
  + `<path d="M32 20.7v24.1" fill="none" stroke="#315bd6" stroke-width="2" stroke-linecap="round"/>`
  + `<path d="M16.5 28c4-1.5 7.8-1.3 11.2.8M16.5 34.2c4-1.5 7.8-1.3 11.2.8M39.5 28c-2-.7-3.9-.9-5.7-.6M39.5 34.2c-2-.7-3.9-.9-5.7-.6" fill="none" stroke="#87a2ff" stroke-width="1.7" stroke-linecap="round"/>`
  + `<path d="m28 10.2 1.5 3.7 3.7 1.5-3.7 1.5-1.5 3.7-1.5-3.7-3.7-1.5 3.7-1.5 1.5-3.7Z" fill="#f4b942"/>`
  + `<circle cx="49.5" cy="49.5" r="2.3" fill="#f4b942"/>`;

export function shareCardSvg(card: ShareCard) {
  const { width, height } = shareCardSize;
  const left = 80, textWidth = width - left * 2;
  const titleSize = card.title.length > 48 ? 58 : card.title.length > 30 ? 66 : 76;
  const titleLines = wrap(card.title, titleSize, textWidth, 3, true);
  const subtitleLines = wrap(card.subtitle, 30, textWidth, titleLines.length > 2 ? 1 : 2, false);
  let y = 278;
  const title = titleLines.map((line, i) => `<text x="${left}" y="${y + i * titleSize * 1.12}" font-size="${titleSize}" font-weight="700" fill="#172033">${escapeXml(line)}</text>`).join("");
  y += (titleLines.length - 1) * titleSize * 1.12 + 62;
  const subtitle = subtitleLines.map((line, i) => `<text x="${left}" y="${y + i * 42}" font-size="30" fill="#4b5873">${escapeXml(line)}</text>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`
    + `<rect width="${width}" height="${height}" fill="#f5f7fd"/>`
    + `<rect x="0" y="0" width="${width}" height="10" fill="#315bd6"/>`
    + `<circle cx="${width - 70}" cy="${height + 40}" r="250" fill="#e6edff"/>`
    + `<circle cx="${width - 150}" cy="120" r="7" fill="#f4b942"/>`
    + `<g font-family="Arial, Helvetica, sans-serif">`
    + `<g transform="translate(${left - 4} 56)">${mark}</g>`
    + `<text x="${left + 78}" y="102" font-size="38" font-weight="700" letter-spacing="-1"><tspan fill="#172033">Learner</tspan><tspan fill="#315bd6">Kits</tspan></text>`
    + `<text x="${left}" y="196" font-size="24" font-weight="700" letter-spacing="2.5" fill="#315bd6">${escapeXml(card.eyebrow.toUpperCase())}</text>`
    + title + subtitle
    + `<text x="${left}" y="${height - 52}" font-size="26" font-weight="700" fill="#315bd6">learnerkits.com</text>`
    + `<text x="${left + 236}" y="${height - 52}" font-size="26" fill="#4b5873">· Free · No sign-up · Runs in the browser</text>`
    + `</g></svg>`;
}
