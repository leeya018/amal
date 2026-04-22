# Amal App — Setup Instructions

## 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

## 2. Download Rubik Fonts

Rubik supports Hebrew + Arabic + Latin in a single typeface.

```bash
bash scripts/download-fonts.sh
```

Or download manually from [Google Fonts — Rubik](https://fonts.google.com/specimen/Rubik)
and place these files in `assets/fonts/`:
- `Rubik-Regular.ttf`
- `Rubik-Medium.ttf`
- `Rubik-Bold.ttf`
- `Rubik-Light.ttf`

## 3. Create Your .env File

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

Then edit `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSy...
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-...
EXPO_PUBLIC_EAS_PROJECT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## 4. Apply Supabase Migration

In the Supabase Dashboard > SQL Editor, run the contents of:
`supabase/migrations/001_initial_schema.sql`

**Important:** Also create the Storage bucket manually:
- Go to Supabase Dashboard > Storage
- Create a new bucket named `recordings`
- Set it to **Private** (not public)

## 5. Deploy Edge Function (Push Notifications)

```bash
npx supabase functions deploy send-daily-notifications
npx supabase secrets set CRON_SECRET=your-secret-here
```

Then in Supabase Dashboard > Edge Functions > Cron Jobs, add two schedules:
- `0 7 * * *` → Morning notifications (07:00 UTC)
- `0 18 * * *` → Evening notifications (18:00 UTC)

## 6. Run the App

```bash
npm start
# Then press 'i' for iOS simulator or 'a' for Android
```

## Notes

- The app uses **Expo Go** for development. For push notifications to work,
  you need a physical device or a development build.
- RTL (Hebrew/Arabic) requires an app reload — this is triggered automatically
  when the user selects Hebrew or Arabic for the first time.
- Gemini API key can be obtained from: https://aistudio.google.com/
- OpenAI API key can be obtained from: https://platform.openai.com/
