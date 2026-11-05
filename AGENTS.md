# CLAUDE.md


## Archive integration

- **Client:** `keryx`
- **Sync communications:** use the `client-archive-sync` skill

Agent instructions for this repository.

## Before making visual or content changes

Read:
- `DESIGN.md`
- `AGENTS.md`

`DESIGN.md` is the authoritative guide for section treatment, spacing rhythm, image-led cards, background contrast, and the Apple-inspired direction of the site.

## Before changing work content

Treat `resources/work-items.json` as the source of truth.

After editing it, run:

```bash
node scripts/sync-work-content.mjs
npx prettier --write index.html work.md
```

This regenerates:
- the marked featured-work region in `index.html`
- the marked work-carousel region in `index.html`
- `work.md`

Prettier restores the committed wrapping; running only the sync script leaves
single-line attributes across the generated regions.

A work item may carry an optional `caseStudyUrl` (site-relative path, e.g.
`work/motory-group/index.html`; keep it relative and end it at the page file,
not the directory, so local previews that do not serve the repo root or
resolve directory indexes still load it). The generator then renders that featured card as a
link with a "Read the case study" call to action, and adds a case-study line
to `work.md`. Case-study pages live at `work/<client>/index.html` and include
the site header, footer, and scheduling modal.

Avoid manually editing generated work items in `index.html` unless you are also updating the generator.

## Insight pages (`/insights/`)

Short direct-answer pages targeting question queries with repeat GSC demand.
Topics are the operator's call (single-digit impressions are seeds, not a
queue); the first batch, the B1-B4 decisions, and the settled constraints
live in GitHub issue #8 and the handoff it links.

When adding a page:

- `insights/<slug>/index.html`, hand-authored, modeled on the existing pages:
  site chrome with `../../` nav anchors, shared `index.css`/`main.js`,
  og/twitter card, canonical URL, robots meta.
- H1 asks the exact question; the first paragraph under it is the direct
  answer (the snippet/AI-Overview target).
- Three-crumb breadcrumb (`Home › Insights › short page label`) plus a
  matching 3-item BreadcrumbList JSON-LD; the `Insights` crumb links
  `/insights/`. The hub page exists at `insights/index.html`
  (decision reversed 2026-11-05 with 8 pages in the cluster; the original
  retraction was about a blog-post index that duplicated the Substack
  archive, which an insights hub does not).
- Cross-link sibling pages only where topically real; link a blog post only
  where one genuinely covers the topic (weak links are noise).
- The same change updates the mirrors: one `<url>` per page in `sitemap.xml`,
  a line in the `## Insight answers` section of `llms.txt`, and a row
  (question + one-line answer) on the `/insights/` hub page.
- Copy is net-new only: blog.keryxsolutions.com is the canonical full-text
  home; never copy or near-copy post text onto the main site (Substack cannot
  set outbound rel=canonical). Copy follows the Keryx writing style guide
  (keryxsolutions repo: `docs/business/writing-style-guide.md`): em-dash-free,
  slop-checked before commit.
- Format touched HTML with `npx prettier --write <files>`; committed HTML is
  prettier-clean.
