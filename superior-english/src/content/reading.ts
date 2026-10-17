import type { Item } from '@/core';

/** Original reading items. Owner: content-writing-reading agent. */
export const readingItems: Item[] = [
  {
    id: 'rmcs-001',
    type: 'reading-mcsa',
    title: 'Sleep and memory',
    difficulty: 1,
    passage:
      'Researchers have long suspected that sleep helps us remember. In a recent study, students who slept for eight hours after learning a list of words recalled about 20 percent more of them the next day than students who stayed awake. Brain scans suggested that during deep sleep the hippocampus replays recent experiences, transferring them to longer-term storage in the cortex.',
    question: 'What does the passage suggest about deep sleep?',
    options: [
      { id: 'a', text: 'It prevents the brain from forming new memories.' },
      { id: 'b', text: 'It helps move recent memories into longer-term storage.' },
      { id: 'c', text: 'It is only important for students before exams.' },
      { id: 'd', text: 'It reduces activity in the hippocampus completely.' },
    ],
    answer: 'b',
  },
];
