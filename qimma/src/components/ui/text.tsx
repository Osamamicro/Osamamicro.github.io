import { Text as RNText, type TextProps } from 'react-native';

import { type, useColors } from '@/theme';

type Variant = keyof typeof type;
type Tone = 'default' | 'muted' | 'faint' | 'primary' | 'success' | 'danger' | 'warning';

export interface AppTextProps extends TextProps {
  variant?: Variant;
  tone?: Tone;
}

export function Text({ variant = 'body', tone = 'default', style, ...rest }: AppTextProps) {
  const c = useColors();
  const color = {
    default: c.text,
    muted: c.textMuted,
    faint: c.textFaint,
    primary: c.primary,
    success: c.success,
    danger: c.danger,
    warning: c.warning,
  }[tone];
  return <RNText {...rest} style={[type[variant], { color }, style]} />;
}
