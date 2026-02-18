// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import type { Categoria } from '@/types';

const firebaseConfig = {
  apiKey: "AIzaSyCWPzLCFQbS6BOMnkT8R7AkfNm1I0r4cAI",
  authDomain: "uniautomarket-f6ffa.firebaseapp.com",
  projectId: "uniautomarket-f6ffa",
  storageBucket: "uniautomarket-f6ffa.firebasestorage.app",
  messagingSenderId: "419809946130",
  appId: "1:419809946130:web:b19c58f9203fb42b9d46cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Document reference
const CATEGORIAS_DOC = doc(db, 'data', 'categorias');

// Fetch categorias from Firebase
export async function fetchCategoriasFromFirebase(): Promise<Categoria[] | null> {
  try {
    const docSnap = await getDoc(CATEGORIAS_DOC);
    if (docSnap.exists()) {
      return docSnap.data().categorias as Categoria[];
    }
    return null;
  } catch (error) {
    console.error('Error fetching from Firebase:', error);
    return null;
  }
}

// Save categorias to Firebase
export async function saveCategoriasToFirebase(categorias: Categoria[]): Promise<boolean> {
  try {
    await setDoc(CATEGORIAS_DOC, { categorias });
    return true;
  } catch (error) {
    console.error('Error saving to Firebase:', error);
    return false;
  }
}

// Subscribe to real-time updates
export function subscribeToCategorias(callback: (categorias: Categoria[]) => void) {
  return onSnapshot(CATEGORIAS_DOC, (doc) => {
    if (doc.exists()) {
      callback(doc.data().categorias as Categoria[]);
    }
  });
}
