import { describe, expect, it } from "vitest";
import { generateMetadata } from "@/app/[locale]/layout";
import { GET } from "@/app/ads.txt/route";

describe("AdSense", () => {
  it("publishes the matching ads.txt record and site verification meta", async () => {
    expect(await GET().text()).toBe("google.com, pub-8975485796928825, DIRECT, f08c47fec0942fa0\n");
    expect((await generateMetadata({ params: Promise.resolve({ locale: "en" }) })).other).toMatchObject({ "google-adsense-account": "ca-pub-8975485796928825" });
  });
});
