# Health App - Design Document

*Generated from mockup HTML files and implementation documentation*

---

## Table of Contents

1. [Overview](#overview)
2. [Design System & Color Palette](#design-system--color-palette)
3. [Typography](#typography)
4. [Animations & Motion](#animations--motion)
5. [Mockup Components](#mockup-components)
6. [Layout & Spacing](#layout--spacing)
7. [Component Specifications](#component-specifications)

---

## Overview

The Health & Fitness App is a Progressive Web App (PWA) built with Vite + React + TypeScript. It provides workout planning, nutrition tracking, analytics, and a gamified squad experience - all running on a raspberry pi (explained in [`raspberry-pi-hosting`](./raspberry-pi-hosting.md))

### Key Principles
- **Mobile-first design** with responsive desktop adaptation
- **Strict color palette adherence** for brand consistency
- **Server-backed architecture** — Go + SQLite API, no browser-local storage
- **Visual feedback** through smooth animations and transitions

---

## Design System & Color Palette

### CSS Variable Definitions

All colors are defined as Tailwind v4 `@theme` custom properties in
`frontend/src/index.css`, mirroring the palette in `docs/humans/design/colors.md`:

```css
@theme {
  --color-sea-bright: #6aa6ae;
  --color-sea-text: #185661;
  --color-sea-dark: #0a3c45;

  --color-forest-bright: #437456;
  --color-forest-text: #156b44;
  --color-forest-dark: #0e341f;

  --color-leaf-bright: #e4eebc;
  --color-leaf-text: #adbf73;
  --color-leaf-dark: #697948;

  --color-pinkish-bright: #efd6d2;
  --color-pinkish-text: #d2968d;
  --color-pinkish-dark: #b69a96;

  --color-mist: #e2ecd8;
}
```

### Complete Palette Reference

| Family | Bright (UI Elements) | Text (Default) | Dark (Deep/Accent) | Usage |
|--------|---------------------|----------------|--------------------|-------|
| **Sea** | `sea-bright` `#6aa6ae` | `sea-text` `#185661` | `sea-dark` `#0a3c45` | Primary buttons, active states |
| **Forest** | `forest-bright` `#437456` | `forest-text` `#156b44` | `forest-dark` `#0e341f` | Secondary buttons, success states, icons |
| **Leaf** | `leaf-bright` `#e4eebc` | `leaf-text` `#adbf73` | `leaf-dark` `#697948` | Progress backgrounds, neutral accents |
| **Pinkish** | `pinkish-bright` `#efd6d2` | `pinkish-text` `#d2968d` | `pinkish-dark` `#b69a96` | Alert backgrounds, warning states |
| **Mist** | `mist` `#e2ecd8` | — | — | Card backgrounds, light containers |

### Card Background Variants

```css
/* Card backgrounds use light tone variants */
.card-light { background-color: var(--color-card-light); }
.card-medium { background-color: var(--color-card-medium); }
.card-dark { background-color: var(--color-card-dark); }

/* Footer/primary containers */
.footer-bg { background-color: var(--color-card-dark); }

/* Button backgrounds (bright tones) */
.btn-primary { background-color: var(--color-sea-blue); }
.btn-success { background-color: var(--color-forest-green); }
.btn-warning { background-color: var(--color-pinkish); }
```

---

## Typography

### Font Family

Primary typeface: **Inter** from Google Fonts

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
```

### Font Weight Scale

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | `400` | Body text, labels |
| Medium | `500` | Headings, prominent text |
| Semi-bold | `600` | Section headers, labels |
| Bold | `700` | Primary headings, buttons |

### Suggested Scale

```css
h1 { font-size: 2rem; font-weight: 700; line-height: 1.2; }
    /* App title, hero sections */

h2 { font-size: 1.5rem; font-weight: 600; line-height: 1.3; }
    /* Section headers */

h3 { font-size: 1.25rem; font-weight: 600; line-height: 1.4; }
    /* Card titles, modal headers */

h4 { font-size: 1.125rem; font-weight: 500; line-height: 1.4; }
    /* Section subtitles */

body { font-size: 1rem; font-weight: 400; line-height: 1.6; }
    /* Body copy */

label { font-size: 0.875rem; font-weight: 500; }
    /* Form labels */
```

### Color Application

```css
.text-primary { color: var(--color-text-primary); }
.text-muted { color: var(--color-text-muted); }
.text-secondary { color: var(--color-text-secondary); }
```

---

## Animations & Motion

### Keyframe Animations

#### fade-in

```css
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Usage */
.fade-in { animation: fade-in 0.3s ease-out forwards; }
```

#### slide-up-fade

```css
@keyframes slide-up-fade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Usage */
.slide-up-fade { animation: slide-up-fade 0.4s ease-out forwards; }
```

#### bounce-in

```css
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Usage */
.bounce-in { animation: bounce-in 0.5s ease-out forwards; }
```

### Transition Utilities

```css
/* Default transitions */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Specific property transitions */
.transition-opacity {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-transform {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Button hover effects */
.btn-hover {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### Animation Classes

```css
/* Delayed animations for staggered effects */
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }

/* Hide animation */
.animate-hide {
  animation: fade-out 0.2s ease-out forwards;
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
```

---

## Mockup Components

### Dashboard Components

#### 1. Protein Ring Progress Indicator

**Purpose**: Visual daily protein target progress tracker

**Structure**:
```html
<div class="protein-ring-container">
  <svg viewBox="0 0 100 100" class="ring-svg">
    <!-- Gradient definition -->
    <defs>
      <linearGradient id="proteinGradient">
        <stop offset="0%" stop-color="var(--color-sea-blue)"></stop>
        <stop offset="100%" stop-color="var(--color-forest-green)"></stop>
      </linearGradient>
    </defs>
    
    <!-- Background track -->
    <circle 
      cx="50" cy="50" r="42" 
      fill="none" 
      stroke="var(--color-card-light)" 
      stroke-width="8"
    />
    
    <!-- Progress arc -->
    <circle 
      cx="50" cy="50" r="42" 
      fill="none" 
      stroke="url(#proteinGradient)" 
      stroke-width="8"
      stroke-dasharray="264" 
      stroke-dashoffset="90" 
      stroke-linecap="round"
    />
    
    <!-- Current value -->
    <text x="50" y="55" text-anchor="middle" font-size="12" font-weight="700">
      65g
    </text>
  </svg>
  <div class="ring-label">Protein</div>
</div>
```

**CSS**:
```css
.protein-ring-container {
  position: relative;
  display: inline-block;
}

.ring-svg {
  width: 100px;
  height: 100px;
}

/* Tailwind equivalent */
.ring-svg {
  @apply w-24 h-24 rounded-full;
}

.progress-circle {
  @apply stroke-[2px] stroke-dasharray-[264] stroke-dashoffset-90;
}

/* Value text */
.ring-value {
  @apply text-sm font-bold text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
}
```

#### 2. Statistics Card

**Purpose**: Display single metric with visual progress

```html
<div class="stats-card">
  <div class="card-header">
    <span class="card-icon">🥩</span>
    <h3 class="card-title">Protein</h3>
  </div>
  <div class="card-value">65g</div>
  <div class="card-progress">
    <div class="progress-bar">
      <div class="progress-fill" style="width: 65%;"></div>
    </div>
    <span class="progress-text">Target: 100g</span>
  </div>
</div>
```

**CSS**:
```css
.stats-card {
  background-color: var(--color-card-light);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.card-icon {
  font-size: 1.5rem;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.card-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.progress-bar {
  height: 6px;
  background-color: var(--color-card-dark);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-sea-blue), var(--color-forest-green));
  border-radius: 3px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Fitness Components

#### 1. Workout Card

**Purpose**: Display workout routine details

```html
<div class="workout-card">
  <div class="card-header">
    <span class="workout-badge">Upper Body</span>
    <h3 class="workout-title">Chest Day</h3>
  </div>
  <div class="workout-meta">
    <span class="meta-item">⏱ 45 min</span>
    <span class="meta-separator">•</span>
    <span class="meta-item">🔥 15 sets</span>
  </div>
  <div class="workout-exercises">
    <div class="exercise-item">
      <span class="exercise-name">Bench Press</span>
      <span class="exercise-reps">4 × 8</span>
    </div>
    <div class="exercise-item">
      <span class="exercise-name">Incline Dumbbell</span>
      <span class="exercise-reps">3 × 10</span>
    </div>
    <div class="exercise-item">
      <span class="exercise-name">Tricep Pushdowns</span>
      <span class="exercise-reps">3 × 12</span>
    </div>
  </div>
  <button class="btn-workout">Start Workout</button>
</div>
```

**CSS**:
```css
.workout-card {
  background-color: var(--color-card-light);
  border-radius: 12px;
  padding: 16px;
}

.workout-badge {
  display: inline-block;
  background-color: var(--color-sea-blue);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
}

.workout-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 8px 0 4px 0;
}

.workout-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  margin-bottom: 12px;
}

.workout-exercises {
  margin-bottom: 12px;
}

.exercise-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-text-secondary);
}

.exercise-item:last-child {
  border-bottom: none;
}

.exercise-name {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.exercise-reps {
  color: var(--color-text-secondary);
  font-size: 0.75rem;
}

.btn-workout {
  width: 100%;
  padding: 12px;
  background-color: var(--color-forest-green);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-workout:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 107, 68, 0.3);
}
```

---

## Layout & Spacing

### Spacing Scale

```css
/* Spacing tokens */
.spacing-1 { padding: 2px; }
.spacing-2 { padding: 4px; }
.spacing-3 { padding: 6px; }
.spacing-4 { padding: 8px; }
.spacing-5 { padding: 10px; }
.spacing-6 { padding: 12px; }
.spacing-8 { padding: 16px; }
.spacing-10 { padding: 20px; }
.spacing-12 { padding: 24px; }
.spacing-16 { padding: 32px; }
.spacing-20 { padding: 40px; }

/* Margin tokens */
.m-1 { margin: 2px; }
.m-2 { margin: 4px; }
.m-3 { margin: 6px; }
.m-4 { margin: 8px; }
.m-5 { margin: 10px; }
.m-6 { margin: 12px; }
.m-8 { margin: 16px; }
.m-10 { margin: 20px; }
.m-12 { margin: 24px; }
.m-16 { margin: 32px; }
.m-20 { margin: 40px; }
```

### Grid System

```css
/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Grid */
.grid-cols-1 { display: grid; grid-template-columns: 1fr; }
.grid-cols-2 { display: grid; grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { display: grid; grid-template-columns: repeat(3, 1fr); }

/* Responsive grid */
.grid-cols-1 md:grid-cols-2 lg:grid-cols-3 {
  grid-template-columns: 1fr;
  @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
}
```

### Border Radius

```css
.radius-sm { border-radius: 4px; }
.radius-md { border-radius: 8px; }
.radius-lg { border-radius: 12px; }
.radius-xl { border-radius: 16px; }
.radius-full { border-radius: 9999px; }
```

### Shadow Scale

```css
.shadow-sm { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }
.shadow-md { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }
.shadow-lg { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); }
.shadow-xl { box-shadow: 0 16px 48px rgba(0, 0, 0, 0.16); }
```

---

## Component Specifications

### Button Component

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | string | `primary` | `primary`, `secondary`, `success`, `warning`, `ghost` |
| `size` | string | `md` | `sm`, `md`, `lg` |
| `fullWidth` | boolean | `false` | Full width button |
| `disabled` | boolean | `false` | Disabled state |
| `icon` | string | `null` | Icon component name |

**Primary Button**:
```jsx
<Button
  variant="primary"
  size="md"
  onClick={handleClick}
>
  <Icon /> Button Text
</Button>
```

**Success Button**:
```jsx
<Button variant="success" fullWidth>
  Confirm Action
</Button>
```

### Card Component

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | `null` | Card heading |
| `subtitle` | string | `null` | Card subheading |
| `headerImage` | string | `null` | Header image URL |
| `clickable` | boolean | `false` | Make card clickable |
| `onClick` | function | `null` | Click handler |

**Basic Card**:
```jsx
<Card>
  <CardHeader title="Daily Stats">
    <CardSubtitle>Today's summary</CardSubtitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Modal Component

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `isOpen` | boolean | `false` | Modal visibility |
| `onClose` | function | `null` | Close handler |
| `title` | string | `null` | Modal title |
| `size` | string | `md` | `sm`, `md`, `lg` |

**Modal**:
```jsx
<Modal
  isOpen={isModalOpen}
  onClose={handleClose}
  title="Log Workout"
  size="lg"
>
  {/* Modal content */}
</Modal>
```

---

## File Structure

```
frontend/src/app/
├── config.tsx      # Brand + sidebar footer
├── router.ts       # Hash router
├── routes.tsx      # ROUTES registry
├── components/     # ui/ layout/ domain/ charts/
├── features/       # dashboard/ fitness/ food/ squad/ stats/
├── lib/            # cn.ts classname joiner
├── App.tsx         # Resolves a route, renders it
├── main.tsx        # React entry point
└── index.css       # Tailwind v4 @theme palette tokens
```

---

## Notes

- All animations use `cubic-bezier(0.4, 0, 0.2, 1)` for smooth, natural motion
- Color palette must be strictly followed - no deviations
- Responsive design: mobile-first with desktop sidebar navigation
- All components use CSS custom properties for easy theming
- Gradient backgrounds should use defined color stops only
- Buttons always have hover state with lift effect (translateY(-2px))
- Progress indicators use circular SVG with stroke-dasharray for smooth animation

---

*Document generated from mockup HTML and implementation documentation*
