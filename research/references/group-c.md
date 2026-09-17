# Group C reference study

Four radically minimal personal sites, studied 2026-09-17 with a real browser at 1440x900 and 390x844.
Screenshots in `./screenshots/`.

| Site | Homepage words | Homepage scroll height (1440px wide) | Pages | Dark mode |
|---|---|---|---|---|
| pqoqubbw.dev | 155 | 900px (zero scroll) | 7 | no |
| austinvalleskey.com | 325 | 8,916px | 1 | yes (auto) |
| benji.org | 142 | 980px | 8 | no |
| jakub.kr | 210 | 1,859px | ~12 | yes (auto) |

---

## pqoqubbw.dev — Dmytro Kalitniuk

Screenshots: `pqoqubbw-desktop.png`, `pqoqubbw-mobile.png`, `pqoqubbw-craft.png`

- **One-line essence:** A single screen of lowercase prose plus a six-row index of interaction experiments, where each row opens a page whose entire point is one live, playable component.

- **Information architecture** (top to bottom, desktop):
  1. Screen-reader-only line for agents: "this site serves markdown variants — see /llms.txt, or append .md to any URL" (invisible to humans, `sr-only`).
  2. `h1` greeting: "hey, i'm dmytro —— a design engineer." (an em-dash rendered as a 24px×1px `<span>` rule, not a character).
  3. Paragraph: current role + two side projects, all inline links.
  4. Paragraph: craft manifesto (3 sentences).
  5. Paragraph: "read more about my journey here" → external Substack.
  6. Paragraph: Twitter handle.
  7. `<nav>`: 6 craft rows — title left, date right, 1px bottom border on each.
  That is the entire page. No footer, no header, no nav bar.

- **Copy volume:** 155 words total on the homepage, and all 155 are above the fold — the page is exactly 900px tall at 1440×900 and does not scroll. Craft detail pages are 33 words.

- **Typography:** Geist Sans throughout (variable), *one* size for everything structural: 16px/24px with `letter-spacing: 0.16px` (a deliberate +0.01em loosening). The only deviations: dates at 14px/21px with `tabular-nums` and `lowercase`, and a "papermono" face loaded for demo captions. `h1` is 16px/400 — visually identical to body copy, so hierarchy comes from color (heading `#171514`-ish vs body `#57534e`-ish stone) and position, not size. Everything is typed in lowercase, including the H1 and the dates ("sep 17, 2025"). Line length: 544px ≈ 68 characters.

- **Color & theme:** Light only — no `prefers-color-scheme` handling at all; forcing dark changes nothing. Background `#f6f5f3` (warm off-white, not `#fff`). Heading near-black, body warm stone grey, dates `stone-400`. One accent: `hsl(23, 84.5%, 57.1%)` = `rgb(238,124,53)` orange, used exclusively on inline links (every link is orange + a tiny 12px external-link glyph). Low contrast between body copy and background by design; only headings hit full contrast.

- **Layout:** Single column. `max-w-xl` = **576px** container with `p-4` → 544px of content, `mx-auto`, `py-20` (80px) top and bottom. No grid, no sidebar, no cards. Whitespace density: paragraphs are `mt-2` (8px) apart — very tight — but the craft list is pushed down by `mt-10` (40px), and the page floats in ~80px of vertical air plus whatever the viewport gives. It reads dense in the block, generous around it.

- **Navigation:** No navbar, no logo, no menu. The 6 craft rows *are* the navigation. Detail pages carry a single `↩ back` link positioned in the **left margin**, outside the text column (at x≈373 while the column starts at 448) — a gutter-anchored back affordance rather than a top bar. Total: 1 index + 6 craft pages = 7 pages, plus `/llms.txt` and a `.md` variant of every URL.

