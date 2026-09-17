# Group A — TLDR portfolio references

Captured 2026-09-17 via agent-browser (Chrome 149), desktop 1440×900 and mobile 390×844.
Screenshots in `./screenshots/`. Files prefixed `_` are supplementary (dark mode, secondary templates).

| Site | Homepage words | Homepage scroll height @1440 | Type sizes used | Dark mode | Internal pages |
|---|---|---|---|---|---|
| shedsgns.me | 179 | 1944px (2.2 screens) | 5 (10–14px) | Yes, manual toggle | ~9 |
| arthurmonnet.com | 145 | 1449px (1.6 screens) | 6 (11–16px) | No | 10 |
| milesdobrenski.com | 79 | 900px (exactly 1 screen) | 1 (14px) | Yes, system + toggle | 0 |
| okfrank.co | 133 | 1450px (1.6 screens) | 2 (16/18px) | No | 0 |

---

## shedsgns.me — Juliette Karapetyan

Screenshots: `shed-desktop.png`, `shed-mobile.png`, `_shed-dark.png`, `_shed-note.png`, `_shed-infinity.png`

- **One-line essence:** A 540px-wide index card of a designer's life — one screen of prose, three link tables, then a draggable photo collage as the only image on the page.

- **Information architecture** (top to bottom, homepage):
  1. Avatar (40×40 rounded square, top-left of the column, no name label — the photo *is* the header)
  2. Trilingual greeting line: `hello, こんにちは, բարև` (muted grey, sets tone in 3 words)
  3. Positioning sentence — "I'm Juliette, a designer who ships with effort, care and taste."
  4. Context paragraph — past + present, 2 lines
  5. Recents paragraph — name-drops with inline links, ends in "and more" → `/cv`
  6. One-line CTA — "Explore my Selected work." → `/infinity`
  7. `Projects` — 4 rows: `name … date`, right-aligned date. One row ("Solana IRL passport / soon") is a *disabled* link with `cursor: not-allowed`
  8. `Playground` — 2 rows, same shape (side projects, explicitly separated from client work)
  9. `Notes` — 5 rows: `title … N min read` (not a date — reading time)
  10. `Connect` — price anchor ("Collaborations start at $7,000 and scale with scope."), then a contact paragraph with inline Telegram/email/X links + a copy-email button
  11. Collage — ~25 scattered, rotated photo/screenshot/tweet cards, desktop only
  12. Footer — `GMT+4  6:33:46 p.m.` live-ticking clock, nothing else
  - Fixed overlays: a floating pill dock (Telegram / GitHub / X icons) centered at the bottom; a 24px theme toggle top-right.

- **Copy volume:** 179 words total on the homepage. ~135 of them are above the 900px fold — i.e. the site front-loads 75% of its prose and the rest of the page is tabular. Sections 1–6 (all the actual sentences) occupy 290px of vertical space.

- **Typography:** Single sans — a self-hosted Inter cut named "Site Inter", with `Noto Sans JP` and `Noto Sans Armenian` swapped in per-script for the greeting line. **Everything body-level is 14px/22px, weight 400 — including headings.** Section labels ("Projects", "Playground") are the same 14px, differentiated only by a muted grey. The remaining sizes (10/11/13px) are footer + collage chrome. Line length ~77 characters at 540px. Distinctive: there is no type hierarchy at all; hierarchy is done entirely with color and 1px rules.

- **Color & theme:** Light `#FAFAFA` bg / `#000` text; dark `#0E0E0E` bg / `#B0B0B0` text. Manual toggle persisted to `localStorage` (`data-theme` on `<html>`). Section labels and dates are a muted grey; links are black with a hairline underline. Contrast is deliberately split-level — primary text at full contrast, all metadata at ~40%.

- **Layout:** Single column, `width: 540px`, `max-width: calc(100% - 60px)`, horizontally centered, `padding: 120px 0 111px`. No grid. Rows inside each section are flexbox `title` / `meta` with a 1px hairline divider between sections. Whitespace density is high: ~40px between sections, 120px above the first line. Mobile: same structure at 326px, collage removed entirely.

