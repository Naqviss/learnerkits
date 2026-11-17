import { getMoleculeReference, moleculeReferences } from "@/lib/seo/molecules";
import { moleculeImageSize, moleculeImageSvg } from "@/lib/seo/molecule-image";

// Prerendered into out/images/molecules/ by the static export: {slug}.svg is the diagram shown on
// each molecule page, {slug}.jpg the 1200×630 share and search-thumbnail image (og:image).
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return moleculeReferences.flatMap((molecule) => [{ file: `${molecule.slug}.svg` }, { file: `${molecule.slug}.jpg` }]);
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const [, slug = "", type] = file.match(/^(.+)\.(svg|jpg)$/) ?? [];
  const molecule = getMoleculeReference(slug);
  if (!molecule || !type) return new Response("Not found", { status: 404 });
  if (type === "svg") {
    return new Response(moleculeImageSvg(molecule), { headers: { "content-type": "image/svg+xml; charset=utf-8" } });
  }
  // Rasterized at build time only; sharp never runs on Cloudflare, which serves the exported file.
  const { default: sharp } = await import("sharp");
  const jpeg = await sharp(Buffer.from(moleculeImageSvg(molecule, moleculeImageSize.social))).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "content-type": "image/jpeg" } });
}
