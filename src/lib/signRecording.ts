import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "./supabase";

export const hashFile = async (uri: string): Promise<string> => {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, base64);
};

export const signRecording = async (args: {
  file_path: string;
  sha256: string;
  created_at: string;
}): Promise<string> => {
  const { data, error } = await supabase.functions.invoke<{ signature: string }>(
    "sign-recording",
    { body: args }
  );
  if (error) throw error;
  if (!data?.signature) throw new Error("sign-recording returned no signature");
  return data.signature;
};
