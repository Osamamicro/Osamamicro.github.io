import { router, Stack } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Alert, View } from 'react-native';

import { Button, Card, Chip, ProgressBar, Row, Screen, Stat, Text } from '@/components/ui';
import { ALL_ITEMS } from '@/content';
import { assembleMock, getExam, getTaskType, scoreItem, type Item, type Response, type ScoreResult, type TaskTypeId } from '@/core';
import { rendererFor } from '@/features/practice/renderers';
import { formatClock, useCountdown } from '@/features/practice/shared';
import { recordAttempt, saveMock, uid, useSettings } from '@/services/app-state';
import { useColors } from '@/theme';

import { newSeed, type MockKind } from './mock-plan';
import { unansweredResult, type MockResultItem } from './mock-results';

/** One question in paper order, with the index of its section. */
interface Slot {
  item: Item;
  section: number;
}

const QUIT_NOTE = 'Answers you have already submitted still count toward your progress.';

function leaveMock() {
  if (router.canGoBack()) router.back();
  else router.replace('/mock');
}

/**
 * Runs one mock paper: a section intro, then its questions one at a time in exam mode
 * (no feedback, no going back). When a section's clock runs out, its remaining questions
 * are marked not answered and the next section starts. The finished record is saved and
 * the learner is taken to the report.
 */
export function MockRunner({ kind }: { kind: MockKind }) {
  const settings = useSettings();
  const exam = getExam(settings.examId);
  const [mockId] = useState(() => uid());
  const [startedAt] = useState(() => Date.now());
  const [paper] = useState(() => assembleMock(exam, ALL_ITEMS, kind, newSeed()));
  const sections = useMemo(() => paper.sections.filter((s) => s.items.length > 0), [paper]);
  const slots = useMemo<Slot[]>(() => sections.flatMap((s, section) => s.items.map((item) => ({ item, section }))), [sections]);
  const starts = useMemo(() => {
    const out: number[] = [];
    let n = 0;
    for (const s of sections) {
      out.push(n);
      n += s.items.length;
    }
    return out;
  }, [sections]);

  const [cursor, setCursor] = useState(0);
  const [started, setStarted] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const cursorRef = useRef(0);
  const settledRef = useRef(-1);
  const draftRef = useRef<Response | null>(null);
  const resultsRef = useRef<MockResultItem[]>([]);
  const finishedRef = useRef(false);

  if (slots.length === 0) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Mock test' }} />
        <Card>
          <Text variant="subheading">No questions yet</Text>
          <Text tone="muted">{exam.name} needs more questions in the bank before this mock can run. Try another mock.</Text>
        </Card>
        <Button label="Back to mock tests" variant="secondary" onPress={leaveMock} />
      </Screen>
    );
  }

  /** Stores the result of one question. Returns true when it was left unanswered. */
  const settle = (idx: number, response: Response | null): boolean => {
    const { item } = slots[idx];
    let result: ScoreResult;
    if (response) {
      result = scoreItem(item, response);
      recordAttempt(item, response, result, mockId);
    } else {
      result = unansweredResult(item.type);
    }
    resultsRef.current.push({ itemId: item.id, taskType: item.type, result });
    settledRef.current = idx;
    draftRef.current = null;
    return response === null;
  };

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    saveMock({ id: mockId, examId: exam.id, kind, startedAt, finishedAt: Date.now(), results: resultsRef.current });
    router.replace({ pathname: '/mock/result/[id]', params: { id: mockId } });
  };

  const moveTo = (next: number) => {
    cursorRef.current = next;
    setCursor(next);
  };

  const submit = (idx: number, response: Response) => {
    if (finishedRef.current || idx !== cursorRef.current) return;
    settle(idx, response);
    const next = idx + 1;
    if (next >= slots.length) {
      finish();
      return;
    }
    if (slots[next].section !== slots[idx].section) setStarted(false);
    moveTo(next);
  };

  const draft = (idx: number, response: Response) => {
    if (idx === cursorRef.current && idx > settledRef.current) draftRef.current = response;
  };

  const timeUp = () => {
    if (finishedRef.current) return;
    const from = cursorRef.current;
    const sectionIdx = slots[from].section;
    let last = from;
    while (last + 1 < slots.length && slots[last + 1].section === sectionIdx) last++;
    let missed = 0;
    for (let i = from; i <= last; i++) {
      // The question on screen keeps its latest draft; the rest of the section is unanswered.
      if (settle(i, i === from ? draftRef.current : null)) missed++;
    }
    const next = last + 1;
    if (next >= slots.length) {
      finish();
      return;
    }
    const name = sections[sectionIdx].name;
    setNotice(
      missed > 0
        ? `Time ran out in ${name}. ${missed} ${missed === 1 ? 'question was' : 'questions were'} marked not answered.`
        : `Time ran out in ${name}. Your last answer was scored.`,
    );
    setStarted(false);
    moveTo(next);
  };

  const quit = () => {
    if (process.env.EXPO_OS === 'web') {
      if (globalThis.confirm?.(`Quit this mock test? ${QUIT_NOTE}`)) leaveMock();
      return;
    }
    Alert.alert('Quit this mock test?', QUIT_NOTE, [
      { text: 'Keep going', style: 'cancel' },
      { text: 'Quit', style: 'destructive', onPress: leaveMock },
    ]);
  };

  const current = slots[cursor];
  const sectionIdx = current.section;
  const section = sections[sectionIdx];

  if (!started) {
    return (
      <SectionIntro
        index={sectionIdx}
        total={sections.length}
        name={section.name}
        minutes={section.minutes}
        items={section.items}
        notice={notice}
        onStart={() => {
          setNotice(null);
          setStarted(true);
        }}
      />
    );
  }

  return (
    <SectionRun
      key={sectionIdx}
      name={section.name}
      minutes={section.minutes}
      size={section.items.length}
      position={cursor - starts[sectionIdx] + 1}
      cursor={cursor}
      item={current.item}
      onSubmit={(response) => submit(cursor, response)}
      onDraft={(response) => draft(cursor, response)}
      onTimeUp={timeUp}
      onQuit={quit}
    />
  );
}

