# tldr-felipe-bueno

The short version of [felipe-bueno.com](https://felipe-bueno.com): one page, in English,
that says who I am and what I build in about fifteen seconds. It lives at
`tldr.felipe-bueno.com`, beside the full site, and reads from the same Contentful space.

Roughly 115 words. Two routes. No JavaScript on the page.

## How it works

SvelteKit reads Contentful at build time and writes static HTML. The delivery token exists
only during the build, so nothing runs on a server afterwards and there is no runtime secret
to leak. Content changes reach the site through a Contentful webhook that triggers a rebuild.

Two sections disappear on their own when Contentful has nothing to show: the availability
line and Writing, which queries the three most recent published blog posts instead of holding
a curated list. Writing has no posts yet, so the section is absent.

Every visible string is an override written for this page. An entry it points at, a `project`
or a `blogPost`, supplies the URL and nothing else.

## Stack

| | |
|---|---|
| Framework | SvelteKit 2.70, Svelte 5 with runes |
| Build | `adapter-static`, `prerender = true`, `csr = false` |
| Content | Contentful, types `tldrProfile` and `tldrRow` in the `master` environment |
| Hosting | Vercel, rebuilt by two Contentful webhooks |
| Type | Inter variable, one weight axis, four half-weights carrying the hierarchy |

## Running it

```sh
npm install
cp .env.example .env.local   # fill in the space id and a delivery token
npm run dev
```

`npm run build` writes `build/`, and `npm run preview` serves it. Both read Contentful, so
both need the two variables.

## Layout

| Path | What it is |
|---|---|
| `src/lib/server/contentful.ts` | Every read from Contentful, and the only place that knows its shape |
| `src/lib/components/Row.svelte` | The row primitive: label, detail, right-hand metadata, link |
| `src/app.css` | The whole design, global on purpose |
| `contentful/migrations/` | The content model, additive, prefixed `tldr*` |
| `contentful/seed-tldr.mjs` | The page copy as data. Idempotent: rerunning rewrites, never duplicates |
| `.scratch/tldr-site/` | The map and nine tickets, one decision each. Start at `map.md` |
| `research/references/` | 16 personal sites studied with a browser agent, and 56 screenshots |
| `prototype/` | Five visual directions in one HTML file, switchable with `?variant=` |

## Where the decisions are

Read [`.scratch/tldr-site/map.md`](.scratch/tldr-site/map.md). Each line under "Decisions so
far" links to the ticket holding the reasoning: why static instead of ISR, why one row type
rather than four, why the page carries no analytics, why `noindex`.

The design comes from variant E of `prototype/visual-directions.prototype.html`. Open it in
a browser and use the arrow keys.
