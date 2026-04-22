import type { Tables } from "./supabase";

export type Profile   = Tables<"profiles">;
export type Recording = Tables<"recordings">;
export type Chat      = Tables<"chats">;
export type Todo      = Tables<"todos">;

export type ChatSender = "user" | "ai";
