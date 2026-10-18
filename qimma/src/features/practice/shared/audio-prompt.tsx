import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { Button, Card, ProgressBar, Row, Text } from '@/components/ui';
import { audioScript, getTaskType, type Item } from '@/core';
import { useSettings } from '@/services/app-state';
import { speakUtterances, type SpeakHandle } from '@/services/tts';
import { useColors } from '@/theme';

import { useCountdown } from './use-countdown';

export interface AudioPromptProps {
  item: Item;
  mode: 'practice' | 'mock';
  /** Called each time the audio finishes playing. */
  onFinished?: () => void;
  /** Reveal the transcript (e.g. after submitting in practice mode). */
  showTranscript?: boolean;
}

type Status = 'countdown' | 'ready' | 'playing' | 'finished';

/**
 * Plays an item's audio prompt: a recorded file when the item has `audio`,
 * otherwise text-to-speech of its script. Mock mode auto-plays once after a short
 * countdown; practice mode allows replays and a speed setting.
 */
export function AudioPrompt({ item, mode, onFinished, showTranscript }: AudioPromptProps) {
  const c = useColors();
  const settings = useSettings();
  const utterances = audioScript(item) ?? [];
  const file = 'audio' in item ? item.audio : undefined;
  const player = useAudioPlayer(file ?? null);
  const fileStatus = useAudioPlayerStatus(player);
  const maxPlays = mode === 'mock' || settings.examMode ? (getTaskType(item.type).timing.audioPlays ?? 1) : Infinity;
  const [status, setStatus] = useState<Status>(mode === 'mock' ? 'countdown' : 'ready');
  const [plays, setPlays] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const handle = useRef<SpeakHandle | null>(null);
  const finishedRef = useRef(onFinished);
  finishedRef.current = onFinished;

  const words = utterances.reduce((n, u) => n + u.text.split(/\s+/).length, 0);
  const estimatedSec = Math.max(2, (words / (150 * settings.speechRate)) * 60);

  const finish = () => {
    setStatus('finished');
    finishedRef.current?.();
  };

  const play = () => {
    if (plays >= maxPlays) return;
    setPlays((p) => p + 1);
    setElapsed(0);
    setStatus('playing');
    if (file) {
      player.seekTo(0);
      player.play();
      return;
    }
    handle.current?.cancel();
    handle.current = speakUtterances(utterances, { rate: settings.speechRate, onDone: finish });
  };

  const countdown = useCountdown(3, status === 'countdown', play);

  // Recorded-file completion.
  useEffect(() => {
    if (file && status === 'playing' && fileStatus.didJustFinish) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileStatus.didJustFinish]);

  // Progress estimate for TTS (engines do not report duration).
  useEffect(() => {
    if (status !== 'playing' || file) return;
    const started = Date.now();
    const id = setInterval(() => setElapsed((Date.now() - started) / 1000), 200);
    return () => clearInterval(id);
  }, [status, file]);

  useEffect(() => () => handle.current?.cancel(), []);

  const progress = file
    ? fileStatus.duration > 0
      ? fileStatus.currentTime / fileStatus.duration
      : 0
    : status === 'finished'
      ? 1
      : Math.min(0.97, elapsed / estimatedSec);

  return (
    <Card>
      <Row style={{ justifyContent: 'space-between' }}>
        <Text variant="subheading">
          {status === 'countdown' && `Audio starts in ${countdown.left}s`}
          {status === 'ready' && 'Audio ready'}
          {status === 'playing' && 'Playing…'}
          {status === 'finished' && 'Audio finished'}
        </Text>
        {maxPlays !== Infinity && (
          <Text variant="small" tone="muted">
            {Math.max(0, maxPlays - plays)} play(s) left
          </Text>
        )}
      </Row>
      <ProgressBar value={status === 'countdown' ? 0 : progress} color={c.skill('listening')} />
      {mode === 'practice' && (
        <Row>
          <Button
            label={status === 'playing' ? 'Restart' : plays === 0 ? '▶ Play' : '↻ Replay'}
            size="sm"
            disabled={plays >= maxPlays}
            onPress={play}
          />
          {status === 'playing' && (
            <Button
              label="Stop"
              size="sm"
              variant="secondary"
              onPress={() => {
                handle.current?.cancel();
                player.pause();
                finish();
              }}
            />
          )}
        </Row>
      )}
      {showTranscript && utterances.length > 0 && (
        <View style={{ gap: 6 }}>
          <Text variant="caption" tone="muted">
            TRANSCRIPT
          </Text>
          {utterances.map((u, i) => (
            <Text key={i} selectable>
              {utterances.length > 1 ? <Text variant="subheading">{u.speaker}: </Text> : null}
              {u.text}
            </Text>
          ))}
        </View>
      )}
    </Card>
  );
}
