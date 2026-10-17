import Svg, { Circle, Path } from 'react-native-svg';

import type { ChartSpec } from '@/core';

import { pieFractions, pieSlicePath } from './chart-math';
import { useChartColors } from './chart-theme';

export interface PieChartProps {
  slices: Extract<ChartSpec, { kind: 'pie' }>['slices'];
  width: number;
  height: number;
}

/** Pie chart drawn as arcs. Percentages are shown by the legend in ChartView. */
export function PieChart({ slices, width, height }: PieChartProps) {
  const cc = useChartColors();
  const fractions = pieFractions(slices.map((s) => s.value));
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.max(20, Math.min(width, height) / 2 - 10);

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {fractions.map((f, i) => {
        const span = f.end - f.start;
        const color = cc.series[i % cc.series.length];
        if (span <= 0) return null;
        if (span >= 0.9999) {
          return <Circle key={`slice-${i}`} cx={cx} cy={cy} r={r} fill={color} stroke={cc.surface} strokeWidth={2} />;
        }
        return (
          <Path
            key={`slice-${i}`}
            d={pieSlicePath(cx, cy, r, f.start, f.end)}
            fill={color}
            stroke={cc.surface}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        );
      })}
    </Svg>
  );
}
