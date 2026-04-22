import React, {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';
import type { LocationObject } from 'expo-location';

interface RecordingContextType {
  isRecording: boolean;
  duration: number;
  location: LocationObject | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<{ uri: string; durationSec: number } | null>;
}

const RecordingContext = createContext<RecordingContextType | null>(null);

export function RecordingProvider({ children }: { children: ReactNode }) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [location, setLocation] = useState<LocationObject | null>(null);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const locationSubRef = useRef<Location.LocationSubscription | null>(null);

  async function startRecording() {
    // Request permissions
    const { granted: audioGranted } = await Audio.requestPermissionsAsync();
    if (!audioGranted) throw new Error('audio_permission_denied');

    const { granted: locGranted } =
      await Location.requestForegroundPermissionsAsync();

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recordingOptions: Audio.RecordingOptions = {
      ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
      android: {
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
        extension: '.m4a',
        outputFormat: Audio.AndroidOutputFormat.MPEG_4,
        audioEncoder: Audio.AndroidAudioEncoder.AAC,
      },
      ios: {
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
        extension: '.m4a',
      },
    };

    const { recording } = await Audio.Recording.createAsync(recordingOptions);
    recordingRef.current = recording;
    setIsRecording(true);
    setDuration(0);

    // Start duration timer
    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);

    // Start location watch
    if (locGranted) {
      locationSubRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 2000 },
        (loc) => setLocation(loc)
      );
    }
  }

  async function stopRecording() {
    if (!recordingRef.current) return null;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    locationSubRef.current?.remove();
    locationSubRef.current = null;

    await recordingRef.current.stopAndUnloadAsync();
    const uri = recordingRef.current.getURI() ?? '';
    const status = await recordingRef.current.getStatusAsync();
    const durationSec = Math.floor(
      ((status as { durationMillis?: number }).durationMillis ?? 0) / 1000
    );

    recordingRef.current = null;
    setIsRecording(false);
    setDuration(0);

    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

    return { uri, durationSec };
  }

  return (
    <RecordingContext.Provider
      value={{ isRecording, duration, location, startRecording, stopRecording }}
    >
      {children}
    </RecordingContext.Provider>
  );
}

export function useRecordingContext() {
  const ctx = useContext(RecordingContext);
  if (!ctx) throw new Error('useRecordingContext must be used inside RecordingProvider');
  return ctx;
}
