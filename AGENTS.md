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

A work item may carry an optional `caseStudyUrl` (root-relative path, e.g.
`/work/motory-group/`). The generator then renders that featured card as a
link with a "Read the case study" call to action, and adds a case-study line
to `work.md`. Case-study pages live at `work/<client>/index.html` and include
the site header, footer, and scheduling modal.

Avoid manually editing generated work items in `index.html` unless you are also updating the generator.
