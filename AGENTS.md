# GEMINI.md

This file provides guidance to Gemini when working with code in this repository.

## Project Overview

This is a static marketing website for Keryx Solutions built with vanilla HTML, CSS, and JavaScript. The site is a single-page application featuring a hero section, services showcase with horizontal scrolling cards, an about section with founder profile, and a contact modal with Google Calendar integration.

## Architecture

### Structure
- **index.html**: Single HTML file containing page structure and loading external resources
- **index.css**: All styling with CSS custom properties for theming and responsive breakpoints
- **main.js**: Contains all client-side logic, event listeners, and dynamic content rendering
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
- **Powered by Embla Carousel**: Robust, touch-enabled carousel with infinite looping (`loop: true`)
- Data loaded from `resources/work-items.json` via fetch API in `main.js`
- Images stored in `resources/` directory
- **Carousel Features**:
  - Smooth alignment (`align: "center"`) and snapping (`containScroll: "trimSnaps"`)
  - Mouse wheel navigation support with smooth momentum scrolling
  - Paddle navigation buttons (prev/next)
- **Dynamic Rendering**: JavaScript generates card markup with standard `embla__slide` structure
- Cards feature project image, title, client, services, and stack details
- Card dimensions and layout handled via CSS within the Embla slides

**Tech Showcase (Services)**
- Horizontal scrolling gallery using custom JavaScript implementation (`setupCarousel`)
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

All JavaScript logic is located in `main.js`:

1. **Intersection Observer**: Triggers fade-in animations when elements enter viewport
2. **Smooth Scrolling**: Anchor link navigation with nav height offset
3. **Services Gallery**: Custom horizontal scroll logic with button state management
4. **Work Gallery**: Embla Carousel initialization, data fetching, and rendering
5. **Modal System**: Open/close handlers with body scroll lock
6. **Dynamic Backgrounds**: Sets card background images from data-image attributes on page load

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
This is a static site with no dependencies or build step. Changes to index.html, index.css, or main.js are immediately reflected on refresh.

### Git Workflow
The repository uses standard git with a main branch. CNAME file exists for custom domain hosting.

## Implementation Patterns

**Modal Integration**: The appointment modal uses Google Calendar's embeddable appointment scheduling. To update the calendar link, modify the iframe src at index.html.

**Carousel Implementations**:
- **Work Gallery**: Uses [Embla Carousel](https://www.embla-carousel.com/) for a robust, touch-friendly infinite slider. Logic in `initWorkGallery` (main.js).
- **Services Gallery**: Uses a lightweight custom implementation (`setupCarousel` in main.js) that handles simple horizontal scrolling with snap points and button states.

**Our Work Gallery - Data Loading**: Portfolio data is stored in `resources/work-items.json` and loaded asynchronously via `loadWorkItems()` in `main.js`. The `renderWorkGallery()` function generates the slide markup needed for Embla Carousel.

**Animation System**: Elements with `.fade-in` class are observed via IntersectionObserver. When visible, `.visible` class is added triggering CSS transitions. Stagger classes (`.stagger-1`, `.stagger-2`, `.stagger-3`) add progressive delays.

**Responsive Images**: Profile and card images use background-image CSS with different background-position-x and background-size values per breakpoint for art direction control.
