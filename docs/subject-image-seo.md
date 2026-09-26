# Subject image publishing

The five active subject pages and the subject directory display the watermarked artwork as server-rendered HTML images, beside the relevant subject text. Hidden subjects are unchanged.

- Web assets: `public/images/subjects/learnerkits-{subject}.webp` (1200 × 800) and `-640.webp` (640 × 427). Full compositions and watermarks are preserved. Original 1536 × 1024 downloads remain in `output/subjects/`.
- Descriptive alt text in all nine supported languages, intrinsic dimensions, and responsive `srcset` are centralized in `lib/subjects/images.ts` and `SubjectImage.tsx`.
- Subject hero images load eagerly with high priority. Directory thumbnails load lazily except the first image.
- Each subject's Open Graph and Twitter metadata identifies the same image shown on the page, including dimensions and localized alternative text.
- CollectionPage structured data includes `image` and `primaryImageOfPage` ImageObject fields. These describe the image; they do not imply eligibility for a particular rich result.
- The sitemap lists the relevant images for every localized subject landing page and the directory. Existing robots rules allow the public image URLs, and subject metadata allows large image previews.
- Visible captions identify generated editorial illustrations and note that they are not to scale. No invented license or copyright ownership metadata is added.

Generation prompts are in `docs/subject-image-prompts.json`. The original PNG files should be used for future re-encoding, rather than recompressing WebP files repeatedly.

After deployment, inspect a subject URL and its image in Search Console and verify that production image responses return HTTP 200 with the WebP content type. Image indexing and preview selection remain search-engine decisions. The requested watermark is preserved as branding.

Reference: [Google image SEO best practices](https://developers.google.com/search/docs/appearance/google-images).
