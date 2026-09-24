import type { ArticleSlug } from "@/lib/articles/catalog";
import { articleImages } from "@/lib/articles/images";
import styles from "./articles.module.css";

export function ArticleImage({ slug, thumbnail = false }: { slug: ArticleSlug; thumbnail?: boolean }) {
  const image = articleImages[slug];
  // Pre-encoded responsive WebP variants keep image delivery static and avoid
  // re-encoding already compressed editorial artwork at request time.
  const picture = <img
    src={image.src}
    srcSet={`${image.smallSrc} 640w, ${image.src} 1200w`}
    sizes={thumbnail ? "(max-width: 560px) calc(100vw - 70px), (max-width: 1200px) 45vw, 540px" : "(max-width: 800px) calc(100vw - 32px), 730px"}
    width={image.width}
    height={image.height}
    alt={image.alt}
    loading={thumbnail ? "lazy" : "eager"}
    fetchPriority={thumbnail ? "auto" : "high"}
    decoding="async"
    className={thumbnail ? styles.cardImage : styles.articleImage}
  />;
  return thumbnail ? picture : <figure className={styles.figure}>{picture}<figcaption>{image.caption}</figcaption></figure>;
}
