import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Chip, ProgressBar, Row, Text } from '@/components/ui';
import type { SpeechResponse } from '@/core';
import { useColors } from '@/theme';

import { formatClock, useCountdown } from './use-countdown';
import { useSpeechCapture } from './use-speech-capture';

type Phase = 'idle' | 'prep' | 'recording' | 'processing' | 'rate' | 'done';

export interface RecordPanelProps {
  prepSec: number;
  responseSec: number;
  mode: 'practice' | 'mock';
  /** False while something must happen first (e.g. the audio prompt is still playing). */
  ready?: boolean;
  /** Start the prep countdown as soon as `ready` is true, in practice mode too (audio tasks). */
  autoStart?: boolean;
  onComplete: (response: SpeechResponse) => void;
}

const RATINGS = [0, 0.25, 0.5, 0.75, 1];

/**
 * Preparation countdown → recording window → result. In mock mode it starts by
 * itself once `ready`; in practice mode the learner taps Begin (also satisfies
 * browsers that need a user gesture before using the microphone).
 */
export function RecordPanel({ prepSec, responseSec, mode, ready = true, autoStart = false, onComplete }: RecordPanelProps) {
  const c = useColors();
  const capture = useSpeechCapture();
  const [phase, setPhase] = useState<Phase>('idle');
  const [response, setResponse] = useState<SpeechResponse | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const player = useAudioPlayer(response?.audioUri ?? null);
  const stopping = useRef(false);

  const startRecording = async () => {
    stopping.current = false;
    if (process.env.EXPO_OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    const ok = await capture.start();
    setPhase(ok ? 'recording' : 'idle');
  };

  const stopRecording = async () => {
    if (stopping.current) return;
    stopping.current = true;
    setPhase('processing');
    const r = await capture.stop();
    setResponse(r);
    // No recogniser (Expo Go on phones): ask for a quick self-rating in mock mode too,
    // otherwise the answer would carry no score at all.
    if (r.transcript === null) {
      setPhase('rate');
    } else {
      setPhase('done');
      onComplete(r);
    }
  };

  const prep = useCountdown(prepSec, phase === 'prep', () => void startRecording());
  const rec = useCountdown(responseSec, phase === 'recording', () => void stopRecording());

  useEffect(() => {
    if ((mode === 'mock' || autoStart) && ready && phase === 'idle') setPhase('prep');
  }, [mode, autoStart, ready, phase]);

  useEffect(() => () => capture.cancel(), [capture.cancel]);

  const submitRating = () => {
    if (!response) return;
    const r = { ...response, selfRating: rating };
    setPhase('done');
    onComplete(r);
  };

  return (
    <Card>
      {phase === 'idle' && (
        <View style={{ gap: 12 }}>
          <Text tone="muted">
            {prepSec > 1 ? `Preparation ${prepSec}s, then recording ${responseSec}s.` : `Recording ${responseSec}s starts right away.`}
          </Text>
          {capture.error ? <Text tone="danger">{capture.error}</Text> : null}
          <Button label={ready ? 'Begin' : 'Waiting for audio…'} disabled={!ready} onPress={() => setPhase(prepSec > 1 ? 'prep' : 'recording')} />
          {!capture.recognitionSupported && (
            <Text variant="small" tone="faint">
              Automatic speech scoring runs in the web app on Chrome or Edge. Here you can record, listen back and self-rate.
            </Text>
          )}
        </View>
      )}

      {phase === 'prep' && (
        <View style={{ gap: 12 }}>
          <Text variant="subheading">Recording starts in {prep.left}s</Text>
          <ProgressBar value={1 - prep.left / Math.max(prepSec, 1)} color={c.warning} />
          <Button label="Start recording now" variant="secondary" onPress={() => void startRecording()} />
        </View>
      )}

      {/* Starting from idle with no prep goes straight to recording; the hook starts on mount. */}
      {phase === 'recording' && !capture.recording && <AutoStart onStart={startRecording} />}

      {phase === 'recording' && capture.recording && (
        <View style={{ gap: 12 }}>
          <Row>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.danger }} />
            <Text variant="subheading" style={{ fontVariant: ['tabular-nums'] }}>
              Recording {formatClock(responseSec - rec.left)} / {formatClock(responseSec)}
            </Text>
          </Row>
          <ProgressBar value={1 - rec.left / responseSec} color={c.danger} />
          {mode === 'practice' && capture.live ? (
            <Text tone="muted" selectable>
              {capture.live}
            </Text>
          ) : null}
          <Button label="Stop" variant="danger" onPress={() => void stopRecording()} />
        </View>
      )}

      {phase === 'processing' && <Text tone="muted">Processing your answer…</Text>}

      {(phase === 'rate' || phase === 'done') && response && (
        <View style={{ gap: 12 }}>
          {response.audioUri ? (
            <Button label="▶ Play my recording" variant="secondary" onPress={() => { player.seekTo(0); player.play(); }} />
          ) : null}
          {response.transcript !== null && (
            <View style={{ gap: 4 }}>
              <Text variant="caption" tone="muted">
                WHAT WE HEARD
              </Text>
              <Text selectable>{response.transcript || '(nothing recognised)'}</Text>
            </View>
          )}
          {phase === 'rate' && (
            <View style={{ gap: 8 }}>
              <Text>How much of the expected content did you cover?</Text>
              <Row>
                {RATINGS.map((r) => (
                  <Chip key={r} label={`${Math.round(r * 100)}%`} selected={rating === r} onPress={() => setRating(r)} />
                ))}
              </Row>
              <Button label="Submit self-review" disabled={rating === null} onPress={submitRating} />
            </View>
          )}
        </View>
      )}
    </Card>
  );
}

function AutoStart({ onStart }: { onStart: () => void | Promise<void> }) {
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void onStart();
  }, [onStart]);
  return null;
}
