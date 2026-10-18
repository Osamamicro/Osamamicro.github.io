import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Chip, ProgressBar, Row, Screen, SectionTitle, Stat, Text } from '@/components/ui';
import { getItem } from '@/content';
import { getTaskType, getTarget } from '@/core';
import { skillTargets, useSettings, type MockRecord } from '@/services/app-state';
import { useColors } from '@/theme';

import { formatMockDate, mockTitle } from './mock-plan';
import { isUnanswered, summarizeMock } from './mock-results';

/** Report for one saved mock: estimates against the goal, a per-task table and every question. */
export function MockReport({ record }: { record: MockRecord }) {
  const c = useColors();
  const settings = useSettings();
  const targets = skillTargets(settings);
  const preset = getTarget(settings.targetId);
  const summary = useMemo(() => summarizeMock(record), [record]);
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const total = record.results.length;
  const minutes = Math.max(1, Math.round((record.finishedAt - record.startedAt) / 60000));
  const overall = summary.estimate.overall;
  const goal = preset ? `Goal: ${preset.name}` : `Goal: ${settings.targetScore} in each skill`;

  const done = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/mock');
  };

  return (
    <Screen>
      <View style={{ gap: 4 }}>
        <Text variant="title">{mockTitle(record.kind)}</Text>
        <Text tone="muted" style={{ fontVariant: ['tabular-nums'] }} selectable>
          {formatMockDate(record.startedAt)} · {minutes} min · {summary.answered} of {total} answered
        </Text>
      </View>

      <Card>
        <Row style={{ alignItems: 'flex-start' }} gap={16}>
          <Stat label="Estimated overall" value={overall === null ? '—' : String(overall)} color={c.primary} />
          <Stat label="Unanswered" value={String(summary.unanswered)} color={summary.unanswered > 0 ? c.warning : undefined} />
        </Row>
        <Text variant="small" tone="muted">
          {goal}. The line on each bar marks the goal for that skill.
        </Text>
        <View style={{ gap: 12 }}>
          {summary.estimate.skills.map((s) => {
            const target = targets[s.skill];
            const tickPct = ((target - 10) / 80) * 100;
            return (
              <View key={s.skill} style={{ gap: 4 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Text variant="small" style={{ textTransform: 'capitalize' }}>
                    {s.skill}
                  </Text>
                  <Text variant="small" tone="muted" style={{ fontVariant: ['tabular-nums'] }}>
                    {s.score === null ? 'not enough answers' : `${s.score} / ${target}`}
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
          These are estimates from this mock, not an official PTE score. Unanswered questions are left out of the estimates.
        </Text>
      </Card>

      <SectionTitle title="By task type" />
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text variant="caption" tone="muted" style={{ flex: 1 }}>
            TASK
          </Text>
          <Text variant="caption" tone="muted" style={{ width: 72, textAlign: 'right' }}>
            ANSWERED
          </Text>
          <Text variant="caption" tone="muted" style={{ width: 56, textAlign: 'right' }}>
            AVG
          </Text>
        </Row>
        {summary.rows.map((r) => (
          <Row key={r.taskType} style={{ justifyContent: 'space-between' }}>
            <Text variant="small" style={{ flex: 1 }}>
              {r.code} · {r.name}
            </Text>
            <Text variant="small" tone="muted" style={{ width: 72, textAlign: 'right', fontVariant: ['tabular-nums'] }}>
              {r.answered} of {r.answered + r.unanswered}
            </Text>
            <Text variant="small" style={{ width: 56, textAlign: 'right', fontVariant: ['tabular-nums'] }}>
              {r.average === null ? '—' : `${Math.round(r.average * 100)}%`}
            </Text>
          </Row>
        ))}
      </Card>

      <SectionTitle title="Questions" action={<Text tone="faint">tap to expand</Text>} />
      <View style={{ gap: 8 }}>
        {record.results.map((r, i) => {
          const isOpen = !!open[i];
          const missed = isUnanswered(r.result);
          const spec = getTaskType(r.taskType);
          const title = getItem(r.itemId)?.title ?? r.itemId;
          const status = missed
            ? 'Not answered'
            : r.result.max === 0
              ? 'Saved for self-review'
              : `${r.result.total} / ${r.result.max} · ${Math.round(r.result.percent * 100)}%`;
          return (
            <Card key={`${i}-${r.itemId}`} onPress={() => setOpen((o) => ({ ...o, [i]: !o[i] }))}>
              <Row style={{ flexShrink: 1 }}>
                <Chip label={spec.code} />
                <Text variant="small" style={{ flexShrink: 1 }}>
                  {i + 1}. {title}
                </Text>
              </Row>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text variant="small" tone={missed ? 'faint' : 'muted'} style={{ fontVariant: ['tabular-nums'] }}>
                  {status}
                </Text>
                <Text variant="small" tone="primary">
                  {isOpen ? 'Hide' : 'Details'}
                </Text>
              </Row>
              {isOpen ? (
                <View style={{ gap: 6 }}>
                  {r.result.traits.map((t) => (
                    <Row key={t.id} style={{ justifyContent: 'space-between' }}>
                      <Text variant="small">{t.label}</Text>
                      <Text variant="small" tone="muted" style={{ fontVariant: ['tabular-nums'] }}>
                        {t.unscored ? '—' : `${t.score} / ${t.max}`}
                      </Text>
                    </Row>
                  ))}
                  {r.result.feedback.map((f, j) => (
                    <Text key={j} variant="small" selectable>
                      • {f}
                    </Text>
                  ))}
                  {r.result.answer ? (
                    <View style={{ gap: 4 }}>
                      <Text variant="caption" tone="muted">
                        {spec.hasModelAnswer ? 'MODEL ANSWER' : 'CORRECT ANSWER'}
                      </Text>
                      <Text selectable>{r.result.answer}</Text>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </Card>
          );
        })}
      </View>

      <Button label="Done" size="lg" onPress={done} />
    </Screen>
  );
}
