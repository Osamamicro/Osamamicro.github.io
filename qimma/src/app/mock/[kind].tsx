import { router, Stack, useLocalSearchParams } from 'expo-router';

import { Button, Card, Screen, Text } from '@/components/ui';
import { isMockKind } from '@/features/mock/mock-plan';
import { MockRunner } from '@/features/mock/mock-runner';

export default function MockRunnerScreen() {
  const { kind } = useLocalSearchParams<{ kind: string }>();
  if (!isMockKind(kind)) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Mock test' }} />
        <Card>
          <Text>We do not recognise that mock test.</Text>
        </Card>
        <Button label="Back to mock tests" variant="secondary" onPress={() => router.replace('/mock')} />
      </Screen>
    );
  }
  return <MockRunner key={kind} kind={kind} />;
}
