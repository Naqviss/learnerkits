// Folds case and accents so "energia" finds "energía" and "ETAPE" finds "étape". CJK, Cyrillic and
// Arabic pass through unchanged apart from lowercasing, so substring matching still works there.
export const normalizeSearch = (text: string) => text.normalize("NFKD").replace(/\p{M}/gu, "").toLocaleLowerCase();

export const searchTerms = (query: string) => normalizeSearch(query).split(/\s+/).filter(Boolean);

// Every term has to appear somewhere in the (already normalized) text.
export const matchesTerms = (haystack: string, terms: string[]) => terms.every((term) => haystack.includes(term));
