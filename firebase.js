import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, setDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC21VVoQavyr0TNVBQTyXCZkIhgYdemvVg",
  authDomain: "ahmadskh-6d7a1.firebaseapp.com",
  projectId: "ahmadskh-6d7a1",
  storageBucket: "ahmadskh-6d7a1.firebasestorage.app",
  messagingSenderId: "55483296072",
  appId: "1:55483296072:web:51ee44b5dc5fcc8b5eeb7d",
  measurementId: "G-L4PLEJJ8E1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { collection, addDoc, setDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp };
