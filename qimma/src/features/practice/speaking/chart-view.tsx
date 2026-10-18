import { useState, type ReactNode } from 'react';
import { View } from 'react-native';

import { Row, Text } from '@/components/ui';
import type { ChartSpec } from '@/core';
import { space } from '@/theme';

import { CartesianChart } from './chart-cartesian';
import { percentLabel, tickLabel } from './chart-math';
import { PieChart } from './chart-pie';
import { ProcessFlow } from './chart-process';
import { useChartColors } from './chart-theme';
import { DataTable } from './chart-table';

const PLACEHOLDER_H = 240;

/** SVG height follows the measured width, kept between 200 and 320 px. */
function svgHeight(width: number): number {
  return Math.min(320, Math.max(200, Math.round(width * 0.62)));
}

/** Renders a Describe Image chart: title, the drawing sized to the container, and a legend. */
export function ChartView({ chart }: { chart: ChartSpec }) {
  switch (chart.kind) {
    case 'bar':
    case 'line': {
      const { kind, title, categories, series, unit, xLabel, yLabel } = chart;
      return (
        <ChartFrame title={title}>
          <Measured label={title}>
            {({ width, height }) => (
              <CartesianChart kind={kind} categories={categories} series={series} unit={unit} width={width} height={height} />
            )}
          </Measured>
          <ChartLegend
            items={series.length > 1 ? series.map((s) => ({ label: s.name })) : []}
            note={axisNote(xLabel, yLabel)}
          />
        </ChartFrame>
      );
    }
    case 'pie': {
      const { title, unit, slices } = chart;
      const total = slices.reduce((sum, s) => sum + Math.max(0, s.value), 0);
      const items = slices.map((s) => ({
        label: s.label,
        detail: unit && unit !== '%' ? `${percentLabel(s.value, total)} · ${tickLabel(s.value, unit)}` : percentLabel(s.value, total),
      }));
      return (
        <ChartFrame title={title}>
          <Measured label={title}>{({ width, height }) => <PieChart slices={slices} width={width} height={height} />}</Measured>
          <ChartLegend items={items} />
        </ChartFrame>
      );
    }
    case 'table':
      return (
        <ChartFrame title={chart.title}>
          <DataTable columns={chart.columns} rows={chart.rows} />
        </ChartFrame>
      );
    case 'process':
      return (
        <ChartFrame title={chart.title}>
          <ProcessFlow steps={chart.steps} />
        </ChartFrame>
      );
  }
}

function ChartFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ gap: space.md }}>
      <Text variant="subheading" selectable>
        {title}
      </Text>
      {children}
    </View>
  );
}

/** Measures the container width with onLayout and hands the drawable size to the chart. */
function Measured({ label, children }: { label: string; children: (size: { width: number; height: number }) => ReactNode }) {
  const [width, setWidth] = useState(0);
  const height = svgHeight(width);
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={`Chart: ${label}`}
      onLayout={(e) => setWidth(Math.floor(e.nativeEvent.layout.width))}
      style={{ width: '100%', height: width > 0 ? height : PLACEHOLDER_H }}>
      {width > 0 ? children({ width, height }) : null}
    </View>
  );
}

interface LegendItem {
  label: string;
  detail?: string;
}

function ChartLegend({ items, note }: { items: LegendItem[]; note?: string }) {
  const cc = useChartColors();
  if (items.length === 0 && !note) return null;
  return (
    <View style={{ gap: space.xs }}>
      {items.length > 0 ? (
        <Row gap={space.md}>
          {items.map((item, i) => (
            <Row key={`legend-${i}`} gap={6}>
              <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: cc.series[i % cc.series.length] }} />
              <Text variant="small" selectable>
                {item.label}
              </Text>
              {item.detail ? (
                <Text variant="small" tone="muted" style={{ fontVariant: ['tabular-nums'] }}>
                  {item.detail}
                </Text>
              ) : null}
            </Row>
          ))}
        </Row>
      ) : null}
      {note ? (
        <Text variant="small" tone="muted">
          {note}
        </Text>
      ) : null}
    </View>
  );
}

function axisNote(xLabel?: string, yLabel?: string): string | undefined {
  const parts = [yLabel ? `Vertical axis: ${yLabel}` : null, xLabel ? `Horizontal axis: ${xLabel}` : null].filter(Boolean);
  return parts.length > 0 ? parts.join(' · ') : undefined;
}
