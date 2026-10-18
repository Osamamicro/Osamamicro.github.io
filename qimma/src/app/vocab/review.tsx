import { useLocalSearchParams } from 'expo-router';

import { ReviewSession } from '@/features/vocab/review-session';

export default function VocabReviewScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const reviewMode = mode === 'new' ? 'new' : 'due';
  return <ReviewSession key={reviewMode} mode={reviewMode} />;
}
