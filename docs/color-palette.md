# Color Reference

## Template
- Daylight palette: sun-washed clay neutrals (`hsl(38 45% 95%) → #f8f4ed`) paired with deep evergreen typography (`hsl(126 18% 22%) → #2e4230`) and botanical accents.
- Dusk palette: shaded forest base (`hsl(132 38% 10%) → #102314`) with warm moonlit foreground (`hsl(36 52% 92%) → #f5ede0`) and glowing spring greens.
- The brand axis balances fresh foliage green (`hsl(134 55% 44%) → #32ae4f`) with terracotta secondary (`hsl(18 60% 50%) → #cc6133`) and crystalline sky accent (`hsl(197 55% 48%) → #3798be`).

## Base Surfaces
| Token | Light Mode (HSL → Hex) | Dark Mode (HSL → Hex) | Notes |
| --- | --- | --- | --- |
| `--background` | 38 45% 95% → `#f8f4ed` | 132 38% 10% → `#102314` | Page background. |
| `--foreground` | 126 18% 22% → `#2e4230` | 36 52% 92% → `#f5ede0` | Default text. |
| `--surface` | 38 45% 92% → `#f4ede1` | 132 28% 14% → `#1a2e1e` | Cards & panels. |
| `--surface-strong` | 38 35% 86% → `#e8dfcf` | 132 28% 18% → `#213b26` | Elevated containers. |
| `--card` | `var(--surface)` | `var(--surface)` | Inherits surface. |
| `--card-foreground` | `var(--foreground)` | `var(--foreground)` | |
| `--popover` | `var(--surface-strong)` | `var(--surface-strong)` | |
| `--popover-foreground` | `var(--foreground)` | `var(--foreground)` | |

## Brand Palette
| Token | Light Mode | Dark Mode | Notes |
| --- | --- | --- | --- |
| `--primary` | 134 55% 44% → `#32ae4f` | 134 65% 50% → `#2dd253` | Spring green primary. |
| `--primary-soft` | 134 45% 82% → `#bce6c6` | 134 50% 18% → `#174522` | Soft glow / background. |
| `--primary-muted` | 134 47% 32% → `#2b783d` | 134 55% 28% → `#206f32` | Hover & outlines. |
| `--primary-foreground` | 0 0% 100% → `#ffffff` | Same | Text on primary. |
| `--secondary` | 18 60% 50% → `#cc6133` | 20 65% 58% → `#da7d4e` | Terracotta contrast. |
| `--secondary-muted` | 18 45% 38% → `#8d4f35` | 20 55% 40% → `#9e532e` | Softened secondary. |
| `--secondary-foreground` | 0 0% 100% → `#ffffff` | Same | |
| `--accent` | 197 55% 48% → `#3798be` | 197 65% 55% → `#42add7` | Sky blue accent. |
| `--accent-foreground` | 0 0% 100% → `#ffffff` | Same | |

## Typographic Helpers
| Token | Light Mode | Dark Mode | Notes |
| --- | --- | --- | --- |
| `--muted` | 38 30% 88% → `#eae3d7` | 132 26% 18% → `#223a27` | Quiet backgrounds. |
| `--muted-foreground` | 26 33% 38% → `#815d41` | 92 28% 70% → `#b1c89d` | Secondary text. |
| `--subtle` | 96 28% 55% → `#86ac6c` | 94 32% 60% → `#95ba78` | Metadata / hints. |

## Status & Alerts
| Token | Light Mode | Dark Mode | Notes |
| --- | --- | --- | --- |
| `--success` | 134 55% 44% → `#32ae4f` | 134 65% 50% → `#2dd253` | Positive state. |
| `--success-light` | 134 45% 82% → `#bce6c6` | 134 60% 26% → `#1b6a2d` | Soft success fill. |
| `--success-foreground` | 0 0% 100% → `#ffffff` | Same | |
| `--warning` | 36 70% 52% → `#da962f` | 36 80% 58% → `#eaa53e` | Warning alerts. |
| `--warning-light` | 36 65% 82% → `#efd7b3` | 36 75% 32% → `#8f5e14` | Subtle warning fill. |
| `--warning-foreground` | 0 0% 100% → `#ffffff` | Same | |
| `--destructive` | 6 68% 48% → `#ce3827` | 6 75% 54% → `#e24332` | Destructive / errors. |
| `--destructive-foreground` | 0 0% 100% → `#ffffff` | Same | |
| `--red-flag` | 4 65% 48% → `#ca352b` | 4 78% 52% → `#e43225` | Elevated risk indicator. |
| `--red-flag-light` | 4 55% 84% → `#edc3c0` | 4 65% 28% → `#761f19` | Backdrop for critical notes. |
| `--red-flag-foreground` | 0 0% 100% → `#ffffff` | Same | |

