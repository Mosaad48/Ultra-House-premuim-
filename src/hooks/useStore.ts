import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Store } from '../types';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';

interface StoreState {
  currentStore: Store | null;
  loading: boolean;
  error: string | null;
  fetchStore: (storeId: string) => Promise<void>;
  fetchStoreBySlug: (slug: string) => Promise<void>;
  updateStore: (storeId: string, updates: Partial<Store>) => Promise<void>;
  setStore: (store: Store | null) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      currentStore: null,
      loading: false,
      error: null,
      fetchStore: async (storeId) => {
        set({ loading: true, error: null });
        try {
          const docRef = doc(db, 'stores', storeId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            set({ currentStore: { id: docSnap.id, ...docSnap.data() } as Store, loading: false });
          } else {
            set({ error: 'Store not found', loading: false });
          }
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },
      fetchStoreBySlug: async (slug = 'main-store') => {
        // Single store focus: try to get the store by slug, fallback to first available
        const current = get().currentStore;
        if (current && current.slug === slug) return;

        set({ loading: true, error: null });
        try {
          const storesRef = collection(db, 'stores');
          const q = query(storesRef, where("slug", "==", slug));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            set({ currentStore: { id: docSnap.id, ...docSnap.data() } as Store, loading: false });
          } else {
            // If no store exists, fetch the first one in the collection
            const allStoresQ = query(storesRef, limit(1));
            const allStoresSnap = await getDocs(allStoresQ);
            
            if (!allStoresSnap.empty) {
              const docSnap = allStoresSnap.docs[0];
              set({ currentStore: { id: docSnap.id, ...docSnap.data() } as Store, loading: false });
            } else {
              set({ error: 'Store not found', loading: false });
            }
          }
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },
      updateStore: async (storeId, updates) => {
        try {
          const docRef = doc(db, 'stores', storeId);
          await updateDoc(docRef, updates as any);
          set((state) => ({
            currentStore: state.currentStore ? { ...state.currentStore, ...updates } : null
          }));
        } catch (err: any) {
          console.error('Failed to update store:', err);
          throw err;
        }
      },
      setStore: (store) => set({ currentStore: store }),
    }),
    {
      name: 'lumiere-store-storage',
      //@ts-ignore
      partialize: (state) => ({ currentStore: state.currentStore }),
    }
  )
);
