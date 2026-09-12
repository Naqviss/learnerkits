import Link from "next/link";
import type { Messages } from "@/lib/i18n/getMessages";
import { siteName } from "@/lib/seo/metadata";

const links=[['about','About'],['contact','Contact'],['editorial-policy','Editorial policy'],['privacy','Privacy'],['cookies','Cookies'],['terms','Terms'],['disclaimer','Disclaimer']] as const;
export function Footer({locale,m}:{locale:string;m:Messages}){return <footer className="footer"><div className="container footerInner"><div className="footerBrand"><strong>{siteName}</strong><span>{m.footer.tagline}</span><small>Independent interactive science education · Free to explore</small></div><nav className="footerLinks" aria-label="Information and policies">{links.map(([path,label])=><Link key={path} href={`/${locale}/${path}`}>{label}</Link>)}</nav><div className="footerBottom"><span>© {new Date().getFullYear()} {siteName}</span><span>Educational models explain ideas; they do not replace professional advice.</span></div></div></footer>}
