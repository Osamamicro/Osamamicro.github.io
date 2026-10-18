import { useMemo, useState } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';

import { Button, Card, Text } from '@/components/ui';
import type { ReorderParagraphsItem } from '@/core';
import { radius, space, useColors } from '@/theme';

import { SubmitBar } from '../shared';
import type { RendererProps } from '../types';
import { shuffleAway } from './seeded-shuffle';

/** Two columns from this width up; stacked below it. */
const WIDE = 720;

const letterFor = (index: number) => String.fromCharCode(65 + index);

function Badge({ label }: { label: string }) {
  const c = useColors();
  return (
    <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: c.primarySoft }}>
      <Text variant="subheading" tone="primary">
        {label}
      </Text>
    </View>
  );
}

/**
 * Re-order Paragraphs. Paragraphs start in a stable shuffle (never the correct order).
 * Tap a source paragraph to append it to "Your order", then move or remove rows.
 */
export function ReorderParagraphsRenderer({ item, mode, onSubmit, onDraft, result }: RendererProps<ReorderParagraphsItem>) {
  const c = useColors();
  const { width } = useWindowDimensions();
  const wide = width >= WIDE;

  const correctIds = useMemo(() => item.paragraphs.map((p) => p.id), [item.paragraphs]);
  const bodyOf = useMemo(() => new Map(item.paragraphs.map((p) => [p.id, p.text])), [item.paragraphs]);
  const correctIndex = useMemo(() => new Map(correctIds.map((id, i) => [id, i])), [correctIds]);
  // Source letters follow the displayed (shuffled) order and stay fixed as paragraphs move.
  const display = useMemo(() => shuffleAway(correctIds, item.id, correctIds), [correctIds, item.id]);
  const letterOf = useMemo(() => new Map(display.map((id, i) => [id, letterFor(i)])), [display]);
  const labelOf = (id: string) => letterOf.get(id) ?? '';

  const [order, setOrder] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const locked = !!result || done;
  const sources = display.filter((id) => !order.includes(id));
  const complete = order.length === correctIds.length;

  const update = (next: string[]) => {
    setOrder(next);
    onDraft?.({ kind: 'order', order: next });
  };
  const add = (id: string) => {
    if (!locked) update([...order, id]);
  };
  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return;
    const next = [...order];
    [next[from], next[to]] = [next[to], next[from]];
    update(next);
  };
  const remove = (index: number) => update(order.filter((_, i) => i !== index));
  const submit = () => {
    setDone(true);
    onSubmit({ kind: 'order', order });
  };

  /** After submission: a row is right when the paragraph after it is its correct successor. */
  const verdictAt = (i: number): 'right' | 'wrong' | undefined => {
    if (!result || i >= order.length - 1) return undefined;
    const here = correctIndex.get(order[i]) ?? -1;
    const next = correctIndex.get(order[i + 1]) ?? -2;
    return next === here + 1 ? 'right' : 'wrong';
  };

  const panel = { borderRadius: radius.md, borderWidth: 1, borderColor: c.border, padding: space.md };

  return (
    <View style={{ gap: 16 }}>
      <Text variant="small" tone="muted">
        Tap paragraphs in the order they should be read.
      </Text>

      <View style={{ flexDirection: wide ? 'row' : 'column', gap: 16 }}>
        <View style={{ flex: wide ? 1 : undefined, gap: 8 }}>
          <Text variant="caption" tone="muted">
            SOURCE
          </Text>
          {sources.length === 0 ? (
            <Text variant="small" tone="faint">
              Every paragraph is placed.
            </Text>
          ) : null}
          {sources.map((id) => (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityLabel={`Add paragraph ${labelOf(id)} to your order`}
              disabled={locked}
              onPress={() => add(id)}
              style={({ pressed }) => [panel, { flexDirection: 'row', gap: space.md, backgroundColor: c.surface, opacity: pressed ? 0.8 : 1 }]}>
              <Badge label={labelOf(id)} />
              <Text variant="reading" style={{ flex: 1 }}>
                {bodyOf.get(id)}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ flex: wide ? 1 : undefined, gap: 8 }}>
          <Text variant="caption" tone="muted">
            YOUR ORDER
          </Text>
          {order.length === 0 ? (
            <Text variant="small" tone="faint">
              Nothing placed yet.
            </Text>
          ) : null}
          {order.map((id, i) => {
            const verdict = verdictAt(i);
            const border = verdict === 'right' ? c.success : verdict === 'wrong' ? c.danger : c.border;
            const bg = verdict === 'right' ? c.successSoft : verdict === 'wrong' ? c.dangerSoft : c.surface;
            return (
              <View key={id} style={{ gap: space.sm, borderRadius: radius.md, borderWidth: 1.5, borderColor: border, backgroundColor: bg, padding: space.md }}>
                <View style={{ flexDirection: 'row', gap: space.md }}>
                  <Badge label={labelOf(id)} />
                  <Text variant="reading" style={{ flex: 1 }} selectable>
                    {bodyOf.get(id)}
                  </Text>
                </View>
                {result ? (
                  verdict ? (
                    <Text variant="small" tone={verdict === 'right' ? 'success' : 'danger'}>
                      {verdict === 'right' ? '✓ Next paragraph is correct' : '✗ Next paragraph is out of place'}
                    </Text>
                  ) : null
                ) : locked ? null : (
                  <View style={{ flexDirection: 'row', gap: space.sm }}>
                    <Button
                      label="↑"
                      variant="secondary"
                      size="sm"
                      accessibilityLabel={`Move paragraph ${labelOf(id)} up`}
                      disabled={i === 0}
                      onPress={() => move(i, i - 1)}
                      style={{ minWidth: 44, minHeight: 44 }}
                    />
                    <Button
                      label="↓"
                      variant="secondary"
                      size="sm"
                      accessibilityLabel={`Move paragraph ${labelOf(id)} down`}
                      disabled={i === order.length - 1}
                      onPress={() => move(i, i + 1)}
                      style={{ minWidth: 44, minHeight: 44 }}
                    />
                    <Button
                      label="✕"
                      variant="ghost"
                      size="sm"
                      accessibilityLabel={`Remove paragraph ${labelOf(id)} from your order`}
                      onPress={() => remove(i)}
                      style={{ minWidth: 44, minHeight: 44 }}
                    />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {result ? (
        <Card>
          <Text variant="caption" tone="muted">
            CORRECT ORDER
          </Text>
          <Text variant="subheading" style={{ fontVariant: ['tabular-nums'] }} selectable>
            {correctIds.map(labelOf).join(' → ')}
          </Text>
        </Card>
      ) : null}

      <SubmitBar mode={mode} submitted={locked} disabled={!complete || locked} onPress={submit} />
    </View>
  );
}
