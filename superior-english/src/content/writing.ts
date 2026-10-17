import type { Item } from '@/core';

/** Original writing items (SWT, Essay, Email). Owner: content-writing-reading agent. */
export const writingItems: Item[] = [
  {
    id: 'we-001',
    type: 'write-essay',
    title: 'Remote work and cities',
    difficulty: 2,
    prompt:
      'Some people believe that the rise of remote work will make large cities less important. To what extent do you agree or disagree? Support your opinion with reasons and examples.',
    keyPoints: [
      { label: 'Remote work / working from home', keywords: ['remote work', 'work from home', 'working from home', 'remotely'] },
      { label: 'Role of large cities', keywords: ['city', 'cities', 'urban', 'metropolitan'] },
      { label: 'Economic or social consequences', keywords: ['economy', 'economic', 'property', 'housing', 'business', 'social'] },
    ],
    modelAnswer:
      'The spread of remote work since 2020 has led many commentators to predict the decline of large cities. While I agree that remote work will change the role of cities, I do not believe it will make them significantly less important.\n\nFirstly, remote work clearly reduces the need to live close to an office. Many professionals have moved to smaller towns where housing is cheaper, and some companies have reduced their office space. For example, several technology firms now allow staff to work remotely on a permanent basis, which weakens the economic pull of city centres.\n\nHowever, cities offer much more than offices. They concentrate universities, hospitals, cultural venues and specialised services that cannot be delivered remotely. Moreover, face-to-face networking remains crucial for innovation; research consistently shows that new businesses cluster where talented people meet in person. As a result, many workers who could live anywhere still choose to stay in urban areas.\n\nFinally, the hybrid model that most employers have adopted keeps people tied to cities for at least part of the week. Rather than emptying cities, remote work is more likely to reshape them, converting some office buildings into homes and spreading activity more evenly across neighbourhoods.\n\nIn conclusion, although remote work reduces the importance of the traditional office, large cities will remain essential because of the services, opportunities and social connections they provide. Their form will change, but their importance will endure.',
  },
];
