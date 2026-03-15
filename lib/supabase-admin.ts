/**
 * Firebase Admin Configuration
 *
 * This module provides a Firebase admin-level client for server-side operations.
 * In production, use the Firebase Admin SDK with a service account.
 *
 * TODO: Replace with firebase-admin SDK for privileged server operations.
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

let adminApp: FirebaseApp;
if (getApps().length === 0) {
  adminApp = initializeApp(firebaseConfig);
} else {
  adminApp = getApps()[0];
}

export const dbAdmin: Firestore = getFirestore(adminApp);
export default adminApp;
