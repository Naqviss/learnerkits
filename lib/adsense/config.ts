export function adsensePublisherId(){const raw=process.env.ADSENSE_PUBLISHER_ID??process.env.NEXT_PUBLIC_ADSENSE_CLIENT??"";const id=raw.replace(/^ca-/,"").trim();return /^pub-\d{10,20}$/.test(id)?id:"";}
export function adsenseClientId(){const id=adsensePublisherId();return id?`ca-${id}`:"";}