- **Motion & interaction:** The signature move is **list dimming**: `nav.group` + `group-hover:opacity-30` on every row, `hover:opacity-100` on the hovered one, `duration-50` (50ms — almost instant). Hover any project and the other five drop to 30% opacity. The row's bottom border simultaneously fades from `stone-200` to `stone-300/30`. Inline links transition `color` to `text-primary/50` on hover, also 50ms. Focus states are a custom `.on-focus` ring drawn with a `::before` pseudo-element and `--radius-lg`. No cursor effects, no page transitions, no scroll animation (there is nothing to scroll). Detail pages use `react-medium-image-zoom` (`cursor: zoom-in` / `zoom-out`) on media, with `prefers-reduced-motion` honored.

- **Implied content model:**
  ```
  Profile { greeting, roleLine, bioParagraphs[], currentEmployer{name,url},
            sideProjects[{name,url}], journeyUrl, twitterHandle }
  Craft   { title (lowercase), date, slug,
            tagline (one line, e.g. "a tiny component built with extra care."),
            highlights[] (3-5 bullet fragments, e.g. "0.5px outline hits differently"),
            demo (live React component, rendered in a black rounded card),
            demoCaption ("demo"),
            credits[{role:"designed by"|"for", name, url}] }
  ```
  Note there is no `description`, no `tags`, no `cover image`, no `year` field separate from the date, and no body/markdown field — the craft page has no prose beyond the tagline and bullets.

- **What's ABSENT:** No navbar. No footer. No photo or avatar. No "about" page. No résumé or CV. No case studies — no problem/process/outcome narrative anywhere. No client logos. No testimonials. No skills list or tech stack. No contact form. No dark mode toggle. No hero image. No scrolling. No display type — nothing on the site is larger than 16px.

- **Steal-worthy:**
  1. **One type size for the whole site.** Hierarchy entirely from color weight and spacing. It makes the page read like a note rather than a marketing page, and it removes every "what size should this be" decision.
  2. **`group-hover:opacity-30` list dimming at 50ms.** Cheap to implement, makes a plain list of links feel deliberately built, and it directs the eye without a hover background or underline.
  3. **A project page that is a tagline + 4 bullets + one live demo.** The bullets are opinionated fragments ("0.5px outline hits differently"), not features. That is the whole case study, and it is more convincing than 800 words would be.
  4. Bonus: the `sr-only` agent notice + `.md` variant of every URL — treating LLMs as a first-class audience without adding a pixel.

---

## austinvalleskey.com — Austin Valleskey

Screenshots: `austinvalleskey-desktop.png` (full 8,916px), `av-hero.png`, `av-s1.png`, `av-dark.png`, `av-zoom.png`, `austinvalleskey-mobile.png`, `av-mobile-hero.png`, `av-mobile-2.png`

- **One-line essence:** One infinite scroll of product screenshots, where the words are a 135-word letter at the top and every project gets exactly three lines of text before the pictures take over.

- **Information architecture:**
  1. **Hero** — full-viewport, `position: fixed`, `min-h-dvh`, centered: name (`h1`), "Design, Coinbase" (`h2`, greyed), five short paragraphs, then three bare text links (X · Email · LinkedIn). A small chevron sits at the bottom as the only scroll cue.
  2. **Honk** — app icon, name, one-liner + "Learn more" (external), "Designed with [avatar] Alex & Benji" credit line, then a 3-column grid of media cards.
  3. **Aave App** — same block shape.
  4. **Family** — same.
  5. **MoneyKit** — same.
  6. **Cash App** — same (credits reduce to one person).
  7. **Freelance** — icon-less variant, "Select projects from over the years.", grid.
  8. **Acknowledgements** — three dense paragraphs thanking 25+ named collaborators by name, including who QA'd the site and who reviewed early drafts.
  Persistent overlays: a fixed top bar (morphing glass pill left, circular X right) and a fixed bottom glass pill nav with the five section names.

