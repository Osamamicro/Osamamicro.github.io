import { View } from 'react-native';

import { Button, Card, Chip, ProgressBar, Row, Text } from '@/components/ui';
import type { ScoreResult } from '@/core';
import { useColors } from '@/theme';

export interface ScoreCardProps {
  result: ScoreResult;
  answerLabel?: string;
  onRetry?: () => void;
  onNext?: () => void;
}

export function ScoreCard({ result, answerLabel = 'Answer', onRetry, onNext }: ScoreCardProps) {
  const c = useColors();
  const pct = Math.round(result.percent * 100);
  const tone = result.max === 0 ? 'default' : pct >= 79 ? 'success' : pct >= 50 ? 'primary' : 'warning';
  return (
    <Card tone={tone}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Text variant="heading" style={{ fontVariant: ['tabular-nums'] }}>
          {result.max === 0 ? 'Self-review saved' : `${result.total} / ${result.max}  ·  ${pct}%`}
        </Text>
        {result.estimated && <Chip label="AI ESTIMATE" />}
      </Row>

      {result.traits.length > 1 && (
        <View style={{ gap: 8 }}>
          {result.traits.map((t) => (
            <View key={t.id} style={{ gap: 4 }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text variant="small">{t.label}</Text>
                <Text variant="small" tone="muted" style={{ fontVariant: ['tabular-nums'] }}>
                  {t.unscored ? '—' : `${t.score}/${t.max}`}
                </Text>
              </Row>
              <ProgressBar value={t.unscored ? 0 : t.score / t.max} height={6} color={c.primary} />
            </View>
          ))}
        </View>
      )}

      {result.feedback.length > 0 && (
        <View style={{ gap: 4 }}>
          {result.feedback.map((f, i) => (
            <Text key={i} variant="small" selectable>
              • {f}
            </Text>
          ))}
        </View>
      )}

      {result.answer ? (
        <View style={{ gap: 4 }}>
          <Text variant="caption" tone="muted">
            {answerLabel.toUpperCase()}
          </Text>
          <Text selectable>{result.answer}</Text>
        </View>
      ) : null}

      {(onRetry || onNext) && (
        <Row>
          {onRetry && <Button label="Try again" variant="secondary" onPress={onRetry} />}
          {onNext && <Button label="Next question →" onPress={onNext} />}
        </Row>
      )}
    </Card>
  );
}