- **Navigation:** **No navbar.** Every route is reached from inline prose or a section row. 9 pages: `/` , `/cv`, `/infinity` (selected work), `/dungeon`, `/alloca`, plus note pages `/27`, `/radius`, `/taste`, `/overconsumption`. Secondary templates observed:
  - `/cv` — 178 words, same 540px column, a tight `org / dates / city` table with a `+ Earlier` collapse toggle.
  - `/radius` (note) — 1228 words, 8012px tall. Left-gutter sticky TOC with an active-section highlight, an issue number (`003`) with a back arrow, lowercase title, `Published 29 June 2026, 6 min read`, syntax-highlighted code blocks and *interactive* inline demos (a live `border-radius` slider).
  - `/infinity` — full-bleed, 36,485px tall infinite image wall with `Static` / `Interaction` filter tabs; the only page that breaks the 540px column.

- **Motion & interaction:**
  - Entry: `@keyframes appear-content` — `opacity 0→1`, `blur(4px)→0`, `translateY(6px)→0`, staggered per block. Blur-in is the signature.
  - Link hover: an `::after` underline bar that `scaleX(0→1)` from `transform-origin: 0 center` (a wipe, not a fade) plus an 11px square dot that fades in and slides — two-part hover on a single link.
  - The "Solana IRL passport" row runs a `solana-shimmer` animated gradient on hover.
  - Collage items are **drag-and-droppable** (`cursor: grab` / `grabbing`), and each hovers with a different rotation nudge via `--hover-nudge` (+3°, −3.5°, +4°, −2.5°, +3.5° cycling by `:nth-child`).
  - Theme toggle: icon crossfade + `scale(0.93)` on `:active`; an `html.is-theme-switching` class sets `transition-duration: 0s !important` on everything during the swap so only the toggle animates.
  - A `footer-sign-draw` `clip-path: inset(0 100% 0 0) → inset(0)` wipe draws a signature.
  - `@media (prefers-reduced-motion: reduce)` blocks are present for every one of these.
  - No custom cursor. Scroll does nothing (no parallax, no reveals, no sticky header).

- **Implied content model:**
  ```
  Profile     { avatar, greetings[locale,text], positioningLine, bio, recentsRichText, ctaLine,
                rateFloor, contactRichText, timezone, socials[label,url] }
  Project     { title, url(external|internal), date:"April 2026"|"soon", status:live|disabled,
                group: work|playground, effect?: "solana-shimmer" }
  Note        { title, slug, issueNumber, publishedAt, readingMinutes, bodyMDX(code+interactive) }
  CVEntry     { org, role, startYear, endYear|null, city, tier: current|experience|earlier }
  CollageItem { media(image|video), caption?, rotation, x, y, z }
  GalleryItem { title, media, category: static|interaction }
  ```

- **What's ABSENT:** navbar, logo/wordmark, hero headline, project thumbnails in the lists (text-only rows), case studies (external links go straight to the live product), testimonials section (they're smuggled into the collage as screenshots of tweets), "services" list, resume PDF, contact form, footer sitemap, cookie banner, any type size above 14px.

- **Steal-worthy:**
  1. **One type size for the entire page.** Hierarchy comes from color (black/grey), a 1px rule, and vertical rhythm only. It makes the page read like a document instead of a marketing site.
  2. **Right-aligned metadata as the only second column.** `title …………… April 2026` / `title …………… 10 min read` — one component, three different section meanings, zero thumbnails.
  3. **Price in the copy** ("Collaborations start at $7,000 and scale with scope."). One sentence that does the filtering an entire services page usually attempts.

---

## arthurmonnet.com — Arthur Monnet

Screenshots: `monnet-desktop.png`, `monnet-mobile.png`, `_monnet-case.png`

- **One-line essence:** A 672px résumé-as-homepage that behaves like a dashboard — live local time, live weather, live Mac keystroke counts — and exposes itself to AI agents over MCP.

