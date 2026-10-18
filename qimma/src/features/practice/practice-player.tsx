import { useState } from 'react';
import { View } from 'react-native';

import { Chip, Row, Text } from '@/components/ui';
import { getTaskType, scoreItem, type Item, type Response, type ScoreResult } from '@/core';
import { recordAttempt } from '@/services/app-state';

import { rendererFor } from './renderers';
import { ScoreCard } from './shared';

/** Practice flow for one item: render → submit → score → feedback → retry/next. */
export function PracticePlayer({ item, onNext }: { item: Item; onNext?: () => void }) {
  const spec = getTaskType(item.type);
  const Renderer = rendererFor(item);
  const [round, setRound] = useState(0);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const submit = (response: Response) => {
    const r = scoreItem(item, response);
    recordAttempt(item, response, r);
    setResult(r);
  };

  return (
    <View style={{ gap: 16 }}>
      <View style={{ gap: 6 }}>
        <Row>
          <Chip label={spec.code} selected />
          <Chip label={['', 'Easy', 'Medium', 'Hard'][item.difficulty]} />
          {item.exams?.length === 1 && <Chip label={item.exams[0] === 'pte-core' ? 'Core only' : 'Academic only'} />}
        </Row>
        <Text variant="heading">{item.title}</Text>
        <Text tone="muted">{spec.instructions}</Text>
      </View>
      <Renderer key={`${item.id}-${round}`} item={item} mode="practice" onSubmit={submit} result={result} />
      {result && (
        <ScoreCard
          result={result}
          answerLabel={spec.hasModelAnswer ? 'Model answer' : 'Correct answer'}
          onRetry={() => {
            setResult(null);
            setRound((n) => n + 1);
          }}
          onNext={onNext}
        />
      )}
    </View>
  );
}
