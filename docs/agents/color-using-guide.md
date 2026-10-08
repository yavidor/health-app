# Color Palette & Design System

## Color Palette

Defined in the source of truth: `docs/humans/design/colors.md`

| Tone | Sea Blue (`sea`) | Forest Green (`forest`) | Leaf Green (`leaf`) | Pinkish (`pinkish`) |
| :--- | :--- | :--- | :--- | :--- |
| **Bright (UI/Cards)** | `#6aa6ae` | `#437456` | `#e4eebc` | `#efd6d2` |
| **Text (Labels/Values)** | `#185661` | `#156b44` | `#adbf73` | `#d2968d` |
| **Dark (Headings/Icons)** | `#0a3c45` | `#0e341f` | `#697948` | `#b69a96` |

Additional background accent:
- **Mist (Warm grey background)**: `#e2ecd8`

---

## Tailwind v4 Class Naming Convention

Classes are defined via CSS theme variables in `frontend/src/index.css`:

| Token | CSS Variable | Background Class | Text Class | Border Class |
| :--- | :--- | :--- | :--- | :--- |
| **Sea Bright** | `--color-sea-bright` | `bg-sea-bright` | `text-sea-bright` | `border-sea-bright` |
| **Sea Text** | `--color-sea-text` | `bg-sea-text` | `text-sea-text` | `border-sea-text` |
| **Sea Dark** | `--color-sea-dark` | `bg-sea-dark` | `text-sea-dark` | `border-sea-dark` |
| **Forest Bright** | `--color-forest-bright` | `bg-forest-bright` | `text-forest-bright` | `border-forest-bright` |
| **Forest Text** | `--color-forest-text` | `bg-forest-text` | `text-forest-text` | `border-forest-text` |
| **Forest Dark** | `--color-forest-dark` | `bg-forest-dark` | `text-forest-dark` | `border-forest-dark` |
| **Leaf Bright** | `--color-leaf-bright` | `bg-leaf-bright` | `text-leaf-bright` | `border-leaf-bright` |
| **Leaf Text** | `--color-leaf-text` | `bg-leaf-text` | `text-leaf-text` | `border-leaf-text` |
| **Leaf Dark** | `--color-leaf-dark` | `bg-leaf-dark` | `text-leaf-dark` | `border-leaf-dark` |
| **Pinkish Bright** | `--color-pinkish-bright` | `bg-pinkish-bright` | `text-pinkish-bright` | `border-pinkish-bright` |
| **Pinkish Text** | `--color-pinkish-text` | `bg-pinkish-text` | `text-pinkish-text` | `border-pinkish-text` |
| **Pinkish Dark** | `--color-pinkish-dark` | `bg-pinkish-dark` | `text-pinkish-dark` | `border-pinkish-dark` |
| **Mist** | `--color-mist` | `bg-mist` | `text-mist` | `border-mist` |

---

## Tailwind v4 `@theme` Configuration

In `frontend/src/index.css`:

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

  --font-sans: 'Inter', system-ui, sans-serif;
  --radius-card: 1rem;
  --radius-tile: 0.75rem;
}
```
