import type { TaskGuide } from '@/core';

/** Original strategy guides, one per task type. Owner: vocab-guides agent. */
export const guides: TaskGuide[] = [
  {
    taskType: 'read-aloud',
    summary: 'Read Aloud scores content, oral fluency and pronunciation, and also feeds your reading score.',
    tips: [
      'Use the preparation time to read silently and mark where you will pause (commas and full stops).',
      'Keep a steady, natural pace; do not rush and do not stop to correct small slips.',
      'Stress content words (nouns, main verbs) and let function words stay light.',
    ],
    commonMistakes: ['Restarting a sentence after a mistake', 'Reading word by word with flat intonation'],
  },
];
