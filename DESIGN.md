# DESIGN.md

Design guidance for `keryxsolutions.com`.

This file exists to help future agents and collaborators create or modify content in a way that stays aligned with the current visual direction of the site. It follows the spirit of Google's Stitch `DESIGN.md` guidance: give explicit design intent, not just code structure.

## Product and aesthetic reference

The site is a high-trust consulting homepage with a strong Apple-inspired visual language.

Primary references:
- Apple product marketing pages such as `apple.com/mac/`
- Apple business storytelling sections such as `apple.com/business/`

Interpretation for Keryx:
- clean, confident, high-contrast layout
- strong typography doing most of the work
- restrained section count
- large rounded cards
- real imagery preferred over abstract gradients for feature blocks
- obvious visual separation between major sections

## Core visual rules

### 1. Section hierarchy

Use a clear rhythm between sections. Each major section should feel distinct.

Preferred pattern:
- light hero
- dark feature/storytelling section
- lighter proof section
- lighter FAQ / conversion sections

Avoid placing two visually similar sections back to back unless the content is intentionally grouped.

### 2. Section intros

Section headings should generally be followed by supporting copy **below** the title, not aligned side-by-side.

Preferred pattern:
- heading
- 1 supporting paragraph below
- cards / carousel / content block below that

Avoid split heading-copy layouts unless there is a strong reason.

### 3. Feature cards

For premium storytelling sections, prefer:
- real images
- dark overlays for legibility
- large rounded corners
- large headline text
- short supporting paragraph

Do **not** use generic gradients when image-led cards are available.

### 4. Labels and micro-headings

Do not introduce extra eyebrow labels by default.

If a card needs a small label, it should feel like the existing site language:
- sentence case or title case
- compact, clear, human
- not AI-ish
- not tiny small-caps metadata

Avoid patterns like:
- overly editorial eyebrow text above every section
- small-caps category tags that feel disconnected from the rest of the site

### 5. Typography tone

The site copy should feel:
- senior
- practical
- plainspoken
- confident
- not salesy
- not startup-hype

Avoid:
- filler adjectives
- generic innovation language
- long multi-clause marketing abstractions

## Section-specific guidance

### Hero
- clean light background
- oversized headline
- short explanatory paragraph
- no clutter

### Expertise section (`#expertise`)
This is the main premium storytelling section.

Requirements:
- dark section background
- large image-led cards
- strong headline hierarchy
- supportive paragraph under the section title
- cards should feel closer to Apple feature tiles than to generic marketing boxes

### Our Work section (`#our-work`)
This is proof and portfolio, not the premium storytelling block.

Requirements:
- lighter background than the expertise section
- obvious contrast from the section above it
- work content must be present in static HTML for resilience and agent readability
- visual treatment should stay more neutral than the expertise section
- the `Recent Keryx Projects` block should remain a static featured-card grid above the broader work carousel
- featured cards should keep the current iPad-framed image treatment rather than reverting to generic thumbnails
- secondary featured cards should keep their device/image blocks bottom-aligned so uneven image heights do not float upward
- the lead featured card should preserve matching horizontal inset around the device on desktop
- portrait iPad devices in the featured-work treatment should keep `padding-top: 0`
- the lead featured-card copy should preserve the inherited padding rhythm; on desktop, remove only the left padding rather than overriding all padding

### How we work (`#services`)
- light section
- standardized vertical spacing
- intro copy directly under title
- cards remain horizontally scrollable

### FAQ (`#faq`)
The FAQ should feel Apple-adjacent:
- large stacked rounded cards
- generous padding
- subtle shadows
- big readable question text
- minimal chrome
- no unnecessary eyebrow labels

Avoid cramped accordion styling or tiny utility-looking rows.

## Spacing system

Default section rhythm:
- mobile: around `4rem` vertical padding for major sections
- tablet/desktop: around `5rem` vertical padding for major sections

Within a section:
- heading to supporting copy: compact
- intro block to cards/content: generous
- card internal spacing: generous, never cramped

When in doubt, choose consistency over novelty.

## Color and contrast

Primary colors already established in CSS variables.

Guidance:
- use dark navy sections for premium contrast moments
- use soft gray / white for supporting sections
- gold remains accent, not dominant surface color
- text contrast should remain excellent at all times

## Imagery guidance

Prefer existing local assets from `resources/` when they fit.

