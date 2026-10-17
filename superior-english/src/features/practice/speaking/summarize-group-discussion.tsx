import { useState } from 'react';
import { View } from 'react-native';

import { getTaskType, type SummarizeGroupDiscussionItem } from '@/core';

import { AudioPrompt, RecordPanel } from '../shared';
import type { RendererProps } from '../types';

/** Summarize Group Discussion: hear several speakers once, then summarize the main points and views. */
export function SummarizeGroupDiscussionRenderer({
  item,
  mode,
  onSubmit,
  result,
}: RendererProps<SummarizeGroupDiscussionItem>) {
  const { timing } = getTaskType(item.type);
  const [heard, setHeard] = useState(false);
  return (
    <View style={{ gap: 16 }}>
      <AudioPrompt item={item} mode={mode} onFinished={() => setHeard(true)} showTranscript={!!result} />
      <RecordPanel
        prepSec={timing.prepSec ?? 10}
        responseSec={timing.responseSec ?? 120}
        mode={mode}
        ready={heard}
        autoStart
        onComplete={onSubmit}
      />
    </View>
  );
}
