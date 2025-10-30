# Clinical Copilot

Clinical Copilot is a deterministic, frontend-only clinical documentation sandbox for primary care visits. Every transcript, extraction, and recommendation comes from local JSON fixtures and pure TypeScript logic—no servers, no network calls, and identical results on every run.

> ⚠️ **Safety notice**: This project is for demos and experimentation only. It is **not** a medical device and must not be used for patient care without validated clinical oversight. Local-only mode is enforced; only a limited subset of demo data is persisted in the browser.

## Highlights

- **Fixture-driven workflow** – Transcripts, case extraction, reasoning, and guideline lookups are sourced from curated fixtures under `src/fixtures`.
- **Deterministic mock services** – `createSTTProvider` and `createReasoner` stream scripted conversations and merge structured case data without side effects.
- **Ambient cockpit** – `AmbientLayer` delivers a WebGL backdrop with automatic `prefers-reduced-motion` and low-power fallbacks.
- **Consent-first UX** – The demo enforces Consent ➝ Visit ➝ Summary flows and clearly labels mocked behavior.
- **Offline by design** – No external APIs; only locale, structured `caseData`, and the SOAP note draft are persisted between sessions.
- **Auditable bundles** – Dead-code analysis (`npm run audit:dead-code`) and bundle reports (`npm run analyze:bundle`) ship with the repo.

## Quick Start

Prerequisites: Node.js 18+ and npm.

```bash
npm install
npm run dev
# open http://localhost:8080
```

Production build & preview:

```bash
npm run build
npm run preview
```

## Development Scripts

- `npm run dev` – Vite dev server on port 8080.
- `npm run build` – Production build (also used by `analyze:bundle`).
- `npm run preview` – Preview the current production build.
- `npm run lint` – ESLint (no warnings).
- `npm run typecheck` – `tsc --noEmit`.
- `npm run audit:dead-code` – `knip` + `ts-prune` sweep.
- `npm run audit:deps` – `depcheck` snapshot (expect `autoprefixer`, `postcss`, `postprocessing` false positives).
- `npm run analyze:bundle` – Generates `stats/bundle.html` via `rollup-plugin-visualizer`.

## Manual QA Checklist

1. Launch `npm run dev`, then exercise the canonical flow: Home → Consent → Visit (start recording or pick every scenario) → Visit Complete → Reset.
2. Confirm deterministic case data updates every third transcript entry and that the summary page matches fixture outputs.
3. Toggle each scenario shortcut and verify `MockSTT` finishes playback without drift, even when the tab is backgrounded.
4. Inspect `localStorage` – only `locale`, `caseData`, and `soapNote` keys should exist (`visit-store` namespace).
5. Simulate `prefers-reduced-motion` / low-power mode – the ambient layer should fall back to the CSS gradient without console errors.
6. Validate the 404 page renders with a working “Go home” link.

## Architecture & Key Paths

```
src/
  fixtures/          # Conversations, cases, reasoning, and guideline JSON
  components/
    layout/          # AppShell + ambient background
    visit/           # AudioCapture, TranscriptViewer, CaseEditor, SuggestionPanel
    ui/              # Reusable UI components and primitives
  hooks/             # Toast state
  lib/
    services/        # mock-reasoner.ts, mock-stt.ts
    store.ts         # Zustand visit/settings stores
    types.ts         # Shared domain types
  three/             # AmbientLayer + AmbientScene (three.js)
  pages/             # Route components
```

- **Mock STT** (`src/lib/services/mock-stt.ts`): schedules transcript entries using fixture offsets and adapts to background-tab throttling.
- **Mock Reasoner** (`src/lib/services/mock-reasoner.ts`): merges fixture case data, safety checks, and SOAP notes without `any`.
- **State** (`src/lib/store.ts`): visit state persists **only** `locale`, `caseData`, and `soapNote`; resets keep locale intact for accessibility.
- **Ambient Layer** (`src/components/layout/AppShell.tsx` + `src/three`): renders WebGL when available, falls back to CSS gradients otherwise.

## Deterministic Data & Persistence

- Visit IDs, transcripts, reasoning panels, and red flags live entirely in memory; reloading clears them.
- `CaseEditor` recalculates structured data every third transcript entry using the fixture reasoner.
- The SOAP note (`soapNote` draft) and `caseData` are merged immutably and persisted so the demo survives reloads without leaking other state.

## Bundle & Audit Reports

- Dead-code audit: `npm run audit:dead-code` (clean as of v0.1.0).
- Dependency scan: `npm run audit:deps` (ignore `postprocessing`, `autoprefixer`, `postcss` peer warnings).
- Bundle visualizer: `npm run analyze:bundle` ➝ open `stats/bundle.html`.

## Privacy & Safety

- Demo content only—do **not** enter real PHI.
- Intended for desktop; tablet/mobile layouts are responsive but remain non-clinical.
- Ambient audio/transcription is scripted; recordings never leave the browser.

## Known Limitations

- Three scripted scenarios (Sore Throat, Thunderclap Headache, UTI) with intentionally static outputs.
- No real STT/LLM integrations; providers must implement the existing interfaces.
- Bundle still ships ~1.2 MB of vendor JS (primarily three.js + framer-motion); future work can split or lazy-load heavier views.
- Prisma schema under `docs/future/` is archival only.

## License

Demo/educational use only. Licensing is TBD—consult the project owner before reuse.
