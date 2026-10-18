import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import { radius, space, useColors } from '@/theme';

import { toWords } from './cloze-words';

export interface ClozeGap {
  /** Word in the slot, or null while the gap is empty. */
  value: string | null;
  /** The gap that the next choice goes into. */
  active?: boolean;
  /** After submission: whether the word matches the answer. */
  status?: 'correct' | 'wrong';
  /** After submission: the expected word, shown beside wrong gaps. */
  answer?: string;
}

export interface ClozeTextProps {
  label?: string;
  /** Passage with {{1}}..{{n}} placeholders. */
  text: string;
  gaps: ClozeGap[];
  onGapPress: (index: number) => void;
  disabled?: boolean;
}

/**
 * Passage with inline gap slots, laid out as a wrapping flow of words so it reads
 * well on a 360px phone. Styled like the shared Passage card.
 */
export function ClozeText({ label, text, gaps, onGapPress, disabled }: ClozeTextProps) {
  const c = useColors();
  const words = toWords(text);
  return (
    <View style={{ gap: 6, backgroundColor: c.surface, borderColor: c.border, borderWidth: 1, borderRadius: radius.lg, padding: space.lg }}>
      {label ? (
        <Text variant="caption" tone="muted">
          {label.toUpperCase()}
        </Text>
      ) : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 5, rowGap: 8 }}>
        {words.map((pieces, w) => (
          // Each word is a non-wrapping row, so a gap and the punctuation glued to it stay together.
          <View key={w} style={{ flexDirection: 'row', alignItems: 'center' }}>
            {pieces.map((piece, p) =>
              piece.kind === 'word' ? (
                <Text key={p} variant="reading" selectable>
                  {piece.text}
                </Text>
              ) : (
                <Slot key={p} index={piece.index} gap={gaps[piece.index]} disabled={disabled} onPress={onGapPress} />
              ),
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

function Slot({
  index,
  gap,
  disabled,
  onPress,
}: {
  index: number;
  gap: ClozeGap | undefined;
  disabled?: boolean;
  onPress: (index: number) => void;
}) {
  const c = useColors();
  const value = gap?.value ?? null;
  const status = gap?.status;
  const filled = value !== null;
  const n = index + 1;

  const border =
    status === 'correct' ? c.success : status === 'wrong' ? c.danger : filled || gap?.active ? c.primary : c.border;
  const bg = status === 'correct' ? c.successSoft : status === 'wrong' ? c.dangerSoft : filled ? c.primarySoft : c.surfaceAlt;
  const fg = status === 'correct' ? c.success : status === 'wrong' ? c.danger : filled ? c.text : c.textFaint;
  const shown = value ?? (status ? '—' : '▾ choose');

  const spoken =
    status === 'wrong'
      ? `Gap ${n}: ${value ?? 'empty'}, incorrect. Correct answer: ${gap?.answer ?? ''}`
      : status === 'correct'
        ? `Gap ${n}: ${value ?? ''}, correct`
        : `Gap ${n}: ${value ?? 'empty'}`;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={spoken}
        accessibilityState={{ selected: !!gap?.active, disabled: !!disabled }}
        disabled={disabled}
        onPress={() => onPress(index)}
        style={{
          minHeight: 32,
          justifyContent: 'center',
          paddingHorizontal: 8,
          borderRadius: radius.sm,
          borderWidth: gap?.active ? 2 : 1.5,
          borderColor: border,
          backgroundColor: bg,
        }}>
        <Text variant="reading" style={{ color: fg, fontWeight: '600' }}>
          {shown}
        </Text>
      </Pressable>
      {status === 'wrong' && gap?.answer ? (
        <Text variant="small" tone="success" style={{ paddingLeft: 6, fontWeight: '600' }}>
          → {gap.answer}
        </Text>
      ) : null}
    </>
  );
}
