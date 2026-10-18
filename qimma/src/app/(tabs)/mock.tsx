import { router } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';

import { Card, Row, Screen, SectionTitle, Text } from '@/components/ui';
import { ALL_ITEMS } from '@/content';
import { getExam } from '@/core';
import { PlanCard } from '@/features/mock/plan-card';
import { formatMockDate, mockTitle, planMock, type MockKind } from '@/features/mock/mock-plan';
import { summarizeMock } from '@/features/mock/mock-results';
import { mocksStore, useSettings } from '@/services/app-state';
import { useColors } from '@/theme';

export default function MockTab() {
  const c = useColors();
  const settings = useSettings();
  const exam = getExam(settings.examId);
  const mocks = mocksStore.use();
  const full = useMemo(() => planMock(exam, ALL_ITEMS, 'full'), [exam]);
  const mini = useMemo(() => planMock(exam, ALL_ITEMS, 'mini'), [exam]);
  const sectionCards = useMemo(
    () => exam.sections.map((s) => ({ id: s.id, name: s.name, plan: planMock(exam, ALL_ITEMS, s.id) })),
    [exam],
  );
  const history = useMemo(() => mocks.map((record) => ({ record, summary: summarizeMock(record) })), [mocks]);

  const start = (kind: MockKind) => router.push({ pathname: '/mock/[kind]', params: { kind } });

  return (
    <Screen>
      <View style={{ gap: 4 }}>
        <Text variant="title">Mock tests</Text>
        <Text tone="muted">{exam.name} · exam conditions, timed sections and an instant report.</Text>
      </View>

      <Card>
        <Text variant="subheading">Exam conditions</Text>
        <Text variant="small">• Section timers run and cannot be paused. You cannot go back to earlier questions.</Text>
        <Text variant="small">• Audio plays once where the task allows, as on test day.</Text>
        <Text variant="small">• Wear headphones and use a microphone. Find a quiet room.</Text>
        <Text variant="small">
          • Speaking is scored from your recording. On the web, automatic speech scoring needs Chrome or Edge. Other browsers let
          you record and self-rate.
        </Text>
        <Text variant="small">• Turn on Exam mode in Settings to switch off spellcheck and autocorrect while you write.</Text>
        <Text variant="small" tone="faint">
          Scores are estimates to guide your study, not an official PTE result.
        </Text>
      </Card>

      <SectionTitle title="Start a mock" />
      <View style={{ gap: 8 }}>
        <PlanCard title="Full mock" plan={full} onStart={() => start('full')} />
        <PlanCard title="Mini mock" plan={mini} onStart={() => start('mini')} />
      </View>

      <SectionTitle title="Single sections" />
      <View style={{ gap: 8 }}>
        {sectionCards.map((s) => (
          <PlanCard key={s.id} title={s.name} plan={s.plan} onStart={() => start(s.id)} />
        ))}
      </View>

      <SectionTitle title="History" action={<Text tone="muted">{mocks.length} saved</Text>} />
      {history.length === 0 ? (
        <Text tone="muted">No mock tests yet. Finish one and its report will appear here.</Text>
      ) : (
        <View style={{ gap: 8 }}>
          {history.map(({ record, summary }) => (
            <Card key={record.id} onPress={() => router.push({ pathname: '/mock/result/[id]', params: { id: record.id } })}>
              <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flexShrink: 1, gap: 2 }}>
                  <Text variant="subheading">{mockTitle(record.kind)}</Text>
                  <Text variant="small" tone="muted" style={{ fontVariant: ['tabular-nums'] }}>
                    {formatMockDate(record.startedAt)} · {summary.answered} of {summary.answered + summary.unanswered} answered
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 2 }}>
                  <Text variant="caption" tone="muted">
                    EST. OVERALL
                  </Text>
                  <Text
                    variant="heading"
                    accessibilityLabel={`Estimated overall ${summary.estimate.overall ?? 'not available'}`}
                    style={{ color: c.primary, fontVariant: ['tabular-nums'] }}>
                    {summary.estimate.overall ?? '—'}
                  </Text>
                </View>
              </Row>
            </Card>
          ))}
        </View>
      )}
    </Screen>
  );
}
