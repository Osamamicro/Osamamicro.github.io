import * as Speech from 'expo-speech';

import type { Utterance } from '@/core';

/*
 * Listening prompts are generated with on-device text-to-speech, so the app ships
 * no copyrighted audio. Different speakers get different voices/pitches so group
 * discussions stay easy to follow.
 */

let englishVoices: Speech.Voice[] | null = null;

async function voices(): Promise<Speech.Voice[]> {
  if (englishVoices && englishVoices.length > 0) return englishVoices;
  try {
    const all = await Speech.getAvailableVoicesAsync();
    englishVoices = all.filter((v) => v.language?.toLowerCase().startsWith('en'));
  } catch {
    englishVoices = [];
  }
  return englishVoices;
}

export interface SpeakHandle {
  cancel: () => void;
}

/** Speaks utterances in order. Resolves `onDone` after the last one (not after cancel). */
export function speakUtterances(
  utterances: Utterance[],
  opts: { rate?: number; onStart?: () => void; onDone?: () => void; onUtterance?: (index: number) => void } = {},
): SpeakHandle {
  let cancelled = false;
  const speakerIndex = new Map<string, number>();
  utterances.forEach((u) => {
    if (!speakerIndex.has(u.speaker)) speakerIndex.set(u.speaker, speakerIndex.size);
  });

  (async () => {
    const list = await voices();
    if (cancelled) return;
    opts.onStart?.();
    const next = (i: number) => {
      if (cancelled) return;
      if (i >= utterances.length) {
        opts.onDone?.();
        return;
      }
      const u = utterances[i];
      const n = speakerIndex.get(u.speaker) ?? 0;
      const voice = list.length > 0 ? list[n % list.length] : undefined;
      const pitch = u.voice === 'female' ? 1.12 : u.voice === 'male' ? 0.88 : [1, 0.9, 1.1, 0.95][n % 4];
      opts.onUtterance?.(i);
      Speech.speak(u.text, {
        language: voice?.language ?? 'en-US',
        voice: voice?.identifier,
        pitch,
        rate: opts.rate ?? 1,
        onDone: () => next(i + 1),
        onStopped: () => undefined,
        onError: () => next(i + 1),
      });
    };
    next(0);
  })();

  return {
    cancel: () => {
      cancelled = true;
      Speech.stop();
    },
  };
}

export function stopSpeaking() {
  Speech.stop();
}
