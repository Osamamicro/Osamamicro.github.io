import { useRef, useState } from 'react';

import type { Response } from '@/core';

import { useCountdown } from '../shared';

interface TimedTextOptions {
  /** Length of the response window in seconds. */
  seconds: number;
  /** True once the answer is final (practice mode after the result arrives). Stops the clock. */
  locked: boolean;
  onDraft?: (response: Response) => void;
  onSubmit: (response: Response) => void;
}

/**
 * Shared state for the timed writing renderers: the typed text, one submit path for
 * both the button and the timer (so onSubmit runs once), and the response countdown.
 */
export function useTimedText({ seconds, locked, onDraft, onSubmit }: TimedTextOptions) {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const textRef = useRef('');
  const doneRef = useRef(false);

  const submit = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setSubmitted(true);
    onSubmit({ kind: 'text', text: textRef.current });
  };

  // Auto-submits with whatever is typed when the window runs out, in practice and mock alike.
  const timer = useCountdown(seconds, !submitted && !locked, submit);

  const change = (value: string) => {
    textRef.current = value;
    setText(value);
    onDraft?.({ kind: 'text', text: value });
  };

  return { text, change, submit, done: submitted || locked, timeLeft: timer.left, timerActive: !submitted && !locked };
}
