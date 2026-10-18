import { router } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';

import { Button, Card, Chip, ProgressBar, Row, Screen, SectionTitle, Stat, Text } from '@/components/ui';
import { buildDailyPlan, getExam, getTarget, getTaskType, isDue, streakDays, EXAM_LIST } from '@/core';
import { vocabEntries } from '@/content';
import { useAttempts, useEstimate } from '@/features/stats';
import { selectExam, skillTargets, useSettings, vocabStore } from '@/services/app-state';
import { useColors } from '@/theme';

export default function TodayScreen() {
  const c = useColors();
  const settings = useSettings();
  const exam = getExam(settings.examId);
  const attempts = useAttempts();
  const estimate = useEstimate();
  const cards = vocabStore.use();
  const now = Date.now();
  const dueVocab = vocabEntries.filter((v) => cards[v.id] && isDue(cards[v.id], now)).length;
  const targets = skillTargets(settings);
  const preset = getTarget(settings.targetId);
  const plan = useMemo(
    () => buildDailyPlan(exam, { ...settings, skillTargets: targets }, estimate, dueVocab, now),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exam, settings.targetId, settings.targetScore, settings.examDate, settings.dailyMinutes, estimate, dueVocab],
  );
  const streak = streakDays(attempts, now);
  const todayCount = attempts.filter((a) => new Date(a.at).toDateString() === new Date(now).toDateString()).length;

  return (
    <Screen>
      <View style={{ gap: 4 }}>
        <Text variant="title">Qimma</Text>
        <Text tone="muted">Reach the summit: practise every PTE task type with instant, explained feedback.</Text>
      </View>

      <Row>
        {EXAM_LIST.map((e) => (
          <Chip key={e.id} label={e.name} selected={e.id === exam.id} onPress={() => selectExam(e.id)} />
        ))}
        <Chip label="⚙︎ Settings" onPress={() => router.push('/settings')} />
      </Row>

      {!settings.onboarded && (
        <Card tone="primary">
          <Text variant="subheading">Set your goal</Text>
          <Text>Tell us your target score and exam date and we will build a daily plan around your weakest skill.</Text>
          <Button label="Set target & exam date" onPress={() => router.push('/settings')} />
        </Card>
      )}

      <Card>
        <Row style={{ alignItems: 'flex-start' }} gap={16}>
          <Stat label="Estimated" value={estimate.overall === null ? '—' : String(estimate.overall)} color={c.primary} />
          <Stat label="Target" value={preset ? preset.name : String(settings.targetScore)} />
          <Stat label="Days left" value={plan.daysLeft === null ? '—' : String(plan.daysLeft)} />
          <Stat label="Streak" value={`${streak}d`} color={c.warning} />
        </Row>
        <View style={{ gap: 8 }}>
          {estimate.skills.map((s) => (
            <View key={s.skill} style={{ gap: 4 }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text variant="small" style={{ textTransform: 'capitalize' }}>
                  {s.skill}
                </Text>
                <Text variant="small" tone={s.score !== null && s.score >= targets[s.skill] ? 'success' : 'muted'} style={{ fontVariant: ['tabular-nums'] }}>
                  {s.score === null ? `no data yet · target ${targets[s.skill]}` : `${s.score} / ${targets[s.skill]}`}
                </Text>
              </Row>
              <ProgressBar value={s.score === null ? 0 : (s.score - 10) / 80} color={c.skill(s.skill)} />
              <View
                style={{ position: 'relative', height: 0 }}
                accessibilityLabel={`${s.skill} target ${targets[s.skill]}`}>
                <View style={{ position: 'absolute', top: -10, left: `${((targets[s.skill] - 10) / 80) * 100}%`, width: 2, height: 12, backgroundColor: c.text }} />
              </View>
            </View>
          ))}
        </View>
        <Text variant="small" tone="faint">
          Estimates use your recent practice and are a guide, not an official PTE score.
        </Text>
      </Card>

      <SectionTitle title="Today’s plan" action={<Text tone="muted">{todayCount} done today</Text>} />
      {plan.focusSkill && (
        <Text tone="muted">
          Focus skill{plan.gaps[plan.focusSkill] ? ` (${plan.gaps[plan.focusSkill]} points to go)` : ''}: <Text style={{ color: c.skill(plan.focusSkill), fontWeight: '700', textTransform: 'capitalize' }}>{plan.focusSkill}</Text>
        </Text>
      )}
      <View style={{ gap: 8 }}>
        {plan.tasks.map((t) => {
          const spec = getTaskType(t.taskType);
          return (
            <Card
                key={t.taskType}
                onPress={() => router.push({ pathname: '/practice/[type]', params: { type: t.taskType } })}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Row>
                    <Chip label={spec.code} selected />
                    <Text variant="subheading">{spec.name}</Text>
                  </Row>
                  <Text tone="muted" style={{ fontVariant: ['tabular-nums'] }}>
                    ×{t.count} · {t.minutes} min
                  </Text>
                </Row>
                <Text variant="small" tone="muted">
                  {t.reason}
                </Text>
              </Card>
          );
        })}
        <Card onPress={() => router.push('/vocab/review')}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text variant="subheading">Vocabulary review</Text>
            <Text tone="muted">{plan.vocabReviews} due</Text>
          </Row>
        </Card>
      </View>
    </Screen>
  );
}
