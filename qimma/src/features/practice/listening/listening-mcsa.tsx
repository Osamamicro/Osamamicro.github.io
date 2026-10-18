import { useState } from 'react';
import { View } from 'react-native';

import type { ListeningMCSAItem } from '@/core';

import { AudioPrompt, ChoiceList, Passage, SubmitBar } from '../shared';
import type { RendererProps } from '../types';

/** Listening multiple choice, single answer: hear the recording, pick the one best answer. */
export function ListeningMCSARenderer({ item, mode, onSubmit, onDraft, result }: RendererProps<ListeningMCSAItem>) {
  const [selected, setSelected] = useState<string[]>([]);
  const change = (ids: string[]) => {
    setSelected(ids);
    onDraft?.({ kind: 'choice', selected: ids });
  };
  return (
    <View style={{ gap: 16 }}>
      <AudioPrompt item={item} mode={mode} showTranscript={!!result} />
      <Passage label="Question" text={item.question} />
      <ChoiceList
        options={item.options}
        selected={selected}
        onChange={change}
        correct={result ? [item.answer] : undefined}
        disabled={!!result}
      />
      <SubmitBar
        mode={mode}
        submitted={!!result}
        disabled={selected.length === 0}
        onPress={() => onSubmit({ kind: 'choice', selected })}
      />
    </View>
  );
}
