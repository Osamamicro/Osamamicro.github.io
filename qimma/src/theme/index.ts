import { useColorScheme } from 'react-native';

import type { SkillId } from '@/core';

const light = {
  background: '#F6F7FB',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF0F7',
  border: '#DCE0EC',
  text: '#141826',
  textMuted: '#5B6275',
  textFaint: '#8A90A2',
  primary: '#3347D1',
  primaryText: '#FFFFFF',
  primarySoft: '#E4E8FF',
  success: '#1E8E5A',
  successSoft: '#DDF5E8',
  danger: '#C8353E',
  dangerSoft: '#FCE3E4',
  warning: '#B66A00',
  warningSoft: '#FFF0D6',
};

const dark: typeof light = {
  background: '#0E1018',
  surface: '#171A26',
  surfaceAlt: '#1F2333',
  border: '#2C3146',
  text: '#ECEEF6',
  textMuted: '#A5ABC0',
  textFaint: '#767D95',
  primary: '#8C9BFF',
  primaryText: '#0E1018',
  primarySoft: '#262C55',
  success: '#5AD69A',
  successSoft: '#163527',
  danger: '#FF7A82',
  dangerSoft: '#3D1C20',
  warning: '#FFB84D',
  warningSoft: '#3A2A10',
};

export type Palette = typeof light;

export const SKILL_COLORS: Record<SkillId, { light: string; dark: string }> = {
  speaking: { light: '#D9480F', dark: '#FF8A5B' },
  writing: { light: '#7048E8', dark: '#B197FC' },
  reading: { light: '#0C8599', dark: '#3BC9DB' },
  listening: { light: '#1971C2', dark: '#74C0FC' },
};

export function useColors(): Palette & { scheme: 'light' | 'dark'; skill: (s: SkillId) => string } {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const palette = scheme === 'dark' ? dark : light;
  return { ...palette, scheme, skill: (s) => SKILL_COLORS[s][scheme] };
}

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;
export const MAX_WIDTH = 880;

export const type = {
  title: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.4 },
  heading: { fontSize: 20, fontWeight: '700' as const },
  subheading: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24 },
  reading: { fontSize: 17, lineHeight: 28 },
  small: { fontSize: 14, lineHeight: 20 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '600' as const, letterSpacing: 0.4 },
};