- **Copy volume:** 325 words on the whole page; ~135 of those are the hero, which occupies the entire first viewport (so 100% of above-the-fold copy is the hero letter). Of the remaining 190, roughly 180 are the Acknowledgements block at the very bottom. **Each project gets about 10 words**: name, a 4-word one-liner, and a credit line. Everything else is imagery.

- **Typography:** Inter, and the whole site runs at **14px/21px body** — unusually small. `h1` "Austin Valleskey" is only 20.8px/600 with `-0.52px` tracking; section titles ("Aave App") are 28px/600 with `-0.7px` tracking. So the type scale is 14 → 20.8 → 28 and nothing else. Tight negative tracking (-0.025em) on every bold element. Hero line length 466px ≈ 62 characters. The small base size is what makes the imagery dominate.

- **Color & theme:** Background `#f5f5f5` light / `#050505` dark, with **real `prefers-color-scheme` support** (no toggle — it just follows the OS). Text tokens: `--fg-500` `#111` for headings, `#222` for body, `#555` for the secondary line. Zero brand accent color — the only color on the page comes from the app icons and the product screenshots themselves. Chrome is glass: `rgba(246,246,246,0.70)` with `backdrop-filter: blur(12px)` and a `::before` inner-highlight gradient (`#fff` → `rgba(255,255,255,.1)` at 30% and 70% → `#fff`) that fakes a lit glass edge.

- **Layout:** Hero is a single centered 466px column. Project sections are centered-text headers over a **3-column grid, 1200px max width, 24px gap, 384px columns**, collapsing to 2 columns at `sm` and 1 column on mobile. Cards are flush rectangles (no border radius on the media container itself), each a uniform 3:4-ish tile filled with a device mockup on a pale or black backdrop. Whitespace: huge vertical gaps (~200px+) between a project's grid and the next project's header, so each section breathes as its own screenful.

- **Navigation:** No traditional navbar. Two persistent glass controls instead:
  - **Bottom center**: a 405×48px glass pill with the five section names, with the active section highlighted — a scroll-spy jump nav. `hidden md:flex`, so it disappears entirely on mobile.
  - **Top left**: a single 48px glass circle that morphs — its inline `width` animates and it crossfades between several icon/label states (back, up, a text label), each child transitioning `opacity/transform/filter` over 0.35s.
  - **Top right**: a 48px glass circle with an X.
  **Total pages: one.** Every link on the site (`honk.me`, `aave.com`, `family.co`, `moneykit.com`, `cash.app`, X, email, LinkedIn) points off-site. There are no internal routes at all.

- **Motion & interaction:** The hero is `fixed`, so the project grid scrolls *over* it rather than pushing it — a parallax-by-stacking trick with no scroll listener. Glass chrome enters and exits with a combined `transition-[width,opacity,transform,filter] duration-[0.35s] ease-in-out` going from `opacity-0 scale-[0.75] blur-sm` to sharp — a **blur-to-focus + scale-up entrance**, not a plain fade. Inner buttons enter from `scale-[0.25] blur-md`. Pills respond `hover:scale-[1.05] active:scale-[0.95]`. A `navButtonScaleEffect` keyframe pops labels from `scale(1.2)` to `1`. A fixed bottom gradient scrim at 50% opacity keeps the pill legible over any card. Media is click-to-zoom (`cursor: zoom-in` / `zoom-out`). Media is lazy-loaded aggressively — 63 images, none of which load until scrolled near.

- **Implied content model:**
  ```
  Profile     { name, role, company, bioParagraphs[], links[{label,url}] }
  Project     { name, icon (app icon image), oneLiner, externalUrl,
                collaborators[{name, avatar, url?}],
                media[{src, poster?, type:'image'|'video', bg:'light'|'dark', span?}] }
  Acknowledgement { body (rich text with 25+ inline names) }
  ```
  `media[]` is the dominant field — 10-20 assets per project. Note the first-class `collaborators` relation: crediting people by name with avatars is part of the schema, not an afterthought.