## Confidence Indicators
| Token | Light Mode | Notes |
| --- | --- | --- |
| `--confidence-high` | 134 55% 44% → `#32ae4f` | Aligns with success. |
| `--confidence-medium` | 18 60% 50% → `#cc6133` | Matches secondary. |
| `--confidence-low` | 197 55% 48% → `#3798be` | Mirrors accent. |

## Form Controls & Rings
| Token | Light Mode | Dark Mode | Notes |
| --- | --- | --- | --- |
| `--border` | 34 28% 78% → `#d7c9b7` | 134 22% 24% → `#304b36` | Borders / dividers. |
| `--input` | 38 45% 92% → `#f4ede1` | 134 22% 20% → `#283e2d` | Input backgrounds. |
| `--ring` | 134 55% 44% → `#32ae4f` | 134 65% 50% → `#2dd253` | Focus outlines. |

## Gradients
- `--gradient-hero` (light): `hsl(134 55% 60% / 0.42)`, `hsl(24 70% 62% / 0.28)`, base wash `hsl(38 45% 95%) → hsl(38 35% 86%)`.
- `--gradient-hero` (dark): `hsl(134 55% 32% / 0.48)`, `hsl(20 70% 42% / 0.32)`, base wash `hsl(132 38% 10%) → hsl(132 28% 14%)`.
- `--gradient-primary`: `hsl(134 55% 52%) → hsl(24 70% 58%)` (light) / `hsl(134 65% 50%) → hsl(24 70% 58%)` (dark).
- `--gradient-success`: `hsl(134 55% 48%) → hsl(156 50% 56%)` (light) / `hsl(134 65% 52%) → hsl(156 55% 60%)` (dark).
- `--gradient-warning`: `hsl(36 72% 56%) → hsl(18 68% 52%)` (light) / `hsl(36 80% 58%) → hsl(18 70% 54%)` (dark).
- `--gradient-subtle`: `hsl(38 45% 95%) → hsl(38 35% 86%)` (light) / `hsl(132 38% 10%) → hsl(132 28% 18%)` (dark).

## Shadows
- `--shadow-sm`: `hsl(134 45% 52% / 0.25)` (light), `hsl(134 65% 40% / 0.45)` (dark).
- `--shadow-md`: `hsl(24 65% 50% / 0.22)` (light), `hsl(24 70% 45% / 0.35)` (dark).
- `--shadow-lg`: `hsl(197 55% 52% / 0.22)` (light), `hsl(197 65% 45% / 0.35)` (dark).
- `--shadow-xl`: `hsl(134 45% 48% / 0.28)` (light), `hsl(134 65% 42% / 0.5)` (dark).

## Additional Color Usages
- Recharts integration (`src/components/ui/chart.tsx`) still references library defaults `#ccc` and `#fff`, but tokens provide runtime overrides.
- Ambient particle field (`src/three/AmbientScene.tsx`) retains its cyan glow `#1fd1d0` to contrast against both themes.
- Legacy Vite starter styles (`src/App.css`) keep subtle drop shadows `#646cffaa` / `#61dafbaa` and helper gray `#888`.
- Interface elements that rely on Tailwind utilities (`bg-background`, `text-muted-foreground`, etc.) now resolve to the spring/earth palette above.

## Theme Toggle
- Theme context (`src/components/theme/theme-context.tsx`) persists the user’s `"light"` or `"dark"` choice in `localStorage` (`clinical-copilot.theme`) and swaps `class="light"` / `class="dark"` on `<html>`.
- Header toggle button (`src/components/layout/AppShell.tsx`) mirrors the state with sun / moon icons and relies on these color tokens—no hard-coded hex values.
- Without a stored value, the controller falls back to `prefers-color-scheme`, ensuring either the sunlight or forest palette loads before paint.
