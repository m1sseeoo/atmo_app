import { NativeModules, Platform } from 'react-native';

type StorageAdapter = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

const memoryStore = new Map<string, string>();
let cachedAdapter: StorageAdapter | null = null;
let warnedAboutFallback = false;

const memoryAdapter: StorageAdapter = {
  async getItem(key) {
    return memoryStore.get(key) ?? null;
  },
  async setItem(key, value) {
    memoryStore.set(key, value);
  },
  async removeItem(key) {
    memoryStore.delete(key);
  },
};

function hasNativeAsyncStorageModule(): boolean {
  if (Platform.OS === 'web') {
    return true;
  }

  return Boolean(NativeModules.RNCAsyncStorage);
}

async function resolveStorageAdapter(): Promise<StorageAdapter> {
  if (cachedAdapter) {
    return cachedAdapter;
  }

  if (!hasNativeAsyncStorageModule()) {
    if (!warnedAboutFallback) {
      warnedAboutFallback = true;
      console.warn(
        'ATMO: AsyncStorage native module is unavailable. Using in-memory profile storage for this session.',
      );
    }
    cachedAdapter = memoryAdapter;
    return cachedAdapter;
  }

  try {
    const module = await import('@react-native-async-storage/async-storage');
    const AsyncStorage = module.default;

    await AsyncStorage.setItem('__atmo_storage_probe__', '1');
    await AsyncStorage.removeItem('__atmo_storage_probe__');

    cachedAdapter = AsyncStorage;
    return cachedAdapter;
  } catch (error) {
    if (!warnedAboutFallback) {
      warnedAboutFallback = true;
      console.warn(
        'ATMO: AsyncStorage failed to initialize. Using in-memory profile storage for this session.',
        error,
      );
    }
    cachedAdapter = memoryAdapter;
    return cachedAdapter;
  }
}

export async function storageGetItem(key: string): Promise<string | null> {
  const storage = await resolveStorageAdapter();
  return storage.getItem(key);
}

export async function storageSetItem(key: string, value: string): Promise<void> {
  const storage = await resolveStorageAdapter();
  await storage.setItem(key, value);
}

export async function storageRemoveItem(key: string): Promise<void> {
  const storage = await resolveStorageAdapter();
  await storage.removeItem(key);
}

export function __resetStorageAdapterForTests(): void {
  cachedAdapter = null;
  warnedAboutFallback = false;
  memoryStore.clear();
}
