import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase.config";
import { getDatabase, ref, set } from "firebase/database"; // Import pour Realtime Database

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialisation de Realtime Database
const database = getDatabase(app);

export const authService = {
  registerDoctor: async (email, password, doctorData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "doctors", userCredential.user.uid), {
        ...doctorData,
        email,
        role: 'doctor',
        createdAt: new Date().toISOString(),
      });
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Nouvelle fonction : mise à jour de la localisation d'un patient
  updatePatientLocation: async (patientId, locationData) => {
    try {
      await set(ref(database, `patients/${patientId}`), locationData);
      console.log("Patient location updated successfully!");
    } catch (error) {
      console.error("Error updating patient location: ", error);
      throw error;
    }
  },
};

export { auth, db };
