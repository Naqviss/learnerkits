import "../globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { locales, isLocale, localeDirection } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/getMessages";
import { Nav } from "@/components/navigation/Nav";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export async function generateMetadata({ params }: { params: Promise<{locale:string}> }): Promise<Metadata> { const { locale: raw } = await params; const locale = isLocale(raw) ? raw : "en"; const m = getMessages(locale); return { title: { default: m.meta.title, template: `%s · ${m.meta.title}` }, description: m.meta.description, icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/learnerkits-mark.svg" } }; }
const themeBoot = `(function(){try{var raw=localStorage.getItem('science-sim-settings-v1');var s=raw?JSON.parse(raw):{};var t=s.theme||'light';if(t==='system')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.theme='light'}})();`;
const googleAnalyticsId = "G-VZ63RT6XYN";
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{locale:string}> }) {
  const { locale: raw } = await params; if (!isLocale(raw)) notFound(); const m = getMessages(raw); const dir = localeDirection(raw); const htmlLang = raw === "zh" ? "zh-Hans" : raw;
  return <html lang={htmlLang} dir={dir} data-theme="light" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeBoot}}/></head><body className={dir === "rtl" ? "rtl" : undefined}><Nav locale={raw} m={m}/>{children}<footer className="footer"><div className="container">{m.footer.tagline}</div></footer><Script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} strategy="afterInteractive"/><Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAnalyticsId}');`}</Script><Script id="microsoft-clarity" strategy="afterInteractive">{`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "ygwnomr7fd");`}</Script></body></html>;
}
