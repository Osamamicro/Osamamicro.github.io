import { useState } from 'react';
import { View } from 'react-native';

import type { ReadingMCSAItem } from '@/core';

import { ChoiceList, Passage, SubmitBar } from '../shared';
import type { RendererProps } from '../types';

/** Reference objective renderer: local answer state, onDraft on change, SubmitBar to finish. */
export function ReadingMCSARenderer({ item, mode, onSubmit, onDraft, result }: RendererProps<ReadingMCSAItem>) {
  const [selected, setSelected] = useState<string[]>([]);
  const change = (ids: string[]) => {
    setSelected(ids);
    onDraft?.({ kind: 'choice', selected: ids });
  };
  return (
    <View style={{ gap: 16 }}>
      <Passage text={item.passage} />
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
