import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileSummaryCard } from '../components/history/ProfileSummaryCard';
import { HistoryCheckCard } from '../components/history/HistoryCheckCard';
import { HistoryHeader } from '../components/history/HistoryHeader';
import { HistoryTabs } from '../components/history/HistoryTabs';
import { NotificationCard } from '../components/history/NotificationCard';
import { SecondaryButton } from '../components/history/SecondaryButton';
import { useAppState } from '../context/AppStateContext';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../constants/theme';
import type { HistoryTab } from '../types/history';

const TAB_BAR_CLEARANCE = 88;

type HistoryScreenProps = {
  onOpenAdmin?: () => void;
  onGoHome?: () => void;
};

export function HistoryScreen({ onOpenAdmin, onGoHome }: HistoryScreenProps) {
  const insets = useSafeAreaInsets();
  const { profile, clearProfile } = useProfile();
  const {
    history,
    isHistoryLoading,
    notifications,
    isNotificationsLoading,
    unreadNotificationsCount,
    deleteHistoryItem,
    clearHistory,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useAppState();
  const [activeTab, setActiveTab] = useState<HistoryTab>('history');

  const handleClearHistory = () => {
    Alert.alert('Очистить историю', 'Удалить все сохранённые проверки?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Очистить',
        style: 'destructive',
        onPress: () => {
          void clearHistory();
        },
      },
    ]);
  };

  const handleClearNotifications = () => {
    Alert.alert('Очистить уведомления', 'Удалить все уведомления?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Очистить',
        style: 'destructive',
        onPress: () => {
          void clearNotifications();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: TAB_BAR_CLEARANCE + insets.bottom + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <HistoryHeader onOpenAdmin={onOpenAdmin} />

        {profile ? <ProfileSummaryCard profile={profile} onReset={clearProfile} /> : null}

        <View style={styles.tabsWrap}>
          <HistoryTabs
            active={activeTab}
            onChange={setActiveTab}
            notificationCount={unreadNotificationsCount}
          />
        </View>

        {activeTab === 'history' ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>История проверок</Text>
              {history.length > 0 ? (
                <Text
                  onPress={handleClearHistory}
                  style={styles.clearLink}
                  accessibilityRole="button"
                >
                  Очистить историю
                </Text>
              ) : null}
            </View>

            {isHistoryLoading ? (
              <Text style={styles.loadingText}>Загрузка истории...</Text>
            ) : history.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>История пока пустая</Text>
                <Text style={styles.emptyMessage}>
                  Сохраните первую проверку условий на главной странице.
                </Text>
                {onGoHome ? (
                  <SecondaryButton title="Перейти на главную" onPress={onGoHome} />
                ) : null}
              </View>
            ) : (
              <View style={styles.cardList}>
                {history.map((item) => (
                  <HistoryCheckCard
                    key={item.id}
                    item={item}
                    onDelete={(id) => {
                      void deleteHistoryItem(id);
                    }}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Уведомления</Text>
              {notifications.length > 0 ? (
                <Text
                  onPress={handleClearNotifications}
                  style={styles.clearLink}
                  accessibilityRole="button"
                >
                  Очистить уведомления
                </Text>
              ) : null}
            </View>

            {isNotificationsLoading ? (
              <Text style={styles.loadingText}>Загрузка уведомлений...</Text>
            ) : notifications.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>Уведомлений пока нет</Text>
                <Text style={styles.emptyMessage}>
                  ATMO сообщит, если условия заметно изменятся.
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.cardList}>
                  {notifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onPress={(id) => {
                        void markNotificationRead(id);
                      }}
                    />
                  ))}
                </View>
                {unreadNotificationsCount > 0 ? (
                  <SecondaryButton
                    title="Отметить все как прочитанные"
                    onPress={() => {
                      void markAllNotificationsRead();
                    }}
                  />
                ) : null}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  tabsWrap: {
    marginTop: 14,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 22,
    flex: 1,
  },
  clearLink: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
    lineHeight: 18,
  },
  cardList: {
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  empty: {
    gap: 10,
    paddingVertical: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMain,
  },
  emptyMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    marginBottom: 4,
  },
});
