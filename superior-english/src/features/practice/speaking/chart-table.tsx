import { View } from 'react-native';

import { Text } from '@/components/ui';
import type { ChartSpec } from '@/core';
import { radius, space, useColors } from '@/theme';

type TableSpec = Extract<ChartSpec, { kind: 'table' }>;

/** Data table with a header row and zebra-striped body rows. Numbers are right-aligned. */
export function DataTable({ columns, rows }: { columns: TableSpec['columns']; rows: TableSpec['rows'] }) {
  const c = useColors();
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: c.border,
        borderRadius: radius.md,
        borderCurve: 'continuous',
        overflow: 'hidden',
      }}>
      <TableRow cells={columns} header />
      {rows.map((row, ri) => (
        <TableRow key={`row-${ri}`} cells={columns.map((_, ci) => row[ci] ?? '')} zebra={ri % 2 === 1} />
      ))}
    </View>
  );
}

function TableRow({ cells, header, zebra }: { cells: (string | number)[]; header?: boolean; zebra?: boolean }) {
  const c = useColors();
  const background = header ? c.surfaceAlt : zebra ? c.background : c.surface;
  return (
    <View style={{ flexDirection: 'row', backgroundColor: background, borderTopWidth: header ? 0 : 1, borderColor: c.border }}>
      {cells.map((cell, i) => (
        <View
          key={`cell-${i}`}
          style={{ flex: 1, paddingVertical: space.sm, paddingHorizontal: space.md, borderLeftWidth: i > 0 ? 1 : 0, borderColor: c.border }}>
          <Text
            variant="small"
            selectable
            style={{
              fontWeight: header ? '700' : '400',
              textAlign: typeof cell === 'number' ? 'right' : 'left',
              fontVariant: ['tabular-nums'],
            }}>
            {String(cell)}
          </Text>
        </View>
      ))}
    </View>
  );
}
