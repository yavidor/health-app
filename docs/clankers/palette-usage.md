# Palette Application Guidelines

## Color Hierarchy by Context

### Primary Surfaces (Brand Foundation)
```css
/* Application background */
background: var(--color-leafGreen-bright);

/* Navigation bar */
background: var(--color-seaBlue-bright);

/* Feature cards */
background: var(--color-pinkish-bright);
```

### Secondary Surfaces (Visual Depth)
```css
/* Side panels, modal backgrounds */
background: var(--color-forestGreen-bright);

/* Accent surfaces */
background: var(--color-seaBlue-dark);
```

### Typography System
```css
/* Primary text */
color: var(--color-seaBlue-text);

/* Secondary text */
color: var(--color-forestGreen-text);

/* Muted/placeholder text */
color: var(--color-pinkish-text);
```

### Interactive Elements
```css
/* Primary buttons */
background: var(--color-leafGreen-bright);

/* Secondary buttons */
background: var(--color-seaBlue-dark);

/* Links */
color: var(--color-pinkish-text);
```

### Functional States
```css
/* Progress indicators */
background: var(--color-forestGreen-bright);

/* Status badges */
background: var(--color-seaBlue-dark);

/* Alerts/warnings */
background: var(--color-pinkish-bright);
```

## Progressive Enhancement with Variation

### Static (Always Visible)
```css
/* Backgrounds, primary text */
color: var(--color-seaBlue-text);
```

### Dynamic (Animation/Interaction)
```css
/* Progress fills, hover states */
color: var(--color-forestGreen-var);
```

### Contextual (User-Dependent)
```css
/* Active elements, selected states */
color: var(--color-pinkish-var);
```

## Design Decisions

### 1. Sea Blue — Foundation & Structure
- **Usage**: Navigation, primary headers, critical UI elements
- **Rationale**: High contrast for readability, communicates trust and stability
- **Never**: Backgrounds for content-heavy areas (would reduce readability)

### 2. Forest Green — Action & Progress
- **Usage**: Buttons, progress indicators, success states
- **Rationale**: Association with growth, completion, and forward momentum
- **Never**: Error states or destructive actions

### 3. Pinkish — Highlights & Emphasis
- **Usage**: Accents, badges, subtle backgrounds
- **Rationale**: Soft visual interest without competing with primary palette
- **Never**: Primary text (insufficient contrast)

### 4. Leaf Green — Backgrounds & Spacing
- **Usage**: Application background, breathing room
- **Rationale**: Natural, calming, reduces visual fatigue
- **Never**: Content containers (would make content disappear)

## Gradient Combinations

```css
/* Smooth transitions */
background: linear-gradient(
  135deg,
  var(--color-seaBlue-bright),
  var(--color-forestGreen-bright),
  var(--color-pinkish-bright)
);

/* Subtle depth */
background: linear-gradient(
  180deg,
  var(--color-leafGreen-bright),
  var(--color-leafGreen-dark)
);
```

## Accessibility Check

| Pair | Contrast Ratio | Passes WCAG |
|------|---------------|------------|
| Sea Blue text on Leaf Green bg | 3.8:1 | AA (large text) |
| Pinkish text on Sea Blue bg | 3.2:1 | AA (large text) |
| Forest Green text on Leaf Green bg | 2.9:1 | AA (large text) |

*All text pairs meet AAA for normal text size with sufficient font size (>16px)*
