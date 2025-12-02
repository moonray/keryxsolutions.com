# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static marketing website for Keryx Solutions built with vanilla HTML, CSS, and JavaScript. The site is a single-page application featuring a hero section, services showcase with horizontal scrolling cards, an about section with founder profile, and a contact modal with Google Calendar integration.

## Architecture

### Structure
- **index.html**: Single HTML file containing all page structure and inline JavaScript
- **index.css**: All styling with CSS custom properties for theming and responsive breakpoints
- **resources/**: Image assets for profile, service cards, and data files
  - **work-items.json**: Portfolio data for Our Work gallery (see Data Files section below)
- **../keryxsolutions/docs/**: Documentation stored in parent directory

### Key Components

**Header (Fixed Navigation)**
- Glassmorphic header with blur effect
- Logo and navigation links
- CTA button that opens appointment modal

**Hero Section**
- Full-viewport hero with gradient background overlay
- Typography system using CSS custom properties for responsive scaling
- Intersection Observer-based fade-in animations

**Our Work Gallery**
- Apple-esque horizontal scrolling portfolio showcase with 16:10 aspect ratio cards (1280:800)
- Data loaded from `resources/work-items.json` via fetch API (index.html:489-501)
- Images stored in `resources/` directory for self-contained deployment
- Infinite scrolling carousel: navigating past last item loops to first, and vice versa
- **Centered card view**: Current card centered with previous/next cards partially visible on sides
- Snap scrolling (`scroll-snap-align: center`) with paddle navigation controls (buttons never disabled)
- Dynamic padding: `calc((100vw - cardWidth) / 2)` centers cards and shows adjacent cards
- Card layout: title/client positioned top-left, services/stack positioned bottom-left
- Cards feature background images from resources/, gradient overlays for text legibility
- Reuses shared setupCarousel helper with `infinite: true` parameter
- Content data sourced from work-items.json (originally from ../keryxsolutions/docs/work-*.md)
- Card dimensions maintain 1.6:1 ratio across breakpoints:
  - Desktop: 800px × 500px
  - Tablet: 640px × 400px
  - Mobile: 360px × 225px
  - Small mobile: 320px × 200px

**Tech Showcase (Services)**
- Horizontal scrolling gallery with snap points
- Paddle navigation buttons (prev/next) with disabled state management
- Cards with background images loaded via data-image attributes
- Custom scrollbar styling and scroll container padding

**About Section**
- Profile image with custom positioning
- Two-column bio text layout (responsive to single column on mobile)
- Gradient background transitioning from secondary to primary

**Contact Modal**
- Embedded Google Calendar appointment scheduler iframe
- Modal controls with backdrop blur and click-outside-to-close
- Escape key handler for accessibility

### JavaScript Functionality

All JavaScript is inline in index.html:

1. **Intersection Observer**: Triggers fade-in animations when elements enter viewport
2. **Smooth Scrolling**: Anchor link navigation with nav height offset
3. **Horizontal Scroll Gallery**: Card-by-card scrolling with button state management
4. **Modal System**: Open/close handlers with body scroll lock
5. **Dynamic Backgrounds**: Sets card background images from data-image attributes on page load

## Styling System

**CSS Custom Properties (index.css:1-75)**
- Color palette based on "Sea from Space" theme
- Font size variables with clamp() for responsive typography
- Gallery-specific variables for viewport content and side padding

**Typography Classes**
- `.headline-hero`: 6rem, used for main hero heading
- `.headline-large`: Clamp 2-3rem, used for section headings
- `.headline-medium`: Clamp 1.5-2.25rem, used for card titles
- `.body-large`: 1.25rem, used for hero subtext
- `.body-medium`: 1.125rem, used for body content

**Responsive Breakpoints**
- Desktop: 1024px+
- Tablet: 641px - 1023px (index.css:702-775)
- Mobile: up to 640px (index.css:778-967)
- Small mobile: up to 480px (index.css:970-1014)

## Data Files

### work-items.json
Portfolio entries for the Our Work gallery. Each entry has the following structure:
```json
{
  "id": "unique-slug",
  "project": "Project Name",
  "client": "Client Name",
  "services": "Comma-separated list of services",
  "stack": "Platform & Stack: Technology description",
  "image": "resources/image.png"
}
```

**To add/update portfolio items:**
1. Add images to `resources/` directory (copy from original sources)
2. Edit `resources/work-items.json` with new entry
3. Image paths should be relative from index.html location: `resources/filename.png`
4. All images must be within the site directory structure (no external paths)
5. Changes appear immediately on page refresh (no build step)

**Current portfolio:**
All 18 projects from both work-chapterthree.md and work-graviteklabs.md are included:
- **6 projects** from Chapter Three work (MemorialCare, Stanford, Nexant, CooperVision, Ixia, 8x8)
- **12 projects** from Gravitek Labs work (Frontline Solvers, Digital Detail, WELS, Edutopia, Roy Orbison, Sir Mix-a-lot, Glee, Ke$ha, Foo Fighters, WBR Nashville, Mario, Shape.com)

**Images:**
- 10 projects use actual project images (copied from docs directories)
- 8 projects use placeholder images from card-*.png files (for projects without available images)
- All images stored in `resources/` for self-contained deployment

## Development

### Viewing the Site
Open index.html directly in a browser or use a local server:
```bash
python -m http.server 8000
# or
npx http-server
```

### No Build Process
This is a static site with no dependencies or build step. Changes to index.html or index.css are immediately reflected on refresh.

### Git Workflow
The repository uses standard git with a main branch. CNAME file exists for custom domain hosting.

## Implementation Patterns

**Modal Integration**: The appointment modal uses Google Calendar's embeddable appointment scheduling. To update the calendar link, modify the iframe src at index.html:224.

**Shared Carousel System**: Both the Tech Showcase and Our Work galleries use a shared `setupCarousel()` helper function (index.html:319-442) that handles scroll amount calculation, paddle button states, and smooth scrolling. This function accepts a config object with scrollContainer, cardContainer, leftBtn, rightBtn, cardSelector, defaultScrollAmount, and optional `infinite` boolean. When `infinite: true`, the carousel loops from last to first and first to last, and paddle buttons are never disabled. This pattern avoids code duplication while keeping each gallery's selectors scoped.

**Our Work Gallery - Data Loading**: Portfolio data is stored in `resources/work-items.json` and loaded asynchronously via the `loadWorkItems()` function (index.html:489-501). Each item includes id, project, client, services, stack, and image path. The `renderWorkGallery()` function (index.html:467-486) generates card markup with separate top and bottom content containers for precise positioning. Cards maintain 16:10 aspect ratio (800×500px desktop) and use stronger gradient overlays on mobile for text readability.

**Infinite Scrolling Pattern**: The work gallery implements infinite scrolling by tracking the current index and total items. When the user clicks "previous" on the first item, it jumps to the last item; clicking "next" on the last item jumps to the first. This is handled entirely in JavaScript without DOM manipulation—the `scrollToIndex()` function calculates the scroll position based on card width + gap. The services carousel does not use infinite scrolling (infinite: false by default).

**Tech Showcase Gallery**: Uses CSS scroll-snap-type with JavaScript paddle buttons. Card width (372px) + gap (20px) = 392px scroll amount. Gallery side padding is calculated based on viewport width to center content.

**Animation System**: Elements with `.fade-in` class are observed via IntersectionObserver. When visible, `.visible` class is added triggering CSS transitions. Stagger classes (`.stagger-1`, `.stagger-2`, `.stagger-3`) add progressive delays.

**Responsive Images**: Profile and card images use background-image CSS with different background-position-x and background-size values per breakpoint for art direction control.
