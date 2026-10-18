import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { useColors } from '@/theme';

export default function RootLayout() {
  const scheme = useColorScheme();
  const c = useColors();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme = {
    ...base,
    colors: { ...base.colors, primary: c.primary, background: c.background, card: c.surface, text: c.text, border: c.border },
  };
  return (
    <ThemeProvider value={theme}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal', contentStyle: { backgroundColor: c.background } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Home' }} />
        <Stack.Screen name="practice/[type]/index" options={{ title: 'Practice' }} />
        <Stack.Screen name="practice/[type]/[id]" options={{ title: 'Question' }} />
        <Stack.Screen name="mock/[kind]" options={{ title: 'Mock test', gestureEnabled: false }} />
        <Stack.Screen name="mock/result/[id]" options={{ title: 'Mock report' }} />
        <Stack.Screen name="vocab/review" options={{ title: 'Vocabulary review' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings', presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
