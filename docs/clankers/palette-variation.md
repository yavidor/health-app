# Palette Variation System (±10%)

## Problem
Strict color matching creates rigid UI. Real design needs subtle variation without introducing brand violation.

## Solution: Delta-Color with Tokenization

### Definition
Each palette color has a configurable delta range (default ±10%). Colors within range are considered "valid" for that palette slot.

### Technical Model

```
Palette Color: C = (R, G, B)
Allowed Range: [C × (1 - Δ), C × (1 + Δ)]

Where Δ = delta (0.10 = 10%)
```

### Linear Interpolation Method

For smooth transitions between strict and loose:

```javascript
// Generate color token with delta
export function generateColorToken(baseColor, delta = 0.10) {
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgb = hexToRgb(baseColor);
  if (!rgb) throw new Error(`Invalid hex color: ${baseColor}`);

  // Generate variation
  const r = Math.round(rgb.r * (1 + (Math.random() - 0.5) * 2 * delta));
  const g = Math.round(rgb.g * (1 + (Math.random() - 0.5) * 2 * delta));
  const b = Math.round(rgb.b * (1 + (Math.random() - 0.5) * 2 * delta));

  return `rgb(${r}, ${g}, ${b})`;
}

// Tailwind config example
module.exports = {
  theme: {
    extend: {
      colors: {
        // Base palette
        seaBlue: { bright: '#6aa6ae', text: '#185661', dark: '#0a3c45' },
        forestGreen: { bright: '#437456', text: '#156b44', dark: '#0e341f' },
        leafGreen: { bright: '#e4eebc', text: '#adbf73', dark: '#697948' },
        pinkish: { bright: '#efd6d2', text: '#d2968d', dark: '#b69a96' },

        // Dynamic tokens with ±10% variation
        seaBlueVar: {
          dynamic: (delta = 0.10) => generateColorToken('#6aa6ae', delta)
        },
        forestGreenVar: {
          dynamic: (delta = 0.10) => generateColorToken('#437456', delta)
        },
        pinkishVar: {
          dynamic: (delta = 0.10) => generateColorToken('#efd6d2', delta)
        }
      }
    }
  }
};
```

### Usage in React

```jsx
// Card background with subtle variation
const cardBg = theme.pinkishVar(0.12);

// Progress bar fill that never matches exactly
const progressFill = theme.forestGreenVar(0.08);

// Badge background with slight uniqueness
const badgeBg = theme.seaBlueVar(0.15);
```

## Design Rationale

| Concern | Solution |
|---------|----------|
| Brand consistency | Stay within ±10% delta |
| Visual uniqueness | Each element gets slightly different color |
| Smooth transitions | Linear interpolation enables animations |
| Accessibility | Maintain WCAG contrast ratios |
| Performance | Client-side generation, no server roundtrip |

## When to Use Strict vs Loose

- **Strict (δ = 0)**: Primary backgrounds, critical brand elements
- **Loose (δ = 0.05-0.10)**: Secondary elements, decorative accents, gradients
- **Random (δ = 0.12-0.15)**: UI components that need visual distinction

## Verification

```javascript
// Verify color stays within bounds
function validateColor(color, base, maxDelta = 0.10) {
  const [br, bg, bb] = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:,\s*([\d.]+))?\s*\)$/i);
  if (!br) return false;

  const baseR = parseInt(base.match(/^#([a-f\d]{2})/i)[1], 16) / 255;
  const baseG = parseInt(base.match(/^#[a-f\d]{4}/i)[1], 16) / 255;
  const baseB = parseInt(base.match(/^#[a-f\d]{3}/i)[1], 16) / 255;

  const r = parseInt(br) / 255;
  const g = parseInt(bg) / 255;
  const b = parseInt(bb) / 255;

  return Math.max(r, g, b) - Math.min(r, g, b) <= maxDelta;
}
```

## Implementation Notes

- **CSS Custom Properties** enable runtime variation without React state
- **CSS HSL()** enables easy delta calculations: `hsl(var(--hue), calc(100% * (1 - delta)), calc(60% * (1 + delta)))`
- **SVG filters** for blur-based variation as alternative approach
- **Animation-friendly**: interpolate between two generated tokens

---

## Related Docs
- `docs/humans/design/colors.md` — Base palette definition
- `docs/clankers/implementation-plan.md` — Tech stack and architecture
- `docs/humans/design/palette-usage.md` — Palette application guidelines
