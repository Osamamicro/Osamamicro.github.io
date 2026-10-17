import { useState } from 'react';
import { View } from 'react-native';

import { getTaskType, type RepeatSentenceItem } from '@/core';

import { AudioPrompt, RecordPanel } from '../shared';
import type { RendererProps } from '../types';

/** Repeat Sentence: listen once, then repeat it. Recording opens as soon as the audio ends. */
export function RepeatSentenceRenderer({ item, mode, onSubmit, result }: RendererProps<RepeatSentenceItem>) {
  const { timing } = getTaskType(item.type);
  const [heard, setHeard] = useState(false);
  return (
    <View style={{ gap: 16 }}>
      <AudioPrompt item={item} mode={mode} onFinished={() => setHeard(true)} showTranscript={!!result} />
      <RecordPanel
        prepSec={timing.prepSec ?? 1}
        responseSec={timing.responseSec ?? 15}
        mode={mode}
        ready={heard}
        autoStart
        onComplete={onSubmit}
      />
    </View>
  );
}
