import Svg, { Circle, G, Line, Polyline, Rect, Text as SvgText } from 'react-native-svg';

import type { ChartSeries } from '@/core';

import { estimateTextWidth, needsRotation, niceTicks, tickLabel } from './chart-math';
import { useChartColors } from './chart-theme';

export interface CartesianChartProps {
  kind: 'bar' | 'line';
  categories: string[];
  series: ChartSeries[];
  unit?: string;
  width: number;
  height: number;
}

const FONT = 11;
const VALUE_FONT = 10;
const PAD_RIGHT = 12;
const PAD_TOP = 14;

/** Grouped bars or multi-series lines, drawn in pixel units for a `width` x `height` box. */
export function CartesianChart({ kind, categories, series, unit, width, height }: CartesianChartProps) {
  const cc = useChartColors();
  const values = series.flatMap((s) => s.values);
  const { ticks, lo, hi } = niceTicks(Math.min(0, ...values), Math.max(0, ...values));
  const n = Math.max(1, categories.length);

  // Left padding grows with the widest tick label; rotate category labels when they would collide.
  const widestTick = Math.max(...ticks.map((t) => estimateTextWidth(tickLabel(t, unit), FONT)));
  const padLeft = Math.min(96, Math.max(40, Math.ceil(widestTick) + 10));
  const plotLeft = padLeft;
  const plotRight = width - PAD_RIGHT;
  const slot = (plotRight - plotLeft) / n;
  const rotate = needsRotation(categories, slot);
  const longestLabel = Math.max(0, ...categories.map((l) => estimateTextWidth(l, FONT)));
  const padBottom = rotate ? Math.min(120, Math.ceil(longestLabel * 0.5) + 18) : 26;
  const plotTop = PAD_TOP;
  const plotBottom = height - padBottom;
  const plotH = Math.max(1, plotBottom - plotTop);
  const span = hi - lo || 1;

  const y = (v: number) => plotBottom - ((v - lo) / span) * plotH;
  const x = (i: number) => plotLeft + (i + 0.5) * slot;
  const zeroY = y(0);

  // Grouped bars: each category slot holds one bar per series, centred in the slot.
  const groupW = slot * 0.72;
  const barW = groupW / Math.max(1, series.length);

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {ticks.map((t) => (
        <G key={`tick-${t}`}>
          <Line x1={plotLeft} x2={plotRight} y1={y(t)} y2={y(t)} stroke={cc.grid} strokeWidth={1} />
          <SvgText x={plotLeft - 6} y={y(t) + 4} fontSize={FONT} fill={cc.text} textAnchor="end">
            {tickLabel(t, unit)}
          </SvgText>
        </G>
      ))}
      <Line x1={plotLeft} x2={plotRight} y1={plotBottom} y2={plotBottom} stroke={cc.axis} strokeWidth={1} />

      {kind === 'bar' &&
        series.map((s, si) =>
          s.values.map((v, ci) => {
            const top = Math.min(y(v), zeroY);
            const barHeight = Math.max(1, Math.abs(y(v) - zeroY));
            const bx = x(ci) - groupW / 2 + si * barW + 1;
            const bw = Math.max(2, barW - 2);
            const label = v.toLocaleString('en-US', { maximumFractionDigits: 2 });
            const showValue = estimateTextWidth(label, VALUE_FONT) <= bw + 4;
            return (
              <G key={`bar-${si}-${ci}`}>
                <Rect x={bx} y={top} width={bw} height={barHeight} rx={2} fill={cc.series[si % cc.series.length]} />
                {showValue ? (
                  <SvgText x={bx + bw / 2} y={top - 4} fontSize={VALUE_FONT} fill={cc.label} textAnchor="middle">
                    {label}
                  </SvgText>
                ) : null}
              </G>
            );
          }),
        )}

      {kind === 'line' &&
        series.map((s, si) => {
          const color = cc.series[si % cc.series.length];
          return (
            <G key={`line-${si}`}>
              <Polyline
                points={s.values.map((v, ci) => `${x(ci)},${y(v)}`).join(' ')}
                fill="none"
                stroke={color}
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {s.values.map((v, ci) => (
                <Circle key={`dot-${ci}`} cx={x(ci)} cy={y(v)} r={4} fill={color} stroke={cc.surface} strokeWidth={1.5} />
              ))}
            </G>
          );
        })}

      {categories.map((cat, ci) => {
        const ax = x(ci);
        const ay = plotBottom + (rotate ? 12 : 16);
        return (
          <SvgText
            key={`cat-${ci}`}
            x={ax}
            y={ay}
            fontSize={FONT}
            fill={cc.label}
            textAnchor={rotate ? 'end' : 'middle'}
            rotation={rotate ? -30 : 0}
            origin={[ax, ay]}>
            {cat}
          </SvgText>
        );
      })}
    </Svg>
  );
}
