import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';

import { Button, Card, Chip, Row, Screen, SectionTitle, Stat, Text } from '@/components/ui';
import { vocabEntries } from '@/content';
import { allTags, cardStatus, filterVocab, NEW_BATCH, vocabStats, type CardStatus } from '@/features/vocab/queue';
import { vocabStore } from '@/services/app-state';
import { radius, space, useColors } from '@/theme';

const PAGE = 100;
const TAGS = allTags(vocabEntries);
const STATUS_LABEL: Record<CardStatus, string> = { new: 'New', due: 'Due', learning: 'Learning', learned: 'Learned' };

export default function VocabTab() {
  const c = useColors();
  const cards = vocabStore.use();
  const now = Date.now();
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState<string | null>(null);
  const [limit, setLimit] = useState(PAGE);
  const stats = vocabStats(vocabEntries, cards, now);
  const matches = useMemo(() => filterVocab(vocabEntries, { query, tag }), [query, tag]);
  const shown = matches.slice(0, limit);
  const newToLearn = Math.min(NEW_BATCH, stats.fresh);
  const statusColor: Record<CardStatus, string> = { new: c.primary, due: c.warning, learning: c.textMuted, learned: c.success };

  const changeQuery = (text: string) => {
    setQuery(text);
    setLimit(PAGE);
  };
  const selectTag = (next: string | null) => {
    setTag(next);
    setLimit(PAGE);
  };

  return (
    <Screen>
      <View style={{ gap: 4 }}>
        <Text variant="title">Vocabulary</Text>
        <Text tone="muted">Your word book. Words come back on a spaced schedule so you remember them longer.</Text>
      </View>

      <Row style={{ alignItems: 'flex-start' }} gap={16}>
        <Stat label="Total" value={String(stats.total)} />
        <Stat label="Due today" value={String(stats.due)} color={stats.due > 0 ? c.warning : undefined} />
        <Stat label="Learned" value={String(stats.learned)} color={c.success} />
        <Stat label="New" value={String(stats.fresh)} />
      </Row>

      <Row>
        <Button
          label={stats.due > 0 ? `Review ${stats.due} due` : 'Nothing due today'}
          disabled={stats.due === 0}
          onPress={() => router.push('/vocab/review')}
        />
        <Button
          label={`Learn ${newToLearn} new`}
          variant="secondary"
          disabled={newToLearn === 0}
          onPress={() => router.push({ pathname: '/vocab/review', params: { mode: 'new' } })}
        />
      </Row>

      <TextInput
        value={query}
        onChangeText={changeQuery}
        placeholder="Search words or meanings"
        placeholderTextColor={c.textFaint}
        accessibilityLabel="Search vocabulary"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        style={{
          color: c.text,
          backgroundColor: c.surface,
          borderWidth: 1,
          borderColor: c.border,
          borderRadius: radius.md,
          padding: space.md,
          fontSize: 16,
        }}
      />

      {TAGS.length > 0 && (
        <Row>
          <Chip label="All" selected={tag === null} onPress={() => selectTag(null)} />
          {TAGS.map((t) => (
            <Chip key={t} label={t} selected={tag === t} onPress={() => selectTag(tag === t ? null : t)} />
          ))}
        </Row>
      )}

      <SectionTitle title="Words" action={<Text tone="muted">{matches.length} shown</Text>} />
      {shown.length === 0 ? (
        <Text tone="muted">
          {vocabEntries.length === 0 ? 'The word book is empty for now.' : 'No words match. Try another search or tag.'}
        </Text>
      ) : (
        <View style={{ gap: 8 }}>
          {shown.map((e) => {
            const status = cardStatus(cards[e.id], now);
            return (
              <Card key={e.id}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Text variant="subheading" selectable style={{ flexShrink: 1 }}>
                    {e.word}
                  </Text>
                  <Chip label={e.partOfSpeech} />
                </Row>
                <Text variant="small" selectable>
                  {e.definition}
                </Text>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Text variant="caption" style={{ color: statusColor[status] }}>
                    {STATUS_LABEL[status].toUpperCase()}
                  </Text>
                  <Text variant="small" tone="faint">
                    {e.tags.join(' · ')}
                  </Text>
                </Row>
              </Card>
            );
          })}
        </View>
      )}
      {matches.length > shown.length && (
        <Button
          label={`Show more (${matches.length - shown.length} left)`}
          variant="secondary"
          onPress={() => setLimit((n) => n + PAGE)}
        />
      )}
    </Screen>
  );
}
