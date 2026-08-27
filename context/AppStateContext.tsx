import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { isMockMode } from '../config/appConfig';
import { MOCK_DEVICES } from '../data/mockDevices';
import { MOCK_LOCATIONS } from '../data/mockLocations';

import { useProfile } from './ProfileContext';

import {
  createAdminActionLog,
  createTelemetryLogsFromDevices,
  getReadingsForDevices,
} from '../services/adminService';

import {
  getDefaultDeviceId,
  getLatestReadingForDevice,
} from '../services/deviceService';

import { deviceRepository } from '../repositories/deviceRepository';
import { readingRepository } from '../repositories/readingRepository';

import {
  addHistoryItem as persistHistoryItem,
  clearHistory as clearPersistedHistory,
  createHistoryItemFromCurrentState,
  deleteHistoryItem as deletePersistedHistoryItem,
  getHistoryItems,
} from '../services/historyService';

import {
  addNotifications,
  clearNotifications as clearPersistedNotifications,
  deleteNotification as deletePersistedNotification,
  generateNotificationsFromState,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead as markPersistedNotificationRead,
} from '../services/notificationService';

import {
  findNearestDevice,
  searchMockLocations,
} from '../services/locationService';

import { getRecommendationForReading } from '../services/recommendationService';
import { isReadingStale } from '../services/sensorAnalysisService';

// REAL ATMO / THINGSPEAK
import {
  convertThingSpeakToReading,
  getAtmoData,
} from '../services/thingSpeak';

import type {
  AdminActionLog,
  AdminActionType,
  TelemetryLog,
} from '../types/admin';

import type { AtmoDevice } from '../types/device';
import type { HistoryItem } from '../types/history';
import type { AtmoLocation } from '../types/location';
import type { AtmoNotification } from '../types/notification';
import type { DeviceReading } from '../types/reading';
import type { RecommendationResult } from '../types/recommendation';


/* =========================================================
   CONTEXT TYPE
========================================================= */

type AppStateContextValue = {
  selectedLocation: AtmoLocation | null;
  selectedDevice: AtmoDevice | null;
  devices: AtmoDevice[];

  latestReading: DeviceReading | null;
  recommendation: RecommendationResult | null;
  atmoFetchStatus: AtmoFetchStatus;
  atmoFetchError: string | null;
  lastSuccessfulFetchAt: string | null;
  isLatestReadingStale: boolean;

  history: HistoryItem[];
  isHistoryLoading: boolean;

  notifications: AtmoNotification[];
  unreadNotificationsCount: number;
  isNotificationsLoading: boolean;

  locationSearchQuery: string;
  locationSuggestions: AtmoLocation[];

  setSelectedLocation: (location: AtmoLocation) => void;

  selectDevice: (deviceId: string) => void;

  searchLocations: (query: string) => AtmoLocation[];

  setLocationSearchQuery: (query: string) => void;

  // Старое mock-обновление пока оставляем,
  // потому что его могут использовать другие экраны.
  refreshMockReadings: () => Promise<void>;

  // НОВОЕ: реальные данные ThingSpeak
  refreshAtmoReadings: () => Promise<void>;

  saveCurrentCheckToHistory: () => Promise<void>;

  deleteHistoryItem: (id: string) => Promise<void>;

  clearHistory: () => Promise<void>;

  reloadHistory: () => Promise<void>;

  generateCurrentNotifications: () => Promise<void>;

  markNotificationRead: (id: string) => Promise<void>;

  markAllNotificationsRead: () => Promise<void>;

  deleteNotification: (id: string) => Promise<void>;

  clearNotifications: () => Promise<void>;

  reloadNotifications: () => Promise<void>;

  adminLogs: AdminActionLog[];

  telemetryLogs: TelemetryLog[];

  runAdminAction: (
    action: AdminActionType,
    deviceId?: string,
  ) => Promise<void>;

  clearAdminLogs: () => void;

  refreshTelemetryLogs: () => void;
};

export type AtmoFetchStatus =
  | 'idle'
  | 'loading'
  | 'live'
  | 'stale'
  | 'error'
  | 'no-data'
  | 'demo';


/* =========================================================
   CREATE CONTEXT
========================================================= */

const AppStateContext =
  createContext<AppStateContextValue | null>(null);


