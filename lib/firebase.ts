// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCn-ABtebJ2W8zpmU8bps9p5bHgY3sccLw",
  authDomain: "nexo-web-cce38.firebaseapp.com",
  projectId: "nexo-web-cce38",
  storageBucket: "nexo-web-cce38.firebasestorage.app",
  messagingSenderId: "1029972554734",
  appId: "1:1029972554734:web:ceb686e84f1434874c54ff"
};

// Singleton ပုံစံဖြင့် Initialize လုပ်ခြင်း
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };