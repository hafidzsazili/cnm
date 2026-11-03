import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Configuration loaded from firebase-applet-config.json
const firebaseConfig = {
  projectId: "emerald-theory-9f6jr",
  appId: "1:155149553024:web:f66d16389d1739a8d00565",
  apiKey: "AIzaSyAKmVFviWV1eW67jyVmjzPIlfabJEK67pY",
  authDomain: "emerald-theory-9f6jr.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-cinemindsimwebsi-1c27072c-55df-4e96-a3ae-a800cc30bdd5",
  storageBucket: "emerald-theory-9f6jr.firebasestorage.app",
  messagingSenderId: "155149553024",
  measurementId: ""
};

let db: Firestore | null = null;

try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  // Initialize with custom firestoreDatabaseId if configured, or default
  db = firebaseConfig.firestoreDatabaseId 
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
} catch (err) {
  console.warn('Firebase initialization notice (will use structured local cache):', err);
  db = null;
}

export { db };
