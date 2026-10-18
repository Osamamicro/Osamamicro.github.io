import { useState } from 'react';
import { View } from 'react-native';

import { getTaskType, type RespondToSituationItem } from '@/core';

import { AudioPrompt, Passage, RecordPanel } from '../shared';
import type { RendererProps } from '../types';

/**
 * Respond to a Situation: read the situation and hear it, then respond aloud.
 * Practice mode lets the learner start without listening; mock mode waits for the audio.
 */
export function RespondToSituationRenderer({ item, mode, onSubmit, result }: RendererProps<RespondToSituationItem>) {
  const { timing } = getTaskType(item.type);
  const [heard, setHeard] = useState(false);
  return (
    <View style={{ gap: 16 }}>
      <Passage label="Situation" text={item.situation} />
      <AudioPrompt item={item} mode={mode} onFinished={() => setHeard(true)} showTranscript={!!result} />
      <RecordPanel
        prepSec={timing.prepSec ?? 20}
        responseSec={timing.responseSec ?? 40}
        mode={mode}
        ready={heard || mode === 'practice'}
        autoStart={heard}
        onComplete={onSubmit}
      />
    </View>
  );
}
