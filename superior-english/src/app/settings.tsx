import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Switch, TextInput, View } from 'react-native';

import { Button, Card, Chip, Row, Screen, Text } from '@/components/ui';
import { EXAM_LIST, SCORE_TARGETS } from '@/core';
import { resetAllData, selectExam, updateSettings, useSettings } from '@/services/app-state';
import { radius, space, useColors } from '@/theme';

const TARGETS = [36, 50, 58, 65, 73, 79, 85];
const MINUTES = [20, 30, 45, 60, 90, 120];
const RATES = [0.8, 0.9, 1, 1.1];

export default function SettingsScreen() {
  const c = useColors();
  const s = useSettings();
  const [date, setDate] = useState(s.examDate ?? '');
  const dateValid = date === '' || /^\d{4}-\d{2}-\d{2}$/.test(date);

  const save = () => {
    updateSettings({ examDate: date === '' ? null : date, onboarded: true });
    if (router.canGoBack()) router.back();
  };

  const confirmReset = () => {
    const run = () => resetAllData();
    if (process.env.EXPO_OS === 'web') {
      if (globalThis.confirm?.('Delete all progress, vocabulary reviews and settings on this device?')) run();
    } else {
      Alert.alert('Reset all data?', 'This deletes your progress on this device.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: run },
      ]);
    }
  };

  return (
    <Screen>
      <Card>
        <Text variant="subheading">Exam</Text>
        <Row>
          {EXAM_LIST.map((e) => (
            <Chip key={e.id} label={e.name} selected={s.examId === e.id} onPress={() => selectExam(e.id)} />
          ))}
        </Row>
        <Text variant="small" tone="muted">
          {EXAM_LIST.find((e) => e.id === s.examId)?.description}
        </Text>
      </Card>

      <Card>
        <Text variant="subheading">Your goal</Text>
        {s.examId === 'pte-academic' && (
          <View style={{ gap: 6 }}>
            <Text variant="small" tone="muted">
              Australian visa levels (Home Affairs, from 7 Aug 2025) — minimum per skill:
            </Text>
            <Row>
              {SCORE_TARGETS.map((t) => (
                <Chip key={t.id} label={t.name} selected={s.targetId === t.id} onPress={() => updateSettings({ targetId: t.id })} />
              ))}
            </Row>
            {SCORE_TARGETS.find((t) => t.id === s.targetId) && (
              <Text variant="small">{SCORE_TARGETS.find((t) => t.id === s.targetId)!.description}</Text>
            )}
          </View>
        )}
        <Text variant="small" tone="muted">
          Or a custom overall score (applied to every skill):
        </Text>
        <Row>
          {TARGETS.map((t) => (
            <Chip
              key={t}
              label={String(t)}
              selected={s.targetId === null && s.targetScore === t}
              onPress={() => updateSettings({ targetId: null, targetScore: t })}
            />
          ))}
        </Row>
      </Card>

      <Card>
        <Text variant="subheading">Exam date</Text>
        <TextInput
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD (leave empty if not booked)"
          placeholderTextColor={c.textFaint}
          autoCapitalize="none"
          inputMode="numeric"
          style={{ color: c.text, borderWidth: 1, borderColor: dateValid ? c.border : c.danger, borderRadius: radius.md, padding: space.md, fontSize: 16 }}
        />
        {!dateValid && <Text tone="danger">Use the format YYYY-MM-DD.</Text>}
      </Card>

      <Card>
        <Text variant="subheading">Daily study time</Text>
        <Row>
          {MINUTES.map((m) => (
            <Chip key={m} label={`${m} min`} selected={s.dailyMinutes === m} onPress={() => updateSettings({ dailyMinutes: m })} />
          ))}
        </Row>
      </Card>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="subheading">Exam mode</Text>
            <Text variant="small" tone="muted">
              Audio plays once, no spellcheck or autocorrect — just like test day.
            </Text>
          </View>
          <Switch value={s.examMode} onValueChange={(v) => updateSettings({ examMode: v })} />
        </Row>
      </Card>

      <Card>
        <Text variant="subheading">Listening voice speed</Text>
        <Row>
          {RATES.map((r) => (
            <Chip key={r} label={`${r}×`} selected={s.speechRate === r} onPress={() => updateSettings({ speechRate: r })} />
          ))}
        </Row>
      </Card>

      <Button label="Save" size="lg" disabled={!dateValid} onPress={save} />
      <Button label="Reset all data on this device" variant="ghost" onPress={confirmReset} />
      <Text variant="small" tone="faint">
        Your progress is stored only on this device. Superior English is an independent study tool and is not affiliated with or
        endorsed by Pearson. PTE is a trademark of Pearson.
      </Text>
    </Screen>
  );
}
