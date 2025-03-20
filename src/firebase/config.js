import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
// Replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBAo8XmgOqdgIi4kWWRflWSR5aZBXoRH1U",
  authDomain: "thythu-calendar.firebaseapp.com",
  projectId: "thythu-calendar",
  storageBucket: "thythu-calendar.firebasestorage.app",
  messagingSenderId: "277261645143",
  appId: "1:277261645143:web:114785837ec6970428fa12",
  measurementId: "G-ZV8P7DYSS7",
  databaseURL: "https://thythu-calendar-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth };
