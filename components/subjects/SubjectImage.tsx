import type { Locale } from "@/lib/i18n/config";
import type { SubjectSlug } from "@/lib/subjects/catalog";
import { subjectImages, subjectImageCaptions } from "@/lib/subjects/images";
import styles from "./subject-image.module.css";

export function SubjectImage({ subject, locale, thumbnail = false, priority = false }: { subject: SubjectSlug; locale: Locale; thumbnail?: boolean; priority?: boolean }) {
  const image = subjectImages[subject];
  if (!image) return null;
  const picture = <img
    src={image.src}
    srcSet={`${image.smallSrc} 640w, ${image.src} 1200w`}
    sizes={thumbnail ? "(max-width: 650px) calc(100vw - 76px), (max-width: 1240px) 44vw, 548px" : "(max-width: 900px) calc(100vw - 24px), (max-width: 1240px) 44vw, 548px"}
    width={image.width}
    height={image.height}
    alt={image.alt[locale]}
    loading={priority ? "eager" : "lazy"}
    fetchPriority={priority ? "high" : "auto"}
    decoding="async"
    className={thumbnail ? styles.thumbnail : styles.image}
  />;
  return thumbnail ? picture : <figure className={styles.figure}>{picture}<figcaption>{subjectImageCaptions[locale]}</figcaption></figure>;
}
