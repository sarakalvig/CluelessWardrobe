import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBx7JyuEyvMej_ORC6oiWbHoELSbCBhV2w",
  authDomain: "clueless-wardrobe.firebaseapp.com",
  projectId: "clueless-wardrobe",
  storageBucket: "clueless-wardrobe.appspot.com",
  messagingSenderId: "454592051130",
  appId: "1:454592051130:web:61a5e63c8391b608df8f83",
  measurementId: "G-M82DSH77G8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
