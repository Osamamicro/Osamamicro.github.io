import { View } from 'react-native';

import { getTaskType, type ReadAloudItem } from '@/core';

import { Passage, RecordPanel } from '../shared';
import type { RendererProps } from '../types';

/** Reference speaking renderer: show the text, prep, record, submit the SpeechResponse. */
export function ReadAloudRenderer({ item, mode, onSubmit }: RendererProps<ReadAloudItem>) {
  const { timing } = getTaskType(item.type);
  return (
    <View style={{ gap: 16 }}>
      <Passage text={item.text} />
      <RecordPanel
        prepSec={timing.prepSec ?? 35}
        responseSec={timing.responseSec ?? 40}
        mode={mode}
        onComplete={onSubmit}
      />
    </View>
  );
}
