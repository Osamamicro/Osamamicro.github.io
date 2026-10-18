import { View } from 'react-native';

import { Card } from '@/components/ui';
import { getTaskType, type DescribeImageItem } from '@/core';

import { RecordPanel } from '../shared';
import type { RendererProps } from '../types';
import { ChartView } from './chart-view';

/** Describe Image: study the chart during preparation, then describe it aloud. */
export function DescribeImageRenderer({ item, mode, onSubmit }: RendererProps<DescribeImageItem>) {
  const { timing } = getTaskType(item.type);
  return (
    <View style={{ gap: 16 }}>
      <Card>
        <ChartView chart={item.chart} />
      </Card>
      <RecordPanel
        prepSec={timing.prepSec ?? 25}
        responseSec={timing.responseSec ?? 40}
        mode={mode}
        onComplete={onSubmit}
      />
    </View>
  );
}
