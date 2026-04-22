# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Amal is an Expo (SDK 54) / React Native 0.81 app — a Hebrew-only safety app for women. It has three features, one per tab:

- **SOS** (`app/(tabs)/sos`): one-tap audio recording with location, uploaded to Supabase Storage and HMAC-signed for tamper-evidence.
- **Agent** (`app/(tabs)/agent`): Hebrew chat with Gemini (`gemini-1.5-flash`). Can extract action items from a message and bulk-create them as todos.
- **Todos** (`app/(tabs)/todos`): personal task list (title, description, due date, completed).

The app is Hebrew-only and RTL is force-enabled at startup via `enforceRTL()` in [app/_layout.tsx](app/_layout.tsx). Text and i18n keys live in [src/i18n/locales/he.json](src/i18n/locales/he.json) — no English locale file is intended.

## Commands

```bash
npm run start         # expo start (dev menu / QR)
npm run ios           # expo start --ios
npm run android       # expo start --android
npm run web           # expo start --web
npm run type-check    # tsc --noEmit   <-- the only verification command in this repo
```

There is no lint script and no test runner configured. When verifying changes, run `npm run type-check`. `supabase/functions/**` is excluded from the app's tsconfig (it's Deno code, not RN).

## Required environment

Copy `.env.example` to `.env`. All are read through [src/constants/config.ts](src/constants/config.ts), which throws on first access if a key is missing — so a missing var surfaces immediately at app boot.

- `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_GEMINI_API_KEY` (Gemini chat + action-item extraction)
- `EXPO_PUBLIC_OPENAI_API_KEY` (Whisper transcription in [src/lib/whisper.ts](src/lib/whisper.ts))

The `sign-recording` Edge Function additionally needs `SIGNING_SECRET` set in the Supabase project env.

## Architecture

### Routing — expo-router, file-based

- [app/_layout.tsx](app/_layout.tsx) — root. Wraps the tree in `GestureHandlerRootView` → `SafeAreaProvider` → `AuthProvider`. Loads Rubik fonts, enforces RTL, manages splash screen.
- [app/index.tsx](app/index.tsx) — gate: redirects to `/(tabs)/sos` if signed in, else `/onboarding/intro`.
- [app/(tabs)/_layout.tsx](app/(tabs)/_layout.tsx) — tabs. Wraps children in `RecordingProvider` so SOS recording state survives tab switches. `sos/recordings` is hidden from the tab bar (`href: null`) and navigated to from inside the SOS screen.

Typed routes are on (`experiments.typedRoutes: true` in [app.json](app.json)).

### Two providers, layered

1. **`AuthProvider`** ([src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)) — wraps the whole app, owns the Supabase session, exposes `signIn` / `signUp` / `signOut`. Every hook/feature gates on `session`.
2. **`RecordingProvider`** ([src/contexts/RecordingContext.tsx](src/contexts/RecordingContext.tsx)) — mounted only inside the tabs layout, owns the SOS state machine (`idle → requesting → recording → saving → saved | error`). Lifting this into context (vs. a screen-local hook) is what lets the user navigate away from the SOS tab mid-save without losing the upload.

### Data layer — Supabase with RLS, per-user scoping

The single Supabase client is [src/lib/supabase.ts](src/lib/supabase.ts) (AsyncStorage-backed session, typed with `Database` from [src/types/supabase.ts](src/types/supabase.ts)). All data access goes through feature hooks that always filter by `session.user.id`:

