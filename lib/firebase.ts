// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Storage ကို ခဏဖယ်ထားပါမယ် (ImgBB သုံးမှာဖြစ်လို့)

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// App ကို Singleton အနေနဲ့ တစ်ကြိမ်ပဲ ပွင့်အောင် လုပ်ခြင်း
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Export လုပ်မယ့် Variables များ
const db = getFirestore(app);
const auth = getAuth(app);

// Storage မသုံးတော့တဲ့အတွက် Export ထဲကနေ ဖယ်ထုတ်ထားပါမယ်
export { db, auth };
export default app;