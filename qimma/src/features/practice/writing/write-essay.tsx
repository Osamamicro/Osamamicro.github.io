import { View } from 'react-native';

import { Row, Text } from '@/components/ui';
import { getTaskType, type WriteEssayItem } from '@/core';

import { formatClock, Passage, SubmitBar, WritingBox } from '../shared';
import type { RendererProps } from '../types';
import { useTimedText } from './use-timed-text';

/** Write Essay: 200–300 words in the 20-minute response window. */
export function WriteEssayRenderer({ item, mode, onSubmit, onDraft, result }: RendererProps<WriteEssayItem>) {
  const seconds = getTaskType(item.type).timing.responseSec ?? 1200;
  const { text, change, submit, done, timeLeft, timerActive } = useTimedText({
    seconds,
    locked: !!result,
    onDraft,
    onSubmit,
  });
  return (
    <View style={{ gap: 16 }}>
      <Row style={{ justifyContent: 'flex-end' }}>
        {timerActive ? (
          <Text variant="subheading" style={{ fontVariant: ['tabular-nums'] }}>
            Time left {formatClock(timeLeft)}
          </Text>
        ) : null}
      </Row>
      <Passage label="Prompt" text={item.prompt} />
      <WritingBox value={text} onChange={change} minWords={200} maxWords={300} minHeight={280} disabled={done} />
      <SubmitBar mode={mode} submitted={done} disabled={text.trim() === '' || done} onPress={submit} />
    </View>
  );
}
