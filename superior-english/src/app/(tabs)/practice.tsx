import { router } from 'expo-router';
import { View } from 'react-native';

import { Card, Chip, ProgressBar, Row, Screen, SectionTitle, Text } from '@/components/ui';
import { getExam, getTaskType, itemFitsExam } from '@/core';
import { ALL_ITEMS } from '@/content';
import { useTypeStats } from '@/features/stats';
import { useSettings } from '@/services/app-state';
import { useColors } from '@/theme';

export default function PracticeScreen() {
  const c = useColors();
  const settings = useSettings();
  const exam = getExam(settings.examId);
  const stats = useTypeStats();
  const available = ALL_ITEMS.filter((i) => itemFitsExam(i, exam.id));

  return (
    <Screen>
      <View style={{ gap: 4 }}>
        <Text variant="title">Practice</Text>
        <Text tone="muted">{exam.name} · every task type, scored the way PTE scores it.</Text>
        <Text variant="small" tone="faint">
          Percentages show how much each task counts toward a skill score
          {exam.weightsSource === 'official' ? ' (Pearson, Aug 2025).' : ' (approximate for PTE Core).'}
        </Text>
      </View>
      {exam.sections.map((section) => (
        <View key={section.id} style={{ gap: 8 }}>
          <SectionTitle title={section.name} action={<Text tone="muted">{section.minutes} min in the exam</Text>} />
          {section.taskTypes.map((id) => {
            const spec = getTaskType(id);
            const count = available.filter((i) => i.type === id).length;
            const s = stats[id];
            const weight = exam.weights[id];
            const skillsFed = Object.entries(weight?.skills ?? spec.skills) as [keyof typeof spec.skills, number][];
            const primary = [...skillsFed].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'speaking';
            return (
              <Card
                  key={id}
                  onPress={() => router.push({ pathname: '/practice/[type]', params: { type: id } })}>
                  <Row style={{ justifyContent: 'space-between' }}>
                    <Row style={{ flexShrink: 1 }}>
                      <Chip label={spec.code} selected color={c.skill(primary)} />
                      <Text variant="subheading" style={{ flexShrink: 1 }}>
                        {spec.name}
                      </Text>
                    </Row>
                    <Text variant="small" tone="muted">
                      {count} questions
                    </Text>
                  </Row>
                  <Row style={{ justifyContent: 'space-between' }}>
                    <Text variant="small" tone="muted">
                      {s ? `${s.attempts} attempts · avg ${Math.round((s.average ?? 0) * 100)}%` : 'Not started'}
                    </Text>
                    <Text variant="small" tone="faint">
                      {skillsFed.map(([skill, pct]) => `${skill} ${pct}%`).join(' · ')}
                    </Text>
                  </Row>
                  {s && <ProgressBar value={Object.keys(s.best).length / Math.max(count, 1)} height={4} color={c.skill(primary)} />}
                </Card>
            );
          })}
        </View>
      ))}
    </Screen>
  );
}
