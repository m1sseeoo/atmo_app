import { StyleSheet, View } from 'react-native';

import type { AdminSummary } from '../../types/admin';
import { AdminSummaryCard } from './AdminSummaryCard';

type AdminSummaryGridProps = {
  items: AdminSummary[];
};

export function AdminSummaryGrid({ items }: AdminSummaryGridProps) {
  const rows: AdminSummary[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row) => (
        <View key={row[0].title} style={styles.row}>
          {row.map((item) => (
            <AdminSummaryCard key={item.title} item={item} />
          ))}
          {row.length === 1 ? <View style={styles.spacer} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  spacer: {
    flex: 1,
  },
});
