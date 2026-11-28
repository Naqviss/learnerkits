// LearnerKits' AdSense publisher; ADSENSE_PUBLISHER_ID / NEXT_PUBLIC_ADSENSE_CLIENT override it (e.g. for staging).
const DEFAULT_PUBLISHER_ID = "pub-8975485796928825";
export function adsensePublisherId(){const raw=process.env.ADSENSE_PUBLISHER_ID??process.env.NEXT_PUBLIC_ADSENSE_CLIENT??DEFAULT_PUBLISHER_ID;const id=raw.replace(/^ca-/,"").trim();return /^pub-\d{10,20}$/.test(id)?id:"";}
export function adsenseClientId(){const id=adsensePublisherId();return id?`ca-${id}`:"";}

// AdSense does not allow ads on screens without publisher content. These are account, dashboard,
// checkout-result and admin screens (all noindex), so the AdSense script is never loaded on them.
const adFreeSections = new Set(["admin", "settings", "progress", "classroom", "missions", "premium", "teacher-preview"]);
export function pageShowsAds(pathname: string) {
  const [, , section = "", page = ""] = pathname.split("/");
  if (adFreeSections.has(section)) return false;
  if (section === "teacher-kit" && page === "dashboard") return false;
  if (section === "donate" && (page === "success" || page === "cancel")) return false;
  if (section === "articles" && page === "read") return false;
  return true;
}
