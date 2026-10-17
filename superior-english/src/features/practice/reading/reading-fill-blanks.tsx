import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { Card, Chip, Row, Text } from '@/components/ui';
import type { ReadingFillBlanksItem } from '@/core';

import { SubmitBar } from '../shared';
import type { RendererProps } from '../types';
import { ClozeText, type ClozeGap } from './cloze-text';
import { stableShuffle } from './seeded-shuffle';

function firstEmpty(placed: (number | null)[]): number | null {
  const i = placed.indexOf(null);
  return i === -1 ? null : i;
}

/** The first empty gap after `from`, else the first empty gap overall, else null. */
function nextEmpty(placed: (number | null)[], from: number): number | null {
  for (let i = from + 1; i < placed.length; i++) if (placed[i] === null) return i;
  return firstEmpty(placed);
}

/**
 * Reading: Fill in the Blanks. A shared word bank (answers plus distractors) is placed
 * into the highlighted gap; a bank word can be used once and a filled gap returns it.
 */
export function ReadingFillBlanksRenderer({ item, mode, onSubmit, onDraft, result }: RendererProps<ReadingFillBlanksItem>) {
  const bank = useMemo(
    () => stableShuffle([...item.answers, ...item.distractors], item.id),
    [item.id, item.answers, item.distractors],
  );
  // placed[gap] = index into `bank`, or null while the gap is empty.
  const [placed, setPlaced] = useState<(number | null)[]>(() => item.answers.map(() => null));
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const locked = !!result || done;

  // The highlighted gap is the one the learner picked, else the first empty one.
  const active = picked !== null && placed[picked] === null ? picked : firstEmpty(placed);
  const used = new Set(placed.filter((p): p is number => p !== null));

  const valuesOf = (next: (number | null)[]) => next.map((p) => (p === null ? '' : bank[p]));
  const emit = (next: (number | null)[]) => onDraft?.({ kind: 'blanks', values: valuesOf(next) });

  const pressGap = (index: number) => {
    if (locked) return;
    if (placed[index] === null) {
      setPicked(index);
      return;
    }
    // A filled gap is cleared, its word returns to the bank, and the gap becomes the target.
    const next = placed.map((p, i) => (i === index ? null : p));
    setPlaced(next);
    setPicked(index);
    emit(next);
  };

  const pressWord = (bankIndex: number) => {
    if (locked || active === null || used.has(bankIndex)) return;
    const next = placed.map((p, i) => (i === active ? bankIndex : p));
    setPlaced(next);
    setPicked(nextEmpty(next, active));
    emit(next);
  };

  const submit = () => {
    setDone(true);
    onSubmit({ kind: 'blanks', values: valuesOf(placed) });
  };

  const gaps = item.answers.map((answer, i): ClozeGap => {
    const p = placed[i];
    const value = p === null ? null : bank[p];
    return {
      value,
      active: !locked && active === i,
      status: result ? (value === answer ? 'correct' : 'wrong') : undefined,
      answer,
    };
  });

  return (
    <View style={{ gap: 16 }}>
      <Text variant="small" tone="muted">
        Tap a gap, then a word from the bank. Tap a filled gap to clear it.
      </Text>
      <ClozeText text={item.text} gaps={gaps} onGapPress={pressGap} disabled={locked} />
      <Card>
        <Text variant="caption" tone="muted">
          WORD BANK
        </Text>
        <Row>
          {bank.map((word, i) => {
            const isUsed = used.has(i);
            const canPick = !locked && !isUsed && active !== null;
            return (
              // Used words stay in place, dimmed, so the bank does not reflow when a word is placed.
              <View key={`${i}-${word}`} style={{ opacity: isUsed ? 0.35 : 1 }}>
                <Chip label={word} onPress={canPick ? () => pressWord(i) : undefined} />
              </View>
            );
          })}
        </Row>
      </Card>
      <SubmitBar mode={mode} submitted={locked} disabled={placed.some((p) => p === null) || locked} onPress={submit} />
    </View>
  );
}
