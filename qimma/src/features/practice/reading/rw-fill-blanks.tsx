import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { Card, Chip, Row, Text } from '@/components/ui';
import type { RWFillBlanksItem } from '@/core';

import { SubmitBar } from '../shared';
import type { RendererProps } from '../types';
import { ClozeText, type ClozeGap } from './cloze-text';
import { stableShuffle } from './seeded-shuffle';

/** Reading & Writing: Fill in the Blanks. Tap a gap, then choose one of its four words. */
export function RWFillBlanksRenderer({ item, mode, onSubmit, onDraft, result }: RendererProps<RWFillBlanksItem>) {
  // Options are shuffled per gap (stable per item) so the answer is never always listed first.
  const options = useMemo(() => item.blanks.map((b, i) => stableShuffle(b.options, `${item.id}#${i}`)), [item.id, item.blanks]);
  const [values, setValues] = useState<(string | null)[]>(() => item.blanks.map(() => null));
  const [open, setOpen] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const locked = !!result || done;

  const emit = (next: (string | null)[]) => onDraft?.({ kind: 'blanks', values: next.map((v) => v ?? '') });

  const pressGap = (index: number) => {
    if (locked) return;
    setOpen(open === index ? null : index);
  };

  const choose = (index: number, word: string) => {
    const next = values.map((v, i) => (i === index ? word : v));
    setValues(next);
    setOpen(null);
    emit(next);
  };

  const submit = () => {
    setDone(true);
    onSubmit({ kind: 'blanks', values: values.map((v) => v ?? '') });
  };

  const gaps = item.blanks.map((b, i): ClozeGap => {
    const value = values[i];
    return {
      value,
      active: !locked && open === i,
      status: result ? (value === b.answer ? 'correct' : 'wrong') : undefined,
      answer: b.answer,
    };
  });

  return (
    <View style={{ gap: 16 }}>
      <Text variant="small" tone="muted">
        Tap a gap, then choose the word that fits.
      </Text>
      <ClozeText text={item.text} gaps={gaps} onGapPress={pressGap} disabled={locked} />
      {open !== null && !locked ? (
        <Card>
          <Text variant="caption" tone="muted">
            GAP {open + 1}: CHOOSE A WORD
          </Text>
          <Row>
            {options[open].map((word) => (
              <Chip key={word} label={word} selected={values[open] === word} onPress={() => choose(open, word)} />
            ))}
          </Row>
        </Card>
      ) : null}
      <SubmitBar mode={mode} submitted={locked} disabled={values.some((v) => v === null) || locked} onPress={submit} />
    </View>
  );
}
