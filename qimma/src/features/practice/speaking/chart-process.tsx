import { Fragment } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui';
import { radius, space, useColors } from '@/theme';

/** Numbered process steps joined by arrows. Steps wrap onto new lines on narrow screens. */
export function ProcessFlow({ steps }: { steps: string[] }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space.sm }}>
      {steps.map((step, i) => (
        <Fragment key={`step-${i}`}>
          {i > 0 ? (
            <Text variant="heading" tone="faint" accessibilityElementsHidden importantForAccessibility="no">
              →
            </Text>
          ) : null}
          <View
            style={{
              flexGrow: 1,
              flexBasis: 130,
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: space.sm,
              padding: space.md,
              borderRadius: radius.md,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: c.border,
              backgroundColor: c.surface,
            }}>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: c.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text variant="caption" style={{ color: c.primaryText }}>
                {i + 1}
              </Text>
            </View>
            <Text variant="small" selectable style={{ flex: 1 }}>
              {step}
            </Text>
          </View>
        </Fragment>
      ))}
    </View>
  );
}
