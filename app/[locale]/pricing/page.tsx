import type { Metadata } from "next";
import PremiumPage, { generateMetadata as premiumMetadata } from "../premium/page";

// /pricing is the address payment reviewers (Paddle) and customers look for. It shows the same
// product and price page as /premium, and its canonical URL stays /premium so search engines see one page.
export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return { ...(await premiumMetadata(props)), title: "Pricing" };
}

export default PremiumPage;
