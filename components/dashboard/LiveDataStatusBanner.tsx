import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';
import type { AtmoFetchStatus } from '../../context/AppStateContext';

type Props = { status: AtmoFetchStatus; hasReading: boolean };

export function LiveDataStatusBanner({ status, hasReading }: Props) {
  if (status === 'live' || status === 'idle') return null;

  const text =
    status === 'loading'
      ? hasReading ? 'Обновляем данные станции…' : 'Загружаем данные станции…'
      : status === 'stale'
        ? 'Данные станции устарели. Показано последнее успешное измерение.'
        : status === 'error'
          ? 'Не удалось обновить данные станции. Показано последнее успешное измерение.'
          : status === 'demo'
            ? 'Демо-режим: показаны шаблонные, а не live-данные.'
            : 'Нет актуальных данных от станции.';

  const warning = status === 'error' || status === 'stale' || status === 'no-data';
  return (
    <View style={[styles.banner, warning && styles.warning]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.border },
  warning: { backgroundColor: '#FFF8E8', borderColor: '#F4D58D' },
  text: { color: colors.textMain, fontSize: 12, lineHeight: 17 },
});
