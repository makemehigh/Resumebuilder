'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/lib/firebase';
import { useAuthStore } from '../src/stores/useAuthStore';

export default function AuthInitializer() {
  const { setUser, setLoading, user } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);

  return null;
}
