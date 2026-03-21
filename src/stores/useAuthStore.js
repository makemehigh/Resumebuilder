import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      error: null,
      initialized: false,
      
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      logout: () => set({ user: null, error: null }),
      
      clearError: () => set({ error: null }),
      
      initAuth: () => {
        if (typeof window !== 'undefined' && !get().initialized) {
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            set({ user, isLoading: false, initialized: true });
          });
          return unsubscribe;
        }
        return () => {};
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
