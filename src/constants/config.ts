const required = (name: string, value: string | undefined): string => {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};

export const config = {
  supabase: {
    url:     required("EXPO_PUBLIC_SUPABASE_URL",      process.env.EXPO_PUBLIC_SUPABASE_URL),
    anonKey: required("EXPO_PUBLIC_SUPABASE_ANON_KEY", process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
  },
  gemini: {
    apiKey: required("EXPO_PUBLIC_GEMINI_API_KEY", process.env.EXPO_PUBLIC_GEMINI_API_KEY),
    model:  "gemini-1.5-flash",
  },
  openai: {
    apiKey: required("EXPO_PUBLIC_OPENAI_API_KEY", process.env.EXPO_PUBLIC_OPENAI_API_KEY),
  },
  storage: {
    recordingsBucket: "recordings",
  },
} as const;
