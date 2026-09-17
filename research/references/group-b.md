# Group B — TLDR portfolio reference study

Captured 2026-09-17 via agent-browser (Chrome 149), desktop 1440×900 and mobile 390×844.
Screenshots in `./screenshots/`.

| Site | Home words | Home scroll height @1440 | Column width | Theme |
|---|---|---|---|---|
| ambrosino.io | 131 | 1196px (1.3 screens) | 672px | dark default, light via `prefers-color-scheme` |
| paco.me | 196 | 1424px (1.6 screens) | 640px | dark default, light via `prefers-color-scheme` |
| grizz.fyi | 129 | 1850px (2.1 screens) | 540px | dark only |
| charliedeets.com | 47 | 900px (**zero scroll**) | ~545px text | dark default, light via `prefers-color-scheme` |

---

## ambrosino.io

- **One-line essence:** A résumé rendered as a typeset table — company logo, role, years — with zero prose, zero case studies, and a sticky icon dock instead of a navbar.

- **Information architecture** (top to bottom, homepage):
  1. `Andrew Ambrosino` — name, 30px, weight 400
  2. Subtitle — "Founder, Design Engineer, Product Leader" (one line, 14px, dimmed)
  3. **Latest** — 3 rows: OpenAI / Noyo / Catch. Each row = `[16px logo] [company] [role] [optional badge e.g. "YC W19"] [year range] [→ if it has a page]`
  4. **Earlier** — 3 rows, same shape: MITRE / Upthere / Microsoft
  5. **Licenses** — 2 rows: `[license name] [issuing body] [ID label] [ID number]` (FINRA/SEC CRD, NPN)
  6. Sticky icon dock — LinkedIn, GitHub, X, Dribbble on the left; PDF résumé, info (`/site`), chat (`/chat`) on the right
  7. **Misc** — 5 rows: `[year] [headline link] [source name]` (Lenny's Podcast, VentureBeat, TechCrunch ×2, Medium)

- **Copy volume:** 131 words on the whole homepage. Before the fold at 900px: ~45 words (name + subtitle + the whole "Latest" block through "Earlier"). There is not a single full sentence anywhere on the page — every line is a label or a title. No "about me" paragraph at all.

- **Typography:** Single self-hosted sans (`_sans`, a Next.js `localFont` — reads as Inter/Söhne-adjacent geometric grotesque). Only **four** sizes on the entire page: 30 / 14.5 / 14 / 12px. Name is 30px at weight **400** — not bold; scale is carried by color contrast, not weight. Tabular figures in the year column. No serif, no mono, no italics. Line length is irrelevant because almost nothing wraps.

- **Color & theme:** `oklch(0.145 0 0)` background (near-black, ~#0F0F0F), `oklch(0.95 0 0)` text. Light mode flips to pure white / `oklch(0.15)`. Strictly achromatic — the *only* color on the page comes from the company logos (OpenAI, Noyo purple, Microsoft's four squares). Three-tier text contrast: full-white for the primary label, mid-gray for the role, dark-gray for the year and section headers.

- **Layout:** Single centered column, `max-width: 672px` (Tailwind `max-w-2xl`), `padding-top: 96px`. Inside it every list is a 3-zone row: identity left, detail center, year right-aligned. Hairline 1px dividers between rows inside a group, ~48px of air between groups. Whitespace density is high vertically, tight horizontally — the page is ~1200px tall carrying 131 words.

- **Navigation:** **No navbar.** The homepage *is* the index. Two internal destinations are reachable from work rows (`/work/noyo`, `/work/catch`, signalled by a `→` at the right edge); everything else in the dock. Total surface: home, 2 work pages, `/site` (a curated link list of ~40 other personal sites), `/chat`, `/resume.pdf`. So ~6 pages.

- **Motion & interaction:** Deliberately quiet. `transition: all` on rows — hover lifts the row's background and brightens the year. `scroll-behavior: smooth` on `<html>`. The dock is `position: sticky; bottom: 0` with a `bg-surface-fade-bottom` gradient mask so content dissolves into it rather than being cut. No entrance animation, no cursor effect, no page transition, no parallax.

- **Implied content model:**
  ```
  Role      { company, companyLogo, companyUrl?, title, badge?, startYear, endYear|"Present",
              group: "latest"|"earlier", caseStudy? -> WorkPage }
  WorkPage  { slug, company, roles: Role[], heroMedia, bullets: RichText[],
              bulletLinks: Link[], stack: Tag[], media: Image[] }
  License   { name, issuer, idLabel, idValue }
  Mention   { year, headline, url, source, kind: "press"|"podcast"|"writing" }
  SocialLink{ platform, icon, url }
  ```

- **What's ABSENT:** No hero statement. No "About". No photo of himself. No testimonials. No services or pricing. No blog. No project thumbnails on the homepage (the grid of screenshots only exists inside a work page). No navbar, no footer text, no copyright, no cookie banner. No email address in plain text. No skills list, no tech-stack cloud on the home page.

- **Steal-worthy:**
  1. **The résumé-row primitive.** One component — `logo · title · meta · year · optional arrow` — renders Work, Earlier, Licenses and Press. Four content types, one visual grammar. That's the whole site.
  2. **Four type sizes, three text colors, zero bold.** Hierarchy comes entirely from opacity tiers. Cheap to build, impossible to make ugly.
  3. **Sticky bottom dock with a gradient fade-out** instead of a navbar — persistent access to socials/PDF without spending any vertical space at the top.

---

## paco.me

- **One-line essence:** A one-page personal essay in a 640px measure, where the only navigation is three short link-columns dropped into the middle of the prose.

- **Information architecture:**
  1. `Paco Coursey` — name, plain 17px, same size as body text
  2. Intro — 2 paragraphs, ~55 words, with inline links (Linear, Vercel)
  3. Three-column link block: **Building** (1 item) · **Projects** (3 items) · **Writing** (3 items). Each item = `title [↗ if external] + one-line description`
  4. **Now** — 3 paragraphs, ~110 words, first-person, non-professional (music taste, playlists)
  5. **Connect** — one sentence with a Twitter handle and a mailto
  6. Footer — rotating aphorism · year · live analog clock

- **Copy volume:** 196 words. Before the fold at 900px: ~120 words (everything through the link columns). Longest single block is the "Now" section at ~110 words — and it's about *taste*, not work.

- **Typography:** Söhne (falling back to Inter) at 17px for prose, 16px base, 14px for the small/low-contrast labels. **Line-height 28px on a 17px body = 1.65**, generous. Measure is exactly 640px ≈ 72 characters. The distinctive move: **Newsreader italic (serif) for emphasis inline in a sans paragraph** — used exactly twice, on "*Crafting interfaces*" and "*everything around me is someone's life work*". Two words of serif carry the entire personality of the site.

- **Color & theme:** `rgb(26,26,26)` background, `rgb(242,242,242)` text; light mode is pure `#fff`/`#000` via `prefers-color-scheme`. Achromatic. A deliberate third tier at `rgb(80,80,80)` used *only* for link underlines and low-contrast labels.

- **Layout:** CSS Grid `192px 640px 192px` with 24px gaps, centered. The centre track holds all content; **the left 192px gutter is reserved for back-links on secondary pages** (`↩ Index`) — it's empty on the homepage. Inside the 640px track, the link block is a nested 3-column grid. Footer is pinned to the bottom of the viewport with a 1px top rule spanning full width.

- **Navigation:** **No navbar.** The three link columns are the nav. On secondary pages an italic serif `↩ Index` sits in the left gutter, outside the text column. Pages: `/`, `/craft`, `/writing`, `/writing/<slug>` (~12 posts), plus `/craft/<slug>` demos. External links (GitHub repos) get a `↗` and are visually identical to internal ones.

- **Motion & interaction:**
  - Staggered entrance: `@keyframes enter { 0% { opacity:0; transform:translateY(10px) } 100% { opacity:1 } }`, **0.6s duration, 0.12s stagger per block** (0, 0.12, 0.24, 0.36, 0.6, 0.72s). Every top-level block fades up in sequence on load.
  - Links carry a permanent 1px underline in `rgb(80,80,80)` with `transition: text-decoration-color 0.24s` — hover brightens the underline, not the text. Underline is always present so links are scannable without hovering.
  - **A live analog clock in the footer**, driven by CSS custom properties `--now-h / --now-m / --now-s`, with a tooltip. It shows the visitor's actual current time.
  - **The footer aphorism is randomized per page load** — "Pray at the altar of hard work.", "Shine, constantly and steadily.", "Sit with your ambient ambition." Three visits, three different lines.
  - No cursor effects, no scroll-triggered animation, no page transitions.

- **Implied content model:**
  ```
  Page      { title, intro: RichText, sections: Section[] }
  Section   { heading?, body: RichText }           // "Now", "Connect"
  LinkGroup { label, items: LinkItem[] }           // "Building"/"Projects"/"Writing"
  LinkItem  { title, url, external: bool, oneLiner }
  Post      { slug, title, oneLiner, year, date }
  CraftDemo { slug, title, oneLiner, category: "Motion"|"CSS"|"Interaction" }
  Aphorism  { text }                               // pool, one picked at random per render
  ```

- **What's ABSENT:** No photo. No job-title line ("Senior Design Engineer at…") — the role is buried mid-sentence. No dates or years anywhere on the homepage. No company logos. No case studies (the "Projects" are GitHub repos). No résumé/CV, no PDF. No contact form. No navbar, no logo mark, no social icon row (just a text handle). No project screenshots — the entire homepage is text.

- **Steal-worthy:**
  1. **Links as the only navigation, arranged as three labelled columns of `title + one-liner`.** It replaces a nav bar, a projects grid and a blog index in ~40 words.
  2. **One serif italic for emphasis inside a sans paragraph.** The cheapest possible personality injection — two occurrences, zero extra layout.
  3. **The randomized footer aphorism + live clock.** Two tiny "someone is home" signals that cost nothing and make a static page feel authored. (Also: the 0.12s staggered `translateY(10px)` fade-up is the exact right amount of entrance motion.)

---

## grizz.fyi

- **One-line essence:** A 540px column of hairline list-rows, punctuated by three physical objects — an auto-cycling work reel, a shelf of real book spines, and a hand-marker display font — that do all the personality work.

- **Information architecture:**
  1. Bear SVG logo (inverted via `filter: invert(1)`) — no name, no h1
  2. Intro — 3 short paragraphs: what he does (with "stupid" carrying a tooltip citing *Don't Make Me Think*), who he's worked with, availability + `Book a call` (cal.com) / `Message me` (mailto)
  3. Work preview reel — one 16:9 card, 6 `.webp` frames auto-cycling
  4. **experience** — 4 rows: `[title, company] … [year range]`, right-aligned years
  5. **artifacts** (= writing) — 3 rows: `[title] … [DD/MM]`
  6. **experiments** — 4 rows: `[title] … [view]` + a `more experiments` row
  7. **bookshelf** — horizontal shelf of book spines, one standing open to show its cover
  8. **elsewhere** — one sentence with X, Telegram, email

- **Copy volume:** 129 words. Before the fold at 900px: ~55 words (logo + 3 intro paragraphs + the top of the reel). Longest prose block is 25 words. Article pages, by contrast, run long — the haptics piece is 636 words.

- **Typography:** Body is system SF Pro / `system-ui` at **15px / 20px line-height (1.33 — noticeably tight)**, sizes only 15 / 16 / 12px. Section headings use **"Wasted Year"**, a hand-drawn marker face, set lowercase and small (`experience`, `artifacts`, `bookshelf`, and `eND` at the bottom of articles). The tension between a neutral system sans and a scrawled display face *is* the brand — there is no third font and no weight variation.

- **Color & theme:** Pure `#000` background, pure `#fff` text. Dark only — no light mode, no toggle. Maximum contrast for text; secondary info (years, "view") sits at ~50% white. Color enters only through content: the orange "catch" work card, the book spines, the green Virgil Abloh cover.

- **Layout:** Single centered column, **540px** — the narrowest of the four. Every list is a two-zone row: label flush left, meta flush right, with the space between doing the work of a leader dot. Section heading, then a gap, then rows at ~28px pitch. No dividers, no cards, no boxes. The bookshelf and the work reel are the only full-column-width objects and they break the text rhythm on purpose.

- **Navigation:** **No navbar, no menu, no hamburger.** Every internal route is reached by clicking a list row. Routes: `/artifact/<slug>`, `/experiments/<slug>`, `/experiments` (index), `/book/<slug>`. Article pages provide their own chrome: a left rail with `↩ Return` plus a scroll-spy table of contents (the active heading gets a `—` marker), and prev/next arrows at both top-right and bottom-right. Built with Astro.

- **Motion & interaction:**
  - **Work reel:** 6 `.webp` frames stacked, each with `animation-delay` staggered and `animation-duration: 9s`, `data-work-preview-cycle-duration="9"` — a pure-CSS cross-fading slideshow, no JS, no video.
  - **Shared tooltip layer:** a single `#shared-tooltip` element repositioned via `--tooltip-x / --tooltip-y / --tooltip-rotate` custom properties, `.is-visible` toggled on hover/focus. "stupid" is underlined with a custom `<span class="line">` and reveals `"Don't Make Me Think" - Steve Krug`.
  - **The redacted joke:** a past client's name rendered with `filter: blur(6px)`; its tooltip reads "Nice try". A content field used as a punchline.
  - **Bookshelf:** each book is `[spine img + cover img]` with `data-tilt`, `data-cover-width`, `data-spine-width`, `data-book-status` (`finished` / `reading` / `not-started`) and an optional `data-book-url`. Hovering rotates a spine open to reveal the cover; loaded books get a two-layer `drop-shadow` glow. A `.book-preview-shimmer` blur placeholder covers image load.
  - Article pages embed live demos (e.g. side-by-side "success sound vs success haptic" buttons) and hand-drawn sketch illustrations on a light card against the black page.

- **Implied content model:**
  ```
  Job        { title, company?, companyUrl?, startYear, endYear|"Present", redacted: bool, redactedTooltip? }
  Artifact   { slug, title, date, body: MDX, coverSketch?, embeds[], footnotes[], toc: auto }
  Experiment { slug, title, url, media }
  Book       { slug, title, spineImage, coverImage, spineWidth, coverWidth,
               status: "finished"|"reading"|"not-started", isManga: bool, notesUrl? }
  WorkFrame  { image, order }                    // the 6-frame reel
  Annotation { phrase, tooltipText }             // inline tooltip on any word
  ```

- **What's ABSENT:** No navbar. No name as a heading (only a bear SVG). No photo of himself. No case studies with problem/process/outcome — the "work" is six screenshots on a loop with no captions or client names. No skills list, no tools list, no testimonials. No résumé/PDF. No light mode. No footer.

- **Steal-worthy:**
  1. **One hand-drawn display face used *only* for lowercase section labels**, against an otherwise pure system sans. Ten words of custom type carry the whole brand.
  2. **The single shared tooltip layer positioned by CSS variables**, letting *any* inline word become an annotated aside — used for a citation, a joke, and a redaction. It turns 25-word paragraphs into layered ones without adding visible copy.
  3. **A real bookshelf as the "about me" section.** `status: reading|finished` + spine/cover images + hover-to-open beats any paragraph about interests, and the data model is trivial.

---

## charliedeets.com

- **One-line essence:** A 47-word business card that fits in one viewport with no scroll, where the nouns in the sentences *are* the navigation, and a bottom-left pill morphs into the site menu.

- **Information architecture** (homepage — that's all of it):
  1. Portrait photo, 300×300, `border-radius: 24px`
  2. `Charlie Deets` — 36px heading
  3. Sentence 1: what he does — "simplicity", "practicality", "craft" each link to an essay
  4. Sentence 2: where he works — "Dia", "The Browser Company" link out
  5. Sentence 3: where he worked — "Apple", "WhatsApp" link to internal work pages
  6. `X` · `LinkedIn`
  7. Floating `Menu` pill, fixed bottom-left (bottom-center on mobile)

- **Copy volume:** **47 words total, all of them above the fold** — `scrollHeight === innerHeight === 900px`. There is nothing below. Three sentences. Secondary pages stay tiny too: `/work/` is 78 words, `/writing/` index is 43; only `/timeline/` runs long at 490 words, and it's 100% one-line entries.

- **Typography:** System stack only (`ui-sans-serif, system-ui` — SF on Apple, Segoe elsewhere), zero webfonts. Four sizes: 36px heading (bold) / **21px body paragraphs** / 17px link row / 16px base. The 21px body is unusually large — it's the reason 47 words feel like a full page. Measure ~543px ≈ 45 characters, deliberately short so each sentence breaks into two lines.

- **Color & theme:** `rgb(23,23,23)` background with `rgb(161,161,161)` body text — **body copy is deliberately low-contrast gray, and the links are near-white.** Inverted emphasis: the plain words recede, the clickable nouns advance. Light mode is `rgb(250,250,250)` / `rgb(46,46,46)`, same relationship. **Two different portrait photos** (`charlie_dark_square.jpg`, `charlie_light_square.jpg`, shot under different lighting) are both in the DOM and cross-faded by theme.

- **Layout:** Desktop is a two-up: photo left, text block right, the pair vertically and horizontally centered in the viewport. Mobile stacks photo above text, photo shrinks to 180px, everything left-aligned with a ~24px gutter. Secondary pages drop the photo and keep the text column at the same left edge (~380px at 1440) so the anchor point never moves between pages. Whitespace is extreme — roughly 85% of the desktop viewport is empty.

- **Navigation:** A single `Menu` pill fixed at bottom-left. It is the only nav on every page. Six destinations: Home, Work, Timeline, Photos, Writing, Links. Below those, a divider and `Close`. Work and writing entries then fan out into `/work/<company>` and `/posts/<date>-<slug>`.

- **Motion & interaction:**
  - **The pill→panel morph.** `.menu-v2` is a fixed element that animates `width` (0.507s) and `height`/`bottom` (0.396s) on a custom `linear()` spring that **overshoots to 1.16** before settling — a real bounce, not an ease. `border-radius` animates separately at 0.216s `cubic-bezier(0.2,0,0,1)`. It carries `backdrop-filter: blur(20px) saturate(1.4)`. The trigger text stays anchored at the bottom-left corner while the container grows up and out, so it reads as one object changing shape rather than a panel appearing.
  - Menu dividers fade in with a **0.15s delay** on the first one — staggered so the container finishes moving before the contents commit.
  - Link hover is a plain color transition (0.264s). No cursor effect, no scroll animation (there is no scroll), no page transition.

- **Implied content model:**
  ```
  Home      { name, portraitDark, portraitLight, intro: RichText[3], socials: Link[] }
  Job       { company, companyUrl?, external: bool, startYear, endYear|"now",
              shipped: string[] }               // e.g. ["Safari","Home","Privacy"]
  Project   { name, url?, startYear, endYear, oneLiner }
  TimelineEntry { year, text }                  // "Shipped Dia's new chat"
  Post      { slug, title, year, category: "Design"|"Photo" }
  NavItem   { label, href }
  ```

- **What's ABSENT:** No scroll. No hero image or banner. No "About" page. No case studies whatsoever — `/work/` lists company, years and shipped feature names as *plain text with no images at all*, for a designer who shipped Safari and WhatsApp. No project thumbnails anywhere. No tagline, no mission statement. No testimonials, no logos wall, no contact form, no email address, no footer, no copyright line, no navbar.

- **Steal-worthy:**
  1. **Prose-as-navigation with inverted contrast.** Write three true sentences, link the nouns, then make the *links* brighter than the surrounding text. The IA disappears into the copy and the page still scans in half a second.
  2. **The bottom-anchored pill that morphs into the menu**, with a spring `linear()` easing that overshoots, `backdrop-filter`, and the trigger label staying put during the morph. It gives a 47-word site one genuinely crafted interaction — which is the whole proof-of-competence.
  3. **Fit the homepage in exactly one viewport, no scroll.** Combined with a 21px body and a 45-character measure, it makes brevity feel like confidence rather than emptiness. (Bonus: theme-paired portraits, two photos shot under different light, cross-faded by `prefers-color-scheme`.)

---

## Cross-cutting notes

**Shared structure.** All four are a single centered column between 540 and 672px. All four are dark by default. All four have **no navbar** (Charlie's pill is the exception that proves it — it's hidden until asked for). All four use a two-zone row — `label left … meta right` — as the primary repeating unit, and three of four right-align a year or date column.

**Shared omissions.** Zero of the four have: an About page, a testimonial, a skills/tools list, a contact form, a copyright footer, or a case study with a problem/process/outcome narrative. Three of four have no photo of the author. Three of four show no project imagery on the homepage at all.

**Where the personality lives.** Never in the layout — always in exactly one or two small, cheap, unexpected artifacts: Paco's live clock and randomized aphorism, Grizz's marker-font labels and blurred client name, Charlie's spring-morph menu, Ambrosino's FINRA license numbers sitting on a design portfolio.
