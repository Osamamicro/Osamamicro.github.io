import { useMemo, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

import { Text } from '@/components/ui';
import type { ListeningFillBlanksItem } from '@/core';
import { radius, space, type as typeScale, useColors } from '@/theme';

import { AudioPrompt, SubmitBar } from '../shared';
import type { RendererProps } from '../types';
import { gapTokens, isBlankCorrect } from './helpers';

/** Space between flowed items; a token with no space before it pulls back by the same amount. */
const GAP = 6;

/** Listening fill in the blanks: the transcript with a text box for each missing word. */
export function ListeningFillBlanksRenderer({ item, mode, onSubmit, onDraft, result }: RendererProps<ListeningFillBlanksItem>) {
  const c = useColors();
  const tokens = useMemo(() => gapTokens(item.transcript), [item.transcript]);
  const [values, setValues] = useState<string[]>(() => item.answers.map(() => ''));
  const inputs = useRef<({ focus: () => void } | null)[]>([]);

  const change = (index: number, value: string) => {
    const next = values.map((v, i) => (i === index ? value : v));
    setValues(next);
    onDraft?.({ kind: 'blanks', values: next });
  };

  return (
    <View style={{ gap: 16 }}>
      <AudioPrompt item={item} mode={mode} showTranscript={!!result} />
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          columnGap: GAP,
          rowGap: space.sm,
        }}>
        {tokens.map((t, i) => {
          const attach = !t.spaced && i > 0 ? { marginLeft: -GAP } : undefined;
          if (t.kind === 'word') {
            return (
              <Text key={i} style={[{ marginTop: 8 }, attach]}>
                {t.text}
              </Text>
            );
          }
          const right = result ? isBlankCorrect(values[t.index], item.answers[t.index]) : undefined;
          const border = right === undefined ? c.border : right ? c.success : c.danger;
          const bg = right === undefined ? c.surface : right ? c.successSoft : c.dangerSoft;
          return (
            <View key={i} style={[{ gap: space.xs, alignItems: 'flex-start' }, attach]}>
              <TextInput
                ref={(el) => {
                  inputs.current[t.index] = el;
                }}
                value={values[t.index]}
                onChangeText={(v) => change(t.index, v)}
                editable={!result}
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                returnKeyType={t.index < item.answers.length - 1 ? 'next' : 'done'}
                onSubmitEditing={() => inputs.current[t.index + 1]?.focus()}
                accessibilityLabel={`Gap ${t.index + 1} of ${item.answers.length}`}
                style={[
                  typeScale.body,
                  {
                    width: 110,
                    minHeight: 40,
                    paddingHorizontal: space.sm,
                    paddingVertical: space.xs,
                    borderWidth: 1.5,
                    borderRadius: radius.md,
                    borderColor: border,
                    backgroundColor: bg,
                    color: c.text,
                  },
                ]}
              />
              {right === false ? (
                <Text variant="small" tone="success" selectable>
                  Answer: {item.answers[t.index]}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
      <SubmitBar
        mode={mode}
        submitted={!!result}
        disabled={values.every((v) => v.trim() === '')}
        onPress={() => onSubmit({ kind: 'blanks', values })}
      />
    </View>
  );
}
