import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { Audio } from "expo-av";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system/legacy";
import * as Crypto from "expo-crypto";
import { supabase } from "@/lib/supabase";
import { signRecording, hashFile } from "@/lib/signRecording";
import { config } from "@/constants/config";
import { useAuth } from "./AuthContext";

export type RecordingStatus = "idle" | "requesting" | "recording" | "saving" | "saved" | "error";

type RecordingState = {
  status: RecordingStatus;
  errorMessage: string | null;
  elapsedMs: number;
  start: () => Promise<void>;
  stop:  () => Promise<void>;
  reset: () => void;
};

const RecordingContext = createContext<RecordingState | null>(null);

export const RecordingProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth();
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number>(0);

  const stopTicker = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const reset = useCallback(() => {
    stopTicker();
    setStatus("idle");
    setErrorMessage(null);
    setElapsedMs(0);
  }, []);

  const start = useCallback(async () => {
    if (!session) return;
    setErrorMessage(null);
    setStatus("requesting");

    const mic = await Audio.requestPermissionsAsync();
    if (!mic.granted) {
      setStatus("error");
      setErrorMessage("permissionMic");
      return;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const rec = new Audio.Recording();
    try {
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
    } catch (e) {
      setStatus("error");
      setErrorMessage(e instanceof Error ? e.message : "generic");
      return;
    }

    recordingRef.current = rec;
    startedAtRef.current = Date.now();
    setElapsedMs(0);
    setStatus("recording");
    tickRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startedAtRef.current);
    }, 250);
  }, [session]);

  const stop = useCallback(async () => {
    const rec = recordingRef.current;
    if (!rec || !session) return;
    stopTicker();
    setStatus("saving");

    try {
      await rec.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const uri = rec.getURI();
      recordingRef.current = null;
      if (!uri) throw new Error("No recording URI");

      // Best-effort location - don't block save if denied.
      let lat: number | null = null;
      let long: number | null = null;
      const loc = await Location.requestForegroundPermissionsAsync();
      if (loc.granted) {
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        lat = pos.coords.latitude;
        long = pos.coords.longitude;
      }

      const fileName = `${Crypto.randomUUID()}.m4a`;
      const filePath = `${session.user.id}/${fileName}`;

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const bytes = decodeBase64(base64);

      const { error: uploadErr } = await supabase.storage
        .from(config.storage.recordingsBucket)
        .upload(filePath, bytes, { contentType: "audio/m4a", upsert: false });
      if (uploadErr) throw uploadErr;

      const sha256 = await hashFile(uri);
      const created_at = new Date().toISOString();
      const signature = await signRecording({ file_path: filePath, sha256, created_at });

      const { error: insertErr } = await supabase.from("recordings").insert({
        user_id:   session.user.id,
        file_path: filePath,
        lat,
        long,
        sha256,
        signature,
        created_at,
      });
      if (insertErr) throw insertErr;

      try { await FileSystem.deleteAsync(uri, { idempotent: true }); } catch {}

      setStatus("saved");
    } catch (e) {
      setStatus("error");
      setErrorMessage(e instanceof Error ? e.message : "generic");
    }
  }, [session]);

  const value = useMemo<RecordingState>(() => ({
    status, errorMessage, elapsedMs, start, stop, reset,
  }), [status, errorMessage, elapsedMs, start, stop, reset]);

  return <RecordingContext.Provider value={value}>{children}</RecordingContext.Provider>;
};

export const useRecording = (): RecordingState => {
  const ctx = useContext(RecordingContext);
  if (!ctx) throw new Error("useRecording must be used inside <RecordingProvider>");
  return ctx;
};

// Minimal base64 -> Uint8Array (no polyfill dependency, RN-safe).
const decodeBase64 = (b64: string): Uint8Array => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const lookup = new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) lookup[chars.charCodeAt(i)] = i;
  const clean = b64.replace(/[^A-Za-z0-9+/]/g, "");
  const len = clean.length;
  const pad = clean.endsWith("==") ? 2 : clean.endsWith("=") ? 1 : 0;
  const out = new Uint8Array(((len * 3) >> 2) - pad);
  let p = 0;
  for (let i = 0; i < len; i += 4) {
    const e1 = lookup[clean.charCodeAt(i)];
    const e2 = lookup[clean.charCodeAt(i + 1)];
    const e3 = lookup[clean.charCodeAt(i + 2)];
    const e4 = lookup[clean.charCodeAt(i + 3)];
    out[p++] = (e1 << 2) | (e2 >> 4);
    if (p < out.length) out[p++] = ((e2 & 15) << 4) | (e3 >> 2);
    if (p < out.length) out[p++] = ((e3 & 3) << 6) | e4;
  }
  return out;
};
