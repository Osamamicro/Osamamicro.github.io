import type { ReactNode } from 'react';
import { Pressable, ScrollView, View, type ScrollViewProps, type StyleProp, type ViewStyle } from 'react-native';

import { MAX_WIDTH, radius, space, useColors } from '@/theme';

import { Text } from './text';

/** Scrollable page with centred, width-limited content. Use as the first child of a route. */
export function Screen({ children, contentContainerStyle, ...rest }: ScrollViewProps & { children: ReactNode }) {
  const c = useColors();
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: c.background }}
      {...rest}
      contentContainerStyle={[
        { padding: space.lg, paddingBottom: space.xxl * 2, gap: space.lg, width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' },
        contentContainerStyle,
      ]}>
      {children}
    </ScrollView>
  );
}

export function Card({
  children,
  style,
  onPress,
  tone = 'default',
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  tone?: 'default' | 'primary' | 'success' | 'danger' | 'warning';
}) {
  const c = useColors();
  const bg = { default: c.surface, primary: c.primarySoft, success: c.successSoft, danger: c.dangerSoft, warning: c.warningSoft }[tone];
  const base: ViewStyle = {
    backgroundColor: bg,
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: tone === 'default' ? c.border : 'transparent',
    padding: space.lg,
    gap: space.md,
  };
  if (!onPress) return <View style={[base, style]}>{children}</View>;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [base, { opacity: pressed ? 0.85 : 1 }, style]}>
      {children}
    </Pressable>
  );
}

export function Row({ children, style, gap = space.sm }: { children: ReactNode; style?: StyleProp<ViewStyle>; gap?: number }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap, flexWrap: 'wrap' }, style]}>{children}</View>;
}

export function Chip({
  label,
  selected,
  onPress,
  color,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  color?: string;
}) {
  const c = useColors();
  const accent = color ?? c.primary;
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={{ selected: !!selected }}
      disabled={!onPress}
      onPress={onPress}
      // Visual size stays compact; the hit area reaches ~44pt when the chip is interactive.
      hitSlop={onPress ? 8 : undefined}
      style={{
        minHeight: onPress ? 30 : undefined,
        justifyContent: 'center',
        paddingVertical: onPress ? 6 : 4,
        paddingHorizontal: onPress ? 12 : 10,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: selected ? accent : c.border,
        backgroundColor: selected ? accent : c.surfaceAlt,
      }}>
      <Text variant="caption" style={{ color: selected ? c.surface : color ?? c.textMuted }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ProgressBar({ value, color, height = 8 }: { value: number; color?: string; height?: number }) {
  const c = useColors();
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: pct }}
      style={{ height, borderRadius: height, backgroundColor: c.surfaceAlt, overflow: 'hidden' }}>
      <View style={{ width: `${pct}%`, height: '100%', backgroundColor: color ?? c.primary, borderRadius: height }} />
    </View>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <Row style={{ justifyContent: 'space-between' }}>
      <Text variant="heading">{title}</Text>
      {action}
    </Row>
  );
}

export function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  const c = useColors();
  return (
    <View style={{ flexGrow: 1, flexBasis: 120, gap: 2 }}>
      <Text variant="caption" tone="muted">
        {label.toUpperCase()}
      </Text>
      <Text variant="title" style={{ color: color ?? c.text, fontVariant: ['tabular-nums'] }}>
        {value}
      </Text>
    </View>
  );
}
