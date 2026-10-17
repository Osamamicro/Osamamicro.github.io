import { router } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';

import { Button, Card, Chip, ProgressBar, Row, Screen, SectionTitle, Stat, Text } from '@/components/ui';
import { getTarget, getTaskType, streakDays, type SkillId, type TaskTypeId } from '@/core';
import { useAttempts, useEstimate, useTypeStats } from '@/features/stats';
import { mocksStore, skillTargets, useSettings, type Attempt } from '@/services/app-state';
import { useColors } from '@/theme';

const WINDOW_DAYS = 14;
const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Attempts per local calendar day for the last `days` days, oldest first. */
function dailyCounts(attempts: Attempt[], days: number): { date: Date; count: number }[] {
  const counts = new Map<string, number>();
  for (const a of attempts) {
    const key = new Date(a.at).toDateString();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - i));
    return { date, count: counts.get(date.toDateString()) ?? 0 };
  });
}

export default function ProgressTab() {
  const c = useColors();
  const settings = useSettings();
  const attempts = useAttempts();
  const estimate = useEstimate();
  const typeStats = useTypeStats();
  const mocks = mocksStore.use();
  const targets = skillTargets(settings);
  const preset = getTarget(settings.targetId);
  const streak = streakDays(attempts, Date.now());
  const days = useMemo(() => dailyCounts(attempts, WINDOW_DAYS), [attempts]);
  const busiest = Math.max(1, ...days.map((d) => d.count));
  const inWindow = days.reduce((n, d) => n + d.count, 0);
  const rows = useMemo(
    () =>
      (Object.keys(typeStats) as TaskTypeId[])
        .flatMap((id) => {
          const s = typeStats[id];
          return s ? [{ id, s }] : [];
        })
        .sort((a, b) => (a.s.average ?? 0) - (b.s.average ?? 0)),
    [typeStats],
  );
  const goal = preset ? `Goal: ${preset.name}` : `Goal: ${settings.targetScore} in each skill`;

  return (
    <Screen>
      <View style={{ gap: 4 }}>
        <Text variant="title">Progress</Text>
        <Text tone="muted">Estimates from your recent answers. They sharpen as you practise more task types.</Text>
      </View>

      <Card>
        <Row style={{ alignItems: 'flex-start' }} gap={16}>
          <Stat label="Estimated" value={estimate.overall === null ? '—' : String(estimate.overall)} color={c.primary} />
          <Stat label="Streak" value={`${streak}d`} color={c.warning} />
          <Stat label="Attempts" value={String(attempts.length)} />
          <Stat label="Mocks" value={String(mocks.length)} />
        </Row>
        <Text variant="small" tone="muted">
          {goal}. The line on each bar marks the goal for that skill.
        </Text>
        <View style={{ gap: 12 }}>
          {estimate.skills.map((s) => {
            const target = targets[s.skill];
            const tickPct = ((target - 10) / 80) * 100;
            return (
              <View key={s.skill} style={{ gap: 4 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Text variant="small" style={{ textTransform: 'capitalize' }}>
                    {s.skill}
                  </Text>
                  <Text variant="small" tone="muted" style={{ fontVariant: ['tabular-nums'] }}>
                    {s.score === null ? 'no data yet' : `${s.score} / ${target}`}
                  </Text>
                </Row>
                <View style={{ height: 8, justifyContent: 'center' }}>
                  <ProgressBar value={s.score === null ? 0 : (s.score - 10) / 80} color={c.skill(s.skill)} />
                  <View
                    style={{
                      position: 'absolute',
                      left: `${tickPct}%`,
                      top: -4,
                      height: 16,
                      width: 2,
                      borderRadius: 1,
                      backgroundColor: c.text,
                    }}
                  />
                </View>
                {s.score !== null && s.coverage < 0.5 ? (
                  <Text variant="small" tone="faint">
                    Based on {Math.round(s.coverage * 100)}% of the skill’s question types
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>
        <Text variant="small" tone="faint">
          Estimates are a guide, not an official PTE score.
        </Text>
      </Card>

      {attempts.length === 0 ? (
        <Card>
          <Text variant="subheading">No attempts yet</Text>
          <Text tone="muted">Your estimates, streak and task stats appear after your first practice item.</Text>
          <Button label="Go to practice" onPress={() => router.navigate('/practice')} />
        </Card>
      ) : null}

      <SectionTitle
        title="Last 14 days"
        action={
          <Text tone="muted" style={{ fontVariant: ['tabular-nums'] }}>
            {inWindow} {inWindow === 1 ? 'attempt' : 'attempts'}
          </Text>
        }
      />
      <Card>
        <Row style={{ alignItems: 'flex-end', flexWrap: 'nowrap' }} gap={4}>
          {days.map((d) => (
            <View
              key={d.date.toDateString()}
              accessible
              accessibilityLabel={`${d.date.toDateString()}: ${d.count} ${d.count === 1 ? 'attempt' : 'attempts'}`}
              style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <View style={{ width: '100%', height: 64, justifyContent: 'flex-end' }}>
                <View
                  style={{
                    height: d.count === 0 ? 3 : Math.max(6, (d.count / busiest) * 64),
                    borderRadius: 3,
                    backgroundColor: d.count === 0 ? c.surfaceAlt : c.primary,
                  }}
                />
              </View>
              <Text variant="caption" tone="faint">
                {DAY_LETTERS[d.date.getDay()]}
              </Text>
            </View>
          ))}
        </Row>
      </Card>

      <SectionTitle title="Task types" action={<Text tone="faint">weakest first</Text>} />
      {rows.length === 0 ? (
        <Text tone="muted">Your task stats appear here after your first attempt.</Text>
      ) : (
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text variant="caption" tone="muted" style={{ flex: 1 }}>
              TASK
            </Text>
            <Text variant="caption" tone="muted" style={{ width: 56, textAlign: 'right' }}>
              TRIES
            </Text>
            <Text variant="caption" tone="muted" style={{ width: 56, textAlign: 'right' }}>
              AVG
            </Text>
          </Row>
          {rows.map(({ id, s }) => {
            const spec = getTaskType(id);
            const avg = s.average ?? 0;
            const primary = Object.keys(spec.skills)[0] as SkillId;
            return (
              <View key={id} style={{ gap: 4 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Row style={{ flex: 1 }}>
                    <Chip label={spec.code} selected color={c.skill(primary)} />
                    <Text variant="small" style={{ flexShrink: 1 }}>
                      {spec.name}
                    </Text>
                  </Row>
                  <Text variant="small" tone="muted" style={{ width: 56, textAlign: 'right', fontVariant: ['tabular-nums'] }}>
                    {s.attempts}
                  </Text>
                  <Text variant="small" style={{ width: 56, textAlign: 'right', fontVariant: ['tabular-nums'] }}>
                    {Math.round(avg * 100)}%
                  </Text>
                </Row>
                <ProgressBar value={avg} height={4} color={c.skill(primary)} />
              </View>
            );
          })}
        </Card>
      )}

      <Button label="Settings" variant="secondary" onPress={() => router.push('/settings')} />
    </Screen>
  );
}
