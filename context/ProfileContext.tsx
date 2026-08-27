import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  clearUserProfile,
  getUserProfile,
  saveUserProfile,
  updateUserProfile,
} from '../services/profileService';
import type { UserProfile } from '../types/profile';

type ProfileContextValue = {
  profile: UserProfile | null;
  isLoading: boolean;
  saveProfile: (profile: UserProfile) => Promise<void>;
  updateProfile: (updates: Partial<Omit<UserProfile, 'createdAt'>>) => Promise<void>;
  clearProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const saved = await getUserProfile();
        if (active) {
          setProfile(saved);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const saveProfile = useCallback(async (nextProfile: UserProfile) => {
    await saveUserProfile(nextProfile);
    setProfile(nextProfile);
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<Omit<UserProfile, 'createdAt'>>) => {
      const updated = await updateUserProfile(updates);
      setProfile(updated);
    },
    [],
  );

  const clearProfile = useCallback(async () => {
    await clearUserProfile();
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      isLoading,
      saveProfile,
      updateProfile,
      clearProfile,
    }),
    [profile, isLoading, saveProfile, updateProfile, clearProfile],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
}
