import { useState } from 'react';
import { View } from 'react-native';

import { getTaskType, type AnswerShortQuestionItem } from '@/core';

import { AudioPrompt, RecordPanel } from '../shared';
import type { RendererProps } from '../types';

/** Answer Short Question: hear the question, then answer in a few words within 10 seconds. */
export function AnswerShortQuestionRenderer({ item, mode, onSubmit, result }: RendererProps<AnswerShortQuestionItem>) {
  const { timing } = getTaskType(item.type);
  const [heard, setHeard] = useState(false);
  return (
    <View style={{ gap: 16 }}>
      <AudioPrompt item={item} mode={mode} onFinished={() => setHeard(true)} showTranscript={!!result} />
      <RecordPanel
        prepSec={timing.prepSec ?? 1}
        responseSec={timing.responseSec ?? 10}
        mode={mode}
        ready={heard}
        autoStart
        onComplete={onSubmit}
      />
    </View>
  );
}
