import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui';
import type { SelectMissingWordItem } from '@/core';

import { AudioPrompt, ChoiceList, Passage, SubmitBar } from '../shared';
import type { RendererProps } from '../types';
import { withheldScript } from './helpers';

/**
 * Select Missing Word: the recording stops before its ending, so the audio is played
 * without the answer words. The full recording is shown once the answer is submitted.
 */
export function SelectMissingWordRenderer({ item, mode, onSubmit, onDraft, result }: RendererProps<SelectMissingWordItem>) {
  const [selected, setSelected] = useState<string[]>([]);
  // `answer` is an option id; the ending we must not speak is that option's text.
  const ending = item.options.find((o) => o.id === item.answer)?.text ?? '';
  const spoken = useMemo<SelectMissingWordItem>(
    () => ({ ...item, script: withheldScript(item.script, ending) }),
    [item, ending],
  );
  const change = (ids: string[]) => {
    setSelected(ids);
    onDraft?.({ kind: 'choice', selected: ids });
  };
  return (
    <View style={{ gap: 16 }}>
      <AudioPrompt item={spoken} mode={mode} showTranscript={false} />
      <Text variant="small" tone="muted">
        The recording stops before the last word(s). Choose the ending.
      </Text>
      <ChoiceList
        options={item.options}
        selected={selected}
        onChange={change}
        correct={result ? [item.answer] : undefined}
        disabled={!!result}
      />
      {result ? <Passage label="Full recording" text={`${withheldScript(item.script, ending)} ${ending}`} /> : null}
      <SubmitBar
        mode={mode}
        submitted={!!result}
        disabled={selected.length === 0}
        onPress={() => onSubmit({ kind: 'choice', selected })}
      />
    </View>
  );
}
