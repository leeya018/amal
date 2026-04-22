import type { AppLanguage } from '../i18n';

export type { AppLanguage };

export interface Profile {
  id: string;
  email: string;
  lang: AppLanguage;
  push_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface Recording {
  id: string;
  user_id: string;
  file_path: string;
  lat: number | null;
  long: number | null;
  rsa_signature: string | null;
  block_hash: string | null;
  duration_sec: number | null;
  file_size_bytes: number | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message_text: string;
  sender: 'user' | 'ai';
  created_at: string;
}

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecordingResult {
  recordingId: string;
  sha256Hash: string;
  rsaSignature: string;
  blockHash: string;
  lat: number | null;
  long: number | null;
  durationSec: number;
}
