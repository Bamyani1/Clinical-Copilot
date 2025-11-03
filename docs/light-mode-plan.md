# Light Mode Integration Plan

## Summary
The design tokens already define both light (`:root`) and dark (`.dark`) palettes in `src/styles/tokens.css`. The site currently runs in dark mode only because the `.dark` class is applied implicitly via default variables. We will add a theme controller that toggles that class on the root element, expose a UI switch in the header, and ensure the light palette reuses the same token values documented in `docs/color-palette.md`.

## Implementation Steps
1. **Establish theme controller**
   - Create `src/components/theme/theme-context.tsx` exporting a `ThemeProvider`, `useTheme` hook, and `Theme` type (`"light" | "dark"`).
   - Provider responsibilities:
     - Initialize theme from `localStorage` if present, otherwise from `window.matchMedia("(prefers-color-scheme: dark)")`.
     - Apply or remove the `dark` class on `document.documentElement`.
     - Persist choice to `localStorage` (`clinical-copilot.theme` key) on change.
     - Expose `setTheme` and `toggleTheme` helpers.
   - Guard against SSR by deferring DOM mutations until `useEffect`.

2. **Wrap the app**
   - In `src/main.tsx`, wrap `<App />` with `<ThemeProvider>`.
   - Ensure the provider only renders its children once the theme is hydrated to avoid flashes (e.g., using a `mounted` flag).

3. **Add toggle UI**
   - In `src/components/layout/AppShell.tsx`:
     - Import `useTheme`.
     - Add a button in the header’s right-hand action group (current `Launch Visit` area) aligned to the top-right.
     - Reuse existing UI primitives (`Button` with `variant="ghost"` or a new `IconButton`) and icons from `lucide-react` (`SunMedium`, `Moon`).
     - The button should announce the current mode (e.g., `aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}`) and call `toggleTheme`.
   - Use Tailwind tokens for styling (`bg-surface`, `text-muted-foreground`, hover states using `bg-primary-muted/40`, etc.)—no new hex colors.

4. **Ensure CSS reflects the toggle**
   - Confirm Tailwind’s `darkMode: "class"` setting (already present in `tailwind.config.ts`) so the new `dark` class is recognized.
   - Audit any components that currently assume dark tokens. Because both palettes use the same token names, the new theme should cascade automatically. If a component forces dark-specific styles (e.g., opacity or hard-coded hex values like `#1fd1d0`), evaluate whether they should remain constant or adapt via tokens.
   - For legacy Vite styles, keep as-is unless a future design update introduces tokenized alternatives.

5. **Testing**
   - Manual: cycle the toggle on every major route and confirm gradients, borders, and typography reflect light tokens.
   - Accessibility: verify contrast ratios for light mode using the documented hex equivalents.
   - Persistence: reload to confirm the stored preference applies before paint (check localStorage and media query fallbacks).

6. **Documentation updates**
   - Append a "Theme toggle" section to `docs/color-palette.md` summarizing usage and referencing shared tokens.
   - Optionally note the storage key and behaviour in `README.md` under a “UI/UX” or “Theming” subsection.

## Color Consistency Notes
- All colors already exist in `docs/color-palette.md`; the toggle reuses those HSL values via CSS variables.
- Avoid introducing new color constants; rely on Tailwind utilities tied to the tokens (`bg-background`, `text-foreground`, `border-border`, etc.).
- If a component needs mode-aware imagery or illustration, use CSS filters or tokenized backgrounds to stay within the established palette.
