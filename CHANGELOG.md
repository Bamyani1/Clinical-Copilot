# Changelog

## v0.1.0 · Clinical Copilot public demo hardening

### Added
- Dead-code and bundle analysis tooling (`audit:dead-code`, `audit:deps`, `analyze:bundle`) with visualizer output in `stats/bundle.html`.
- Ambient WebGL layer wired into `AppShell` with low-power and reduced-motion detection.
- Type-check script (`npm run typecheck`) and cross-env configuration to support bundle analysis on all platforms.

### Changed
- Trimmed unused UI primitives, fixtures re-exports, and auxiliary deps to keep the bundle deterministic.
- Hardened `useVisitStore` persistence to limit localStorage to `locale`, `caseData`, and `soapNote`, preserving locale across resets.
- Tightened `CaseEditor`, `Visit`, and store logic to rely on typed helpers and stable hooks.
- Reworked README and new CONTRIBUTING guidelines for public release expectations.

### Removed
- TanStack Query provider wrapper and legacy `build:dev` script.
- Unused UI components (alert-dialog, sidebar, calendar, etc.), fixture constants, and redundant toast re-exports.
- Stale `src/components/ui/use-toast.ts` bridge and other dead files flagged by `knip`.

### Fixed
- Mock STT playback now schedules entries using fixture offsets to avoid drift during tab throttling.
- `CaseEditor` extraction now runs on stable callbacks without `any`, and Visit route hook ordering no longer violates React rules.
- Eliminated ESLint/TypeScript warnings (no explicit `any`, no missing deps) and replaced `require` usage in the Tailwind config.
- Store reset & migration paths keep locale intact while clearing transcript reasoning state.
