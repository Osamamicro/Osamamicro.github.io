import { useState } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui';
import type { ListeningMCMAItem } from '@/core';
import { space } from '@/theme';

import { AudioPrompt, ChoiceList, Passage, SubmitBar } from '../shared';
import type { RendererProps } from '../types';

/** Listening multiple choice, multiple answers: tick every option the recording supports. */
export function ListeningMCMARenderer({ item, mode, onSubmit, onDraft, result }: RendererProps<ListeningMCMAItem>) {
  const [selected, setSelected] = useState<string[]>([]);
  const change = (ids: string[]) => {
    setSelected(ids);
    onDraft?.({ kind: 'choice', selected: ids });
  };
  return (
    <View style={{ gap: 16 }}>
      <AudioPrompt item={item} mode={mode} showTranscript={!!result} />
      <Passage label="Question" text={item.question} />
      <View style={{ gap: space.sm }}>
        <Text variant="small" tone="muted">
          Select all that apply.
        </Text>
        <ChoiceList
          multiple
          options={item.options}
          selected={selected}
          onChange={change}
          correct={result ? item.answers : undefined}
          disabled={!!result}
        />
      </View>
      <SubmitBar
        mode={mode}
        submitted={!!result}
        disabled={selected.length === 0}
        onPress={() => onSubmit({ kind: 'choice', selected })}
      />
    </View>
  );
}
