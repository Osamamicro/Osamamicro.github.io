import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Chip, Row, Screen, Text } from '@/components/ui';
import { getTaskType, isTaskTypeId, itemFitsExam } from '@/core';
import { guideFor, itemsOfType } from '@/content';
import { useTypeStats } from '@/features/stats';
import { bookmarksStore, useSettings } from '@/services/app-state';
import { useColors } from '@/theme';

type Filter = 'all' | 'new' | 'bookmarked';

export default function TaskTypeScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const c = useColors();
  const settings = useSettings();
  const stats = useTypeStats();
  const bookmarks = bookmarksStore.use();
  const [filter, setFilter] = useState<Filter>('all');
  const [showGuide, setShowGuide] = useState(false);

  if (!type || !isTaskTypeId(type)) {
    return (
      <Screen>
        <Text>Unknown task type.</Text>
      </Screen>
    );
  }
  const spec = getTaskType(type);
  const guide = guideFor(type);
  const best = stats[type]?.best ?? {};
  const items = itemsOfType(type)
    .filter((i) => itemFitsExam(i, settings.examId))
    .filter((i) => (filter === 'new' ? best[i.id] === undefined : filter === 'bookmarked' ? bookmarks.includes(i.id) : true));
  const firstNew = items.find((i) => best[i.id] === undefined) ?? items[0];

  return (
    <Screen>
      <Stack.Screen options={{ title: spec.name }} />
      <View style={{ gap: 6 }}>
        <Row>
          <Chip label={spec.code} selected />
          {Object.keys(spec.skills).map((s) => (
            <Chip key={s} label={s} />
          ))}
        </Row>
        <Text tone="muted">{spec.instructions}</Text>
        <Text variant="small" tone="faint">
          {[
            spec.timing.prepSec && spec.timing.prepSec > 1 ? `Prep ${spec.timing.prepSec}s` : null,
            spec.timing.responseSec ? `Answer ${spec.timing.responseSec >= 120 ? `${spec.timing.responseSec / 60} min` : `${spec.timing.responseSec}s`}` : null,
            `Scored on: ${spec.traits.map((t) => t.label).join(', ')}`,
          ]
            .filter(Boolean)
            .join(' · ')}
        </Text>
      </View>

      {guide && (
        <Card tone="primary" onPress={() => setShowGuide((v) => !v)}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text variant="subheading">Strategy guide</Text>
            <Text tone="primary">{showGuide ? 'Hide' : 'Show'}</Text>
          </Row>
          <Text>{guide.summary}</Text>
          {showGuide && (
            <View style={{ gap: 6 }}>
              {guide.tips.map((t, i) => (
                <Text key={i} selectable>
                  {i + 1}. {t}
                </Text>
              ))}
              {guide.template ? (
                <View style={{ gap: 4 }}>
                  <Text variant="caption" tone="muted">
                    TEMPLATE
                  </Text>
                  <Text selectable style={{ fontStyle: 'italic' }}>
                    {guide.template}
                  </Text>
                </View>
              ) : null}
              {guide.commonMistakes.length > 0 && (
                <View style={{ gap: 4 }}>
                  <Text variant="caption" tone="muted">
                    AVOID
                  </Text>
                  {guide.commonMistakes.map((m, i) => (
                    <Text key={i}>• {m}</Text>
                  ))}
                </View>
              )}
            </View>
          )}
        </Card>
      )}

      <Row style={{ justifyContent: 'space-between' }}>
        <Row>
          {(['all', 'new', 'bookmarked'] as Filter[]).map((f) => (
            <Chip key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
          ))}
        </Row>
        {firstNew && (
          <Button
            label="Start practising"
            size="sm"
            onPress={() => router.push({ pathname: '/practice/[type]/[id]', params: { type, id: firstNew.id } })}
          />
        )}
      </Row>

      <View style={{ gap: 8 }}>
        {items.length === 0 && <Text tone="muted">No questions match this filter yet.</Text>}
        {items.map((item, n) => {
          const b = best[item.id];
          return (
            <Card key={item.id} onPress={() => router.push({ pathname: '/practice/[type]/[id]', params: { type, id: item.id } })}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text variant="subheading" style={{ flexShrink: 1 }}>
                  #{n + 1} {item.title}
                </Text>
                <Row>
                  {bookmarks.includes(item.id) && <Text tone="warning">★</Text>}
                  <Text variant="small" style={{ color: b === undefined ? c.textFaint : b >= 0.79 ? c.success : c.warning }}>
                    {b === undefined ? 'new' : `best ${Math.round(b * 100)}%`}
                  </Text>
                </Row>
              </Row>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}
