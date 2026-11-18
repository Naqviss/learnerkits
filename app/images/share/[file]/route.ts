import { readFile } from "node:fs/promises";
import path from "node:path";
import { articleImages } from "@/lib/articles/images";
import { articleShareImagePath, getShareCard, shareCardSvg, shareCards } from "@/lib/seo/share-card";

// Prerendered into out/images/share/ by the static export: link-preview JPEGs for pages without
// their own picture, plus JPEG copies of the article social images (WebP previews are not shown
// by WhatsApp, LinkedIn and some chat apps). sharp only runs at build time, never on Cloudflare.
export const dynamic = "force-static";
export const dynamicParams = false;

const articleFiles = () => [...new Set(Object.values(articleImages).map((image) => image.socialSrc))].map((source) => ({ file: articleShareImagePath(source).split("/").pop()!, source }));

export function generateStaticParams() {
  return [...shareCards().map((card) => ({ file: `${card.key}.jpg` })), ...articleFiles().map(({ file }) => ({ file }))];
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const { default: sharp } = await import("sharp");
  const article = articleFiles().find((entry) => entry.file === file);
  const card = getShareCard(file.replace(/\.jpg$/, ""));
  if (!article && !card) return new Response("Not found", { status: 404 });
  const input = article ? await readFile(path.join(process.cwd(), "public", article.source)) : Buffer.from(shareCardSvg(card!));
  const jpeg = await sharp(input).resize(1200, 630, { fit: "cover" }).flatten({ background: "#ffffff" }).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "content-type": "image/jpeg" } });
}
