import type { RecognitionResult, Recognizer } from './speech-recognition';

export type { RecognitionResult, Recognizer } from './speech-recognition';

/* Web Speech API (Chrome, Edge, Safari). Not in TS DOM lib everywhere, so typed loosely. */
type AnyRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: any) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: any) => void) | null;
};

function ctor(): (new () => AnyRecognition) | null {
  const w = globalThis as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function createRecognizer(lang = 'en-US'): Recognizer {
  const Ctor = ctor();
  if (!Ctor) {
    return { supported: false, start: () => undefined, stop: async () => null, abort: () => undefined };
  }
  let rec: AnyRecognition | null = null;
  let active = false;
  let finals: { text: string; confidence: number }[] = [];
  let interim = '';
  let resolveStop: ((r: RecognitionResult | null) => void) | null = null;
  // Set on errors that will not recover by restarting (mic blocked, no service, no audio device).
  let fatal = false;

  const result = (): RecognitionResult => {
    const transcript = [...finals.map((f) => f.text), interim].join(' ').replace(/\s+/g, ' ').trim();
    const confs = finals.map((f) => f.confidence).filter((c) => c > 0);
    return { transcript, confidence: confs.length ? confs.reduce((a, b) => a + b, 0) / confs.length : null };
  };

  /** null when recognition failed fatally and heard nothing: callers fall back to self-review. */
  const final = (): RecognitionResult | null => {
    const r = result();
    return fatal && r.transcript === '' ? null : r;
  };

  const begin = (onInterim?: (text: string) => void) => {
    rec = new Ctor();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finals.push({ text: r[0].transcript, confidence: r[0].confidence ?? 0 });
        else interim += r[0].transcript;
      }
      onInterim?.(result().transcript);
    };
    rec.onerror = (e: any) => {
      if (['not-allowed', 'service-not-allowed', 'audio-capture', 'language-not-supported'].includes(e?.error)) fatal = true;
    };
    rec.onend = () => {
      // Chrome ends continuous sessions after silence; restart while we are still recording.
      if (active && !fatal) {
        try {
          begin(onInterim);
        } catch {
          active = false;
        }
        return;
      }
      resolveStop?.(final());
      resolveStop = null;
    };
    rec.start();
  };

  return {
    supported: true,
    start: (onInterim) => {
      finals = [];
      interim = '';
      fatal = false;
      active = true;
      begin(onInterim);
    },
    stop: () =>
      new Promise<RecognitionResult | null>((resolve) => {
        active = false;
        resolveStop = resolve;
        try {
          rec?.stop();
        } catch {
          resolve(final());
        }
        // Safety net: some browsers never fire onend after stop().
        setTimeout(() => {
          if (resolveStop) {
            resolveStop(final());
            resolveStop = null;
          }
        }, 1500);
      }),
    abort: () => {
      active = false;
      resolveStop = null;
      try {
        rec?.abort();
      } catch {
        // already stopped
      }
    },
  };
}