For feature cards, current acceptable images include:
- `resources/architecture-modernization.jpg`
- `resources/ai-applied-carefully.jpg`
- `resources/product-engineering.jpg`
- `resources/technical-leadership.jpg`
- `resources/card-solutions.jpg`
- `resources/card-user-experience.jpg`
- `resources/card-standards.png`
- `resources/card-scalable.jpg`
- `resources/card-ai.jpg`

Use overlays when needed for readability.

### Imagery art direction

For premium storytelling cards, the image language should match the existing Apple-inspired direction used across the site.

Requirements:
- photographic, not illustrative
- premium commercial or editorial feel
- realistic people, materials, and environments
- minimal composition with one clear focal subject
- uncluttered backgrounds
- no logos or visible brand marks
- no text baked into the image
- realistic lighting with soft depth of field
- dark-enough tonal range that white overlay copy remains legible
- calm, high-trust mood rather than energetic startup hype

Preferred palette and lighting:
- dark neutrals, navy, gray, charcoal, and warm natural materials
- restrained warm highlights with cooler shadows
- subtle contrast, not oversaturated color
- polished but believable lighting

Composition constraints for card use:
- subject centered or slightly above center
- preserve calmer negative space in the lower third for overlaid text
- avoid placing important facial details exactly where the copy will sit
- generate at high resolution so the image can be cropped flexibly into rounded cards

Subject matter guidance for the expertise section:
- `Architecture & modernization` should feel like simplification, systems thinking, and technical clarity
- `AI, applied carefully` should feel practical, grounded, and judgment-driven rather than futuristic
- `Product engineering` should feel detail-oriented, polished, and human-centered
- `Technical leadership` should feel hands-on, calm, and credible rather than corporate or executive-staged

Avoid:
- handshake imagery
- conference-room stock-photo clichés
- holograms, robots, glowing AI brains, or cyberpunk motifs
- generic abstract gradients when strong photography is available
- over-busy scenes that compete with the text overlay

## Content generation and source of truth

The work content is static-first in HTML for resilience and agent-readiness, but the **authoring source** should remain structured data.

Source of truth:
- `resources/work-items.json`

Generated outputs:
- the marked featured-work region in `index.html` (`FEATURED_WORK_START` / `FEATURED_WORK_END`)
- the marked work-carousel region in `index.html` (`WORK_CAROUSEL_START` / `WORK_CAROUSEL_END`)
- `work.md`

Do not manually edit generated regions if the sync script is available.

## Maintenance workflow

When adding or changing work items:
1. edit `resources/work-items.json`
2. run `scripts/sync-work-content.mjs`
3. review the diff in `index.html` and `work.md`, including both the featured cards and the carousel slides

## Reusable components

### Device frame (`.ipad-device`)

The current featured-work implementation uses the `.ipad-device` family rather than the older `.ipad-chassis` structure. Keep future work aligned with the existing SVG-frame contract unless the component is intentionally redesigned.

Usage (portrait featured card):
```html
<div class="ipad-device ipad-device--portrait ipad-device--half" aria-hidden="true">
  <img class="ipad-screenshot" src="..." alt="" loading="lazy" />
</div>
```

Usage (landscape variant when needed):
```html
<div class="ipad-device ipad-device--landscape" aria-hidden="true">
  <img class="ipad-screenshot" src="..." alt="" loading="lazy" />
</div>
```

Current contract:
- `.ipad-device--portrait` and `.ipad-device--landscape` use SVG frame overlays from `resources/ipad-frame-portrait.svg` and `resources/ipad-frame-landscape.svg`
- `.ipad-screenshot` should remain the only image element inside the device wrapper
- the `--half` variant is used in featured-work cards to crop the device while preserving the frame treatment
- featured-work cards should keep white card backgrounds and neutral surfaces
- preserve the current proportions and framing unless the device treatment is being intentionally redesigned across the section

## Anti-patterns to avoid

- adding new decorative eyebrow text everywhere
- using gradient-only feature cards when better images already exist
- placing adjacent sections on nearly identical backgrounds
- side-by-side heading / intro layouts that break the established rhythm
- introducing runtime-only content when static content is possible
- manually editing generated featured-work or work-carousel markup if JSON is intended to stay canonical

## Quick checklist for future edits

Before finalizing any major visual/content change, confirm:
- Does the section clearly differ from the one before it?
- Is the supporting copy below the heading unless there is a strong reason otherwise?
- Are feature cards image-led and legible?
- Do labels feel like the original site language rather than utility metadata?
- Is the copy practical and specific?
- If portfolio data changed, was it updated from `work-items.json` and synced?