- **Information architecture** (homepage):
  1. Hand-drawn low-poly portrait, ~110px, top-left
  2. `Arthur Monnet` — 16px, medium weight. The largest thing on the page.
  3. Positioning paragraph, 3 sentences, muted grey
  4. Location line + `Read more →` inline link to `/about`
  5. **Status strip** — `🕐 Montréal, 10:36 AM · ☀ 18°C · ● Open to opportunities` (live clock, live weather, availability dot in green)
  6. `SELECTED WORK` — 3 rows: `[logo] Name  one-liner ………… 2022–2026`
  7. `LAB` — 4 rows, same shape, with `NEW` pill badges instead of years for the recent ones
  8. Inline embedded podcast player (Daily Digest) sitting *inside* the Lab list as a row expansion
  9. `Tally` row + a live stats strip: `3.4k keystrokes · 845 clicks · 7 screenshots · 200 app switches · mostly in Dia`
  10. Footer icon row — Email (copy button), X, GitHub, LinkedIn, MCP
  11. `This site is agent-readable` → `/mcp`
  - Floating circular `⌘` button top-right labelled "Ask AI"; a persistent mini audio player pinned bottom-center when the podcast plays.

- **Copy volume:** 145 words. ~95 above the fold. The prose is 2 paragraphs; everything else is a one-liner per row (4–7 words each).

- **Typography:** Plus Jakarta Sans for headings/name, system `ui-sans-serif` for body. Base 16px/25.6px. Scale is 11 / 12 / 13 / 14 / 15 / 16 — six sizes inside a 5px range, which reads as *one* size with metadata whispered a notch smaller. Section labels (`SELECTED WORK`, `LAB`) are ~11px uppercase with wide tracking and muted grey. Line length ~85 characters at 672px. Body text color is a near-black in `lab()` color space, not `#000`.

- **Color & theme:** Pure white `#FFF`, near-black text, a warm tan/amber accent used only for the ⌘ glyph and the hairline rules between rows. Light only — no dark mode, no `prefers-color-scheme` handling. One green dot (`● Open to opportunities`) is the sole saturated color in the content.

- **Layout:** Single column, `max-w-[720px]` with `px-24` → 672px of content, `pt-20 pb-30` (80px / 120px), reduced to `pt-13` on small screens. Work/Lab rows are a 3-part flex: brand mark (16px) · name + one-liner · year, with a 1px rule under each row. Tailwind v4.

- **Navigation:** **No navbar.** Homepage is the index; every project row is a link. 10 pages: `/`, `/about`, `/work/{vasco, shippeo, tiller, distill, shiori, daily-digest, tally}`, `/mcp`. Subpages have a circular ← back button top-left and a **next-project pill** top-right (`[S] Shippeo ›`) — sequential browsing instead of a menu.
  - `/about` — 277 words, no images, a `year — org — role + outcome` list, ending with a personality paragraph with inline emoji (cooking, astrophotography, padel, electric skateboard).
  - `/work/vasco` — 650 words, 9 images, 5400px. Header: big `Vasco` + subtitle, then a `ROLE / TIMELINE / LOCATION` 3-column metadata strip between two hairlines, then uppercase-labelled sections (`THE PROBLEM`, `REVIEW HUB`, …).
  - `/mcp` — "Talk to this portfolio". Setup tabs for Claude / Claude Code / Cursor / Windsurf, a copyable server URL, a `TRY ASKING` list of 6 sample prompts, and a `DATA` list of read-only tools (`get_profile`, `search_work`, `get_context`, `get_opinions`).

- **Motion & interaction:** Deliberately quiet. `animate-page-in` fades the whole page in on load. Row hover is `group-hover:text-hover` + `group-hover:underline underline-offset-[3px]` — the title underlines, nothing moves. Icon links use `hover:opacity-60/70/80` with `transition-colors duration-150`. The bottom mini-player animates in with `transition-[bottom,transform] duration-500 ease-out` from `-bottom-20 translate-y-8 opacity-0`. A toast pill (`Email was copied`) slides up with `duration-200`. No scroll-triggered anything. No custom cursor. `backdrop-blur-xl` on the floating chrome.

