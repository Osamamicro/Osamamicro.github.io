import { router, useLocalSearchParams } from 'expo-router';

import { Button, Card, Screen, Text } from '@/components/ui';
import { MockReport } from '@/features/mock/mock-report';
import { mocksStore } from '@/services/app-state';

export default function MockResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const mocks = mocksStore.use();
  const record = mocks.find((m) => m.id === id);
  if (!record) {
    return (
      <Screen>
        <Card>
          <Text variant="subheading">Report not found</Text>
          <Text tone="muted">This report is not stored on this device. The last 50 mock tests are kept.</Text>
        </Card>
        <Button label="Back to mock tests" variant="secondary" onPress={() => router.replace('/mock')} />
      </Screen>
    );
  }
  return <MockReport record={record} />;
}
