import type { Locale } from "./config";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import zh from "@/messages/zh.json";
import ar from "@/messages/ar.json";
import pt from "@/messages/pt.json";
import fr from "@/messages/fr.json";
import ru from "@/messages/ru.json";
import ja from "@/messages/ja.json";
import de from "@/messages/de.json";
import { siteName } from "@/lib/seo/metadata";

const dictionaries = { en, es, zh, ar, pt, fr, ru, ja, de } as const;
export type Messages = typeof en;
export function getMessages(locale: Locale | string): Messages {
  const messages = dictionaries[locale as Locale] ?? en;
  return {
    ...messages,
    meta: { ...messages.meta, title: siteName },
    footer: { ...messages.footer, tagline: messages.footer.tagline.replace("Science Universe", siteName) },
  } as Messages;
}
