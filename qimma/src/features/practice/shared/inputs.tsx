import { Pressable, TextInput, View } from 'react-native';

import { Button, Text } from '@/components/ui';
import { wordCount, type Option } from '@/core';
import { useSettings } from '@/services/app-state';
import { radius, space, type as typeScale, useColors } from '@/theme';

/** Passage or prompt text in a comfortable reading style. */
export function Passage({ text, label }: { text: string; label?: string }) {
  const c = useColors();
  return (
    <View style={{ gap: 6, backgroundColor: c.surface, borderColor: c.border, borderWidth: 1, borderRadius: radius.lg, padding: space.lg }}>
      {label ? (
        <Text variant="caption" tone="muted">
          {label.toUpperCase()}
        </Text>
      ) : null}
      <Text variant="reading" selectable>
        {text}
      </Text>
    </View>
  );
}

export interface ChoiceListProps {
  options: Option[];
  multiple?: boolean;
  selected: string[];
  onChange: (ids: string[]) => void;
  /** After submission: ids of the correct options, to colour right/wrong. */
  correct?: string[];
  disabled?: boolean;
}

export function ChoiceList({ options, multiple, selected, onChange, correct, disabled }: ChoiceListProps) {
  const c = useColors();
  const toggle = (id: string) => {
    if (multiple) onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
    else onChange([id]);
  };
  return (
    <View style={{ gap: space.sm }} accessibilityRole={multiple ? undefined : 'radiogroup'}>
      {options.map((o, i) => {
        const isSel = selected.includes(o.id);
        const isRight = correct?.includes(o.id);
        const border = correct ? (isRight ? c.success : isSel ? c.danger : c.border) : isSel ? c.primary : c.border;
        const bg = correct ? (isRight ? c.successSoft : isSel ? c.dangerSoft : c.surface) : isSel ? c.primarySoft : c.surface;
        return (
          <Pressable
            key={o.id}
            accessibilityRole={multiple ? 'checkbox' : 'radio'}
            accessibilityState={{ checked: isSel, disabled }}
            disabled={disabled}
            onPress={() => toggle(o.id)}
            style={{ flexDirection: 'row', gap: space.md, padding: space.md, borderRadius: radius.md, borderWidth: 1.5, borderColor: border, backgroundColor: bg }}>
            <View
              style={{
                width: 22,
                height: 22,
                marginTop: 1,
                borderRadius: multiple ? 6 : 11,
                borderWidth: 2,
                borderColor: isSel ? c.primary : c.textFaint,
                backgroundColor: isSel ? c.primary : 'transparent',
              }}
            />
            <Text style={{ flex: 1 }}>
              <Text variant="subheading">{String.fromCharCode(65 + i)}. </Text>
              {o.text}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export interface WritingBoxProps {
  value: string;
  onChange: (text: string) => void;
  minWords?: number;
  maxWords?: number;
  placeholder?: string;
  minHeight?: number;
  disabled?: boolean;
}

export function WritingBox({ value, onChange, minWords, maxWords, placeholder, minHeight = 160, disabled }: WritingBoxProps) {
  const c = useColors();
  const settings = useSettings();
  const n = wordCount(value);
  const inRange = (minWords === undefined || n >= minWords) && (maxWords === undefined || n <= maxWords);
  return (
    <View style={{ gap: 6 }}>
      <TextInput
        multiline
        editable={!disabled}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder ?? 'Type your answer…'}
        placeholderTextColor={c.textFaint}
        // PTE has no spellchecker; exam mode switches it off.
        spellCheck={!settings.examMode}
        autoCorrect={!settings.examMode}
        autoCapitalize="sentences"
        textAlignVertical="top"
        style={[
          typeScale.body,
          { minHeight, color: c.text, backgroundColor: c.surface, borderColor: c.border, borderWidth: 1, borderRadius: radius.md, padding: space.md },
        ]}
      />
      <Text variant="small" tone={n === 0 ? 'faint' : inRange ? 'success' : 'warning'} style={{ fontVariant: ['tabular-nums'] }}>
        Word count: {n}
        {minWords !== undefined && maxWords !== undefined ? `  (target ${minWords}–${maxWords})` : ''}
      </Text>
    </View>
  );
}

/** Standard submit button for renderers; shows "Next" in mock mode. */
export function SubmitBar({
  mode,
  disabled,
  onPress,
  submitted,
}: {
  mode: 'practice' | 'mock';
  disabled?: boolean;
  onPress: () => void;
  submitted?: boolean;
}) {
  if (submitted) return null;
  return <Button label={mode === 'mock' ? 'Next →' : 'Submit'} size="lg" disabled={disabled} onPress={onPress} />;
}