- **What's ABSENT:** No case study pages — literally no second page. No process writing, no "the challenge / my role / the outcome". No dates or years on any project. No job titles or duration. No résumé. No blog. No navbar or logo. No hero image of himself. No metrics ("increased conversion by X%"). No contact form — just three plain-text links. No project tags or filters. No "selected works" numbering.

- **Steal-worthy:**
  1. **A 10-word project record.** Icon, name, four-word one-liner, "Learn more" out-link, credits. Then show the work. It removes the whole "what do I write about this project" problem and makes the portfolio buildable in an afternoon.
  2. **Glass chrome that enters from `blur-sm scale-75 opacity-0`.** The blur-to-focus entrance reads as far more considered than a fade, costs one extra property in the transition list, and it's what makes the floating nav feel like a native OS control.
  3. **Crediting collaborators as a schema field**, with avatars, on every project. It's the most human thing on the page and takes two lines.
  4. **A fixed hero that the content scrolls over** — depth with zero scroll JS.

---

## benji.org — Benji Taylor

Screenshots: `benji-desktop.png`, `benji-mobile.png`, `benji-post.png`

- **One-line essence:** A CV compressed into five sentences with every noun hyperlinked, followed by a seven-row writing index and a live local clock — the whole site is a business card that happens to contain 2,000-word essays.

- **Information architecture:**
  1. Name (`Benji Taylor`) and, directly beneath it, **`Updated Aug 22, 2026`** in grey — a freshness stamp in place of a role line.
  2. Bio: five paragraphs. Where he's from. Current role. Previous roles and the company he founded/sold. Open-source tools he maintains. Where to find him. Fourteen inline links in ~125 words — roughly one link every nine words.
  3. Label: `Writing` (grey, 14px, acts as a section heading without being one).
  4. Post index: a three-column table — year in a left gutter (printed only on the first entry of each year), title in the middle, `DD/MM` right-aligned in 40% black. Hairline dividers between rows.
  5. Footer: a short 40px rule, then **`7:41am in Los Angeles, California`** — a live clock with animated rolling digits — and a tiny hand-drawn face glyph.

- **Copy volume:** 142 words on the homepage. The page is 980px tall, so effectively all of it is one screen (~125 words above the fold on a 900px viewport). Post pages run ~2,100 words.

- **Typography:** Inter Variable at **14px/20px with `font-weight: 460`** — a non-standard variable weight between Regular and Medium, which is the single most distinctive type decision on any of these four sites. `letter-spacing: -0.09px`. Titles in the post list are also 14px/460; even the `h1` on a post page is **14px/500**. There is genuinely no display type. Secondary faces exist in the design tokens and appear inside articles: `--font-newsreader` (serif, used for definition blocks) and `--font-benji-script` — **his own handwriting**, used for margin annotations. Numerals use `font-variant-numeric: tabular-nums`. Line length 550px ≈ 72 characters.

- **Color & theme:** Light only, no dark mode (forcing `prefers-color-scheme: dark` changes nothing — `--body-bg` stays `#fdfdfc`). Text `#111`. Secondary text `rgba(0,0,0,0.4)` — a 40% black rather than a grey hex, so it tints correctly on the off-white. Link underlines `#d9d9d9`. Accent `--primary` defined in **display-p3** (`color(display-p3 0.243 0.624 1)` ≈ vivid blue) behind an `@supports` guard, used only for hover on styled links. Contrast is deliberately soft: secondary text at 40% would fail WCAG AA at that size, which tells you the page is designed for calm reading, not compliance.

- **Layout:** Single 582px container (550px content + 16px padding), centered. The post index is a CSS grid with a ~110px year gutter on the left and right-aligned dates. Post pages break out into a **three-zone layout**: a left rail (~360px from viewport edge) holding `↩ Index` and a section TOC, the 550px article column, and a right margin reserved for handwritten marginalia — annotations in his script font tied to the text with a hand-drawn bracket. Whitespace: ~20px between paragraphs, ~48px between sections. Tight, document-like.