- **Implied content model:**
  ```
  Profile   { portraitSVG, name, bioParagraph, locationLine, timezone, weatherCity,
              availability: { status, dotColor }, socials[] }
  Project   { slug, name, brandMark, oneLiner, yearStart, yearEnd, group: work|lab,
              badge?: "NEW", body: Section[], images[], role, timeline, location,
              prevSlug, nextSlug }
  Section   { label: "THE PROBLEM", blocks: (paragraph|image|caption)[] }
  Episode   { title, show, publishedAt, audioUrl, durationSec }
  LiveStat  { icon, label, value }                    // pulled from a Mac tracker
  MCPTool   { name, access: "read-only", description }
  ```

- **What's ABSENT:** navbar, hero image, thumbnails in the work list, testimonials, skills/tools grid, a blog, dark mode, contact form, a CV download, any type larger than 16px on the homepage, scroll animations.

- **Steal-worthy:**
  1. **The live status strip** — `location + local time · weather · ● availability` in one 12px line. It proves the site is maintained and answers "are you hireable" without a page.
  2. **`/mcp` — the site as an MCP server.** A portfolio that a recruiter's agent can query, with named read-only tools and a "try asking" list. Cheapest possible differentiator in 2026.
  3. **Next-project pill instead of a nav.** `← back` + `[logo] Shippeo ›` on every case study; you can walk the whole portfolio without ever returning to the index.

---

## milesdobrenski.com — Miles Dobrenski

Screenshots: `miles-desktop.png`, `miles-mobile.png`, `_miles-dark.png`

- **One-line essence:** A business card — 79 words on one non-scrolling screen, one type size, every link pointing off-site, floating on a WebGL shader background.

- **Information architecture** (the whole site):
  1. `Miles Dobrenski` / `San Francisco, CA` — two lines, no avatar, no title
  2. A 16px black dot in the top-right — this is the theme toggle. No icon, no label, no tooltip.
  3. `Currently <typewriter phrase>` with a blinking caret — rotating strings ("wrangling…", "writing my next short…")
  4. One 4-sentence bio paragraph, with inline links on every proper noun (OpenAI, Poke, Interaction, Twitter, email)
  5. An experience table: `[gradient orb] COMPANY ……… ROLE, YEARS`, 6 rows, monospace
  6. Nothing else. No footer.

- **Copy volume:** 79 words. All 79 are above the fold, because there is no fold — `scrollHeight === innerHeight === 900`. The page does not scroll at any width; on mobile it is exactly 844px.

- **Typography:** Two families, **one size**. Inter 14px/21px for the name and bio; **Berkeley Mono 14px, letter-spacing −0.14px** for the entire experience table, in uppercase. `getComputedStyle` over every element in the DOM returns exactly one `font-size`: `14px`. Line length ~77 characters at 570px. The sans/mono split *is* the hierarchy: prose vs. record.

- **Color & theme:** Light `#FFFFFF` / text `#080808`; dark `#0F0F0F` / white. Links are a muted grey against near-black body text — inverted from the usual convention (the link is *quieter* than the text). Each company row has a small blurred radial-gradient orb as its logo stand-in (black, pale blue, blue, grey, pink, violet) — the only color on the page. Theme = system preference on first load (inline blocking script adds `light`/`dark` to `<html>`), overridable by the dot; toggling adds a `theme-preview` class for the transition.

- **Layout:** Single column, `max-w-[618px]` + `px-6` → 570px of text, centered, `py-16` (`sm:py-24`). Vertical rhythm is a single `space-y-16` (64px) between the three blocks and `space-y-1` inside them. Experience rows are a 2-column flex, `COMPANY` left / `ROLE, YEARS` right, no rules, no zebra. Mobile: the same rows break to two lines — company + years on line 1, role indented on line 2.

- **Navigation:** **None, and there is nothing to navigate to.** `/about`, `/work`, and everything else return 404; there is no sitemap. All 17 `<a>` elements are external. The portfolio *is* the outbound links — proof of work lives at OpenAI, Poke, Dia, madrealities.tv.

