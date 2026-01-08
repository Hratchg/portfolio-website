# Design Guidelines: Hratch Ghanime Portfolio

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern developer portfolios (Linear, Vercel, GitHub profiles) - clean, content-focused, technically sophisticated.

**Key Principles**: Clarity over decoration, purposeful whitespace, technical professionalism with creative touches.

---

## Typography System

**Font Stack**: 
- Headings: Inter (600-700 weight) via Google Fonts
- Body: Inter (400-500 weight)
- Code/Tech Tags: JetBrains Mono (400 weight)

**Hierarchy**:
- Hero Name: text-5xl to text-7xl (responsive)
- Section Headings: text-3xl to text-4xl
- Subsection Headings: text-xl to text-2xl
- Body Text: text-base to text-lg
- Metadata/Tags: text-sm

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16, 20, 24** for consistent rhythm.

**Container Strategy**:
- Max-width: `max-w-6xl` for main content sections
- Section padding: `py-16 md:py-24` for vertical breathing room
- Component spacing: `gap-8 md:gap-12` for grids

**Grid Patterns**:
- Projects: 1 column mobile → 2 columns tablet → 3 columns desktop
- Skills: 2 columns mobile → 4 columns desktop
- Experience: Single column timeline throughout

---

## Component Library

### Navigation
- Sticky header with backdrop blur effect
- Logo/name on left, nav links center-right, dark mode toggle far right
- Smooth scroll behavior to sections
- Height: `h-16` with `px-6` horizontal padding

### Hero Section
- Full viewport height (`min-h-screen`) with centered content
- Subtle gradient background (NOT image - code/tech aesthetic)
- Name + tagline stack with `space-y-4`
- Button group with `gap-4`, primary + secondary + icon-only styles
- Floating geometric shapes or grid pattern as background decoration

### Project Cards
- Elevated cards with subtle border and hover lift effect
- Card structure: Image placeholder → Title → Description (2-3 lines) → Tech tags row → Action buttons row
- Padding: `p-6`
- Tech tags: Pill-shaped with monospace font, `gap-2` wrapping
- Filter buttons: Tab-style UI above grid
- Search box: Clean input with icon, `mb-8` before grid

### Skills Section
- Category headings with accent underline
- Pills layout with subtle background, `gap-2` wrapping
- Group spacing: `space-y-8` between categories

### Timeline (Experience)
- Left border line connecting items
- Each entry: Circle marker → Date badge → Title/Org → Bullets
- Entry spacing: `space-y-12`

### Contact Form
- Two-column layout: Form on left (60%), contact links on right (40%)
- Input styling: Minimal borders, focus states with subtle glow
- Form spacing: `space-y-4` for fields
- Submit button: Primary style, full-width on mobile

### Footer
- Clean single row with copyright left, social icons right
- Padding: `py-8`, subtle top border

---

## Interactive Elements

**Animations** (subtle, performance-focused):
- Navbar: Fade in on scroll, hide on scroll down
- Section reveals: Stagger fade-up on viewport entry (use intersection observer)
- Card hovers: Translate up 2-4px + shadow increase
- Button hovers: Scale 1.02 + brightness adjustment
- Dark mode toggle: Smooth theme transition (200ms)

**States**:
- Hover: Defined for all interactive elements
- Focus: Visible focus rings for accessibility
- Active project filter: Emphasized with accent treatment

---

## Accessibility Standards

- Semantic HTML5 tags (`<nav>`, `<main>`, `<section>`, `<article>`)
- Proper heading hierarchy (single `<h1>` for name)
- ARIA labels for icon-only buttons
- Focus visible on all interactive elements
- Form inputs with associated `<label>` elements
- Alt text placeholders for project images
- Color contrast ratios meeting WCAG AA standards

---

## Dark Mode Strategy

- System preference detection by default
- Manual toggle persists in localStorage
- Color scheme affects: backgrounds, text, borders, cards, and accents
- Smooth transitions between modes
- Ensure sufficient contrast in both modes

---

## Images

**Hero Section**: NO large background image. Use gradient + geometric code-themed decorative elements (grid lines, floating brackets, subtle particles).

**Project Cards**: Each includes a project thumbnail/preview image (16:9 aspect ratio, rounded corners). These should be prominent visual anchors for each card.

**Placement**: Project images at top of each card, `aspect-video` with `object-cover`.

---

## Special Features

**Featured Projects**: Top 2-3 projects in larger cards before main grid, spanning 2 columns on desktop.

**Filter + Search**: Horizontal filter tabs + search input in single row on desktop, stacked on mobile. Real-time filtering with smooth transitions.

**Scroll Progress**: Thin progress bar at top of page showing read position.

**Smooth Navigation**: Offset scroll to account for sticky header height.