- **Navigation:** No navbar. The Writing table is the navigation. Post pages carry `↩ Index` plus an in-page section TOC in the left rail. Total: 1 index + 7 writing pages = 8 pages. (The site also injects his own `Agentation` annotation toolbar — a fixed 297px dark control cluster bottom-right — which is dogfooding one of his own products, not site chrome.)

- **Motion & interaction:** Named easing tokens on `:root`, which is worth copying wholesale:
  ```css
  --duration-snappy: 220ms;  --ease-snappy: cubic-bezier(0.175,0.885,0.32,1.1);
  --duration-swift:  800ms;  --ease-swift:  cubic-bezier(0.175,0.885,0.32,1.275);
  --duration-smooth: 300ms;  --ease-smooth: cubic-bezier(0.19,1,0.22,1);
  ```
  - **Underlines are `::before` pseudo-elements**, not `text-decoration`: a 1px, `border-radius: 2px` bar pinned to the bottom of the inline link, `background: #d9d9d9`, transitioning to `#666` on hover over 0.2s. This gives a perfectly flat underline that never collides with descenders and can animate color.
  - **Same list-dimming pattern as pqoqubbw**, but scoped: `ul:hover > li ... a h2 { opacity: 0.3 }` with `a:hover h2 { opacity: 1 }`, 0.14s, and gated behind `@media screen and (min-width: 520px)` so it never fires on touch. Crucially, `time span:last-child { opacity: 1 }` keeps the **year** at full opacity while the rest dims — so the year gutter stays readable during the dim.
  - Hovering a post row slides a chevron: `h2::after { transform: translateX(0.25rem) rotate(45deg) }`.
  - `scroll-behavior: smooth` with `scroll-padding-top: 5.25rem` for the TOC anchors.
  - The footer clock uses `number-flow-react` — each digit physically rolls when the minute changes.
  - No custom cursor. Custom scrollbar thumb (`rgba(0,0,0,0.15)` → `0.25` on hover).

- **Implied content model:**
  ```
  Profile { name, updatedAt (surfaced in UI), bioParagraphs (rich text, link-dense),
            timezone (drives the live clock), locationLabel }
  Post    { title, date, slug, sections[{id, heading}] (drives the rail TOC),
            body (MDX: prose, footnotes, marginNotes, embedded live demos,
                  definition blocks in serif),
            footnotes[{id, body}], marginNotes[{anchor, text}] }
  ```
  `marginNotes` and `footnotes` as first-class fields is the unusual part — the essay format assumes asides.

- **What's ABSENT:** No projects section — Honk, Family, cmdk are mentioned as *sentences in the bio*, not as cards. No images, logos, or screenshots on the homepage. No navbar, no footer links, no social icons (X/Instagram/email are words inside a sentence). No dark mode. No avatar. No role/title line. No newsletter signup. No contact CTA. No dates on anything except the writing, and no years-of-experience anywhere.

- **Steal-worthy:**
  1. **`Updated <date>` directly under the name.** It signals the site is maintained, replaces a role line, and quietly justifies the absence of everything else — it's a living document, not a campaign.
  2. **Underline-as-`::before`** with a hover color transition. One rule, and every inline link in dense bio prose becomes legible and animatable without `text-decoration` artifacts.
  3. **The year-gutter post list**: year printed once per group in a left column, title centre, `DD/MM` right. It shows cadence and recency without repeating "2026" seven times, and it holds up at any list length.
  4. **A live local clock in the footer** with rolling digits. Two lines of content that make a static page feel inhabited.
  5. Named `--duration-*` / `--ease-*` token pairs — motion becomes a design system, not per-component guesses.

---

## jakub.kr — Jakub Krehel

Screenshots: `jakub-desktop.png`, `jakub-mobile.png`, `jakub-dark.png`, `jakub-post.png`

