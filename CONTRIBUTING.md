# Contributing to Clinical Copilot

Thanks for helping keep the Clinical Copilot demo deterministic, type-safe, and demo-ready. Because the experience mirrors production workflows without a backend, we lean heavily on tooling and manual QA to avoid regressions.

## Environment & Installation

1. Use Node.js 18+.
2. Install dependencies with `npm install`.
3. Start the dev server via `npm run dev` (served on port 8080).

## Commit & PR Guidelines

- Follow conventional commit prefixes (`feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, etc.).
- Keep commits focused and include context in the body when the intent is not obvious.
- Never add network calls, backend dependencies, or persistence beyond the approved keys (`locale`, `caseData`, `soapNote`).

## Code Style Expectations

- TypeScript only—avoid `any`. Prefer shared types from `src/lib/types.ts`.
- UI primitives live in `src/components/ui/`; keep only the pieces that ship in the demo.
- Tailwind utility classes go through `cn` (`src/lib/utils.ts`); do not introduce custom CSS unless required by the design tokens.
- Ambient rendering must honour `prefers-reduced-motion` and low-power detection.

## Required Checks Before Opening a PR

Run the full suite locally:

```bash
npm run lint
npm run typecheck
npm run audit:dead-code
npm run build
npm run analyze:bundle   # generates stats/bundle.html
```

If dependencies change, refresh (`npm run audit:deps`) and call out any intentional keepers.

## Manual QA Checklist

- Walk through Home → Consent → Visit (exercise every scenario) → Visit Complete → Reset.
- Confirm `caseData` and the SOAP note update deterministically every third transcript entry.
- Verify `localStorage` only contains `locale`, `caseData`, and `soapNote`.
- Simulate `prefers-reduced-motion` / low-power mode and ensure the ambient layer falls back gracefully.
- Validate the 404 page renders with a working “Go home” link.

## Bundle & Audit Artifacts

- Dead-code sweep: `npm run audit:dead-code` (uses `knip` + `ts-prune`).
- Dependency check: `npm run audit:deps` (ignore `autoprefixer`, `postcss`, `postprocessing` peer warnings).
- Bundle report: `npm run analyze:bundle` writes `stats/bundle.html`; attach or summarize changes when the bundle shifts significantly.

## Additional Notes

- Mock services (`src/lib/services`) must remain pure and deterministic.
- Keep documentation (README, CHANGELOG) and the manual QA list updated whenever behavior or tooling changes.
