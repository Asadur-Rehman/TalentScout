// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "talentscout-7a4de.firebaseapp.com",
  projectId: "talentscout-7a4de",
  storageBucket: "talentscout-7a4de.firebasestorage.app",
  messagingSenderId: "793722617950",
  appId: "1:793722617950:web:66905763dca78b1c22b4cf",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
