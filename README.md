# tldr-felipe-bueno

The spec for `tldr.felipe-bueno.com`, a one-page version of
[felipe-bueno.com](https://felipe-bueno.com).

The site is not built yet. This repo holds the decisions that come before the code.

## What's here

| Path | What it is |
|---|---|
| `.scratch/tldr-site/` | The map and its eight tickets, one decision each |
| `research/references/` | 16 personal sites studied with a browser agent, plus 56 screenshots |
| `research/sveltekit-contentful.md` | What SvelteKit and the Contentful SDK actually do |
| `prototype/` | Five visual directions in one HTML file, switchable with `?variant=` |
| `contentful/migrations/` | The content model, written and not yet run |
| `static/` | Favicon |
| `CONTEXT.md` | The glossary |

## Start here

Open `.scratch/tldr-site/map.md`. Every line under "Decisions so far" links to the
ticket that holds the reasoning behind it.

To see the visual directions, open `prototype/visual-directions.prototype.html` in a
browser. Arrow keys switch between them. `E` is the one that won.

## The shape of the thing

One page. No internal routes. Roughly 115 words of English, read from the same
Contentful space the full site uses. SvelteKit, prerendered to static HTML, with no
JavaScript on the page.
