export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          lang: string;
          push_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          lang?: string;
          push_token?: string | null;
        };
        Update: {
          lang?: string;
          push_token?: string | null;
          updated_at?: string;
        };
      };
      recordings: {
        Row: {
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
        };
        Insert: {
          user_id: string;
          file_path: string;
          lat?: number | null;
          long?: number | null;
          rsa_signature?: string | null;
          block_hash?: string | null;
          duration_sec?: number | null;
          file_size_bytes?: number | null;
        };
        Update: {
          block_hash?: string | null;
        };
      };
      chats: {
        Row: {
          id: string;
          user_id: string;
          message_text: string;
          sender: 'user' | 'ai';
          created_at: string;
        };
        Insert: {
          user_id: string;
          message_text: string;
          sender: 'user' | 'ai';
        };
        Update: never;
      };
      todos: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          due_date: string | null;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          description?: string | null;
          due_date?: string | null;
          completed?: boolean;
        };
        Update: {
          title?: string;
          description?: string | null;
          due_date?: string | null;
          completed?: boolean;
          updated_at?: string;
        };
      };
    };
    Views: {
      push_notification_targets: {
        Row: {
          id: string;
          push_token: string;
          lang: string;
        };
      };
    };
  };
}
