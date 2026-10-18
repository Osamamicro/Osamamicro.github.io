import { router, Stack, useLocalSearchParams } from 'expo-router';

import { Button, Row, Screen, Text } from '@/components/ui';
import { getTaskType, isTaskTypeId, itemFitsExam } from '@/core';
import { getItem, itemsOfType } from '@/content';
import { PracticePlayer } from '@/features/practice/practice-player';
import { bookmarksStore, toggleBookmark, useSettings } from '@/services/app-state';

export default function QuestionScreen() {
  const { type, id } = useLocalSearchParams<{ type: string; id: string }>();
  const settings = useSettings();
  const bookmarks = bookmarksStore.use();
  const item = id ? getItem(id) : undefined;

  if (!item || !type || !isTaskTypeId(type)) {
    return (
      <Screen>
        <Text>Question not found.</Text>
      </Screen>
    );
  }
  const list = itemsOfType(item.type).filter((i) => itemFitsExam(i, settings.examId));
  const index = list.findIndex((i) => i.id === item.id);
  const next = list[index + 1];
  const prev = list[index - 1];
  const go = (target?: { id: string }) =>
    target && router.replace({ pathname: '/practice/[type]/[id]', params: { type: item.type, id: target.id } });

  return (
    <Screen>
      <Stack.Screen options={{ title: `${getTaskType(item.type).code} ${index + 1}/${list.length}` }} />
      <Row style={{ justifyContent: 'space-between' }}>
        <Button label="← Prev" size="sm" variant="ghost" disabled={!prev} onPress={() => go(prev)} />
        <Button
          label={bookmarks.includes(item.id) ? '★ Saved' : '☆ Save'}
          size="sm"
          variant="ghost"
          onPress={() => toggleBookmark(item.id)}
        />
        <Button label="Next →" size="sm" variant="ghost" disabled={!next} onPress={() => go(next)} />
      </Row>
      <PracticePlayer key={item.id} item={item} onNext={next ? () => go(next) : undefined} />
    </Screen>
  );
}
