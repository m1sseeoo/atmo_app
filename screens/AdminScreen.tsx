import { useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AdminActionLogsList } from '../components/admin/AdminActionLogsList';
import { AdminActionsGrid } from '../components/admin/AdminActionsGrid';
import { AdminBackground } from '../components/admin/AdminBackground';
import { AdminBottomTabBar, type AdminTab } from '../components/admin/AdminBottomTabBar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminSummaryGrid } from '../components/admin/AdminSummaryGrid';
import { DemoModeBanner } from '../components/admin/DemoModeBanner';
import { DeviceDetailsCard } from '../components/admin/DeviceDetailsCard';
import { DeviceTable } from '../components/admin/DeviceTable';
import { RemoteConfigModal } from '../components/admin/RemoteConfigModal';
import { TelemetryLogsList } from '../components/admin/TelemetryLogsList';
import type { MainTab } from '../components/navigation/BottomTabBar';
import { useAppState } from '../context/AppStateContext';
import { colors } from '../constants/theme';
import {
  buildAdminSummaryCards,
  filterAdminDevices,
} from '../services/adminService';
import { getLatestReadingForDevice } from '../services/deviceService';
import { adminActions, type AdminAction, type AdminDeviceFilter } from '../types/admin';
import { deviceToAdminDevice } from '../utils/deviceMappers';

type AdminScreenProps = {
  onTabChange: (tab: MainTab) => void;
};

function mapAdminTabToMain(tab: AdminTab): MainTab {
  switch (tab) {
    case 'home':
      return 'home';
    case 'analytics':
      return 'analytics';
    case 'map':
      return 'map';
    case 'notifications':
      return 'profile';
    case 'admin':
      return 'admin';
  }
}

export function AdminScreen({ onTabChange }: AdminScreenProps) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const telemetryOffsetRef = useRef(0);

  const {
    devices,
    selectedDevice,
    selectDevice,
    latestReading,
    adminLogs,
    telemetryLogs,
    runAdminAction,
    clearAdminLogs,
  } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<AdminDeviceFilter>('all');
  const [remoteConfigVisible, setRemoteConfigVisible] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const summaryCards = useMemo(() => buildAdminSummaryCards(devices), [devices]);

  const filteredDevices = useMemo(
    () => filterAdminDevices(devices, deviceFilter, searchQuery),
    [devices, deviceFilter, searchQuery],
  );

  const adminDevices = useMemo(
    () => filteredDevices.map(deviceToAdminDevice),
    [filteredDevices],
  );

  const detailsReading = useMemo(() => {
    if (!selectedDevice) {
      return null;
    }
    if (latestReading?.deviceId === selectedDevice.id) {
      return latestReading;
    }
    return getLatestReadingForDevice(selectedDevice.id);
  }, [latestReading, selectedDevice]);

  const handleAdminTabChange = (tab: AdminTab) => {
    onTabChange(mapAdminTabToMain(tab));
  };

  const showFeedback = (message: string) => {
    setActionFeedback(message);
    setTimeout(() => {
      setActionFeedback(null);
    }, 2500);
  };

  const scrollToTelemetry = () => {
    scrollRef.current?.scrollTo({
      y: Math.max(telemetryOffsetRef.current - 12, 0),
      animated: true,
    });
  };

  const handleActionPress = (action: AdminAction) => {
    if (action.actionKey === 'navigate_map') {
      onTabChange('map');
      showFeedback('Открыта карта устройств');
      return;
    }

    if (action.actionKey === 'remote_config') {
      setRemoteConfigVisible(true);
      return;
    }

    if (action.actionKey === 'view_telemetry') {
      void runAdminAction('view_telemetry', selectedDevice?.id);
      scrollToTelemetry();
      showFeedback('Выполнено');
      return;
    }

    void runAdminAction(action.actionKey, selectedDevice?.id).then(() => {
      showFeedback('Выполнено');
    });
  };

  const handleRemoteConfigApply = () => {
    setRemoteConfigVisible(false);
    void runAdminAction('remote_config', selectedDevice?.id).then(() => {
      showFeedback('Настройки применены');
    });
  };

  return (
    <AdminBackground>
      <SafeAreaView style={styles.screen} edges={['top']}>
        <StatusBar style="dark" />
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: Math.max(insets.bottom, 16) + 8 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <AdminHeader />

          <DemoModeBanner />

          {actionFeedback ? (
            <View style={styles.feedback}>
              <Text style={styles.feedbackText}>{actionFeedback}</Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Сводка системы</Text>
            <AdminSummaryGrid items={summaryCards} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Действия</Text>
            <AdminActionsGrid actions={adminActions} onActionPress={handleActionPress} />
          </View>

          <View style={styles.section}>
            <DeviceTable
              devices={adminDevices}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={deviceFilter}
              onFilterChange={setDeviceFilter}
              selectedDeviceId={selectedDevice?.id}
              onDevicePress={(deviceId) => {
                selectDevice(deviceId);
              }}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Детали устройства</Text>
            <DeviceDetailsCard device={selectedDevice} reading={detailsReading} />
          </View>

          <View
            style={styles.section}
            onLayout={(event) => {
              telemetryOffsetRef.current = event.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.sectionTitle}>Входящие данные</Text>
            <TelemetryLogsList logs={telemetryLogs} />
          </View>

          <View style={styles.section}>
            <AdminActionLogsList logs={adminLogs} onClear={clearAdminLogs} />
          </View>

          <AdminBottomTabBar active="admin" onChange={handleAdminTabChange} embedded />
        </ScrollView>

        <RemoteConfigModal
          visible={remoteConfigVisible}
          onClose={() => setRemoteConfigVisible(false)}
          onApply={handleRemoteConfigApply}
        />
      </SafeAreaView>
    </AdminBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 18,
    paddingTop: 8,
    gap: 20,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 22,
  },
  feedback: {
    backgroundColor: '#E8F9EE',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#15803D',
    lineHeight: 18,
  },
});
