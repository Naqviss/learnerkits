import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { verifyStaticSeo, verifyUnlistedLocales } from "../../scripts/verify-static-seo.mjs";

const directories = [];
const origin = "https://www.learnerkits.com";
function fixture({ canonical = `${origin}/en/example`, robots = "index, follow", missing = false, sitemapOrigin = origin, ogImage = `${origin}/images/share/example.jpg`, title = "Example · LearnerKits" } = {}) {
  const directory = mkdtempSync(join(tmpdir(), "learnerkits-seo-"));
  directories.push(directory);
  mkdirSync(join(directory, "en"));
  writeFileSync(join(directory, "sitemap.xml"), `<urlset><url><loc>${sitemapOrigin}/en/example</loc></url></urlset>`);
  mkdirSync(join(directory, "images/share"), { recursive: true });
  writeFileSync(join(directory, "images/share/example.jpg"), "jpeg");
  if (!missing) writeFileSync(join(directory, "en/example.html"), `<html><head><title>${title}</title><meta content='${robots}' name='robots'><link href='${canonical}' rel='canonical'>${ogImage ? `<meta property="og:image" content="${ogImage}">` : ""}</head><body>Example</body></html>`);
  return pathToFileURL(`${directory}/`);
}
afterEach(() => directories.splice(0).forEach((directory) => rmSync(directory, { recursive: true, force: true })));

describe("static export deployment checks", () => {
  it("accepts an indexable exported sitemap page", () => {
    expect(verifyStaticSeo(fixture(), origin)).toBe(1);
  });
  it("treats a bare origin and its root slash as the same canonical", () => {
    const out = fixture();
    writeFileSync(new URL("sitemap.xml", out), `<urlset><url><loc>${origin}/</loc></url></urlset>`);
    writeFileSync(new URL("index.html", out), `<html><head><title>Home</title><link rel="canonical" href="${origin}"><meta property="og:image" content="${origin}/images/share/example.jpg"></head></html>`);
    expect(verifyStaticSeo(out, origin)).toBe(1);
  });
  it("blocks a sitemap page deleted by export cleanup", () => {
    expect(() => verifyStaticSeo(fixture({ missing: true }), origin)).toThrow("no exported HTML");
  });
  it("blocks noindex pages even when they have a canonical", () => {
    expect(() => verifyStaticSeo(fixture({ robots: "noindex, follow" }), origin)).toThrow("marked noindex");
  });
  it("blocks a canonical pointing to a different page or deployment", () => {
    expect(() => verifyStaticSeo(fixture({ canonical: "https://preview.example/en/example" }), origin)).toThrow("mismatched canonical");
  });
  it("requires every page in a language not open to search to be noindex", () => {
    const out = fixture();
    mkdirSync(new URL("es/simulations/", out), { recursive: true });
    const page = (robots) => `<html><head><meta name="robots" content="${robots}"></head><body>Ejemplo</body></html>`;
    writeFileSync(new URL("es.html", out), page("noindex, follow"));
    writeFileSync(new URL("es/simulations/example.html", out), page("noindex, follow"));
    expect(verifyUnlistedLocales(out, ["es"])).toBe(2);
    writeFileSync(new URL("es/simulations/example.html", out), page("index, follow"));
    expect(() => verifyUnlistedLocales(out, ["es"])).toThrow("/es/simulations/example");
  });
  it("requires a link-preview image that was exported as JPEG or PNG", () => {
    expect(() => verifyStaticSeo(fixture({ ogImage: "" }), origin)).toThrow("no og:image");
    expect(() => verifyStaticSeo(fixture({ ogImage: `${origin}/images/share/example.webp` }), origin)).toThrow("JPEG or PNG");
    expect(() => verifyStaticSeo(fixture({ ogImage: `${origin}/images/share/missing.jpg` }), origin)).toThrow("not exported");
  });
  it("blocks an indexed English simulation page that still uses the generic guide template", () => {
    const out = fixture();
    mkdirSync(new URL("en/simulations/", out), { recursive: true });
    writeFileSync(new URL("sitemap.xml", out), `<urlset><url><loc>${origin}/en/simulations/tsunami-3d</loc></url></urlset>`);
    const page = (body) => `<html><head><title>Tsunami</title><link rel="canonical" href="${origin}/en/simulations/tsunami-3d"><meta property="og:image" content="${origin}/images/share/example.jpg"></head><body>${body}</body></html>`;
    writeFileSync(new URL("en/simulations/tsunami-3d.html", out), page("<ol><li>Change one variable so its effect is easier to identify.</li></ol>"));
    expect(() => verifyStaticSeo(out, origin)).toThrow("generic template");
    writeFileSync(new URL("en/simulations/tsunami-3d.html", out), page("<p>Set Offshore water depth to 2,000 m and compare Deep-water speed.</p>"));
    expect(verifyStaticSeo(out, origin)).toBe(1);
  });
  it("blocks missing titles and titles over 70 characters", () => {
    expect(() => verifyStaticSeo(fixture({ title: "" }), origin)).toThrow("no title");
    expect(() => verifyStaticSeo(fixture({ title: "x".repeat(71) }), origin)).toThrow("over 70 characters");
    expect(verifyStaticSeo(fixture({ title: "Tom &amp; Jerry".padEnd(74, "x") }), origin)).toBe(1);
  });
  it("blocks a sitemap built for the wrong host", () => {
    expect(() => verifyStaticSeo(fixture({ sitemapOrigin: "http://localhost:3000" }), origin)).toThrow("Unexpected sitemap origin");
  });
});
