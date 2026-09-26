import { getArticleFigure } from "@/lib/articles/figures";
import styles from "./articles.module.css";

export function ArticleFigure({ id }: { id: string }) {
  const figure = getArticleFigure(id);
  if (!figure) return null;
  return <figure className={styles.explainerFigure}>
    <a href={figure.src} aria-label={`Open full-size figure: ${figure.title}`}>
      <img src={figure.src} srcSet={`${figure.smallSrc} 640w, ${figure.src} 1200w`} sizes="(max-width: 800px) calc(100vw - 32px), 730px" width={figure.width} height={figure.height} alt={figure.alt} loading="lazy" decoding="async" />
    </a>
    <figcaption>{figure.caption} <a href={figure.src}>View full size</a></figcaption>
  </figure>;
}
