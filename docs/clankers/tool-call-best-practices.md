# Color Palette & Design System

## Color Palette

Defined in the source truth file: `docs/humans/design/colors.md`

| Sea Blue | Forest Green | Leaf Green | Pinkish |
| -------- | ------------ | ---------- | ------- |
| `#6aa6ae` | `#437456` | `#e4eebc` | `#efd6d2` |
| `#185661` | `#156b44` | `#adbf73` | `#d2968d` |
| `#0a3c45` | `#0e341f` | `#697948` | `#b69a96` |

### Brightness Usage Guidelines

- **Bright colors**: UI elements (buttons, backgrounds, icons, cards)
- **Text colors**: Darker shades for readability
- **Minimal brightness variation**: Keep it subtle for visual consistency

### Tailwind Class Naming Convention

| Hex | Class Name |
|-----|------------|
| `#6aa6ae` | `sea-blue-bright` |
| `#185661` | `sea-blue-text` |
| `#0a3c45` | `sea-blue-dark` |
| `#437456` | `forest-green-bright` |
| `#156b44` | `forest-green-text` |
| `#0e341f` | `forest-green-dark` |
| `#e4eebc` | `leaf-green-bright` |
| `#adbf73` | `leaf-green-text` |
| `#697948` | `leaf-green-dark` |
| `#efd6d2` | `pinkish-bright` |
| `#d2968d` | `pinkish-text` |
| `#b69a96` | `pinkish-dark` |

### Tailwind Config

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        seaBlue: { bright: '#6aa6ae', text: '#185661', dark: '#0a3c45' },
        forestGreen: { bright: '#437456', text: '#156b44', dark: '#0e341f' },
        leafGreen: { bright: '#e4eebc', text: '#adbf73', dark: '#697948' },
        pinkish: { bright: '#efd6d2', text: '#d2968d', dark: '#b69a96' },
      }
    }
  }
}
```

---

## Quick Reference Examples

### Navigation Bar
```html
<nav class="bg-sea-blue-dark text-white p-2">
```

### Progress Bars
```html
<div class="w-full bg-gray-200 rounded-full h-2">
  <div class="bg-sea-blue-bright h-2 rounded-full" style="width: 85%"></div>
</div>
```

### Gradient Backgrounds
```html
<div class="bg-gradient-to-r from-sea-blue-dark to-forest-green-bright">
```

### Icon Backgrounds
```html
<div class="w-8 h-8 bg-leaf-green-bright rounded-lg flex items-center justify-center">
  <span>🍎</span>
</div>
```

---

## Important Notes

> [!NOTE]
> Always explicitly ask before using a color that isn't strictly from the palette.
>