import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrkFFnHT6MWM9-xtLhxfKaWL-cmtUCPEo",
  authDomain: "hospital-tracking-f511d.firebaseapp.com",
  projectId: "hospital-tracking-f511d",
  storageBucket: "hospital-tracking-f511d.appspot.com",
  messagingSenderId: "616452390078",
  appId: "1:616452390078:web:35216661ef98a4e949f2ef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


// Export Firestore database instance
export const db = getFirestore(app);
export const auth = getAuth(app);

export { database };
