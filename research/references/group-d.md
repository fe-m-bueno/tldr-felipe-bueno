# Group D — Reference teardown

Captured 2026-09-17 with `agent-browser` (Chromium), desktop 1440×900 and mobile 390×844.
Screenshots: `research/references/screenshots/<slug>-desktop.png`, `<slug>-mobile.png`.
All measurements below are real computed values read off the live DOM, not estimates, unless marked "approx".

---

## jib.design — JB Eudeline

- **One-line essence:** A 400px-wide dark column that reads like a tightly-edited résumé, with the entire "hire me" flow hidden behind one button that splits the screen into credentials + a 3-question qualification quiz.

- **Information architecture** (top → bottom, single page `/`):
  1. **Header** — wordmark logo (`JIB` blobs, PNG, black/white swapped per theme) left, theme toggle (sun/moon) right.
  2. **Intro** — 4 short paragraphs: who he is → track record (7 yrs, 50+ startups, $100M raised) → past employers (Qonto #30, Contentsquare #25, with superscript unicorn ranks) → design philosophy.
  3. **CTA** — a single pill button, "Start a project".
  4. **`selected work`** — horizontal-scroll strip of product screenshots (2 videos + ~16 images). Each thumbnail is a button that opens a lightbox ("Enlarge Ale Aceves shot", "Enlarge Jupi shot"). Only 2 named projects. No case study pages.
  5. **`experiences`** — 7 rows, hairline-separated: `2026 - Today | Design Engineer | Independent`. Date left, title mid, company in muted grey.
  6. **`services`** — 6 plain lines, no descriptions: Product Design, Design Systems, Design Ops, Product Strategy, AI Workflows, Design Engineering.
  7. **`stack`** — 4 plain lines: Claude Code, GitHub, Figma, Linear.
  8. **`contact`** — 4 underlined links: X, GitHub, LinkedIn, Email.
  9. **Footer bar** — "Currently in Bali • UTC+8" left, a version chip `v. 1.69.1` right. The version number is the joke: the site is treated as a shipped product.

- **Copy volume:** 152 words on the whole homepage. **~85 words above the fold** (the 4 intro paragraphs + CTA — that is literally everything before you scroll; `selected work` starts at ~500px). The `/start` panel adds ~75 more.

- **Typography:**
  - Geist Sans (variable 100–900) + Geist Mono loaded. Everything visible is Geist Sans.
  - Only **three** sizes in the whole page: body **14px / 20px line-height**, section labels **12px**, h1 **16px** (and h1 is visually just the logo). No display type at all — the name is never set large.
  - Line length: 14px in a 400px column ≈ **58–62 characters**, i.e. deliberately narrow.
  - Section labels are lowercase (`selected work`, `experiences`, `stack`) at 12px, `--text-secondary` = white at 60% opacity. Lowercase is the styling — no `text-transform`, it's typed that way.
  - Distinctive: superscript rank markers (`Qonto`^30), an arrow glyph in "0 → 1", letter-spacing left at `normal` throughout.

- **Color & theme:** Dark by default (`bg` = near-black, `lab(5.56 0 0)` ≈ `#0e0e0e`), text white @ 93%. Manual toggle flips to light: `#fafafa` bg, black @ 92% text. Two text tiers only: primary (93%) and secondary (60%). Contrast is intentionally *low* for secondary text — the muted company names sit around 3:1.

- **Layout:** Single centered column, **`max-width: 400px`** (this is the whole design decision). Page height 2080px at 1440w = 2.3 viewports. Section rhythm is uniform: `mt-16` (64px) between every section, `mt-4` (16px) label→content. The `selected work` strip is the one break: a 920px-wide scroller that visually overflows the 400px column to the right. A `position: fixed`, 496px-wide, full-height decorative panel sits behind the column at larger breakpoints (a subtle "sheet of paper" backdrop).

- **Navigation:** **No navbar.** Zero internal `<a>` links on the homepage — 7 links total, all external (LinkedIn, Qonto, Contentsquare, X, GitHub, LinkedIn, and an email button). There are exactly **2 routes**: `/` and `/start`. You reach `/start` only by pressing the CTA.

- **Motion & interaction:**
  - Theme toggle: the SVG moon↔sun **morphs its `d` path** over 0.3s `cubic-bezier(0.77,0,0.175,1)` rather than cross-fading two icons.
  - Buttons: 0.1s `cubic-bezier(0.23,1,0.32,1)` on background/border/box-shadow — very fast, near-instant feedback.
  - The main column has a 0.25s `translate` transition (0.23,1,0.32,1) used by the `/start` "doors" transition.
  - **`/start` is the showpiece:** the viewport splits into two independently-scrolling halves. Left = a credentials column ("It's just me. / I design and build, in Figma and/or in your codebase. / 13+ years, 50+ startups, two unicorns early." then a 2-column list of 16 client names under `they trusted me`, then the full experiences table). Right = a card with `1/3` progress chip and a 5-option radio question ("How's your product's design today?" → "Solid, we keep it consistent" … "AI-built, needs a human eye" … "Barely any design yet"), each option numbered 1–5 for keyboard selection. Bottom: ✕ close + "Start a new project".
  - No cursor effects, no scroll-linked animation, no page-load reveal.

- **Implied content model:**
  ```
  Site      { intro: RichText, location, timezone, version, ctaLabel }
  Shot      { image|video, alt, projectName, order }        // flat, no project entity
  Experience{ startYear, endYear|"Today", title, company, companyUrl? }
  Service   { label }                                        // label only
  Tool      { label }                                        // label only
  Client    { name }                                         // 16 of these, name only
  Social    { label, url }
  QuizStep  { question, options: [{ label, index }], step, total }
  ```
  Note what is *not* a field: no project description, no year, no role, no client per project, no case-study body.

- **What's ABSENT:** No navbar. No project detail pages. No case studies. No blog. No photo of himself. No testimonials. No logo wall (client names are plain text, and only visible inside `/start`). No "my process" section. No newsletter. No hero headline — the largest type on the page is 16px. No pricing on the homepage. No footer sitemap. No cookie banner.

- **Steal-worthy:**
  1. **400px max-width and a 14px/12px two-size type scale.** The constraint does all the work; nothing else has to be "designed".
  2. **`/start` as the only second page.** Instead of a contact form at the bottom, the CTA opens a split screen where the left half re-states credentials while the right half qualifies the lead in 3 questions. Contact becomes the product.
  3. **The `v. 1.69.1` chip + "Currently in Bali • UTC+8" footer bar.** Two tiny live/pseudo-live signals that make a static page feel maintained.

---

## evilrabbit.com — Evil Rabbit (Guillermo's Vercel design counterpart)

- **One-line essence:** A monospace CV printed on black, where 97 words of text are followed by 21 giant, lazily-loaded work images and nothing else.

- **Information architecture** (single page):
  1. **Header** — rabbit-head SVG logo only, in a 200px-tall (`h-[12.5rem]`) block. No name in the header.
  2. **Bio** — 2 sentences. "**Evil Rabbit** is a designer from Buenos Aires, Argentina." / "Based in San Francisco, California." The name is bold-white, the rest is grey — one line does the job of a whole About page.
  3. **Employment table** — 7 rows, hairline-separated: company (white) + role (grey) left, years right-aligned. Vercel's end date is **`∞`** (`2016-∞`).
  4. **`Awards`** — exactly one entry (Next.js Conf, Awwwards Site of the Day, linked out).
  5. **`Featured`** — one line + one image (the Book of Design spread).
  6. **`Product`** — 5 work items.
  7. **`Branding`** — 10 work items.
  8. **`Physical`** — 1 work item (the ZEIT keyboard).
  9. **`Angel Investor`** — one sentence + 5 company links (Ato, CodeCrafters, Langbase, Paper, Puma Browser).
  10. **Footer** — 𝕏 glyph left, `© 2026` right.

- **Copy volume:** **181 words total** once everything lazy-loads; **97 words** in the initial HTML. **~30 words above the fold** (logo + 2 bio sentences + the first 2 employment rows). Every work item's entire copy is one line: `2024—"Grep" Rebranding Direction`.

- **Typography:**
  - Inter is loaded on `<body>` but every visible element resolves to the **system monospace stack** (`ui-monospace, SFMono-Regular, Menlo, …`).
  - One size: **14px / 20px line-height** for body and for `h2`/`h3` alike. Headings differ only by `font-weight: 700` and `capitalize` — the size scale is literally flat.
  - 14px mono in a 668px column ≈ **78 characters** — a full code-editor measure, much wider than jib's.
  - The `∞` in `2016-∞` and the em-dash-joined `2024—Title` pattern are the only typographic flourishes.

- **Color & theme:** **Dark only.** `#000` background, `#fafafa` text, grey `#666` for years and secondary role text, `#333` 1px outlines on images. I emulated `prefers-color-scheme: light` and the page stays pure black (the `light` class applies, the palette doesn't change). There is a 0.3s `background-color` transition on `<html>`/`<body>` — a light theme was clearly scaffolded and abandoned. Contrast is maximal (21:1) for primary, deliberately weak (~4:1) for the `#666` metadata.

- **Layout:** Single centered column, **668px wide** (no `max-width` property — it's a fixed-width wrapper), 16px side padding on mobile → 358px. No grid, no cards. Spacing is the design: `mb-24` = **96px between work items**, `mb-16` = 64px between sections, `mb-8` = 32px under section headings. Full page height with all media loaded: **23,574px** desktop / 14,805px mobile — roughly 26 viewports of almost nothing but images.

- **Navigation:** **No navbar, no internal links at all.** 7 links on the page, every one external. One page, one scroll. You navigate by scrolling for 23,000 pixels.

- **Motion & interaction:**
  - Entrance only: `fadeIn` 0.5s on the header and on each section, staggered via `delay-1` / `delay-2` classes. Nothing scroll-triggered visually.
  - Work images live in **empty `<div data-index="0-0">` slots** that are populated as you approach them (IntersectionObserver). The page literally grows from 2,542px to 23,574px as you scroll. This is why the initial paint is instant.
  - Hairline `border-color` transitions (0.3s ease) on the employment rows — the only hover state.
  - No cursor effects, no smooth-scroll library, no page transitions (there are no other pages).

- **Implied content model:**
  ```
  Bio      { name, origin, basedIn }
  Role     { company, title, startYear, endYear|"∞", order }
  Award    { title, subtitle, date, url }
  WorkItem { year, title, category: "Product"|"Branding"|"Physical", media: Media[] }
  Media    { src, alt, type: image|video, width, height }   // 1..n per item, stacked
  Investment { name, url }
  ```
  A `WorkItem` has **no description field**. Title + year + pictures. That's the entire schema.

- **What's ABSENT:** No navbar, no about page, no case studies, no project write-ups, no client logos, no testimonials, no CTA, no contact form, no email address, no services list, no availability, no résumé download, no light mode, no dates more granular than a year.

- **Steal-worthy:**
  1. **`2016-∞`** as the end-date for your current role. One character of copy that says more than a paragraph.
  2. **96px of vertical space between work items and zero description.** The image is the argument; the caption is `YEAR—"Name" Discipline`. Rounded corners + a 1px `#333` outline are the only chrome on the media.
  3. **Empty placeholder divs hydrated on scroll.** A 23,000px page that ships a 2,500px document.

---

## rauchg.com — Guillermo Rauch

- **One-line essence:** A writing index rendered as a three-column table — year, title, view count — that fits in one viewport, with the view counts doing the work a description would.

- **Information architecture** (homepage `/`):
  1. **Header** — "Guillermo Rauch" (bold, 16px) left; "About" and "✕ Follow me" right. Total nav: 2 items.
  2. **Post table** — 16 rows. `year | title | views`. The year cell is **only printed when it changes** (2025, 2021, 2020, blank, blank… 2017, 2016, 2015, 2014), so the eye reads it as a grouped timeline without any group headings.
  3. **Footer** — "Guillermo Rauch (@rauchg)" in mono left; "Source" (link to the GitHub repo of the blog) right.

  There is nothing else. No hero, no bio, no work, no footer nav.

- **Copy volume:** **78 words on the homepage** — and 16 of those are years and 16 are view counts, so the *prose* is 0 words. Above the fold: the entire page (page height 964px at 1440×900; it fits, with ~250px of empty space below the table).

- **Typography:**
  - **Geist** (sans) for the interface, **Geist Mono** for the footer, the post metadata line, and post body prose.
  - Homepage scale: post titles **16px**, years and view counts **12px** grey `#737373`, nav links 12px, name 16px bold. Two sizes again.
  - Post page scale: `h1` **24px/700 Geist**, meta line **12px Geist Mono**, body **Geist Mono**. Setting long-form body copy in a monospace is the distinctive choice — it makes the essays read like README files.
  - 672px column; body prose wraps at ~75–80 characters.

- **Color & theme:** Light default — `#fff` background (body bg is transparent over white), `#000` text, `#737373` for metadata. **Honors `prefers-color-scheme: dark`** with no toggle: `#1c1c1c` background, `#f3f4f6` text. Contrast is absolute (21:1 / 16:1) for content and deliberately soft for years/views.

- **Layout:** Single centered column, **672px wide**, `x = 384px` at 1440 (centered). No `max-width` declared — fixed width. The table is a 3-column grid: year (left, ~60px), title (flex), views (right-aligned, tabular). Row rhythm ~36px. Whitespace density is high *vertically inside the table* (nothing is cramped) and the page ends early — the empty bottom third is part of the statement.

- **Navigation:** A minimal 2-item header that is present on **every** page (name → `/`, About, Follow me → X). **19 links total** on the homepage: 16 posts + About + X + Source. URLs are `/YYYY/slug` (`/2025/the-ai-cloud`, `/2014/7-principles-of-rich-web-applications`) — the year is in the path, so the URL is the archive.
  Total page count: **18** (home, `/about`, 16 posts).

- **Motion & interaction:** Essentially none. No entrance animation, no scroll effects, no cursor work, no page transitions (MPA-feel navigation). The "interaction" is the **live view counter** — the post page showed `51,281 views` one minute after the index showed `51,280`, and the meta line renders a relative timestamp (`Oct 17, 2025 (11m ago)`) that is computed, not written.

- **Secondary templates seen:**
  - **Post** (`/2025/the-ai-cloud`): same header → `h1` 24px → meta row (`@rauchg | Oct 17, 2025 (11m ago)` left / `51,281 views` right, both 12px mono) → mono body prose → same footer. 5,421px tall.
  - **About** (`/about`): same header → `h1 About` → 6 short biography paragraphs → a "Technical contributions" bulleted list of 12 items (MooTools, Socket.IO, Mongoose, Hyper, Next.js, SWR…). **404 words** — the About page carries nearly all of the site's prose, and it is a list of artifacts, not adjectives.

- **Implied content model:**
  ```
  Post   { year, slug, title, date, body: MDX, views: LiveCounter }
  About  { body: RichText, contributions: [{ text, links[] }] }
  Site   { name, navLinks: [{label,url}], sourceUrl, handle }
  ```
  `views` is the only non-authored field, and it is the only "sell" on the homepage.

- **What's ABSENT:** No tagline. No bio on the homepage (he is the CEO of Vercel and the homepage does not say so). No project/work section at all. No post excerpts, no tags, no categories, no cover images, no reading time, no search, no pagination, no RSS link in the UI, no newsletter, no comments, no footer nav, no theme toggle, no photo.

- **Steal-worthy:**
  1. **Suppress the repeated year.** Printing the year only when it changes turns a flat list into a timeline for free — and leaves a column of whitespace that reads as structure.
  2. **View counts as the only metadata.** No excerpt, no date-in-the-row, no tag. One number per row tells the visitor what to read, and it is the only dynamic thing on the page.
  3. **A homepage that fits in one viewport, with 250px of deliberate emptiness under it.** The absence of scroll *is* the claim.

---

## danielwhite.uk — Daniel White

- **One-line essence:** A portfolio dressed as a rendered Markdown file in a code editor — literal `#` and `##` heading markers, a collapsible folder tree for the work, `// Category` comments in the gutter — in monospace on cream paper.

- **Information architecture** (homepage `/`):
  1. **Title** — `# Daniel White` with the `#` visible in a muted colour, as if the Markdown source were showing through.
  2. **Intro paragraph** — one paragraph, ~50 words, with four product names rendered as **coloured favicon chips** inline (`▪textmotion` `◉cuelume` `◎drawably` `▪springline`) that link out.
  3. **Proof bar** — 4 stat cells separated by vertical hairlines: `1.8K / cuelume stars`, `1K / slot-text stars`, `111K / npm weekly`, `GitHub / sponsored`. Number 20px, label 11px muted.
  4. **`## Work`** — a **collapsed file tree**. Two closed folder rows: 📁 `2026` (blue) and 📁 `2025` (orange). Expanding draws ASCII-style tree connectors and reveals 11 child rows: item name left, `// Open source` / `// Performance` / `// Conversion` / `// Growth` right-aligned in the gutter, with `New` (amber) and `•Building…` (blue) pill badges. Only the 2025 items link to case studies.
  5. **`## Kind words`** — a horizontally auto-scrolling marquee of quote pills (`"Seriously cool." Des Traynor`), 8 quotes duplicated ×2 for the loop, bleeding off both edges of the column.
  6. **`## Connect`** — one paragraph with inline underlined links (email, GitHub, LinkedIn, X). No form, no button.
  7. **`## Off screen`** — 7 personal photos as a fanned stack of **polaroids** (white borders, rotated, overlapping), captioned only by alt text (Dog, London, Daniel, Meme, Sun, Sunset, Water).
  8. **Footer** — live local time `3:40pm in the UK`, then a small cat sprite and a fish: a **"Feed the cat"** button easter egg.

- **Copy volume:** **289 words** including the 8 duplicated testimonials (~170 words of unique, author-written copy). **~55 words above the fold** (title + intro + stat labels).

- **Typography:**
  - **CommitMono** — a single self-hosted monospace, used for absolutely everything. No second family.
  - Body **14px / 20px**, `h1` **20px / 600**, `h2` **13px at 60% opacity** (and each `h2` is preceded by a literal `## `). Stat numbers 20px, stat labels ~11px.
  - Mono at 14px in a 560px column ≈ **66 characters** — the Goldilocks measure between jib's 60 and evilrabbit's 78.
  - The distinctive move: **the Markdown syntax is part of the design.** `#`, `##`, `//`, and `←` are rendered, not stripped.

- **Color & theme:** Warm off-white `rgb(251,250,249)` (`#fbfaf9`) with `#111` text — paper, not screen-white. **Light only** — emulating `prefers-color-scheme: dark` returns the identical palette; `color-scheme: light` is declared. Accent colours appear only in tiny doses and are all semantic: blue folder + `Building…`, orange folder, amber `New` badge, amber-tinted `IMPACT` row on case studies, per-product brand colours on the inline chips. Muted text is `rgba(17,17,17,0.6)`.

- **Layout:** Single centered column, **`max-width: 560px`** (380px on mobile), `x = 435px` at 1440. Page height 1,141px = 1.27 viewports — it very nearly fits in one screen. Two elements break the column: the testimonial marquee (bleeds past both edges) and the polaroid fan (overflows ~90px each side). Section rhythm ~56–64px.

- **Navigation:** **No navbar.** The work tree *is* the navigation, and it starts collapsed — you have to open a folder to discover the case studies. 3 internal routes: `/work/catalogue-performance`, `/work/quote-rebuild`, `/work/club-points`. Total page count: **4**. Secondary pages navigate back via a single `← index` link at top-left; there is no header at all on the case study template.

- **Motion & interaction:**
  - **Lenis smooth scroll** (`<html class="lenis lenis-smooth">`).
  - Entrance: `v2Rise` 0.64s `cubic-bezier(0.16, 1, 0.3, 1)` (an expo-out) on the title, prose and proof bar — a staggered rise-and-fade on load.
  - The inline product chips animate on load: `tagSweep` 0.42s (0.16,1,0.3,1) sweeps a highlight across the chip, `tagLabel` 0.3s ease-out fades the label in, and `tagPulse` 1.8s ease-out pulses the status dot.
  - Folder rows expand/collapse on click with the tree connectors drawing in.
  - Testimonial marquee scrolls continuously; each quote is a `<button>` (clickable, presumably to the source).
  - Footer: live clock updating in local UK time, plus the **"Feed the cat"** toy — a rewarding, pointless interaction at the very bottom.
  - No custom cursor.

- **Secondary template — case study (`/work/quote-rebuild`, 2,426px tall, 311 words):**
  `← index` → eyebrow `2025 · CONVERSION` → `# Rebuilding the quote journey` → role subtitle → 3-sentence summary → tech chips (`TypeScript` `Next.js` `React` `Node.js`) → a **PROBLEM / SOLUTION / OUTCOME / IMPACT definition list** (label in the left gutter at 11px caps, body right; the IMPACT row gets an amber background — "Contributed to a quotation flow linked to about 60% sales growth") → then numbered chapters `01`, `02` … each with a title, one-sentence caption, a screenshot, and its own PROBLEM/SOLUTION/OUTCOME triplet.

- **Implied content model:**
  ```
  Site       { title, intro: RichText(with ProductChip refs), localTimezone }
  ProductChip{ name, url, faviconUrl, accentColor }
  Stat       { value: "1.8K", label: "cuelume stars", url }
  WorkFolder { year, accentColor, order }
  WorkItem   { title, category, badge?: "New"|"Building…", url?, folder→WorkFolder }
  CaseStudy  { slug, year, discipline, title, roleSubtitle, summary,
               stack: string[],
               problem, solution, outcome, impact,
               chapters: [{ index, title, caption, image, imageAlt,
                            problem, solution, outcome }] }
  Testimonial{ quote, author, sourceUrl }
  Photo      { image, alt, rotation }
  Social     { label, url }
  ```
  This is the richest model of the four — and notably the case study fields are **named after the argument** (problem/solution/outcome/impact), not after the medium (hero/gallery/body).

- **What's ABSENT:** No navbar. No dark mode. No hero image or portrait. No services/pricing page. No blog. No résumé download. No contact form (just a sentence with links). No client logo wall. No "my process" diagram. No expanded work list by default — the portfolio is *hidden inside closed folders*.

- **Steal-worthy:**
  1. **Render the Markdown syntax.** `#`, `##`, and right-gutter `// Category` comments cost nothing, are instantly legible, and give the whole page a voice without a single decorative element.
  2. **Work as a collapsed file tree with year folders.** It shows the shape of the output (11 things, across 2 years, tagged by discipline) in ~120px of vertical space, and makes expanding it feel like the visitor's choice.
  3. **PROBLEM / SOLUTION / OUTCOME / IMPACT as a fixed definition list, with IMPACT highlighted.** A case study template that cannot ramble, repeated per chapter.
  4. (Bonus) **Live local time + a "feed the cat" toy in the footer.** One line of warmth at the exact point the visitor has finished reading.

---

## Cross-cutting patterns

| | jib.design | evilrabbit.com | rauchg.com | danielwhite.uk |
|---|---|---|---|---|
| Column width | 400px | 668px | 672px | 560px |
| Body type | Geist Sans 14/20 | system mono 14/20 | Geist 16/24 | CommitMono 14/20 |
| Homepage words | 152 | 181 | 78 | 289 |
| Type sizes used | 3 | 2 | 3 | 4 |
| Theme | dark default + toggle | dark only | light + auto dark | light only |
| Internal pages | 2 | 1 | 18 | 4 |
| Navbar | no | no | 2 items | no |
| Page height (desktop) | 2,080px | 23,574px | 964px | 1,141px |

- **Nobody uses display type.** The largest text on any of these four sites is 24px (a rauchg post `h1`). Three of the four never exceed 20px. The name is set at body size or slightly above.
- **The measure is the design.** Every site is one centered column between 400 and 672px with no grid, no sidebar and no cards. Layout decisions collapse to a single number.
- **Two text tiers, not a palette.** Primary at ~93–100% and secondary at ~60% opacity, plus hairline rules. Accent colour appears only where it carries meaning (Daniel's status badges) or not at all.
- **Metadata replaces prose.** A year, a view count, a star count, a `∞`, a `// category`. Each is one token that does the job of a sentence — and three of the four make at least one of those numbers live (view counter, local clock, npm downloads).
- **The résumé is a two-column table**, present on three of four sites: label/company left, date right-aligned, hairline between rows. It is the single most reused component in this group.
- **Contact is a sentence, not a form.** Three sites end with a line of underlined inline links. The fourth (jib) replaces the form with a 3-question qualification quiz on a dedicated route.
- **Mobile is the same page, narrower.** Nothing here has a mobile-specific IA, a hamburger, or a drawer. Columns go from 400/560/668 → 358–380px and the two-column résumé rows stack. That is the entire responsive strategy.
- **Motion is entrance-only and expo-eased.** `cubic-bezier(0.16,1,0.3,1)` or `(0.23,1,0.32,1)`, 0.25–0.64s, fired on load, never scroll-linked. No parallax, no custom cursor, no page transitions anywhere in the group.
