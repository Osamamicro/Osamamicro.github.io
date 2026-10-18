import { ActivityIndicator, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { radius, space, useColors } from '@/theme';

import { Text } from './text';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'md' | 'lg' | 'sm';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, variant = 'primary', size = 'md', loading, disabled, style, ...rest }: ButtonProps) {
  const c = useColors();
  const bg = { primary: c.primary, secondary: c.surfaceAlt, ghost: 'transparent', danger: c.danger }[variant];
  const fg = { primary: c.primaryText, secondary: c.text, ghost: c.primary, danger: '#FFFFFF' }[variant];
  const pad = { sm: space.xs + 2, md: space.md, lg: space.lg }[size];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      disabled={disabled || loading}
      {...rest}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          paddingVertical: pad,
          paddingHorizontal: pad * 1.6,
          borderRadius: radius.md,
          borderCurve: 'continuous',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: space.sm,
          opacity: disabled ? 0.45 : pressed ? 0.8 : 1,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: c.border,
        },
        style,
      ]}>
      {loading ? <ActivityIndicator color={fg} /> : null}
      <Text variant={size === 'sm' ? 'small' : 'subheading'} style={{ color: fg }}>
        {label}
      </Text>
    </Pressable>
  );
}
