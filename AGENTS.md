# CLAUDE.md

Agent instructions for this repository.

## Before making visual or content changes

Read:
- `DESIGN.md`
- `AGENTS.md`

`DESIGN.md` is the authoritative guide for section treatment, spacing rhythm, image-led cards, background contrast, and the Apple-inspired direction of the site.

## Before changing the work carousel

Treat `resources/work-items.json` as the source of truth.

After editing it, run:

```bash
node scripts/sync-work-content.mjs
```

This regenerates:
- the marked work carousel region in `index.html`
- `work.md`

Avoid manually editing generated work items in `index.html` unless you are also updating the generator.
