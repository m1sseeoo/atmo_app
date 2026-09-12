import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilterButton } from '../components/map/FilterButton';
import { MapSearchBar } from '../components/map/MapSearchBar';
import { MockMap } from '../components/map/MockMap';
import { NearbyStationsList } from '../components/map/NearbyStationsList';
import { StationBottomSheet } from '../components/map/StationBottomSheet';
import { BottomTabBar, type MainTab } from '../components/navigation/BottomTabBar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { useAppState } from '../context/AppStateContext';
import { useProfile } from '../context/ProfileContext';
import { getLatestReadingForDevice } from '../services/deviceService';
import { getDistanceKm } from '../services/locationService';
import { colors, typography } from '../constants/theme';
import type { AtmoDevice } from '../types/device';
import {
  filterDevicesByQuery,
  filterDevicesByStatus,
  type DeviceFilter,
} from '../types/map';
import { deviceToMapStation } from '../utils/deviceMappers';

const MAP_HEIGHT = 350;

type DeviceMapScreenProps = {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
};

function sortDevicesByDistance(
  devices: AtmoDevice[],
  selectedLocation: ReturnType<typeof useAppState>['selectedLocation'],
): AtmoDevice[] {
  if (!selectedLocation) {
    return devices;
  }

  return [...devices].sort((left, right) => {
    const leftDistance = getDistanceKm(selectedLocation, left);
    const rightDistance = getDistanceKm(selectedLocation, right);
    return leftDistance - rightDistance;
  });
}

export function DeviceMapScreen({ activeTab, onTabChange }: DeviceMapScreenProps) {
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  const {
    devices,
    selectedDevice,
    selectedLocation,
    recommendation,
    selectDevice,
  } = useAppState();

  const [deviceSearchQuery, setDeviceSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>('all');
  const [zoomLevel, setZoomLevel] = useState(1);

  const filteredDevices = useMemo(() => {
    const byStatus = filterDevicesByStatus(devices, deviceFilter);
    return filterDevicesByQuery(byStatus, deviceSearchQuery);
  }, [devices, deviceFilter, deviceSearchQuery]);

  const stations = useMemo(
    () =>
      filteredDevices.map((device) =>
        deviceToMapStation(
          device,
          getLatestReadingForDevice(device.id),
          device.id === selectedDevice?.id,
          {
            selectedLocation,
            comfortIndex:
              device.id === selectedDevice?.id
                ? recommendation?.comfortIndex
                : undefined,
          },
        ),
      ),
    [filteredDevices, selectedDevice?.id, selectedLocation, recommendation?.comfortIndex],
  );

  const nearbyStations = useMemo(() => {
    const sortedDevices = sortDevicesByDistance(
      filterDevicesByQuery(devices, deviceSearchQuery),
      selectedLocation,
    );

    return sortedDevices.map((device) =>
      deviceToMapStation(
        device,
        getLatestReadingForDevice(device.id),
        device.id === selectedDevice?.id,
        {
          selectedLocation,
          comfortIndex:
            device.id === selectedDevice?.id ? recommendation?.comfortIndex : undefined,
        },
      ),
    );
  }, [
    devices,
    deviceSearchQuery,
    selectedLocation,
    selectedDevice?.id,
    recommendation?.comfortIndex,
  ]);

  const selectedStation = useMemo(() => {
    if (!selectedDevice) {
      return null;
    }

    const visible = stations.find((station) => station.id === selectedDevice.id);
    if (visible) {
      return visible;
    }

    return deviceToMapStation(
      selectedDevice,
      getLatestReadingForDevice(selectedDevice.id),
      true,
      {
        selectedLocation,
        comfortIndex: recommendation?.comfortIndex,
      },
    );
  }, [
    stations,
    selectedDevice,
    selectedLocation,
    recommendation?.comfortIndex,
  ]);

  const handleSelectStation = (id: string) => {
    selectDevice(id);
  };

  const locationHint = selectedLocation
    ? `Место: ${selectedLocation.label}`
    : undefined;

  const tabBarSpace = 88 + Math.max(insets.bottom, 8);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.shell}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: tabBarSpace },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <DashboardHeader userName={profile?.name} />

          <Text style={styles.title}>Карта устройств</Text>

          <View style={styles.toolbar}>
            <MapSearchBar
              value={deviceSearchQuery}
              onChangeText={setDeviceSearchQuery}
              locationHint={locationHint}
            />
            <FilterButton value={deviceFilter} onChange={setDeviceFilter} />
          </View>

          <MockMap
            height={MAP_HEIGHT}
            stations={stations}
            zoomLevel={zoomLevel}
            onSelectStation={handleSelectStation}
            onZoomIn={() => setZoomLevel((level) => Math.min(3, level + 1))}
            onZoomOut={() => setZoomLevel((level) => Math.max(1, level - 1))}
          />

          <View style={styles.stationCardWrap}>
            <StationBottomSheet station={selectedStation} />
          </View>

          <NearbyStationsList stations={nearbyStations} onSelect={handleSelectStation} />
        </ScrollView>

        <View style={[styles.tabBarWrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          <BottomTabBar active={activeTab} onChange={onTabChange} embedded />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  shell: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    gap: 14,
  },
  title: {
    ...typography.title,
    color: colors.textMain,
    marginTop: 10,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stationCardWrap: {
    marginTop: 0,
  },
  tabBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 6,
    backgroundColor: colors.background,
  },
});
