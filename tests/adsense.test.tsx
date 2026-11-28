import { describe, expect, it } from "vitest";
import { generateMetadata } from "@/app/[locale]/layout";
import { GET } from "@/app/ads.txt/route";
import { pageShowsAds } from "@/lib/adsense/config";

describe("AdSense", () => {
  it("publishes the matching ads.txt record and site verification meta", async () => {
    expect(await GET().text()).toBe("google.com, pub-8975485796928825, DIRECT, f08c47fec0942fa0\n");
    expect((await generateMetadata({ params: Promise.resolve({ locale: "en" }) })).other).toMatchObject({ "google-adsense-account": "ca-pub-8975485796928825" });
  });

  it("never loads ads on account, dashboard, admin or checkout-result screens", () => {
    for (const path of ["/en/settings", "/en/progress", "/en/classroom", "/en/admin", "/en/premium", "/en/missions", "/en/teacher-preview", "/en/teacher-kit/dashboard", "/en/donate/success", "/en/donate/cancel", "/en/articles/read"]) expect(pageShowsAds(path), path).toBe(false);
    for (const path of ["/en", "/en/simulations/acid-base-ph", "/en/molecules", "/en/exam-prep", "/en/articles/how-to-use-science-simulations", "/en/teacher-kit", "/en/donate"]) expect(pageShowsAds(path), path).toBe(true);
  });
});
