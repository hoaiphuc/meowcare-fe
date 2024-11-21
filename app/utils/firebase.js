// utils/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAMD2keHKBsg2LsQPLe1NVS5xwfRY-qwE0",
  authDomain: "meowcare-22fd8.firebaseapp.com",
  projectId: "meowcare-22fd8",
  storageBucket: "meowcare-22fd8.appspot.com",
  messagingSenderId: "818268491134",
  appId: "1:818268491134:web:a1aa9229a74677833eb72f",
  measurementId: "G-RH72JTF2NY",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export const db = getFirestore(app);

export { storage };
