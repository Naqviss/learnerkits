// LearnerKits' AdSense publisher; ADSENSE_PUBLISHER_ID / NEXT_PUBLIC_ADSENSE_CLIENT override it (e.g. for staging).
const DEFAULT_PUBLISHER_ID = "pub-8975485796928825";
export function adsensePublisherId(){const raw=process.env.ADSENSE_PUBLISHER_ID??process.env.NEXT_PUBLIC_ADSENSE_CLIENT??DEFAULT_PUBLISHER_ID;const id=raw.replace(/^ca-/,"").trim();return /^pub-\d{10,20}$/.test(id)?id:"";}
export function adsenseClientId(){const id=adsensePublisherId();return id?`ca-${id}`:"";}
