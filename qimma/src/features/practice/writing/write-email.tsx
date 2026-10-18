import { View } from 'react-native';

import { Chip, Row, Text } from '@/components/ui';
import { getTaskType, type WriteEmailItem } from '@/core';

import { formatClock, Passage, SubmitBar, WritingBox } from '../shared';
import type { RendererProps } from '../types';
import { useTimedText } from './use-timed-text';

const REGISTER_LABEL: Record<WriteEmailItem['register'], string> = {
  formal: 'Formal',
  'semi-formal': 'Semi-formal',
  informal: 'Informal',
};

/** Write Email: 50–120 words covering every bullet point, in the 9-minute response window. */
export function WriteEmailRenderer({ item, mode, onSubmit, onDraft, result }: RendererProps<WriteEmailItem>) {
  const seconds = getTaskType(item.type).timing.responseSec ?? 540;
  const { text, change, submit, done, timeLeft, timerActive } = useTimedText({
    seconds,
    locked: !!result,
    onDraft,
    onSubmit,
  });
  return (
    <View style={{ gap: 16 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Chip label={`Register: ${REGISTER_LABEL[item.register]}`} selected />
        {timerActive ? (
          <Text variant="subheading" style={{ fontVariant: ['tabular-nums'] }}>
            Time left {formatClock(timeLeft)}
          </Text>
        ) : null}
      </Row>
      <Passage label="Situation" text={item.situation} />
      <View style={{ gap: 8 }}>
        <Text variant="subheading">Your email must:</Text>
        {item.bulletPoints.map((point, i) => (
          // A plain row (not Row, which wraps) keeps long bullets wrapping under their own text.
          <View key={`${i}-${point.label}`} style={{ flexDirection: 'row', gap: 8 }}>
            <Text variant="reading" tone="primary">
              •
            </Text>
            <Text variant="reading" style={{ flex: 1 }} selectable>
              {point.label}
            </Text>
          </View>
        ))}
      </View>
      <WritingBox value={text} onChange={change} minWords={50} maxWords={120} minHeight={220} disabled={done} />
      <SubmitBar mode={mode} submitted={done} disabled={text.trim() === '' || done} onPress={submit} />
    </View>
  );
}
