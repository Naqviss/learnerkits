// Last real content change for public pages whose sitemap date is not derived elsewhere (no locale
// prefix). Update an entry whenever that page's own text changes, so sitemap.xml and
// sitemap-bing.xml tell search engines what is worth recrawling. Lab pages use simulationReviewDate.
export const pageUpdatedAt: Partial<Record<string, string>> = {
  // 2026-11-28 thin-content clean-up: guides written for each hub and subject page, the new VSEPR
  // chart page, and the Exam Prep and mock exam sales pages.
  "/simulations": "2026-11-28",
  "/subjects": "2026-11-28",
  "/subjects/space": "2026-11-28",
  "/subjects/physics": "2026-11-28",
  "/subjects/geography": "2026-11-28",
  "/subjects/environmental-science": "2026-11-28",
  "/subjects/chemistry": "2026-11-28",
  "/subjects/mathematics": "2026-11-28",
  "/articles": "2026-11-28",
  "/molecules": "2026-11-28",
  "/exam-prep": "2026-11-28",
  "/exam-prep/any-board": "2026-11-28",
  "/mock-exams": "2026-11-28",
  "/teacher-kit": "2026-11-28",
};