- **Motion & interaction:**
  - Background is a `@paper-design/shaders` WebGL canvas at `fixed inset-0 -z-10`, full viewport, one instance per theme (`#FFFFFF` and `#0F0F0F`). It renders a slow dithered/halftone grain gradient pooling in the corners — visible in the screenshots as a faint diagonal texture. It is the only "art direction" on the page.
  - `animate-blink` on the caret after the typewriter string.
  - Typewriter types the `Currently …` phrase character by character (~1 char/200ms), pauses, and swaps to the next phrase.
  - `hover:scale-110 transition-transform` on the company orbs; `hover:text-secondary/90 transition-colors` on links. That is the complete hover vocabulary.
  - No scroll behavior (nothing scrolls), no page transitions (no pages), no custom cursor.

- **Implied content model:**
  ```
  Profile      { name, city, bioRichText(inlineLinks[]) }
  CurrentlyLine{ phrases: string[] }                 // cycled by the typewriter
  Role         { company, companyUrl, title, startYear, endYear|null,
                 orbColor|orbGradient }
  Theme        { mode: system|light|dark, shaderLight, shaderDark }
  ```
  Four types. No project type at all — work is a URL inside a sentence.

- **What's ABSENT:** navbar, any second page, project list, case studies, images (`document.images.length === 0`), a footer, a CTA, a résumé, section headings, a type scale, scrolling.

- **Steal-worthy:**
  1. **The no-scroll constraint.** Committing to `scrollHeight === 100vh` at every breakpoint forces every editorial decision. It is the single hardest and most legible "TLDR" rule on offer.
  2. **Sans for prose, mono for record.** No size change, no weight change, no rules — the typeface switch alone separates "who I am" from "where I've been".
  3. **A 16px dot as the theme toggle.** No sun/moon icon, no label; it inverts to white in dark mode so it also *reports* the current theme. Zero chrome.

---

## okfrank.co — Frank Costa

Screenshots: `okfrank-desktop.png`, `okfrank-mobile.png`

- **One-line essence:** Five paragraphs of first-person prose on warm paper, with one hand-drawn line illustration and dotted underlines — a letter, not a portfolio.

- **Information architecture** (the whole site):
  1. Four stacked lines, no styling difference between them: `Frank Costa` / `San Francisco` / `Email` / `X`. The last two are the only contact affordances and they are links, but they sit in the same list as the name and the city.
  2. A 576×326 hand-drawn SVG: the Golden Gate Bridge seen through cypress trees, with birds. Contour-line style, no fill, drawn in the same near-black as the text.
  3. Five body paragraphs: current role → Notion work → pre-Bay work → education/self-taught → cities lived in.
  4. Nothing else. No footer, no fixed elements.

- **Copy volume:** 133 words. ~59 above the fold — the illustration deliberately pushes most of the prose below it, which is the opposite of every other site here. Paragraphs are 1–4 sentences; the last is a single sentence of 12 words.

- **Typography:** One family, **GT America** (a licensed webfont — the whole visual identity is this one purchase). Two sizes: 16px/24px for the header block, and `17px/30px` rising to `18px/34px` at ≥640px for the prose. Line-height is very open (1.89). Line length ~68 characters at 576px. No uppercase, no letter-spacing, no weight above regular anywhere on the page.

- **Color & theme:** `--background: #faf1ea` (warm cream/paper) and `--foreground: #000` (pure black). Two custom properties; that is the entire palette. The illustration is a mid-grey stroke. Contrast is maximal on text and near-nil everywhere else. Light only — no dark mode, no `prefers-color-scheme` rule anywhere in the stylesheet.

- **Layout:** Single column, `max-w-xl` = `36rem` = **576px**, `justify-center` horizontally, `p-10` (40px) on mobile / `px-6 py-32` (128px vertical) on desktop. `flex-col gap-10 sm:gap-12` between the three blocks, `gap-6` between paragraphs. The illustration is exactly the column width, no bleed. The entire compiled utility set is **20 Tailwind classes**.

- **Navigation:** **None.** One route; `/about`, `/work`, `/writing`, `/notes`, `/projects` all 404. All 10 links are external (Thinking Machines, Notion, an X status for each claim, the App Store, a Microsoft blog post). Notably every *claim* is linked to its receipt: "became one of its most successful products" links to the tweet that says so.

