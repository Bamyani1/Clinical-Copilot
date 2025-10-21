# Clinical Copilot

Clinical Copilot is an AI-powered clinical decision support and documentation assistant for primary care visits. This frontend demo is built with React, Vite, TypeScript, Tailwind, and shadcn/ui. It simulates live transcription, case data extraction, differential diagnosis, red flag detection, and guideline-aware suggestions using local mock providers (no backend required).

> Important: This project is for demos and experimentation only. It is not a medical device and must not be used for patient care without appropriate validation and oversight. Local-only mode is enabled by default; only a safe subset of data is persisted in the browser.

## Features

- **Live transcription (mocked)**: Simulated clinician–patient conversation with speaker labels and confidence.
- **Case data extraction**: Pulls demographics, vitals, HPI, ROS, and exam findings from transcript.
- **Clinical reasoning**: Differential diagnoses with confidence and rationales; suggested workup and first-line meds with safety checks.
- **Red flag detection**: Highlights critical symptoms that require escalation (e.g., thunderclap headache).
- **Guidelines viewer**: Browse mock evidence-based pathways (sore throat, UTI, headache).
- **Consent flow**: Explicit patient and clinician authorization prior to recording.
- **Admin panel**: Toggle local-only mode and switch mock providers; future hooks for real providers.
- **Modern UI**: Tailwind + shadcn/ui components, responsive layout, mobile tabs.

## Tech Stack

- React 18, TypeScript, Vite 5 (port 8080)
- Tailwind CSS, shadcn/ui (Radix), Lucide icons
- Zustand (state), TanStack Query, React Router
- Mock services for LLM and STT under `src/lib/services/`
- Prisma schema present for future backend integration (not used in this demo)

## Quick Start

Prerequisites: Node.js 18+ and npm

```npm install
npm install
npm run dev
# open http://localhost:8080
```

Build and preview:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## Project Structure

```text
src/
  components/
    ui/                 # shadcn/ui component library
    layout/             # AppShell, theme provider
  three/                # Ambient WebGL components
    visit/              # AudioCapture, TranscriptViewer, CaseEditor, SuggestionPanel
  hooks/                # Reusable hooks
  lib/
    services/           # mock-llm.ts, mock-stt.ts (demo providers)
    store.ts            # Zustand stores for visit and settings
    types.ts            # Shared app/clinical types
  pages/                # Index, Consent, Visit, Guidelines, Admin, Login, NotFound
  App.tsx               # Routes and providers
  index.css             # Tailwind layers + tokens import
  styles/tokens.css     # Design tokens (CSS variables)
vite.config.ts          # Vite config (port 8080)
prisma/schema.prisma    # Placeholder for future backend (unused here)
```

## How It Works

1. Start at Home → Consent → Begin AI‑Assisted Visit.
2. On the Visit page:
   - Start Recording to stream a mocked transcript, or choose a scenario (Sore Throat, Red Flag Headache, UTI).
   - The `CaseEditor` auto-extracts structured case data from the transcript every few entries.
   - The `SuggestionPanel` generates differentials, workup, meds, and red flags based on case data.
3. Use the Admin page to toggle local-only mode and view provider settings (mock by default).

### Mock Providers

- Speech-to-Text: `src/lib/services/mock-stt.ts`
  - Simulates transcript entries and includes helper methods for different clinical scenarios.
- LLM: `src/lib/services/mock-llm.ts`
  - Extracts case data, generates reasoning (differentials/workup/meds/red flags), and scaffolds note generation.

### State & Persistence

`src/lib/store.ts` defines two Zustand stores:

- Visit store: visit metadata, transcript, case data, AI suggestions, and documentation.
- Settings store: local-only mode and provider selections.

Only a subset is persisted to localStorage (locale, `caseData`, `soapNote`). Visit IDs, transcript, and suggestions are not persisted.

## Design System & WebGL Layer

- Tokens in `src/styles/tokens.css`; Tailwind maps variables in `tailwind.config.ts`.
- Single-theme token system with global gradients and color ramps; no runtime theme toggle.
- `AppShell` provides header, footer, skip link, and offline banner.
- Ambient GL: `src/three/AmbientLayer.tsx` and `AmbientScene.tsx` render a subtle particle field.
  - Honors `prefers-reduced-motion` and supports `lowPowerMode`.
  - Degrades gracefully if WebGL is unsupported.
  - GL is background-only and never blocks interaction.

## Performance

- Routes are lazy-loaded in `App.tsx`.
- WebGL runs at reduced density/DPR when low power mode is enabled.

## Pages & Routes

- `/` Home/landing
- `/consent` Consent flow to start a visit
- `/visit/:id` Live visit workspace
- `/guidelines` Mock guideline browser
- `/admin` Admin and provider settings
- `/login` Mock login screen

## NPM Scripts

- `dev`: start Vite dev server
- `build`: production build
- `build:dev`: development-mode build
- `preview`: preview built app
- `lint`: run ESLint

## Extending the App

- Real STT: Implement additional providers in `createSTTProvider` (e.g., Whisper, GCP) to satisfy the `STTProvider` interface.
- Real LLM: Implement providers in `createLLMProvider` (e.g., OpenAI, Anthropic) to satisfy the `LLMProvider` interface.
- Backend: Introduce an API and connect Prisma schema; wire authentication/authorization as needed.

## Privacy & Safety

- Decision support only; clinician retains full responsibility.
- Local-only mode keeps data on device; some features may be limited.
- Do not input real PHI in demo environments.

## Known Limitations

- Mock-only STT/LLM; no real cloud integrations are active.
- No backend/API; Prisma schema is not used.
- Auth is mocked; NextAuth deps are present but not wired.
- Note generation exists in the mock LLM but is not surfaced in the UI.

## License

This repository is provided for demo/educational purposes. Licensing is TBD; consult the project owner before reuse.
