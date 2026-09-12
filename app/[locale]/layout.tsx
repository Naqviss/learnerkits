import "../globals.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale, localeDirection } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/getMessages";
import { Nav } from "@/components/navigation/Nav";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export async function generateMetadata({ params }: { params: Promise<{locale:string}> }): Promise<Metadata> { const { locale: raw } = await params; const locale = isLocale(raw) ? raw : "en"; const m = getMessages(locale); return { title: { default: m.meta.title, template: `%s · ${m.meta.title}` }, description: m.meta.description, icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/learnerkits-mark.svg" } }; }
const themeBoot = `(function(){try{var raw=localStorage.getItem('science-sim-settings-v1');var s=raw?JSON.parse(raw):{};var t=s.theme||'light';if(t==='system')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.theme='light'}})();`;
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{locale:string}> }) {
  const { locale: raw } = await params; if (!isLocale(raw)) notFound(); const m = getMessages(raw); const dir = localeDirection(raw); const htmlLang = raw === "zh" ? "zh-Hans" : raw;
  return <html lang={htmlLang} dir={dir} data-theme="light" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeBoot}}/></head><body className={dir === "rtl" ? "rtl" : undefined}><Nav locale={raw} m={m}/>{children}<footer className="footer"><div className="container">{m.footer.tagline}</div></footer></body></html>;
}
