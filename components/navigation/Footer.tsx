import Link from "next/link";
import type { Messages } from "@/lib/i18n/getMessages";
import { siteName } from "@/lib/seo/metadata";
import { socialLinks } from "@/lib/social";

type FooterGroup={title:string;links:readonly (readonly [string,string])[];enOnly?:boolean};
const groups:readonly FooterGroup[]=[
  {title:'Learn',enOnly:true,links:[['exam-prep','Exam Prep'],['mock-exams','Mock Exams'],['teacher-kit','Teacher Kit'],['classroom','My classroom'],['guides','Science guides'],['articles','News & Articles']]},
  {title:'About',links:[['about','About'],['pricing','Plans & pricing'],['faq','FAQ'],['accessibility','Accessibility'],['contact','Contact'],['editorial-policy','Editorial policy']]},
  {title:'Legal',links:[['privacy','Privacy'],['cookies','Cookies'],['terms','Terms'],['refunds','Refunds'],['disclaimer','Disclaimer']]},
];
export function Footer({locale,m}:{locale:string;m:Messages}){return <footer className="footer"><div className="container footerInner"><div className="footerBrand"><strong>{siteName}</strong><span>{m.footer.tagline}</span><small>Independent interactive science education · Free to explore</small></div><nav className="footerLinks" aria-label="Information, policies, and social media">{groups.filter(g=>!g.enOnly||locale==="en").map(g=><div key={g.title} className="footerGroup"><p className="footerHeading">{g.title}</p><ul>{g.links.map(([path,label])=><li key={path}><Link href={`/${locale}/${path}`}>{label}</Link></li>)}</ul></div>)}<div className="footerGroup"><p className="footerHeading">Follow</p><ul>{socialLinks.map(({label,href})=><li key={href}><a href={href} target="_blank" rel="noopener noreferrer">{label}</a></li>)}</ul></div></nav><nav className="simulationFooterLinks" aria-label="Simulation footer navigation"><Link href={`/${locale}/simulations`}>Simulations</Link><Link href={`/${locale}/guides`}>Guides</Link><Link href={`/${locale}/about`}>About</Link></nav><div className="footerBottom"><span>© {new Date().getFullYear()} {siteName}</span><span>Educational models explain ideas; they do not replace professional advice.</span></div></div></footer>}