- **One-line essence:** The most conventional of the four and still radically reduced — a bio, a four-row project list, a nine-row writing list, and a newsletter box, all at one type size, with a hand-drawn signature and a link to the page's own markdown source.

- **Information architecture:**
  1. **Identity row** — a small circular avatar (a scribble/doodle, not a photo) beside `Jakub Krehel` / `Design Engineer at Interfere` stacked in two lines.
  2. **Bio** — two paragraphs. Current role and what the company does; previous employers and four contact routes. Inline links carry **the destination's favicon** immediately before the link text (Interfere's mark, the ✉ glyph, the GitHub octocat).
  3. `Projects` heading, then 4 rows: `[favicon] name / description`, hairline divider between rows.
  4. `Writing` heading, then 9 rows: `title / Category`, hairline divider between rows.
  5. `Interface Newsletter` — heading, one-line description, and a pill-shaped email input with a black pill Subscribe button inset on the right.
  6. Footer — `index.md` (an underlined link to the raw markdown of the page) on the left, a **hand-drawn signature SVG** on the right.

- **Copy volume:** 210 words total. Above the fold on a 900px viewport: the identity row, both bio paragraphs, the Projects heading and all four project rows — about 100 words. The writing list and newsletter are below. Post pages run ~1,650 words.

- **Typography:** Inter Variable, **16px/26px** body — the most generous of the four, and the only site here with a 1.6 line-height. Type scale is essentially flat: section headings (`Projects`, `Writing`) are 16px at `font-weight: 500`; list titles are `font-[450]`; the post `h1` is 16px at `font-weight: 550`. Those 450/500/550 values are variable-font weights, used as the *only* hierarchy mechanism alongside color. One deliberate typographic flourish: the word "deeply" in the bio is set in **Libre Baskerville italic** mid-sentence (`<em class="font-libre-baskerville">`) — a single serif word in a sans paragraph. Line length 644px ≈ 78 characters.

- **Color & theme:** `#fcfcfc` light / `#101010` dark, with **full automatic `prefers-color-scheme` support and no toggle**. A Radix-style numbered grey ramp (`text-gray-800` for separators, `gray-1100` for body, `gray-1200` for emphasis) declared in **Lab/OKLCH color space** — and he wrote the OKLCH guide, so this is on-brand. No accent hue anywhere: the only saturated colors on the page are the borrowed favicons. The Subscribe button is the single high-contrast element (near-black pill).

- **Layout:** Single column, `<main>` at **644px**, centered, no padding gutters visible at desktop. List rows are `flex items-center py-3.5` (14px vertical) with a 1px bottom border — so rows are ~54px tall and the lists read as tables. Section gaps are large (~90px between the project list and the Writing heading). On mobile the rows switch from `flex-row` to `flex-col`: the `/` separator is `hidden ... sm:block`, so `Title / Category` becomes title stacked over category, and project rows put the favicon at the left of a two-line block.

- **Navigation:** No navbar. Two lists are the navigation. Post pages replace it with **two 40px circular ghost buttons** at the top edge of the column: a back-arrow on the left, a copy-link icon on the right. Pages: 1 index + 9 writing/work/components posts + `/skills` + `/index.md` + `/api/rss` ≈ 12 routes. Note the URL space is deliberately unstructured — posts live under `/writing/`, `/work/` and `/components/` yet all appear in one "Writing" list.

- **Motion & interaction:**
  - **Hover reveals a chevron** at the end of each row: from `opacity-0 -translate-x-0.5 scale-75` to `opacity-100 translate-x-0 scale-100`, `transition-[opacity,translate,scale] duration-200 ease-out`. Three properties animating together on a 4px journey.
  - The whole hover effect is gated behind a `hover-hover:` variant (`@media (hover: hover)`), so nothing fires on touch — a detail the other sites handle with a `min-width` media query instead.
  - Rows are `group` containers; the title and category themselves don't change, only the chevron arrives. Quieter than the dim-the-siblings pattern used by pqoqubbw and benji.
  - Post pages: section headings are followed by a **hairline rule that fills the remaining column width** on the same baseline, so `## Quality over quantity ————————` reads as a divider and a heading at once. Body demos sit in rounded, hairline-bordered cards.
  - No custom cursor, no page transitions, no scroll-triggered animation.

