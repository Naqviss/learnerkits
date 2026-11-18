import { describe, expect, it } from "vitest";
import { localizedMetadata } from "@/lib/seo/metadata";
import { articleShareImagePath, getShareCard, shareCards, shareCardSvg } from "@/lib/seo/share-card";
import { articleImages } from "@/lib/articles/images";
import { generateMetadata as simulationMetadata } from "@/app/[locale]/simulations/[slug]/page";

describe("link previews", () => {
  it("uses the LearnerKits card as a 1200×630 JPEG by default, never the old image", () => {
    const metadata = localizedMetadata("en", "/about", "About", "About LearnerKits");
    expect(metadata.openGraph?.images).toEqual([expect.objectContaining({ url: "https://www.learnerkits.com/images/share/learnerkits.jpg", width: 1200, height: 630, type: "image/jpeg" })]);
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", images: [{ url: "https://www.learnerkits.com/images/share/learnerkits.jpg" }] });
    expect(JSON.stringify(metadata)).not.toContain("og-default");
  });

  it("names the page in the preview for simulations, guides and sections", async () => {
    const tsunami = await simulationMetadata({ params: Promise.resolve({ locale: "en", slug: "tsunami-3d" }) });
    expect(tsunami.openGraph?.images).toEqual([expect.objectContaining({ url: "https://www.learnerkits.com/images/share/simulation-tsunami-3d.jpg" })]);
    expect(localizedMetadata("en", "/guides/tsunami-3d", "t", "d").openGraph?.images).toEqual([expect.objectContaining({ url: "https://www.learnerkits.com/images/share/simulation-tsunami-3d.jpg" })]);
    expect(localizedMetadata("en", "/exam-prep/cambridge", "t", "d").openGraph?.images).toEqual([expect.objectContaining({ url: "https://www.learnerkits.com/images/share/exam-prep.jpg" })]);
  });

  it("draws every card with escaped text and no overflow-prone titles", () => {
    for (const card of shareCards()) {
      const svg = shareCardSvg(card);
      expect(svg, card.key).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="1200" height="630"/);
      expect(svg.replace(/<[^>]+>/g, ""), card.key).not.toMatch(/[<>]/);
      expect(svg).toContain("Learner</tspan><tspan fill=\"#315bd6\">Kits");
    }
    expect(new Set(shareCards().map((card) => card.key)).size).toBe(shareCards().length);
    expect(getShareCard("simulation-balance-equation")?.title).toBe("Balancing Chemical Equations");
  });

  it("serves article previews as JPEG", () => {
    for (const image of Object.values(articleImages)) expect(articleShareImagePath(image.socialSrc)).toMatch(/^\/images\/share\/article-[a-z0-9-]+\.jpg$/);
  });
});

describe("image rights structured data", () => {
  it("fills every field Google's image metadata report checks", async () => {
    const { imageRights } = await import("@/lib/seo/metadata");
    const { subjectImageJsonLd } = await import("@/lib/seo/subject-images");
    const rights = imageRights();
    expect(rights).toMatchObject({ creditText: "LearnerKits", creator: { "@type": "Organization", name: "LearnerKits" }, license: "https://www.learnerkits.com/en/terms#content-and-intellectual-property", acquireLicensePage: "https://www.learnerkits.com/en/contact" });
    expect(rights.copyrightNotice).toMatch(/^© \d{4} LearnerKits$/);
    expect(subjectImageJsonLd("en", "chemistry")).toMatchObject(rights);
  });
});
