// Firebase configuration for UniAutoMarket
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

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
const db = getFirestore(app);

// Collection names
const CATEGORIAS_COLLECTION = 'categorias';
const NEGOCIOS_COLLECTION = 'negocios';

// ==================== CATEGORIAS ====================

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

// Save a category to Firebase
export async function saveCategoriaToFirebase(categoria) {
  try {
    const categoriaRef = doc(db, CATEGORIAS_COLLECTION, categoria.id);
    await setDoc(categoriaRef, categoria);
    return true;
  } catch (error) {
    console.error('Error saving categoria:', error);
    return false;
  }
}

// Update a category
export async function updateCategoriaInFirebase(id, data) {
  try {
    const categoriaRef = doc(db, CATEGORIAS_COLLECTION, id);
    await updateDoc(categoriaRef, data);
    return true;
  } catch (error) {
    console.error('Error updating categoria:', error);
    return false;
  }
}

// Delete a category
export async function deleteCategoriaFromFirebase(id) {
  try {
    const categoriaRef = doc(db, CATEGORIAS_COLLECTION, id);
    await deleteDoc(categoriaRef);
    return true;
  } catch (error) {
    console.error('Error deleting categoria:', error);
    return false;
  }
}

// ==================== NEGOCIOS ====================

// Add a business to a category
export async function addNegocioToFirebase(categoriaId, negocio) {
  try {
    const negocioRef = doc(db, CATEGORIAS_COLLECTION, categoriaId, 'negocios', negocio.id);
    await setDoc(negocioRef, negocio);
    return true;
  } catch (error) {
    console.error('Error adding negocio:', error);
    return false;
  }
}

// Update a business
export async function updateNegocioInFirebase(categoriaId, negocioId, data) {
  try {
    const negocioRef = doc(db, CATEGORIAS_COLLECTION, categoriaId, 'negocios', negocioId);
    await updateDoc(negocioRef, data);
    return true;
  } catch (error) {
    console.error('Error updating negocio:', error);
    return false;
  }
}

// Delete a business
export async function deleteNegocioFromFirebase(categoriaId, negocioId) {
  try {
    const negocioRef = doc(db, CATEGORIAS_COLLECTION, categoriaId, 'negocios', negocioId);
    await deleteDoc(negocioRef);
    return true;
  } catch (error) {
    console.error('Error deleting negocio:', error);
    return false;
  }
}

// ==================== REAL-TIME SUBSCRIPTION ====================

// Subscribe to categories changes (real-time)
export function subscribeToCategorias(callback) {
  const categoriasRef = collection(db, CATEGORIAS_COLLECTION);
  
  return onSnapshot(categoriasRef, async (snapshot) => {
    const categorias = [];
    
    for (const catDoc of snapshot.docs) {
      const categoriaData = catDoc.data();
      
      // Get businesses for this category
      const negociosRef = collection(db, CATEGORIAS_COLLECTION, catDoc.id, 'negocios');
      const negociosSnapshot = await getDocs(negociosRef);
      
      const negocios = [];
      negociosSnapshot.forEach((negDoc) => {
        negocios.push({
          id: negDoc.id,
          ...negDoc.data()
        });
      });
      
      categorias.push({
        id: catDoc.id,
        ...categoriaData,
        negocios
      });
    }
    
    callback(categorias.sort((a, b) => (a.orden || 0) - (b.orden || 0)));
  }, (error) => {
    console.error('Error in subscription:', error);
  });
}

export { db, app };
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
