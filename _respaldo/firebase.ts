import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  enableIndexedDbPersistence
} from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Habilitar persistencia offline (opcional pero recomendado)
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Persistencia fallida: múltiples pestañas abiertas');
  } else if (err.code === 'unimplemented') {
    console.warn('Persistencia no soportada en este navegador');
  }
});

// Referencia al documento de categorías
const CATEGORIAS_DOC_ID = 'categorias_principal';

/**
 * Obtiene las categorías desde Firebase
 */
export const fetchCategoriasFromFirebase = async (): Promise<any[] | null> => {
  try {
    console.log('📡 Obteniendo datos desde Firebase...');
    const docRef = doc(db, 'categorias', CATEGORIAS_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('✅ Datos obtenidos desde Firebase:', data);
      return data.categorias || [];
    } else {
      console.log('⚠️ No existe el documento en Firebase');
      return null;
    }
  } catch (error) {
    console.error('❌ Error al obtener datos de Firebase:', error);
    return null;
  }
};

/**
 * Guarda las categorías en Firebase
 */
export const saveCategoriasToFirebase = async (categorias: any[]): Promise<boolean> => {
  try {
    console.log('💾 Guardando datos en Firebase...');
    const docRef = doc(db, 'categorias', CATEGORIAS_DOC_ID);
    await setDoc(docRef, { 
      categorias, 
      updatedAt: new Date().toISOString() 
    });
    console.log('✅ Datos guardados en Firebase exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error al guardar en Firebase:', error);
    return false;
  }
};

/**
 * Se suscribe a cambios en tiempo real de las categorías
 */
export const subscribeToCategorias = (callback: (categorias: any[]) => void) => {
  console.log('👂 Suscribiéndose a cambios en tiempo real de Firebase...');
  const docRef = doc(db, 'categorias', CATEGORIAS_DOC_ID);
  
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('🔄 Datos actualizados desde Firebase:', data);
      callback(data.categorias || []);
    } else {
      console.log('⚠️ Documento no existe aún');
      callback([]);
    }
  }, (error) => {
    console.error('❌ Error en suscripción de Firebase:', error);
  });
  
  return unsubscribe;
};

export { db };
