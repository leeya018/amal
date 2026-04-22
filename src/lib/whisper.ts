import { config } from "@/constants/config";

export const transcribeAudio = async (uri: string): Promise<string> => {
  const form = new FormData();
  form.append("file", {
    uri,
    name: "audio.m4a",
    type: "audio/m4a",
  } as unknown as Blob);
  form.append("model", "whisper-1");
  form.append("language", "he");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${config.openai.apiKey}` },
    body: form,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Whisper failed (${res.status}): ${err}`);
  }
  const json = (await res.json()) as { text: string };
  return json.text;
};
