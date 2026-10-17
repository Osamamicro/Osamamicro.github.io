import { Link } from 'expo-router';
import { TabList, TabSlot, TabTrigger, Tabs, type TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, View } from 'react-native';

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
function TabButton({ label, isFocused, ...props }: Omit<TabTriggerSlotProps, 'ref'> & { label: string }) {
  const c = useColors();
  return (
    <Pressable {...props} style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: radius.md, backgroundColor: isFocused ? c.primarySoft : 'transparent' }}>
      <Text variant="small" style={{ color: isFocused ? c.primary : c.textMuted, fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Web: a top navigation bar instead of bottom tabs. */
export default function AppTabs() {
  const c = useColors();
  return (
    <Tabs>
      <View style={{ backgroundColor: c.surface, borderBottomWidth: 1, borderBottomColor: c.border }}>
        <View style={{ width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg, paddingVertical: space.sm, flexWrap: 'wrap' }}>
          <Link href="/" style={{ marginRight: 'auto' }}>
            <Text variant="subheading" style={{ color: c.primary }}>
              Superior English
            </Text>
          </Link>
          <TabList style={{ flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
            {TABS.map((t) => (
              <TabTrigger key={t.name} name={t.name} href={t.href} asChild>
                <TabButton label={t.label} />
              </TabTrigger>
            ))}
          </TabList>
        </View>
      </View>
      <TabSlot style={{ flex: 1 }} />
    </Tabs>
  );
}
