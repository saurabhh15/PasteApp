import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD3Q7WEnX0GsI8096u4ycVbIgPTg1D7_yE",
  authDomain: "pasteapp-6ac35.firebaseapp.com",
  projectId: "pasteapp-6ac35",
  storageBucket: "pasteapp-6ac35.firebasestorage.app",
  messagingSenderId: "75229641795",
  appId: "1:75229641795:web:aed520d0acf6feab0068f6",
  measurementId: "G-0FVJ7H90QY",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);