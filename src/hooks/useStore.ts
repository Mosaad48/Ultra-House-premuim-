import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StoreSettings } from '../types';
import { storeService } from '../services/storeService';

interface StoreState {
  currentStore: StoreSettings | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Partial<StoreSettings>) => Promise<void>;
  setSettings: (settings: StoreSettings | null) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      currentStore: null,
      loading: false,
      error: null,
      fetchSettings: async () => {
        set({ loading: true, error: null });
        try {
          const settings = await storeService.getSettings();
          if (settings) {
            set({ currentStore: settings, loading: false });
          } else {
            // Provide a default if nothing in DB
            const defaultSettings: StoreSettings = {
              id: 'default',
              storeName: 'LUMIÈRE',
              primaryColor: '#000000',
              accentColor: '#fbbf24',
              fontFamily: 'Inter',
              currency: 'USD',
              updatedAt: new Date().toISOString()
            };
            set({ currentStore: defaultSettings, loading: false });
          }
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },
      updateSettings: async (updates) => {
        set({ loading: true });
        try {
          await storeService.updateSettings(updates);
          set((state) => ({
            currentStore: state.currentStore ? { ...state.currentStore, ...updates } : null,
            loading: false
          }));
        } catch (err: any) {
          console.error('Failed to update settings:', err);
          set({ loading: false, error: err.message });
          throw err;
        }
      },
      setSettings: (settings) => set({ currentStore: settings }),
    }),
    {
      name: 'lumiere-store-storage',
      //@ts-ignore
      partialize: (state) => ({ currentStore: state.currentStore }),
    }
  )
);
