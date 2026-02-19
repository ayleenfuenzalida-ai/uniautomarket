// Firebase configuration for UniAutoMarket
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CATEGORIAS_COLLECTION = 'categorias';

// Get all categories from Firebase
export async function fetchCategoriasFromFirebase() {
  try {
    const categoriasRef = collection(db, CATEGORIAS_COLLECTION);
    const snapshot = await getDocs(categoriasRef);
    
    const categorias = [];
    snapshot.forEach((doc) => {
      categorias.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return categorias.sort((a, b) => (a.orden || 0) - (b.orden || 0));
  } catch (error) {
    console.error('Error fetching categorias:', error);
    return [];
  }
}

// Save all categories to Firebase
export async function saveCategoriasToFirebase(categorias) {
  try {
    for (const categoria of categorias) {
      const categoriaRef = doc(db, CATEGORIAS_COLLECTION, categoria.id);
      await setDoc(categoriaRef, categoria);
    }
    return true;
  } catch (error) {
    console.error('Error saving categorias:', error);
    return false;
  }
}

// Subscribe to real-time updates
export function subscribeToCategorias(callback) {
  const categoriasRef = collection(db, CATEGORIAS_COLLECTION);
  
  return onSnapshot(categoriasRef, async (snapshot) => {
    const categorias = [];
    snapshot.forEach((doc) => {
      categorias.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(categorias.sort((a, b) => (a.orden || 0) - (b.orden || 0)));
  }, (error) => {
    console.error('Error in subscription:', error);
  });
}

export { db, app };
