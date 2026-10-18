import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { type HighlightIncorrectWordsItem, parseHiw } from '@/core';
import { radius, space, useColors } from '@/theme';

import { AudioPrompt, SubmitBar } from '../shared';
import type { RendererProps } from '../types';

/** Highlight Incorrect Words: tap each word on screen that differs from what is spoken. */
export function HighlightIncorrectWordsRenderer({
  item,
  mode,
  onSubmit,
  onDraft,
  result,
}: RendererProps<HighlightIncorrectWordsItem>) {
  const c = useColors();
  const { shown, incorrect } = useMemo(() => parseHiw(item.text), [item.text]);
  const [picked, setPicked] = useState<number[]>([]);

  const toggle = (i: number) => {
    const next = picked.includes(i) ? picked.filter((x) => x !== i) : [...picked, i].sort((a, b) => a - b);
    setPicked(next);
    onDraft?.({ kind: 'indices', indices: next });
  };

  return (
    <View style={{ gap: 16 }}>
      <AudioPrompt item={item} mode={mode} showTranscript={!!result} />
      <Card>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
          {shown.map((word, i) => {
            const isPicked = picked.includes(i);
            const isIncorrect = incorrect.includes(i);
            let border: string = c.border;
            let bg: string = c.surface;
            let width = 1.5;
            if (!result) {
              if (isPicked) {
                border = c.primary;
                bg = c.primarySoft;
              }
            } else if (isPicked) {
              border = isIncorrect ? c.success : c.danger;
              bg = isIncorrect ? c.successSoft : c.dangerSoft;
            } else if (isIncorrect) {
              border = c.warning;
              width = 2.5;
            }
            return (
              <Pressable
                key={i}
                accessibilityRole="checkbox"
                accessibilityLabel={word}
                accessibilityState={{ checked: isPicked, disabled: !!result }}
                disabled={!!result}
                onPress={() => toggle(i)}
                style={{
                  minHeight: 40,
                  justifyContent: 'center',
                  paddingVertical: space.xs + 2,
                  paddingHorizontal: space.sm,
                  borderRadius: radius.md,
                  borderWidth: width,
                  borderColor: border,
                  backgroundColor: bg,
                }}>
                <Text>{word}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>
      {result ? (
        <Text variant="small" tone="muted">
          Green: correct. Red: marked wrongly. Amber outline: a difference you missed.
        </Text>
      ) : null}
      <SubmitBar mode={mode} submitted={!!result} onPress={() => onSubmit({ kind: 'indices', indices: picked })} />
    </View>
  );
}
