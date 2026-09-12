import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ComfortIndexCard } from '../components/dashboard/ComfortIndexCard';
import { DeveloperDiagnostics } from '../components/dashboard/DeveloperDiagnostics';
import { DashboardEmptyState } from '../components/dashboard/DashboardEmptyState';
import { DashboardGreeting } from '../components/dashboard/DashboardGreeting';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { LocationSearchPanel } from '../components/dashboard/LocationSearchPanel';
import { LiveDataStatusBanner } from '../components/dashboard/LiveDataStatusBanner';
import { MetricStrip } from '../components/dashboard/MetricStrip';
import { RecommendationDetailModal } from '../components/dashboard/RecommendationDetailModal';
import { RecommendationGrid } from '../components/dashboard/RecommendationGrid';
import { SafeTimeCard } from '../components/dashboard/SafeTimeCard';
import { SaveCheckButton } from '../components/dashboard/SaveCheckButton';
import { SearchBar } from '../components/dashboard/SearchBar';
import { SelectedLocationMeta } from '../components/dashboard/SelectedLocationMeta';
import { ShouldGoOutCard } from '../components/dashboard/ShouldGoOutCard';
import { StationStatusRow } from '../components/dashboard/StationStatusRow';
import { useAppState } from '../context/AppStateContext';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../constants/theme';
import type { Recommendation } from '../types/dashboard';
import type { AtmoLocation } from '../types/location';
import {
  buildDashboardView,
  formatDashboardUpdatedAt,
  formatDeviceStatusLabel,
} from '../utils/dashboardMappers';

type DashboardScreenProps = {
  onOpenAnalytics?: () => void;
  onOpenMap?: () => void;
};

export function DashboardScreen({ onOpenAnalytics, onOpenMap }: DashboardScreenProps) {
  const insets = useSafeAreaInsets();
  const { profile, isLoading } = useProfile();
  const {
    latestReading,
    recommendation,
    selectedLocation,
    selectedDevice,
    devices,
    locationSearchQuery,
    locationSuggestions,
    setSelectedLocation,
    searchLocations,
    setLocationSearchQuery,
    refreshAtmoReadings,
    saveCurrentCheckToHistory,
    atmoFetchStatus,
  } = useAppState();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);

  useEffect(() => {
  void refreshAtmoReadings();

  const interval = setInterval(() => {
    void refreshAtmoReadings();
  }, 60000);

  return () => clearInterval(interval);
}, [refreshAtmoReadings]);

  const locationLabel = selectedLocation?.label ?? profile?.city ?? 'Выберите место';

  const displayedDeviceStatus =
    atmoFetchStatus === 'live'
      ? 'онлайн'
      : atmoFetchStatus === 'stale' || atmoFetchStatus === 'error'
        ? 'задержка'
        : selectedDevice ? formatDeviceStatusLabel(selectedDevice.status) : '';

  const stationLabel = selectedDevice
    ? `Станция ${selectedDevice.name} • ${displayedDeviceStatus}`
    : 'Станция не выбрана';

  const updatedAt = formatDashboardUpdatedAt(
    selectedDevice?.lastUpdated ?? latestReading?.createdAt ?? recommendation?.updatedAt,
  );

  const data =
    latestReading && recommendation
      ? buildDashboardView(latestReading, recommendation)
      : null;

  const scrollPadding = {
    paddingTop: insets.top + 8,
    paddingBottom: insets.bottom + 88,
  };

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setLocationSearchQuery('');
  };

  const handleSelectLocation = (location: AtmoLocation) => {
    setSelectedLocation(location);
    setIsSearchOpen(false);
  };

  const handleShowPopular = () => {
    setLocationSearchQuery('');
    searchLocations('');
  };

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <StatusBar style="dark" />
        <DashboardEmptyState title="Загрузка профиля..." message="" />
      </View>
    );
  }

  const locationBlock = (
    <View style={styles.locationBlock}>
      {!isSearchOpen ? (
        <SearchBar locationLabel={locationLabel} onPress={handleOpenSearch} />
      ) : (
        <LocationSearchPanel
          query={locationSearchQuery}
          suggestions={locationSuggestions}
          devices={devices}
          selectedId={selectedLocation?.id}
          onChangeQuery={searchLocations}
          onSelect={handleSelectLocation}
          onClose={handleCloseSearch}
          onShowPopular={handleShowPopular}
        />
      )}
      <SelectedLocationMeta nearestDevice={selectedDevice} />
    </View>
  );

  const headerBlock = (
    <>
      <DashboardHeader userName={profile?.name} />
      <DashboardGreeting name={profile?.name} />
      {locationBlock}
      <StationStatusRow
        stationLabel={stationLabel}
        lastUpdated={updatedAt}
        onRefresh={() => {
          void refreshAtmoReadings();
        }}
        onOpenMap={onOpenMap}
      />
      <LiveDataStatusBanner status={atmoFetchStatus} hasReading={Boolean(latestReading)} />
    </>
  );

  const recommendationModal = (
    <RecommendationDetailModal
      item={selectedRecommendation}
      onClose={() => setSelectedRecommendation(null)}
    />
  );

  if (!latestReading) {
    return (
      <View style={styles.screen}>
        <StatusBar style="dark" />
        <ScrollView
          contentContainerStyle={[styles.scroll, scrollPadding, styles.emptyScroll]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={atmoFetchStatus === 'loading'} onRefresh={() => { void refreshAtmoReadings(); }} />}
        >
          {headerBlock}
          <DashboardEmptyState
            title="Нет данных от станции"
            message="Выберите другую станцию или повторите позже."
            actionLabel="Обновить"
            onAction={() => {
              void refreshAtmoReadings();
            }}
          />
        </ScrollView>
        {recommendationModal}
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.screen}>
        <StatusBar style="dark" />
        <ScrollView
          contentContainerStyle={[styles.scroll, scrollPadding, styles.emptyScroll]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {headerBlock}
          <DashboardEmptyState
            title="Рекомендации пока недоступны"
            message="Попробуйте обновить данные или выбрать другую станцию."
            actionLabel="Обновить"
            onAction={() => {
              void refreshAtmoReadings();
            }}
          />
        </ScrollView>
        {recommendationModal}
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[styles.scroll, scrollPadding]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={atmoFetchStatus === 'loading'} onRefresh={() => { void refreshAtmoReadings(); }} />}
      >
        {headerBlock}
        <ComfortIndexCard
          score={data.comfortIndex}
          status={data.status}
          conclusion={data.conclusion}
        />
        <ShouldGoOutCard
          title={data.shouldGoOutTitle}
          subtitle={data.shouldGoOutSubtitle}
          explanation={data.shouldGoOutExplanation}
        />
        <SaveCheckButton onPress={saveCurrentCheckToHistory} />
        <SafeTimeCard
          safeTime={data.safeTime}
          returnAdvice={data.returnAdvice}
          worseningNote={data.worseningNote}
          updatedAt={data.updatedAt}
        />
        <RecommendationGrid
          items={data.recommendations}
          onItemPress={setSelectedRecommendation}
        />
        <MetricStrip
          metrics={data.metrics}
          stationLabel={stationLabel}
          updatedAt={data.updatedAt}
          onOpenAnalytics={onOpenAnalytics}
        />
        <DeveloperDiagnostics reading={latestReading} status={atmoFetchStatus} />
      </ScrollView>
      {recommendationModal}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: 18,
    gap: 14,
  },
  emptyScroll: {
    flexGrow: 1,
  },
  locationBlock: {
    gap: 6,
  },
});
