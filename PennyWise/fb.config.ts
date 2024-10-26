// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBNNtqMr91PD2DDeu-fH_ya7HVePadGufo",
  authDomain: "pennywise-189a4.firebaseapp.com",
  projectId: "pennywise-189a4",
  storageBucket: "pennywise-189a4.appspot.com",
  messagingSenderId: "177699166570",
  appId: "1:177699166570:web:26897c9396628cce982d13",
  measurementId: "G-R6QJWDKKDH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);