import { useColors } from '@/theme';

/** Colours for chart marks. Series hues are distinct in both themes; the grey and text tones follow the theme. */
export function useChartColors() {
  const c = useColors();
  return {
    series: [c.primary, c.skill('speaking'), c.skill('reading'), c.success, c.skill('writing'), c.warning, c.danger, c.textMuted],
    grid: c.border,
    axis: c.textFaint,
    text: c.textMuted,
    label: c.text,
    surface: c.surface,
  };
}
