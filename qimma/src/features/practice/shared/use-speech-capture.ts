import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';
import { useCallback, useMemo, useRef, useState } from 'react';

import type { SpeechResponse } from '@/core';
import { createRecognizer } from '@/services/speech-recognition';

/**
 * Records the microphone (for playback) and, where available, runs speech
 * recognition in parallel (for scoring). Returns a SpeechResponse on stop.
 */
export function useSpeechCapture() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recognizer = useMemo(() => createRecognizer(), []);
  const [recording, setRecording] = useState(false);
  const [live, setLive] = useState('');
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef(0);
  const audioOk = useRef(false);

  const start = useCallback(async (): Promise<boolean> => {
    setError(null);
    setLive('');
    try {
      const perm = await requestRecordingPermissionsAsync();
      if (!perm.granted) {
        setError('Microphone permission is needed for speaking tasks.');
        return false;
      }
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      audioOk.current = true;
    } catch {
      // Recording can fail (e.g. insecure origin) while recognition still works.
      audioOk.current = false;
    }
    if (recognizer.supported) {
      try {
        recognizer.start(setLive);
      } catch {
        // Recogniser busy or blocked; we still have the audio.
      }
    }
    if (!audioOk.current && !recognizer.supported) {
      setError('Could not access the microphone.');
      return false;
    }
    startedAt.current = Date.now();
    setRecording(true);
    return true;
  }, [recorder, recognizer]);

  const stop = useCallback(async (): Promise<SpeechResponse> => {
    const durationMs = Date.now() - startedAt.current;
    setRecording(false);
    const [, recognised] = await Promise.all([
      audioOk.current ? recorder.stop().catch(() => undefined) : Promise.resolve(),
      recognizer.supported ? recognizer.stop() : Promise.resolve(null),
    ]);
    try {
      await setAudioModeAsync({ allowsRecording: false });
    } catch {
      // ignore
    }
    return {
      kind: 'speech',
      // null = no usable recogniser this time (unsupported or failed): the panel asks for self-review.
      transcript: recognised ? recognised.transcript : null,
      confidence: recognised?.confidence ?? null,
      durationMs,
      audioUri: audioOk.current ? recorder.uri : null,
    };
  }, [recorder, recognizer]);

  const cancel = useCallback(() => {
    setRecording(false);
    recognizer.abort();
    if (audioOk.current) recorder.stop().catch(() => undefined);
  }, [recorder, recognizer]);

  return { start, stop, cancel, recording, live, error, recognitionSupported: recognizer.supported };
}