- [src/hooks/useChats.ts](src/hooks/useChats.ts) — chat history + `send()` which inserts the user row, calls Gemini with prior history, inserts the AI row.
- [src/hooks/useTodos.ts](src/hooks/useTodos.ts) — CRUD + `createMany` (used by the agent's action-item flow).
- [src/hooks/useRecordings.ts](src/hooks/useRecordings.ts) — list/delete + `getSignedUrl` for playback.

Schema and policies live in [supabase/migrations/001_initial_schema.sql](supabase/migrations/001_initial_schema.sql) (`profiles`, `recordings`, `chats`, `todos`) and [supabase/migrations/002_storage_recordings_bucket.sql](supabase/migrations/002_storage_recordings_bucket.sql). **RLS is enabled on every table** and policies scope reads/writes to `auth.uid() = user_id`. Storage objects follow the path convention `{user_id}/{uuid}.m4a`; the storage policies enforce this using `storage.foldername(name)[1]`. A trigger (`handle_new_user`) auto-creates a `profiles` row on `auth.users` insert.

### Recording → upload → sign flow

The non-obvious part of this codebase. In [src/contexts/RecordingContext.tsx](src/contexts/RecordingContext.tsx) `stop()` does, in order:

1. Stop expo-av recording, get local URI.
2. Best-effort location (denied permission does NOT block save).
3. Read file as base64, decode to `Uint8Array` (custom decoder — no `atob` polyfill), upload to the `recordings` bucket at `{user_id}/{uuid}.m4a`.
4. SHA-256 hash the file via [src/lib/signRecording.ts](src/lib/signRecording.ts) `hashFile()`.
5. Call the `sign-recording` Edge Function ([supabase/functions/sign-recording/index.ts](supabase/functions/sign-recording/index.ts)), which verifies the user's JWT, checks the `file_path` starts with their `user.id`, and returns `HMAC-SHA256(SIGNING_SECRET, "{file_path}:{sha256}:{created_at}")` hex-encoded.
6. Insert the `recordings` row with `file_path`, `sha256`, `signature`, `lat`, `long`, `created_at`.
7. Delete the local file.

The signature is the tamper-evidence primitive — any later edit to the audio, path, or timestamp invalidates it. If you touch this flow, the **canonical string** (`{file_path}:{sha256}:{created_at}`) must stay identical on both sides.

### AI integration

[src/lib/gemini.ts](src/lib/gemini.ts) exports two entry points with distinct system prompts:

- `askGemini(history, message)` — uses a Hebrew system instruction tuned for emotional support; the app persists full chat history in Supabase and replays it on every call.
- `extractActionItems(text)` — asks Gemini for strict JSON (`{items:[{title, description}]}`), strips ` ```json ` fences, safely falls back to `[]` on parse failure. Feeds into `useTodos.createMany`.

[src/lib/whisper.ts](src/lib/whisper.ts) calls OpenAI Whisper (`whisper-1`, `language=he`) with a multipart form — used for transcribing recordings.

## Styling

NativeWind v4 (Tailwind v3) configured in [babel.config.js](babel.config.js), [metro.config.js](metro.config.js), and [global.css](global.css) (imported at the top of `app/_layout.tsx`).

The design system lives in [tailwind.config.js](tailwind.config.js): use the semantic color scales (`brand-*`, `accent-*`, `cream`, `ink`, `danger`, `success`) instead of raw hex. Fonts are Rubik (`font-sans`, `font-medium`, `font-bold`) — they're loaded asynchronously and the splash screen is held until `useAppFonts()` resolves (see [app/_layout.tsx](app/_layout.tsx) and [src/constants/fonts.ts](src/constants/fonts.ts)).

UI primitives in [src/components/ui/](src/components/ui/) (`Button`, `Card`, `Input`, `Typography`) wrap the design tokens — prefer extending them over adding one-off styled views.

## Conventions

- Path alias `@/*` → `src/*` (configured in [tsconfig.json](tsconfig.json)). Use it for all intra-`src` imports.
- `strict: true` is on. Supabase row types come from `Tables<"…">` in [src/types/supabase.ts](src/types/supabase.ts), re-exported as domain names in [src/types/app.ts](src/types/app.ts) (`Profile`, `Recording`, `Chat`, `Todo`).
- All user-facing strings go through `react-i18next` (`const { t } = useTranslation()`), keyed into [src/i18n/locales/he.json](src/i18n/locales/he.json).
- Feature code is organised by feature: a screen in `app/(tabs)/<feature>/`, presentational components in `src/components/<feature>/`, and data access in `src/hooks/use<Feature>.ts`.

## Security note for maintainers

[.mcp.json](.mcp.json) currently contains a hard-coded GitHub PAT passed via `-e GITHUB_PERSONAL_ACCESS_TOKEN=…` on the command line. If you rotate it, do so here and in the GitHub account — consider moving it to an untracked env var instead.
