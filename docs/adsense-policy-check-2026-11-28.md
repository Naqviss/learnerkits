# LearnerKits policy check: AdSense, thin content and spam policies

28 November 2026 · checked against the local production build (`out/`) and the source code, before deploy

## Verdict

**Not ready to reapply yet, but close.** The content now passes all three Google pages. Before reapplying, three things are needed:

1. **Deploy.** Google still sees the old site with 796 pages, most of them thin. None of the fixes count until they are live.
2. **Remove or prove the home-page numbers.** "10K+ Students · 500+ Instructors · 50+ Learning institutions" is not supported by the analytics, and Google's spam policy says sites should not claim "content or services that they do not have".
3. **Wait for a recrawl.** Leave 1–2 weeks after deploying, so Google sees the new pages before AdSense reviews the site.

| Area | Result |
|---|---|
| Enough unique content on every page | Pass |
| No duplicate or near-duplicate pages | Pass |
| No scraped or copied content | Pass, with one spot-check recommended |
| Navigation and working links | Pass, with one minor note |
| Site delivers what it promises | **Fail until the home-page numbers are fixed** |
| Works in different browsers | Partly tested (Chrome only) |
| Spam signals: cloaking, hidden text, doorways, keyword stuffing, affiliates | Pass |
| Ads kept off screens with little content | Pass for app screens; suggested for legal pages too |

## What was tested

The three pages and what they actually contain:

