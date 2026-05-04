import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjl3_tX2IDkON_oR5RkwqN0UdgeGlXY0o",
  authDomain: "medication-tracker-ecf7a.firebaseapp.com",
  projectId: "medication-tracker-ecf7a",
  storageBucket: "medication-tracker-ecf7a.firebasestorage.app",
  messagingSenderId: "157838267454",
  appId: "1:157838267454:web:cf8662c222604546022d6f"
};

const firebase_app = initializeApp(firebaseConfig);
export const db = getFirestore(firebase_app);