- **Implied content model:**
  ```
  Profile { name, role, company, avatar, bioRichText (supports inline favicon links
            and mixed-font emphasis), links[{label, url, icon}] }
  Project { name, description (one sentence), url (external or internal),
            favicon/icon }
  Post    { title, category ('Thoughts'|'Animations'|'Colors'|'User Interfaces'),
            slug, section (writing|work|components),
            body (MDX with live demos), footnotes[] }
  Newsletter { heading, description, formAction }
  ```
  `category` carries the weight that a date carries on benji.org — there are **no dates anywhere** in the writing list.

- **What's ABSENT:** No dates on any post. No navbar, no logo mark. No case studies — projects are one-sentence links to live products. No photo of himself (a scribble avatar instead). No résumé, job history table, or client list. No "services" or "available for work". No tags, filters, or search. No pagination. No testimonials. No contact form (a `mailto:` inside a sentence). No hero.

- **Steal-worthy:**
  1. **Favicon-prefixed inline links.** Pulling the destination's own icon into the sentence adds recognition and texture to a plain paragraph at zero design cost, and it makes "I worked at X" scannable.
  2. **`/index.md` in the footer** (plus a proper markdown mirror of the whole site). One underlined link that says "this page is a document, here's the source" — the clearest possible statement of the TLDR thesis, and it's LLM-readable for free.
  3. **One serif italic word in a sans paragraph.** `I care <em serif italic>deeply</em> about craft` — a single-word font switch is the entire ornament budget for the site, and it lands.
  4. **`hover-hover:` gating on every hover affordance**, and a chevron that animates opacity + translate + scale together over 200ms. Reveal-on-hover rather than change-on-hover keeps the resting state perfectly quiet.
  5. Pill input with an inset pill button as the only "component" on the page — one shape, one dark fill, nothing else competes.

---

## Cross-cutting notes

**The shared skeleton.** All four are: name → one-line role → 2-5 paragraph bio with every noun hyperlinked → one or two bordered lists → done. Three of four fit the whole homepage in under 1,900px; pqoqubbw fits in 900px with zero scroll. Word counts cluster at 142-325.

**Flat type is the defining move.** pqoqubbw: everything 16px. benji: everything 14px (h1 included). jakub: everything 16px. Only Austin has a real scale, and it tops out at 28px. Hierarchy comes from color and variable-font weights (460 / 450 / 500 / 550) — half-steps that don't exist in a static font family.

**Warm off-white, never `#fff`.** `#f6f5f3`, `#f5f5f5`, `#fdfdfc`, `#fcfcfc`. Dark mode is split 2-2, and where it exists it is automatic with no toggle.

**Column width is 544-644px.** No one goes wider. Single column on every site; the only grid is Austin's 3×384px media grid.

**Lists are the navigation.** Zero navbars across four sites. Rows are `title / meta` with a 1px bottom border, and the meta is the only thing right-aligned. The back link on a secondary page lives in the left gutter or as a small circular button, never in a header.

**Hover is where all the craft went.** Two sites use identical "dim the siblings to 30%, keep the hovered one at 100%" at 50-140ms; the other two reveal a chevron with a 200-350ms multi-property transition. Every one of them gates the effect behind a hover-capable media query.

**Case studies are extinct.** Not one of the four has a project page with problem/process/outcome. Projects are a name, a one-line description, and an external link — or, on pqoqubbw, four opinionated bullets and a live demo.

**Two are LLM-aware.** pqoqubbw ships `/llms.txt` plus a `.md` variant of every URL behind an `sr-only` notice; jakub links `index.md` in the footer.