- **Motion & interaction:** Essentially none, and it is deliberate — the entire custom CSS is four rules:
  ```css
  :root { --background:#faf1ea; --foreground:#000 }
  body  { background:var(--background); color:var(--foreground); font-family:var(--font-sans) }
  main a { color:inherit; border-bottom:1px dotted #0000005e; text-decoration:none; transition:border-color .15s }
  main a:hover { border-bottom-color:#000000e6 }
  ```
  Links are the *same color as the body text*, marked only by a 37%-opacity dotted bottom border that darkens to 90% over 150ms on hover. No `@keyframes`, no JS behavior, no entrance animation, no scroll effect, no custom cursor, no page transitions.

- **Implied content model:**
  ```
  Profile { name, city, contactLinks[{label,url}], illustration: SVG, bodyRichText }
  ```
  One type, five fields. Everything else is inline markup inside `bodyRichText`. If this were a CMS it would be a single-entry singleton with a rich-text field.

- **What's ABSENT:** navbar, job titles as headings, a project list, dates, years, logos, case studies, thumbnails, testimonials, dark mode, a CTA button, a footer, a second page, any element that isn't a paragraph, a link, or one drawing.

- **Steal-worthy:**
  1. **Every claim links to its receipt.** "which *became* one of its most successful products" hyperlinks to the tweet proving it. It replaces an entire metrics-and-results case-study section with one inline `<a>`.
  2. **Dotted-underline links in body color.** `border-bottom: 1px dotted rgba(0,0,0,.37)` → `.9` on hover. The prose stays a single uninterrupted color and the page never looks like a link farm.
  3. **One custom illustration doing all the art direction.** A 12KB SVG, exactly the column width, in the text color — no photography, no screenshots, no logos, and the site still has a face.

---

## Cross-cutting patterns

**Layout.** All four are a single centered column between **540 and 672px** (540 / 672 / 570 / 576). None uses a grid, sidebar, or full-bleed section on the homepage. Vertical padding is generous and asymmetric-heavy at the top (80–128px).

**Type.** Nobody uses a display size. The largest type on any of these four homepages is **18px**. Hierarchy is done with color (full-contrast text vs. ~40% metadata), a 1px hairline, a typeface switch, or vertical space — never with size. Miles uses literally one size; okfrank uses two; shed's headings are the same 14px as its body.

**Copy.** 79–179 words on the homepage. Every site opens with a first-person positioning sentence, in prose, within the first 200px. Nobody has a hero headline, a tagline, or a value proposition.

**The list row is the universal component.** Three of four render work as `title …………… right-aligned metadata` with no thumbnail: shed (`ASCIInator … April 2026`), Monnet (`Vasco  AI-powered RevOps platform … 2022–2026`), Miles (`OPENAI … DESIGNER, 2026–`). The right column carries whatever the section means — a date, a year range, reading time, a role.

**Navigation is absent in all four.** Zero navbars. Two sites (Miles, okfrank) have no second page at all and 404 on every guessed route; the other two reach subpages only through inline prose and list rows, with sequential prev/next on case studies rather than a menu.

**External links as the portfolio.** Miles and okfrank ship *no* case studies — the work is the live product, linked inline. okfrank goes further and links each claim to its public proof. Shed links most project rows straight to the shipped URL.

**Light-first, dark optional.** All four default light (#FAFAFA / #FFF / #FFF / #FAF1EA). Two have dark mode, both via a deliberately tiny control (a 24px icon, a 16px dot). Nobody has a labelled "Dark mode" switch.

**One warm signature per site, and only one.** Each site permits itself exactly one indulgence and keeps everything else flat: shed's draggable photo collage, Monnet's live status strip + MCP server, Miles's WebGL shader background + typewriter, okfrank's hand-drawn SVG. This is the pattern most worth copying — pick one, not two.

**Motion is entrance + hover, nothing else.** Nobody has scroll-triggered reveals, parallax, or a custom cursor. Entrances are a fade (sometimes with blur/translateY). Hovers are an underline, a color shift, or an opacity change at 150–360ms. Shed, the most animated of the four, honours `prefers-reduced-motion` on every single effect.
