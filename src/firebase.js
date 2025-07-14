import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAMwqKznVRwwViSRH7xWby5e45wY4ZpgtQ",
  authDomain: "soicalmedia-6a40a.firebaseapp.com",
  projectId: "soicalmedia-6a40a",
  storageBucket: "soicalmedia-6a40a.firebasestorage.app",
  messagingSenderId: "358485952621",
  appId: "1:358485952621:web:9bf768bcc9c9e9565bd764"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app; 