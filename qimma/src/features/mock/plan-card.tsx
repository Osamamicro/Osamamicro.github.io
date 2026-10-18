import { View } from 'react-native';

import { Card, Row, Text } from '@/components/ui';

import { timeLabel, type MockPlan } from './mock-plan';

/** Start card for a mock kind: question count and time from the exam blueprint. */
export function PlanCard({ title, plan, onStart }: { title: string; plan: MockPlan; onStart: () => void }) {
  const ready = plan.items > 0;
  const body = (
    <View style={{ gap: 4 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Text variant="subheading" style={{ flexShrink: 1 }}>
          {title}
        </Text>
        <Text variant="small" tone={ready ? 'primary' : 'faint'}>
          {ready ? 'Start' : 'Not ready'}
        </Text>
      </Row>
      <Text variant="small" tone="muted" style={{ fontVariant: ['tabular-nums'] }}>
        {ready ? `${plan.items} questions · ${timeLabel(plan.minMinutes, plan.minutes)}` : 'No questions in the bank yet'}
      </Text>
    </View>
  );
  return ready ? <Card onPress={onStart}>{body}</Card> : <Card>{body}</Card>;
}
