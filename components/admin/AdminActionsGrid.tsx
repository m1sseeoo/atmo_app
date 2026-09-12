import { StyleSheet, View } from 'react-native';

import type { AdminAction } from '../../types/admin';
import { AdminActionCard } from './AdminActionCard';

type AdminActionsGridProps = {
  actions: AdminAction[];
  onActionPress?: (action: AdminAction) => void;
};

export function AdminActionsGrid({ actions, onActionPress }: AdminActionsGridProps) {
  const rows: AdminAction[][] = [];
  for (let i = 0; i < actions.length; i += 2) {
    rows.push(actions.slice(i, i + 2));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row) => (
        <View key={row[0].title} style={styles.row}>
          {row.map((action) => (
            <AdminActionCard
              key={action.title}
              action={action}
              onPress={() => onActionPress?.(action)}
            />
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
