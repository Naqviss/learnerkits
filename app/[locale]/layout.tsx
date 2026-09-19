import "../globals.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale, localeDirection } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/getMessages";
import { Nav } from "@/components/navigation/Nav";
import { Footer } from "@/components/navigation/Footer";
import { ConsentManager } from "@/components/privacy/ConsentManager";
import { adsenseClientId } from "@/lib/adsense/config";
import { siteUrl } from "@/lib/seo/metadata";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export async function generateMetadata({ params }: { params: Promise<{locale:string}> }): Promise<Metadata> { const { locale: raw } = await params; const locale = isLocale(raw) ? raw : "en"; const m = getMessages(locale),adsense=adsenseClientId(); return { metadataBase: new URL(siteUrl), title: { default: m.meta.title, template: `%s · ${m.meta.title}` }, description: m.meta.description, applicationName: "LearnerKits", creator: "LearnerKits", publisher: "LearnerKits", formatDetection: { telephone: false }, icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/learnerkits-mark.svg" }, verification: { google: "9SDKLsHd0vlmWO8Hl0c71834IrwGrBKIz_wTrxpm1Xk" },other:{"msvalidate.01":"055069CDF0FF795D8165DD9C833DC616",...(adsense?{"google-adsense-account":adsense}:{})} }; }
const themeBoot = `(function(){try{var raw=localStorage.getItem('science-sim-settings-v1');var s=raw?JSON.parse(raw):{};var t=s.theme||'light';if(t==='system')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.theme='light'}})();`;
const googleAnalyticsId = "G-VZ63RT6XYN";
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{locale:string}> }) {
  const { locale: raw } = await params; if (!isLocale(raw)) notFound(); const m = getMessages(raw); const dir = localeDirection(raw); const htmlLang = raw === "zh" ? "zh-Hans" : raw;
  return <html lang={htmlLang} dir={dir} data-theme="light" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeBoot}}/></head><body className={dir === "rtl" ? "rtl" : undefined}><Nav locale={raw} m={m}/>{children}<Footer locale={raw} m={m}/><ConsentManager locale={raw} googleAnalyticsId={googleAnalyticsId} clarityId="ygwnomr7fd"/></body></html>;
}
