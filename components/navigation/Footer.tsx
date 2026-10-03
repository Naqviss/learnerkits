import Link from "next/link";
import type { Messages } from "@/lib/i18n/getMessages";
import { siteName } from "@/lib/seo/metadata";

type FooterGroup={title:string;links:readonly (readonly [string,string])[];enOnly?:boolean};
const groups:readonly FooterGroup[]=[
  {title:'Learn',enOnly:true,links:[['guides','Science guides'],['articles','Articles']]},
  {title:'About',links:[['about','About'],['faq','FAQ'],['accessibility','Accessibility'],['contact','Contact'],['editorial-policy','Editorial policy']]},
  {title:'Legal',links:[['privacy','Privacy'],['cookies','Cookies'],['terms','Terms'],['disclaimer','Disclaimer']]},
];
export function Footer({locale,m}:{locale:string;m:Messages}){return <footer className="footer"><div className="container footerInner"><div className="footerBrand"><strong>{siteName}</strong><span>{m.footer.tagline}</span><small>Independent interactive science education · Free to explore</small></div><nav className="footerLinks" aria-label="Information and policies">{groups.filter(g=>!g.enOnly||locale==="en").map(g=><div key={g.title} className="footerGroup"><h2>{g.title}</h2><ul>{g.links.map(([path,label])=><li key={path}><Link href={`/${locale}/${path}`}>{label}</Link></li>)}</ul></div>)}</nav><div className="footerBottom"><span>© {new Date().getFullYear()} {siteName}</span><span>Educational models explain ideas; they do not replace professional advice.</span></div></div></footer>}