interface SectionIntroProps {
  index: number;
  total: number;
  name: string;
  minutes: number;
  items: Item[];
  notice: string | null;
  onStart: () => void;
}

function SectionIntro({ index, total, name, minutes, items, notice, onStart }: SectionIntroProps) {
  const counts = new Map<TaskTypeId, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return (
    <Screen>
      <Stack.Screen options={{ title: name, headerBackVisible: true }} />
      {notice ? (
        <Card tone="warning">
          <Text>{notice}</Text>
        </Card>
      ) : null}
      <Card tone="primary">
        <Text variant="caption" tone="muted">
          SECTION {index + 1} OF {total}
        </Text>
        <Text variant="heading">{name}</Text>
        <Row style={{ alignItems: 'flex-start' }} gap={16}>
          <Stat label="Time limit" value={`${minutes} min`} />
          <Stat label="Questions" value={String(items.length)} />
        </Row>
        <View style={{ gap: 4 }}>
          {[...counts].map(([type, count]) => (
            <Text key={type} variant="small">
              {count} × {getTaskType(type).name}
            </Text>
          ))}
        </View>
      </Card>
      <Card>
        <Text variant="subheading">Before you start</Text>
        <Text variant="small">• The clock starts when you tap Start section and cannot be paused.</Text>
        <Text variant="small">• Once you move on, an answer is final. You cannot go back.</Text>
        <Text variant="small">• Wear headphones and check your microphone. Find a quiet room.</Text>
        <Text variant="small">• If time runs out, unanswered questions score zero.</Text>
      </Card>
      <Button label="Start section" size="lg" onPress={onStart} />
    </Screen>
  );
}

interface SectionRunProps {
  name: string;
  minutes: number;
  size: number;
  position: number;
  cursor: number;
  item: Item;
  onSubmit: (response: Response) => void;
  onDraft: (response: Response) => void;
  onTimeUp: () => void;
  onQuit: () => void;
}

function SectionRun({ name, minutes, size, position, cursor, item, onSubmit, onDraft, onTimeUp, onQuit }: SectionRunProps) {
  const spec = getTaskType(item.type);
  const Renderer = rendererFor(item);
  return (
    <Screen>
      <Stack.Screen options={{ title: name, headerBackVisible: false }} />
      <Card>
        <SectionClock seconds={minutes * 60} onDone={onTimeUp} />
        <Row style={{ justifyContent: 'space-between' }}>
          <Text variant="small" tone="muted" style={{ fontVariant: ['tabular-nums'] }}>
            Item {position} / {size}
          </Text>
          <Button label="Quit mock" variant="ghost" size="sm" onPress={onQuit} />
        </Row>
        <ProgressBar value={(position - 1) / size} height={4} />
      </Card>
      <View style={{ gap: 6 }}>
        <Row>
          <Chip label={spec.code} selected />
        </Row>
        <Text variant="heading">{item.title}</Text>
        <Text tone="muted">{spec.instructions}</Text>
      </View>
      <Renderer key={`${cursor}-${item.id}`} item={item} mode="mock" onSubmit={onSubmit} onDraft={onDraft} result={null} />
    </Screen>
  );
}

/** Only this component re-renders each second, so the question renderer keeps its input state. */
function SectionClock({ seconds, onDone }: { seconds: number; onDone: () => void }) {
  const c = useColors();
  const { left } = useCountdown(seconds, true, onDone);
  return (
    <Text variant="subheading" style={{ fontVariant: ['tabular-nums'], color: left <= 60 ? c.danger : c.text }}>
      Section time left {formatClock(left)}
    </Text>
  );
}
