import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppStateProvider } from './context/AppStateContext';
import { ProfileLoadingScreen } from './components/ProfileLoadingScreen';
import { AdminScreen } from './screens/AdminScreen';
import { AssistantScreen } from './screens/AssistantScreen';
import { BottomTabBar, type MainTab } from './components/navigation/BottomTabBar';
import { AnalyticsScreen } from './screens/AnalyticsScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { DeviceMapScreen } from './screens/DeviceMapScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { RegistrationScreen } from './screens/RegistrationScreen';
import { ProfileProvider, useProfile } from './context/ProfileContext';

function MainApp() {
  const [tab, setTab] = useState<MainTab>('home');

  return (
    <AppStateProvider>
      <View style={styles.shell}>
        <View style={styles.content}>
          {tab === 'home' ? (
            <DashboardScreen
              onOpenAnalytics={() => setTab('analytics')}
              onOpenMap={() => setTab('map')}
            />
          ) : null}
          {tab === 'analytics' ? <AnalyticsScreen /> : null}
          {tab === 'map' ? (
            <DeviceMapScreen activeTab={tab} onTabChange={setTab} />
          ) : null}
          {tab === 'assistant' ? (
            <AssistantScreen
              activeTab={tab}
              onTabChange={setTab}
              onBack={() => setTab('home')}
            />
          ) : null}
          {tab === 'profile' ? (
            <HistoryScreen
              onOpenAdmin={() => setTab('admin')}
              onGoHome={() => setTab('home')}
            />
          ) : null}
          {tab === 'admin' ? <AdminScreen onTabChange={setTab} /> : null}
        </View>
        {tab !== 'map' && tab !== 'assistant' && tab !== 'admin' ? (
          <BottomTabBar active={tab} onChange={setTab} />
        ) : null}
      </View>
    </AppStateProvider>
  );
}

function AppContent() {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return <ProfileLoadingScreen />;
  }

  if (!profile) {
    return <RegistrationScreen />;
  }

  return <MainApp />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ProfileProvider>
        <AppContent />
      </ProfileProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
