// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAs5ny3i0bzpWL50lvXALRlgkBygZcgWWo",
  authDomain: "car-rental-web-app-369ff.firebaseapp.com",
  projectId: "car-rental-web-app-369ff",
  storageBucket: "car-rental-web-app-369ff.firebasestorage.app",
  messagingSenderId: "426133164896",
  appId: "1:426133164896:web:d2d64388ca27f37a350405",
  measurementId: "G-LKEHDFS0YX",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
