import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDmYlwu58YhfUdToaCHOsjpOpvvE7OEQP0",
  authDomain: "resumebuider-50fec.firebaseapp.com",
  projectId: "resumebuider-50fec",
  storageBucket: "resumebuider-50fec.firebasestorage.app",
  messagingSenderId: "567842926887",
  appId: "1:567842926887:web:57aa6ff9e7e4e3c284b902",
  measurementId: "G-6G19HWEMC5"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