/* =========================================================
   BUILD OLD / MOCK DEVICE STATE
========================================================= */

async function buildStateForDevice(
  deviceId: string,
  profile: ReturnType<typeof useProfile>['profile'],
  location: AtmoLocation | null,
) {
  const reading =
    await readingRepository.getLatestReadingForDevice(deviceId);

  const recommendation = reading
    ? getRecommendationForReading(
        reading,
        profile,
        location,
      )
    : null;

  return {
    reading,
    recommendation,
  };
}


function buildStateForDeviceSync(
  deviceId: string | null,
  profile: ReturnType<typeof useProfile>['profile'],
  location: AtmoLocation | null,
) {
  if (!deviceId) {
    return {
      reading: null,
      recommendation: null,
    };
  }

  const reading =
    getLatestReadingForDevice(deviceId);

  const recommendation = reading
    ? getRecommendationForReading(
        reading,
        profile,
        location,
      )
    : null;

  return {
    reading,
    recommendation,
  };
}


function resolveInitialLocation(): AtmoLocation | null {
  return isMockMode ? MOCK_LOCATIONS[0] ?? null : null;
}


/* =========================================================
   PROVIDER
========================================================= */

export function AppStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { profile } = useProfile();


  /* =======================================================
     DEVICES
  ======================================================= */

  const [devices, setDevices] =
    useState<AtmoDevice[]>(
      () =>
        isMockMode
          ? [...MOCK_DEVICES]
          : [],
    );


  /* =======================================================
     INITIAL LOCATION
  ======================================================= */

  const initialLocation =
    resolveInitialLocation();


  const initialDeviceList =
    isMockMode
      ? MOCK_DEVICES
      : [];


  const initialDeviceId = (() => {
    if (!initialLocation) {
      return getDefaultDeviceId(
        initialDeviceList,
      );
    }

    return (
      findNearestDevice(
        initialLocation,
        initialDeviceList,
      )?.id ??
      getDefaultDeviceId(
        initialDeviceList,
      )
    );
  })();


  /* =======================================================
     MAIN STATE
  ======================================================= */

  const [
    selectedLocation,
    setSelectedLocationState,
  ] = useState<AtmoLocation | null>(
    initialLocation,
  );


  const [
    selectedDeviceId,
    setSelectedDeviceId,
  ] = useState<string | null>(
    initialDeviceId,
  );


  const initialDeviceState =
    buildStateForDeviceSync(
      initialDeviceId,
      null,
      initialLocation,
    );


  const [
    latestReading,
    setLatestReading,
  ] = useState<DeviceReading | null>(
    initialDeviceState.reading,
  );


  const [
    recommendation,
    setRecommendation,
  ] =
    useState<RecommendationResult | null>(
      initialDeviceState.recommendation,
    );

  const [atmoFetchStatus, setAtmoFetchStatus] = useState<AtmoFetchStatus>(
    isMockMode ? 'demo' : 'idle',
  );
  const [atmoFetchError, setAtmoFetchError] = useState<string | null>(null);
  const [lastSuccessfulFetchAt, setLastSuccessfulFetchAt] = useState<string | null>(null);


  /* =======================================================
     HISTORY
  ======================================================= */

  const [
    history,
    setHistory,
  ] =
    useState<HistoryItem[]>([]);


  const [
    isHistoryLoading,
    setIsHistoryLoading,
  ] =
    useState(true);


  /* =======================================================
     NOTIFICATIONS
  ======================================================= */

  const [
    notifications,
    setNotifications,
  ] =
    useState<AtmoNotification[]>([]);


  const [
    isNotificationsLoading,
    setIsNotificationsLoading,
  ] =
    useState(true);


  /* =======================================================
     LOCATION SEARCH
  ======================================================= */

  const [
    locationSearchQuery,
    setLocationSearchQuery,
  ] =
    useState('');


  /* =======================================================
     ADMIN
  ======================================================= */

  const [
    adminLogs,
    setAdminLogs,
  ] =
    useState<AdminActionLog[]>([]);


  const [
    telemetryLogs,
    setTelemetryLogs,
  ] =
    useState<TelemetryLog[]>([]);


  /* =======================================================
     PREVIOUS READING FOR NOTIFICATIONS
  ======================================================= */

  const previousReadingRef =
    useRef<DeviceReading | null>(
      null,
    );


  const previousRecommendationRef =
    useRef<RecommendationResult | null>(
      null,
    );

  const hasSuccessfulAtmoReadingRef = useRef(Boolean(initialDeviceState.reading));


  /* =======================================================
     LOCATION SUGGESTIONS
  ======================================================= */

  const locationSuggestions =
    useMemo(
      () =>
        searchMockLocations(
          locationSearchQuery,
        ),
      [locationSearchQuery],
    );


  /* =======================================================
     SELECTED DEVICE
  ======================================================= */

  const selectedDevice =
    useMemo(
      () =>
        devices.find(
          (device) =>
            device.id ===
            selectedDeviceId,
        ) ?? null,
      [
        devices,
        selectedDeviceId,
      ],
    );


  /* =======================================================
     UNREAD NOTIFICATIONS
  ======================================================= */

  const unreadNotificationsCount =
    useMemo(
      () =>
        notifications.filter(
          (item) =>
            !item.read,
        ).length,
      [notifications],
    );


  /* =======================================================
     TELEMETRY
  ======================================================= */

  const refreshTelemetryLogs =
    useCallback(() => {
      const readings =
        getReadingsForDevices(
          devices,
        );

      setTelemetryLogs(
        createTelemetryLogsFromDevices(
          devices,
          readings,
        ),
      );
    }, [devices]);


  /* =======================================================
     RELOAD NOTIFICATIONS
  ======================================================= */

  const reloadNotifications =
    useCallback(async () => {
      setIsNotificationsLoading(
        true,
      );

      try {
        const items =
          await getNotifications();

        setNotifications(
          items,
        );
      } finally {
        setIsNotificationsLoading(
          false,
        );
      }
    }, []);


  /* =======================================================
     RELOAD HISTORY
  ======================================================= */

  const reloadHistory =
    useCallback(async () => {
      setIsHistoryLoading(
        true,
      );

      try {
        const items =
          await getHistoryItems();

        setHistory(items);
      } finally {
        setIsHistoryLoading(
          false,
        );
      }
    }, []);


  /* =======================================================
     LOAD DEVICES
  ======================================================= */

  useEffect(() => {
    let active = true;

    async function loadDevices() {
      const loadedDevices =
        await deviceRepository.getDevices();

      if (active) {
        setDevices(
          loadedDevices,
        );

        // Если устройство ещё не выбрано,
        // выбираем первое доступное.
        if (
          !selectedDeviceId &&
          loadedDevices.length > 0
        ) {
          setSelectedDeviceId(
            loadedDevices[0].id,
          );
        }
      }
    }

    void loadDevices();

    return () => {
      active = false;
    };
  }, [selectedDeviceId]);


  /* =======================================================
     LOAD HISTORY + NOTIFICATIONS
  ======================================================= */

  useEffect(() => {
    let active = true;

    async function loadPersistedState() {
      setIsHistoryLoading(true);
      setIsNotificationsLoading(
        true,
      );

      try {
        const [
          historyItems,
          notificationItems,
        ] =
          await Promise.all([
            getHistoryItems(),
            getNotifications(),
          ]);

        if (active) {
          setHistory(
            historyItems,
          );

          setNotifications(
            notificationItems,
          );
        }
      } finally {
        if (active) {
          setIsHistoryLoading(
            false,
          );

          setIsNotificationsLoading(
            false,
          );
        }
      }
    }

    void loadPersistedState();

    return () => {
      active = false;
    };
  }, []);


  /* =======================================================
     TELEMETRY AUTO UPDATE
  ======================================================= */

  useEffect(() => {
    refreshTelemetryLogs();
  }, [refreshTelemetryLogs]);


  /* =======================================================
     NOTIFICATION GENERATION
  ======================================================= */

  const runNotificationGeneration =
    useCallback(
      async (
        reading:
          DeviceReading | null,

        nextRecommendation:
          RecommendationResult | null,

        device:
          AtmoDevice | null,

        location:
          AtmoLocation | null,
      ) => {
        const drafts =
          generateNotificationsFromState({
            reading,

            recommendation:
              nextRecommendation,

            selectedDevice:
              device,

            selectedLocation:
              location,

            previousReading:
              previousReadingRef.current,

            previousRecommendation:
              previousRecommendationRef.current,
          });


        if (
          drafts.length > 0
        ) {
          const added =
            await addNotifications(
              drafts,
            );

          if (
            added.length > 0
          ) {
            setNotifications(
              await getNotifications(),
            );
          }
        }


        previousReadingRef.current =
          reading;

        previousRecommendationRef.current =
          nextRecommendation;
      },
      [],
    );


  /* =======================================================
     GENERATE CURRENT NOTIFICATIONS
  ======================================================= */

  const generateCurrentNotifications =
    useCallback(async () => {
      await runNotificationGeneration(
        latestReading,
        recommendation,
        selectedDevice,
        selectedLocation,
      );
    }, [
      latestReading,
      recommendation,
      selectedDevice,
      selectedLocation,
      runNotificationGeneration,
    ]);


  /* =======================================================
     OLD DEVICE SELECTION
  ======================================================= */

  const applyDeviceSelection =
    useCallback(
      async (
        deviceId: string,

        locationOverride?:
          AtmoLocation | null,

        withNotifications = false,
      ) => {
        setSelectedDeviceId(
          deviceId,
        );

        const location =
          locationOverride ??
          selectedLocation;


        const next =
          await buildStateForDevice(
            deviceId,
            profile,
            location,
          );


        setLatestReading(
          next.reading,
        );


        setRecommendation(
          next.recommendation,
        );


        if (
          withNotifications
        ) {
          const device =
            devices.find(
              (item) =>
                item.id ===
                deviceId,
            ) ??
            (
              await deviceRepository.getDeviceById(
                deviceId,
              )
            );


          await runNotificationGeneration(
            next.reading,
            next.recommendation,
            device,
            location,
          );
        }
      },
      [
        profile,
        selectedLocation,
        runNotificationGeneration,
        devices,
      ],
    );


  /* =======================================================
     CLEAR DEVICE
  ======================================================= */

  const clearDeviceSelection =
    useCallback(() => {
      setSelectedDeviceId(
        null,
      );

      setLatestReading(
        null,
      );

      setRecommendation(
        null,
      );
    }, []);


  /* =======================================================
     REBUILD RECOMMENDATION
  ======================================================= */

  useEffect(() => {
    if (!latestReading) {
      return;
    }

    setRecommendation(
      getRecommendationForReading(
        latestReading,
        profile,
        selectedLocation,
      ),
    );
  }, [
    profile,
    latestReading,
    selectedLocation,
  ]);


  /* =======================================================
     SELECT DEVICE
  ======================================================= */

  const selectDevice =
    useCallback(
      (deviceId: string) => {
        void applyDeviceSelection(
          deviceId,
          undefined,
          true,
        );
      },
      [applyDeviceSelection],
    );


  /* =======================================================
     SELECT LOCATION
  ======================================================= */

  const setSelectedLocation =
    useCallback(
      (
        location:
          AtmoLocation,
      ) => {
        setSelectedLocationState(
          location,
        );

        setLocationSearchQuery(
          '',
        );

        if (!isMockMode && devices.length === 1) {
          setSelectedDeviceId(devices[0].id);
          return;
        }

        const nearest =
          findNearestDevice(
            location,
            devices,
          );


        if (nearest) {
          void applyDeviceSelection(
            nearest.id,
            location,
            true,
          );

          return;
        }


        clearDeviceSelection();
      },
      [
        applyDeviceSelection,
        clearDeviceSelection,
        devices,
      ],
    );


  /* =======================================================
     SEARCH
  ======================================================= */

  const searchLocations =
    useCallback(
      (
        query:
          string,
      ) => {
        setLocationSearchQuery(
          query,
        );

        return searchMockLocations(
          query,
        );
      },
      [],
    );


  /* =======================================================
     MOCK REFRESH
  ======================================================= */

  const refreshMockReadings =
    useCallback(async () => {
      if (
        !selectedDeviceId
      ) {
        return;
      }

      await applyDeviceSelection(
        selectedDeviceId,
        undefined,
        true,
      );
    }, [
      applyDeviceSelection,
      selectedDeviceId,
    ]);


  /* =======================================================
     REAL THINGSPEAK REFRESH
  ======================================================= */

  const refreshAtmoReadings =
    useCallback(async () => {
      const deviceId =
        selectedDeviceId ??
        selectedDevice?.id ??
        'ATMO-STATION-1';

      if (isMockMode) {
        await applyDeviceSelection(deviceId, undefined, true);
        setAtmoFetchStatus('demo');
        setAtmoFetchError(null);
        return;
      }

      setAtmoFetchStatus('loading');
      setAtmoFetchError(null);
      try {
        const atmoData =
          await getAtmoData();
        const reading =
          convertThingSpeakToReading(
            atmoData,
            deviceId,
          );
        const nextRecommendation =
          getRecommendationForReading(
            reading,
            profile,
            selectedLocation,
          );
        setLatestReading(
          reading,
        );
        setRecommendation(
          nextRecommendation,
        );
        if (
          !selectedDeviceId
        ) {
          setSelectedDeviceId(
            deviceId,
          );
        }
        const stale = isReadingStale(reading.createdAt);
        setAtmoFetchStatus(stale ? 'stale' : 'live');
        setLastSuccessfulFetchAt(new Date().toISOString());
        hasSuccessfulAtmoReadingRef.current = true;
        const device =
          selectedDevice;


        await runNotificationGeneration(
          reading,
          nextRecommendation,
          device ?? null,
          selectedLocation,
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
        setAtmoFetchError(message);
        setAtmoFetchStatus(hasSuccessfulAtmoReadingRef.current ? 'error' : 'no-data');
        console.warn('ATMO: ThingSpeak refresh failed');
      }
    }, [
      selectedDeviceId,
      profile,
      selectedLocation,
      selectedDevice,
      runNotificationGeneration,
      applyDeviceSelection,
    ]);


  /* =======================================================
     SAVE HISTORY
  ======================================================= */

  const saveCurrentCheckToHistory =
    useCallback(async () => {
      const draft =
        createHistoryItemFromCurrentState({
          location:
            selectedLocation,

          device:
            selectedDevice,

          reading:
            latestReading,

          recommendation,

          profileCity:
            profile?.city,
        });


      if (!draft) {
        throw new Error(
          'NO_DATA',
        );
      }


      const saved =
        await persistHistoryItem(
          draft,
        );


      if (!saved) {
        throw new Error(
          'DUPLICATE',
        );
      }


      setHistory(
        (prev) => [
          saved,

          ...prev.filter(
            (item) =>
              item.id !==
              saved.id,
          ),
        ],
      );
    }, [
      selectedLocation,
      selectedDevice,
      latestReading,
      recommendation,
      profile?.city,
    ]);


  /* =======================================================
     HISTORY ACTIONS
  ======================================================= */

  const deleteHistoryItem =
    useCallback(
      async (
        id:
          string,
      ) => {
        await deletePersistedHistoryItem(
          id,
        );

        setHistory(
          (prev) =>
            prev.filter(
              (item) =>
                item.id !== id,
            ),
        );
      },
      [],
    );


  const clearHistory =
    useCallback(async () => {
      await clearPersistedHistory();

      setHistory([]);
    }, []);


  /* =======================================================
     NOTIFICATION ACTIONS
  ======================================================= */

  const handleMarkNotificationRead =
    useCallback(
      async (
        id:
          string,
      ) => {
        await markPersistedNotificationRead(
          id,
        );

        setNotifications(
          (prev) =>
            prev.map(
              (item) =>
                item.id === id
                  ? {
                      ...item,
                      read: true,
                    }
                  : item,
            ),
        );
      },
      [],
    );


  const handleMarkAllNotificationsRead =
    useCallback(async () => {
      await markAllNotificationsRead();

      setNotifications(
        (prev) =>
          prev.map(
            (item) => ({
              ...item,
              read: true,
            }),
          ),
      );
    }, []);


  const handleDeleteNotification =
    useCallback(
      async (
        id:
          string,
      ) => {
        await deletePersistedNotification(
          id,
        );

        setNotifications(
          (prev) =>
            prev.filter(
              (item) =>
                item.id !==
                id,
            ),
        );
      },
      [],
    );


  const handleClearNotifications =
    useCallback(async () => {
      await clearPersistedNotifications();

      setNotifications([]);
    }, []);


  /* =======================================================
     ADMIN
  ======================================================= */

  const clearAdminLogs =
    useCallback(() => {
      setAdminLogs([]);
    }, []);


  const runAdminAction =
    useCallback(
      async (
        action:
          AdminActionType,

        deviceId?:
          string,
      ) => {

        const targetDeviceId =
          deviceId ??
          selectedDeviceId ??
          undefined;


        if (
          action ===
          'firmware_update'
        ) {
          const pendingLog =
            createAdminActionLog({
              action,

              deviceId:
                targetDeviceId,

              status:
                'pending',

              message:
                'Запущена проверка обновления прошивки.',
            });


          setAdminLogs(
            (prev) => [
              pendingLog,
              ...prev,
            ],
          );


          await new Promise(
            (resolve) => {
              setTimeout(
                resolve,
                700,
              );
            },
          );


          const successLog:
            AdminActionLog = {
              ...pendingLog,

              status:
                'success',

              message:
                'Проверка обновления завершена. Новых версий не найдено.',

              createdAt:
                new Date().toISOString(),
            };


          setAdminLogs(
            (prev) => [
              successLog,

              ...prev.filter(
                (item) =>
                  item.id !==
                  pendingLog.id,
              ),
            ],
          );

          return;
        }


        /*
         * В админке refresh_data
         * тоже используем реальные данные.
         */
        if (
          action ===
          'refresh_data'
        ) {
          await refreshAtmoReadings();

          refreshTelemetryLogs();
        }


        const log =
          createAdminActionLog({
            action,
            deviceId:
              targetDeviceId,
          });


        setAdminLogs(
          (prev) => [
            log,
            ...prev,
          ],
        );
      },
      [
        selectedDeviceId,
        refreshAtmoReadings,
        refreshTelemetryLogs,
      ],
    );


  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value =
    useMemo<AppStateContextValue>(
      () => ({
        selectedLocation,

        selectedDevice,

        devices,

        latestReading,

        recommendation,

        atmoFetchStatus,

        atmoFetchError,

        lastSuccessfulFetchAt,

        isLatestReadingStale: latestReading ? isReadingStale(latestReading.createdAt) : false,

        history,

        isHistoryLoading,

        notifications,

        unreadNotificationsCount,

        isNotificationsLoading,

        locationSearchQuery,

        locationSuggestions,

        setSelectedLocation,

        selectDevice,

        searchLocations,

        setLocationSearchQuery,

        refreshMockReadings,

        // REAL THINGSPEAK
        refreshAtmoReadings,

        saveCurrentCheckToHistory,

        deleteHistoryItem,

        clearHistory,

        reloadHistory,

        generateCurrentNotifications,

        markNotificationRead:
          handleMarkNotificationRead,

        markAllNotificationsRead:
          handleMarkAllNotificationsRead,

        deleteNotification:
          handleDeleteNotification,

        clearNotifications:
          handleClearNotifications,

        reloadNotifications,

        adminLogs,

        telemetryLogs,

        runAdminAction,

        clearAdminLogs,

        refreshTelemetryLogs,
      }),
      [
        selectedLocation,

        selectedDevice,

        devices,

        latestReading,

        recommendation,

        atmoFetchStatus,

        atmoFetchError,

        lastSuccessfulFetchAt,

        history,

        isHistoryLoading,

        notifications,

        unreadNotificationsCount,

        isNotificationsLoading,

        locationSearchQuery,

        locationSuggestions,

        setSelectedLocation,

        selectDevice,

        searchLocations,

        refreshMockReadings,

        refreshAtmoReadings,

        saveCurrentCheckToHistory,

        deleteHistoryItem,

        clearHistory,

        reloadHistory,

        generateCurrentNotifications,

        handleMarkNotificationRead,

        handleMarkAllNotificationsRead,

        handleDeleteNotification,

        handleClearNotifications,

        reloadNotifications,

        adminLogs,

        telemetryLogs,

        runAdminAction,

        clearAdminLogs,

        refreshTelemetryLogs,
      ],
    );


  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <AppStateContext.Provider
      value={value}
    >
      {children}
    </AppStateContext.Provider>
  );
}


/* =========================================================
   USE APP STATE
========================================================= */

export function useAppState():
  AppStateContextValue {

  const context =
    useContext(
      AppStateContext,
    );


  if (!context) {
    throw new Error(
      'useAppState must be used within AppStateProvider',
    );
  }


  return context;
}
