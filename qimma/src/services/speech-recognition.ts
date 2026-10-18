/**
 * Native fallback: Expo Go has no speech-recognition module, so speaking tasks
 * record audio for playback and use self-review. A development build can swap in
 * an on-device recogniser here without touching the scorers (see docs/ROADMAP.md).
 */
export interface RecognitionResult {
  transcript: string;
  confidence: number | null;
}

export interface Recognizer {
  supported: boolean;
  start: (onInterim?: (text: string) => void) => void;
  stop: () => Promise<RecognitionResult | null>;
  abort: () => void;
}

export function createRecognizer(): Recognizer {
  return {
    supported: false,
    start: () => undefined,
    stop: async () => null,
    abort: () => undefined,
  };
}
