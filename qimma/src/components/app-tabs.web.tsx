import { Link } from 'expo-router';
import { TabList, TabSlot, TabTrigger, Tabs, type TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, useWindowDimensions, View } from 'react-native';

import { Text } from '@/components/ui';
import { MAX_WIDTH, radius, space, useColors } from '@/theme';

const TABS = [
  { name: 'index', href: '/', label: 'Today' },
  { name: 'practice', href: '/practice', label: 'Practice' },
  { name: 'mock', href: '/mock', label: 'Mock tests' },
  { name: 'vocab', href: '/vocab', label: 'Vocab' },
  { name: 'progress', href: '/progress', label: 'Progress' },
] as const;

// React 19 passes `ref` as a regular prop, so spreading props forwards it to Pressable.
function TabButton({ label, isFocused, compact, ...props }: Omit<TabTriggerSlotProps, 'ref'> & { label: string; compact?: boolean }) {
  const c = useColors();
  return (
    <Pressable
      {...props}
      style={{ paddingVertical: 6, paddingHorizontal: compact ? 8 : 12, borderRadius: radius.md, backgroundColor: isFocused ? c.primarySoft : 'transparent' }}>
      <Text variant="small" style={{ color: isFocused ? c.primary : c.textMuted, fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Web: a top navigation bar instead of bottom tabs. */
export default function AppTabs() {
  const c = useColors();
  // Phones: brand on its own line and the five tabs spread across the full width.
  const compact = useWindowDimensions().width < 640;
  return (
    <Tabs>
      <View style={{ backgroundColor: c.surface, borderBottomWidth: 1, borderBottomColor: c.border }}>
        <View
          style={{
            width: '100%',
            maxWidth: MAX_WIDTH,
            alignSelf: 'center',
            flexDirection: compact ? 'column' : 'row',
            alignItems: compact ? 'stretch' : 'center',
            gap: compact ? space.xs : space.sm,
            paddingHorizontal: compact ? space.sm : space.lg,
            paddingVertical: space.sm,
          }}>
          <Link href="/" style={{ marginRight: compact ? undefined : 'auto', paddingHorizontal: compact ? space.sm : 0 }}>
            <Text variant="subheading" style={{ color: c.primary }}>
              Qimma
            </Text>
          </Link>
          <TabList style={{ flexDirection: 'row', gap: 2, justifyContent: compact ? 'space-between' : 'flex-end' }}>
            {TABS.map((t) => (
              <TabTrigger key={t.name} name={t.name} href={t.href} asChild>
                <TabButton label={compact && t.name === 'mock' ? 'Mock' : t.label} compact={compact} />
              </TabTrigger>
            ))}
          </TabList>
        </View>
      </View>
      <TabSlot style={{ flex: 1 }} />
    </Tabs>
  );
}
