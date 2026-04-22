import * as FileSystem from 'expo-file-system';
import { config } from '../constants/config';
import type { AppLanguage } from '../i18n';

const WHISPER_URL = 'https://api.openai.com/v1/audio/transcriptions';

const LANG_CODES: Record<AppLanguage, string> = {
  he: 'he',
  ar: 'ar',
  en: 'en',
};

export async function transcribeAudio(
  audioUri: string,
  lang: AppLanguage
): Promise<string> {
  const fileInfo = await FileSystem.getInfoAsync(audioUri);
  if (!fileInfo.exists) throw new Error('Audio file not found');

  const formData = new FormData();
  formData.append('file', {
    uri: audioUri,
    type: 'audio/m4a',
    name: 'recording.m4a',
  } as unknown as Blob);
  formData.append('model', 'whisper-1');
  formData.append('language', LANG_CODES[lang]);

  const response = await fetch(WHISPER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.openAiApiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Whisper error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return (data.text as string).trim();
}
