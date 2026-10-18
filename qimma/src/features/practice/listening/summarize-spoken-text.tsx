import { useRef, useState } from 'react';
import { View } from 'react-native';

import { Row, Text } from '@/components/ui';
import { getTaskType, type SummarizeSpokenTextItem } from '@/core';

import { AudioPrompt, formatClock, SubmitBar, useCountdown, WritingBox } from '../shared';
import type { RendererProps } from '../types';

/**
 * Summarize Spoken Text: the response clock (10 minutes) starts when the recording ends
 * and submits whatever is written when it reaches zero.
 */
export function SummarizeSpokenTextRenderer({ item, mode, onSubmit, onDraft, result }: RendererProps<SummarizeSpokenTextItem>) {
  const seconds = getTaskType(item.type).timing.responseSec ?? 600;
  const [text, setText] = useState('');
  const [listened, setListened] = useState(false);
  const [closed, setClosed] = useState(false);
  const sent = useRef(false);

  const change = (next: string) => {
    setText(next);
    onDraft?.({ kind: 'text', text: next });
  };

  const submit = () => {
    if (sent.current) return;
    sent.current = true;
    setClosed(true);
    onSubmit({ kind: 'text', text });
  };

  const clock = useCountdown(seconds, listened && !closed && !result, submit);
  const low = clock.left <= 60;

  return (
    <View style={{ gap: 16 }}>
      <AudioPrompt item={item} mode={mode} showTranscript={!!result} onFinished={() => setListened(true)} />
      {!result && (
        <Row style={{ justifyContent: 'space-between' }}>
          <Text variant="subheading">Time left</Text>
          <Text
            variant="subheading"
            tone={low ? 'danger' : 'default'}
            accessibilityLabel={`Time left ${formatClock(clock.left)}`}
            style={{ fontVariant: ['tabular-nums'] }}>
            {formatClock(clock.left)}
          </Text>
        </Row>
      )}
      {!listened && !result && (
        <Text variant="small" tone="muted">
          The timer starts when the audio ends.
        </Text>
      )}
      <WritingBox
        value={text}
        onChange={change}
        minWords={50}
        maxWords={70}
        minHeight={160}
        disabled={!!result}
        placeholder="Write your summary in 50–70 words…"
      />
      <SubmitBar mode={mode} submitted={!!result} disabled={text.trim() === ''} onPress={submit} />
    </View>
  );
}
