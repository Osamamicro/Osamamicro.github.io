import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { useRef, useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Chip, ProgressBar, Row, Screen, Stat, Text } from '@/components/ui';
import { vocabEntries } from '@/content';
import type { Grade, VocabEntry } from '@/core';
import { reviewWord, vocabStore } from '@/services/app-state';

import { buildReviewQueue, GRADES, previewIntervals, type ReviewMode } from './queue';

const GRADE_LABEL: Record<Grade, string> = { again: 'Again', hard: 'Hard', good: 'Good', easy: 'Easy' };
const GRADE_VARIANT: Record<Grade, 'danger' | 'secondary' | 'primary'> = {
  again: 'danger',
  hard: 'secondary',
  good: 'primary',
  easy: 'secondary',
};

/** Flashcards: the queue is fixed when the session starts, so grading never reshuffles it. */
export function ReviewSession({ mode }: { mode: ReviewMode }) {
  const cards = vocabStore.use();
  const [queue] = useState(() => buildReviewQueue(vocabEntries, vocabStore.get(), Date.now(), mode));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [tally, setTally] = useState<Record<Grade, number>>({ again: 0, hard: 0, good: 0, easy: 0 });
  const graded = useRef(-1);
  const total = queue.entries.length;

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/vocab');
  };

  if (total === 0) {
    return (
      <Screen>
        <Card>
          <Text variant="heading">All caught up</Text>
          <Text tone="muted">No words are due and every word has been reviewed. Come back when cards are due.</Text>
        </Card>
        <Button label="Back to vocabulary" variant="secondary" onPress={back} />
      </Screen>
    );
  }

  if (index >= total) {
    return (
      <Screen>
        <Card tone="success">
          <Text variant="heading">Session complete</Text>
          <Text>
            You reviewed {total} {total === 1 ? 'word' : 'words'}.
          </Text>
        </Card>
        <Row style={{ alignItems: 'flex-start' }} gap={16}>
          {GRADES.map((g) => (
            <Stat key={g} label={GRADE_LABEL[g]} value={String(tally[g])} />
          ))}
        </Row>
        <Text tone="muted">Words you missed come back tomorrow. Words you knew come back later.</Text>
        <Button label="Back to vocabulary" size="lg" onPress={back} />
      </Screen>
    );
  }

  const entry: VocabEntry = queue.entries[index];
  const intervals = previewIntervals(cards[entry.id], Date.now());

  const grade = (g: Grade) => {
    // Guards against a double tap grading the same card twice.
    if (graded.current === index) return;
    graded.current = index;
    reviewWord(entry.id, g);
    setTally((t) => ({ ...t, [g]: t[g] + 1 }));
    setRevealed(false);
    setIndex(index + 1);
  };

  return (
    <Screen>
      {mode === 'due' && queue.source === 'new' ? (
        <Card tone="primary">
          <Text>Nothing is due right now, so here are new words to start.</Text>
        </Card>
      ) : null}

      <Row style={{ justifyContent: 'space-between' }}>
        <Text variant="small" tone="muted" style={{ fontVariant: ['tabular-nums'] }}>
          Card {index + 1} of {total}
        </Text>
        <Text variant="small" tone="faint">
          {queue.source === 'new' ? 'New word' : 'Due'}
        </Text>
      </Row>
      <ProgressBar value={index / total} height={4} />

      <Card style={{ minHeight: 220 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Chip label={entry.partOfSpeech} />
          <Button
            label="🔊"
            variant="ghost"
            size="sm"
            accessibilityLabel={`Hear the word ${entry.word}`}
            onPress={() => Speech.speak(entry.word, { language: 'en-US' })}
          />
        </Row>
        <Text variant="title" selectable>
          {entry.word}
        </Text>
        {revealed ? (
          <View style={{ gap: 8 }}>
            <Text selectable>{entry.definition}</Text>
            <Text selectable tone="muted" style={{ fontStyle: 'italic' }}>
              “{entry.example}”
            </Text>
          </View>
        ) : (
          <Text tone="faint">Say the meaning to yourself, then show the answer.</Text>
        )}
      </Card>

      {revealed ? (
        <View style={{ gap: 8 }}>
          <Text variant="small" tone="muted">
            How well did you know it? The number is the wait until the word comes back.
          </Text>
          <Row>
            {GRADES.map((g) => {
              const days = intervals[g];
              return (
                <Button
                  key={g}
                  label={`${GRADE_LABEL[g]} · ${days} ${days === 1 ? 'day' : 'days'}`}
                  variant={GRADE_VARIANT[g]}
                  style={{ flexGrow: 1, flexBasis: '45%' }}
                  onPress={() => grade(g)}
                />
              );
            })}
          </Row>
        </View>
      ) : (
        <Button label="Show answer" size="lg" onPress={() => setRevealed(true)} />
      )}
    </Screen>
  );
}
