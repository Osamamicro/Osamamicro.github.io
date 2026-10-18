import { useState } from 'react';
import { View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { getTaskType, type RetellLectureItem } from '@/core';

import { AudioPrompt, RecordPanel } from '../shared';
import type { RendererProps } from '../types';

/** Re-tell Lecture: listen to the lecture once, then re-tell it. Recording opens after the audio ends. */
export function RetellLectureRenderer({ item, mode, onSubmit, result }: RendererProps<RetellLectureItem>) {
  const { timing } = getTaskType(item.type);
  const [heard, setHeard] = useState(false);
  return (
    <View style={{ gap: 16 }}>
      {/* Mock mode is exam conditions, so the note-taking hint is practice-only. */}
      {mode === 'practice' ? <NotesHint /> : null}
      <AudioPrompt item={item} mode={mode} onFinished={() => setHeard(true)} showTranscript={!!result} />
      <RecordPanel
        prepSec={timing.prepSec ?? 10}
        responseSec={timing.responseSec ?? 40}
        mode={mode}
        ready={heard}
        autoStart
        onComplete={onSubmit}
      />
    </View>
  );
}

function NotesHint() {
  return (
    <Card tone="primary">
      <Text variant="caption" tone="muted">
        NOTES
      </Text>
      <Text>Take notes on keywords while you listen.</Text>
    </Card>
  );
}