- [Google AdSense content and user experience](https://support.google.com/adsense/answer/10015918): unique content, no duplicates or scraping, working navigation, and the site delivering what it promises.
- [Manual actions report](https://support.google.com/webmasters/answer/9044175) (Search Console), section "Thin content with little or no added value": thin affiliate pages, content taken from other sources, and doorway pages.
- [Spam policies for Google web search](https://support.google.com/publisherpolicies/answer/11035931) (Publisher Policies): no ads on pages that break Google's spam policies, no keyword stuffing, no doorway or cookie-cutter pages, and no claims of content or services the site does not have.

**Method**
- Measured the words each page has of its own in the built HTML. A text block counts only if it appears on fewer than 3 pages.
- Compared every pair of pages for shared 5-word phrases.
- Checked all titles and meta descriptions for duplicates.
- Scanned every outbound link and looked for hidden text.
- Reviewed the ad, redirect and navigation code.
- Rendered key pages in headless Chrome at 1440px and 390px, in light and dark themes.

## 1. AdSense: content and user experience

**Enough unique content: pass.**
- All 141 English content pages have at least 804 words of their own; the median is 928.
- The 10 legal and utility pages are shorter (98–1,224 words), which is normal for that kind of page.
- The 10 app screens (settings, classroom, dashboards) are hidden from search and never load ads.

**Regular updates: pass.** 37 lab guides, every hub page, the molecule chart and both exam pages were rewritten on 28 November, and articles carry their own dates.

**No duplicate content: pass.**
- No two pages share 30% or more of their 5-word phrases.
- No title or meta description is used twice.
- The page sets that used to repeat each other were retired or merged: 423 exam-prep lessons, 117 molecule pages and 30 worksheets.

**Repeated long text: acceptable.**
- The longest block repeated across many pages is 12 words: "Send a link to students or add the simulation to your website", on 105 lab pages.
- The AI disclosure on articles (27 words, 17 pages) is a required note, not filler.
- Google's own example of a problem is long copyright text on every page, which the site doesn't have.

**No scraped or copied content: pass, one spot-check advised.**
- The lab guides, hub guides and sales pages were written for this site, from each lab's own model.
- There are no embed-only media pages.
- Each molecule's background text is written from a cited source, mostly Wikipedia. It loads only when a visitor opens that molecule, but a quick check on a handful of entries for close paraphrase is worth doing.

**Navigation: pass, one note.**
- All 7,697 internal links in the build reach a real page, and the build fails if any do not.
- The header, dropdowns and footer render correctly at desktop and phone width with no sideways scrolling.
- Note: the "Exam Preparation" dropdown lists Cambridge, Edexcel, AQA and IB. A signed-out visitor who clicks a board lands on the general exam-prep page with a sign-in prompt, not on that board. Google asks whether navigation takes users "to the right content". Consider pointing these items at the page's board section, or labeling them "sign in".

**Site delivers what it promises: fail until fixed.**
- The home page shows "10K+ Students", "500+ Instructors" and "50+ Learning institutions".
- GA4 recorded about 1,140 sessions from English-language browsers between 1 October and 27 November 2026. GA4 only counts visitors who accept cookies, so the real figure is higher, but nothing in the data comes near 10,000, and no instructor or institution count exists.
- Unless you have records behind these numbers, remove them or replace them with facts the site can show, such as 105 labs, 117 molecules or 17 articles.
- Everything else checks out. Premium is labeled "Coming soon" rather than offered for sale, and lab and molecule pages contain what their titles say.

**Different browsers: partly tested.** Chrome rendered cleanly on desktop and phone, in light and dark themes. Safari and Firefox were not tested; open the home page, a lab, the molecule chart and exam prep in both before reapplying.

## 2. Search Console: thin content with little or no added value

| Example Google lists | Finding |
|---|---|
| Thin affiliate pages | None. No affiliate-style links (`ref=`, `aff=`, `tag=`) in any page. Outbound links are share buttons and sources such as OpenStax and PhET. |
| Content from other sources, scraped or low-quality guest posts | None found. No guest posts; articles are original and say they are AI-assisted, with no independent expert review claimed. |
| Doorways | None. The near-identical sets that could read as doorways (exam-prep lessons copied across boards, template molecule pages) were retired with 301 redirects to the page that now holds the content. |

**Other manual-action checks**
- **Cloaking and sneaky redirects:** none. Redirects are plain 301s, the same for visitors and crawlers. Exam lessons are shown only after sign-in, and crawlers see the same public page as any signed-out visitor.
- **Hidden text:** none. No inline hidden styles. The only off-screen text is one accessibility label for a table column.
- **Keyword stuffing:** no title repeats a word more than twice.
- **Structured data:** it matches what each page shows. The molecule chart's data describes each row's own facts.

**Remaining risk: scaled content.** Google's "Major spam problems" section names scaled content abuse. The new lab text was produced in bulk on one day with AI assistance. Every guide uses its own lab's numbers, and tests block repeated sentences. Even so, read about 10 of the expanded lab guides before reapplying, to confirm they read as written for students rather than generated.

## 3. Publisher Policies: spam policies

| Rule | Finding |
|---|---|
| No Google ads on pages that break the spam policies | Pass, once deployed. No page in the new build matches a spam pattern above. |
| No unnecessary, repeated keywords | Pass. Titles and descriptions are unique and readable; the meta keywords tag is ignored by Google and carries no stuffing. |
| Do not claim content or services you do not have | **Fail until the home-page numbers are fixed** (see section 1). |
| No doorway or cookie-cutter pages | Pass. No affiliate programs, and the template-built sets are gone. |

**Ads placement**
- `pageShowsAds` keeps the AdSense script off settings, progress, classroom, admin, premium, missions, teacher preview, the teacher dashboard, the donation result pages and the article reader.
- Suggested addition: also keep ads off contact, privacy, terms, cookies, refunds, disclaimer, accessibility, donate and pricing. These are short utility pages (donate has 98 words), and they are where a reviewer is most likely to see ads with little content around them.

## Fix list before reapplying

1. **Deploy the current build.** Then run `npm run indexnow` and the one-time IndexNow submission of the 255 retired URLs. *Effort: minutes.*
2. **Fix the home-page numbers.** Remove "10K+ / 500+ / 50+", or replace them with figures you can show. *Effort: minutes.*
3. **Resubmit `sitemap.xml` in Search Console**, then wait 1–2 weeks for Google to recrawl. *Effort: minutes, plus waiting.*
4. **Read about 10 expanded lab guides and 5 molecule backgrounds** for tone and close paraphrase. *Effort: about 1 hour.*
5. **Check Safari and Firefox** on the home page, a lab, the molecule chart and exam prep. *Effort: 15 minutes.*
6. **Optional:** add the legal and utility pages to the ad-free list, and make the exam-board dropdown items lead somewhere board-specific for signed-out visitors. *Effort: under an hour.*

Outside these three pages, but checked by AdSense: serving ads to visitors in the EEA, UK or Switzerland needs a Google-certified consent tool (a CMP). The site's consent banner is custom-built, so confirm this in AdSense under Privacy & messaging.

## Evidence

| Measure | Value |
|---|---|
| English pages in the build | 161: 141 content, 10 legal, 10 app screens |
| Before the clean-up | 796 pages; 651 thin or near-duplicate |
| Words of their own, content pages | lowest 804, median 928 |
| Pages sharing 30% or more of phrases with another | 0 |
| Duplicate titles / descriptions | 0 / 0 |
| Google sitemap / Bing sitemap | 113 / 38 URLs, every one with a last-modified date |
| Internal links checked by the build | 7,697, all resolve |
| Spanish pages | 0 published; `/es/*` redirects to English |
| Retired URLs (301) | exam-prep, mock-exam sets, 117 molecules, 30 worksheets |
| Affiliate-style links / hidden-style elements | 0 / 0 |
| Longest text block repeated on 5+ pages | 12 words (lab share prompt, 105 pages) |
| Ads switch in `.env.local` | `NEXT_PUBLIC_ADSENSE_ADS_ENABLED` not set, so no ad script loads; the site is verified for AdSense by its meta tag and `ads.txt` |
| Premium | Off (`NEXT_PUBLIC_PREMIUM_ENABLED=false`), shown as "Coming soon" |

Sources: the three Google pages above, read on 28 November 2026.
