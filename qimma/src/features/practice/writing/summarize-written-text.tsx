import { View } from 'react-native';

import { Row, Text } from '@/components/ui';
import { getTaskType, type SummarizeWrittenTextItem } from '@/core';

import { formatClock, Passage, SubmitBar, WritingBox } from '../shared';
import type { RendererProps } from '../types';
import { useTimedText } from './use-timed-text';

/** Summarize Written Text: one sentence of 5–75 words, within the task's response window. */
export function SummarizeWrittenTextRenderer({ item, mode, onSubmit, onDraft, result }: RendererProps<SummarizeWrittenTextItem>) {
  const seconds = getTaskType(item.type).timing.responseSec ?? 600;
  const { text, change, submit, done, timeLeft, timerActive } = useTimedText({
    seconds,
    locked: !!result,
    onDraft,
    onSubmit,
  });
  return (
    <View style={{ gap: 16 }}>
      <Passage label="Passage" text={item.passage} />
      <Row style={{ justifyContent: 'space-between' }}>
        <Text variant="small" tone="muted">
          One sentence only.
        </Text>
        {timerActive ? (
          <Text variant="subheading" style={{ fontVariant: ['tabular-nums'] }}>
            Time left {formatClock(timeLeft)}
          </Text>
        ) : null}
      </Row>
      <WritingBox value={text} onChange={change} minWords={5} maxWords={75} minHeight={120} disabled={done} />
      <SubmitBar mode={mode} submitted={done} disabled={text.trim() === '' || done} onPress={submit} />
    </View>
  );
}
