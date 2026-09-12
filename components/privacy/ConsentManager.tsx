"use client";
import Script from "next/script";
import { useEffect, useState } from "react";

const KEY="learnerkits-cookie-consent-v1";
type Choice="all"|"essential";

export function ConsentManager({locale,googleAnalyticsId,clarityId}:{locale:string;googleAnalyticsId:string;clarityId:string}){
 const [choice,setChoice]=useState<Choice|null>(null),[ready,setReady]=useState(false);
 useEffect(()=>{const read=()=>{try{const saved=localStorage.getItem(KEY);setChoice(saved==="all"||saved==="essential"?saved:null);}catch{setChoice("essential");}setReady(true);};read();window.addEventListener("learnerkits-consent-change",read);return()=>window.removeEventListener("learnerkits-consent-change",read);},[]);
 function choose(value:Choice){try{localStorage.setItem(KEY,value);}catch{/* The in-memory choice still prevents a broken dialog. */}setChoice(value);window.dispatchEvent(new Event("learnerkits-consent-change"));}
 return <>{choice==="all"&&<><Script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} strategy="afterInteractive"/><Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${googleAnalyticsId}',{'anonymize_ip':true});`}</Script><Script id="microsoft-clarity" strategy="afterInteractive">{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,'clarity','script','${clarityId}');`}</Script></>}
  {ready&&!choice&&<aside className="consentBanner" role="dialog" aria-label="Cookie choices" aria-live="polite"><div><span aria-hidden="true">🍪</span><p><strong>Your privacy, your choice</strong><small>We use necessary storage for language, settings, and lab progress. With permission, analytics helps us improve LearnerKits.</small></p></div><div className="consentActions"><button onClick={()=>choose("essential")}>Essential only</button><button className="consentAccept" onClick={()=>choose("all")}>Allow analytics</button><a href={`/${locale}/cookies`}>Learn more</a></div></aside>}
 </>;
}

export function CookieSettingsButton(){
 function reopen(){try{localStorage.removeItem(KEY);}catch{/* Browser storage controls remain available. */}window.dispatchEvent(new Event("learnerkits-consent-change"));}
 return <button type="button" className="button" onClick={reopen}>Change cookie choices</button>;
}
