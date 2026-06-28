import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAHwJ_LGGB-rr_F4Ly5giunICH5_x4YGnI",
  authDomain: "genial-magnet-246tg.firebaseapp.com",
  projectId: "genial-magnet-246tg",
  storageBucket: "genial-magnet-246tg.firebasestorage.app",
  messagingSenderId: "1022267686455",
  appId: "1:1022267686455:web:5051aa41579e31431a09b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with the specific databaseId from the configuration
const db = getFirestore(app, "ai-studio-datakesyahbandar-efe1080f-8e39-44b8-bb0a-9221a68ea484");

export { db };
