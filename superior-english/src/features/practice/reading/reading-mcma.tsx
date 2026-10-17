import { useState } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui';
import type { ReadingMCMAItem } from '@/core';

import { ChoiceList, Passage, SubmitBar } from '../shared';
import type { RendererProps } from '../types';

/** Reading: Multiple Choice, Multiple Answers. Each wrong pick costs a point, so pick only what you are sure of. */
export function ReadingMCMARenderer({ item, mode, onSubmit, onDraft, result }: RendererProps<ReadingMCMAItem>) {
  const [selected, setSelected] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const locked = !!result || done;

  const change = (ids: string[]) => {
    setSelected(ids);
    onDraft?.({ kind: 'choice', selected: ids });
  };
  const submit = () => {
    setDone(true);
    onSubmit({ kind: 'choice', selected });
  };

  return (
    <View style={{ gap: 16 }}>
      <Passage text={item.passage} />
      <Passage label="Question" text={item.question} />
      <Text variant="caption" tone="muted">
        SELECT ALL THAT APPLY
      </Text>
      <ChoiceList
        options={item.options}
        multiple
        selected={selected}
        onChange={change}
        correct={result ? item.answers : undefined}
        disabled={locked}
      />
      <SubmitBar mode={mode} submitted={locked} disabled={selected.length === 0 || locked} onPress={submit} />
    </View>
  );
}
