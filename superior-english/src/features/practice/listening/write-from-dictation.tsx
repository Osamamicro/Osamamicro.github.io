import { useState } from 'react';
import { View } from 'react-native';

import type { WriteFromDictationItem } from '@/core';

import { AudioPrompt, SubmitBar, WritingBox } from '../shared';
import type { RendererProps } from '../types';

/** Write from Dictation: hear one sentence once and type it exactly as heard. */
export function WriteFromDictationRenderer({ item, mode, onSubmit, onDraft, result }: RendererProps<WriteFromDictationItem>) {
  const [text, setText] = useState('');
  const change = (next: string) => {
    setText(next);
    onDraft?.({ kind: 'text', text: next });
  };
  return (
    <View style={{ gap: 16 }}>
      <AudioPrompt item={item} mode={mode} showTranscript={!!result} />
      <WritingBox
        value={text}
        onChange={change}
        minHeight={80}
        disabled={!!result}
        placeholder="Type the sentence you hear…"
      />
      <SubmitBar
        mode={mode}
        submitted={!!result}
        disabled={text.trim() === ''}
        onPress={() => onSubmit({ kind: 'text', text })}
      />
    </View>
  );
}
