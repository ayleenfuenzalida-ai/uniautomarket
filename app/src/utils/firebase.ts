// Firebase configuration for UniAutoMarket
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot,
  deleteDoc,
  updateDoc,
  addDoc,
  Timestamp
} from 'firebase/firestore';

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
const USUARIOS_COLLECTION = 'usuarios';
const PREGUNTAS_COLLECTION = 'preguntas';

// ==================== CATEGORIAS ====================

// Get all categories from Firebase
export async function fetchCategoriasFromFirebase() {
  try {
    const categoriasRef = collection(db, CATEGORIAS_COLLECTION);
    const snapshot = await getDocs(categoriasRef);

    const categorias: any[] = [];
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
export async function saveCategoriasToFirebase(categorias: any[]) {
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
export function subscribeToCategorias(callback: (categorias: any[]) => void) {
  const categoriasRef = collection(db, CATEGORIAS_COLLECTION);

  return onSnapshot(categoriasRef, async (snapshot) => {
    const categorias: any[] = [];

    for (const catDoc of snapshot.docs) {
      const categoriaData = catDoc.data();

      // Get businesses for this category
      const negociosRef = collection(db, CATEGORIAS_COLLECTION, catDoc.id, 'negocios');
      const negociosSnapshot = await getDocs(negociosRef);

      const negocios: any[] = [];
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

// ==================== USUARIOS ====================

// Get all users from Firebase
export async function fetchUsuariosFromFirebase() {
  try {
    const usuariosRef = collection(db, USUARIOS_COLLECTION);
    const snapshot = await getDocs(usuariosRef);

    const usuarios: any[] = [];
    snapshot.forEach((doc) => {
      usuarios.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return usuarios;
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    return [];
  }
}

// Save a user to Firebase
export async function saveUsuarioToFirebase(usuario: any) {
  try {
    const usuarioRef = doc(db, USUARIOS_COLLECTION, usuario.id);
    await setDoc(usuarioRef, {
      ...usuario,
      createdAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error saving usuario:', error);
    return false;
  }
}

// Update a user in Firebase
export async function updateUsuarioInFirebase(usuario: any) {
  try {
    const usuarioRef = doc(db, USUARIOS_COLLECTION, usuario.id);
    await updateDoc(usuarioRef, {
      ...usuario,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error updating usuario:', error);
    return false;
  }
}

// Delete a user from Firebase
export async function deleteUsuarioFromFirebase(id: string) {
  try {
    const usuarioRef = doc(db, USUARIOS_COLLECTION, id);
    await deleteDoc(usuarioRef);
    return true;
  } catch (error) {
    console.error('Error deleting usuario:', error);
    return false;
  }
}

// Subscribe to users updates
export function subscribeToUsuarios(callback: (usuarios: any[]) => void) {
  const usuariosRef = collection(db, USUARIOS_COLLECTION);

  return onSnapshot(usuariosRef, (snapshot) => {
    const usuarios: any[] = [];
    snapshot.forEach((doc) => {
      usuarios.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(usuarios);
  }, (error) => {
    console.error('Error in usuarios subscription:', error);
  });
}

// ==================== PREGUNTAS (BLOG) ====================

// Get all questions from Firebase
export async function fetchPreguntasFromFirebase() {
  try {
    const preguntasRef = collection(db, PREGUNTAS_COLLECTION);
    const snapshot = await getDocs(preguntasRef);

    const preguntas: any[] = [];
    snapshot.forEach((doc) => {
      preguntas.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return preguntas.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error fetching preguntas:', error);
    return [];
  }
}

// Save a question to Firebase
export async function savePreguntaToFirebase(pregunta: any) {
  try {
    const preguntaRef = doc(db, PREGUNTAS_COLLECTION, pregunta.id);
    await setDoc(preguntaRef, {
      ...pregunta,
      createdAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error saving pregunta:', error);
    return false;
  }
}

// Update a question in Firebase
export async function updatePreguntaInFirebase(pregunta: any) {
  try {
    const preguntaRef = doc(db, PREGUNTAS_COLLECTION, pregunta.id);
    await updateDoc(preguntaRef, {
      ...pregunta,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error updating pregunta:', error);
    return false;
  }
}

// Add a response to a question
export async function addRespuestaToFirebase(preguntaId: string, respuesta: any) {
  try {
    const respuestasRef = collection(db, PREGUNTAS_COLLECTION, preguntaId, 'respuestas');
    await addDoc(respuestasRef, {
      ...respuesta,
      createdAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error adding respuesta:', error);
    return false;
  }
}

// Subscribe to questions updates
export function subscribeToPreguntas(callback: (preguntas: any[]) => void) {
  const preguntasRef = collection(db, PREGUNTAS_COLLECTION);

  return onSnapshot(preguntasRef, (snapshot) => {
    const preguntas: any[] = [];
    snapshot.forEach((doc) => {
      preguntas.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(preguntas.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    }));
  }, (error) => {
    console.error('Error in preguntas subscription:', error);
  });
}

export { db, app };
