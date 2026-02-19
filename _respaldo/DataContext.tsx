import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  fetchCategoriasFromFirebase, 
  saveCategoriasToFirebase,
  subscribeToCategorias 
} from '@/utils/firebase';

// Tipos
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  stock: number;
}

export interface Negocio {
  id: string;
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  email: string;
  imagen: string;
  productos: Producto[];
  rating: number;
  reviews: number;
}

export interface Subcategoria {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  negocios: Negocio[];
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  icono: string;
  subcategorias: Subcategoria[];
}

interface DataContextType {
  categorias: Categoria[];
  setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  saveData: (nuevasCategorias: Categoria[]) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Datos iniciales por defecto
const defaultCategorias: Categoria[] = [
  {
    id: '1',
    nombre: 'Desarmadurías',
    descripcion: 'Encuentra repuestos usados y piezas de vehículos desarmados',
    imagen: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800',
    icono: 'Car',
    subcategorias: []
  },
  {
    id: '2',
    nombre: 'Talleres Mecánicos',
    descripcion: 'Servicios de reparación y mantenimiento automotriz',
    imagen: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800',
    icono: 'Wrench',
    subcategorias: []
  },
  {
    id: '3',
    nombre: 'Herramientas',
    descripcion: 'Herramientas especializadas para mecánica automotriz',
    imagen: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=800',
    icono: 'Tool',
    subcategorias: []
  },
  {
    id: '4',
    nombre: 'Repuestos',
    descripcion: 'Repuestos nuevos para todo tipo de vehículos',
    imagen: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=800',
    icono: 'Package',
    subcategorias: []
  },
  {
    id: '5',
    nombre: 'Grúas',
    descripcion: 'Servicios de grúas y asistencia en ruta',
    imagen: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=800',
    icono: 'Truck',
    subcategorias: []
  },
  {
    id: '6',
    nombre: 'Pintura y Desabolladura',
    descripcion: 'Servicios de pintura y reparación de carrocería',
    imagen: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=800',
    icono: 'Paintbrush',
    subcategorias: []
  },
  {
    id: '7',
    nombre: 'Scanner y Diagnóstico',
    descripcion: 'Diagnóstico computacional de vehículos',
    imagen: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800',
    icono: 'Cpu',
    subcategorias: []
  },
  {
    id: '8',
    nombre: 'Electrónica Automotriz',
    descripcion: 'Reparación de sistemas electrónicos de vehículos',
    imagen: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800',
    icono: 'Zap',
    subcategorias: []
  },
  {
    id: '9',
    nombre: 'Reprogramación ECU',
    descripcion: 'Servicios de reprogramación de centralitas',
    imagen: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800',
    icono: 'Settings',
    subcategorias: []
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Cargar datos desde Firebase al iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('🚀 Cargando datos desde Firebase...');
        
        const firebaseData = await fetchCategoriasFromFirebase();
        
        if (firebaseData && firebaseData.length > 0) {
          console.log('✅ Datos cargados desde Firebase:', firebaseData);
          setCategorias(firebaseData);
        } else {
          console.log('⚠️ No hay datos en Firebase, usando datos por defecto');
          setCategorias(defaultCategorias);
          // Guardar datos por defecto en Firebase
          await saveCategoriasToFirebase(defaultCategorias);
        }
      } catch (err) {
        console.error('❌ Error cargando datos:', err);
        setError('Error al cargar los datos');
        setCategorias(defaultCategorias);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    loadData();
  }, []);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    if (initialLoad) return;

    console.log('🔄 Configurando suscripción en tiempo real...');
    const unsubscribe = subscribeToCategorias((nuevasCategorias) => {
      console.log('📥 Datos actualizados en tiempo real:', nuevasCategorias);
      setCategorias(nuevasCategorias);
    });

    return () => {
      console.log('🛑 Cancelando suscripción');
      unsubscribe();
    };
  }, [initialLoad]);

  // Función para recargar datos manualmente
  const refreshData = async () => {
    try {
      setLoading(true);
      const firebaseData = await fetchCategoriasFromFirebase();
      if (firebaseData) {
        setCategorias(firebaseData);
      }
    } catch (err) {
      console.error('Error al refrescar datos:', err);
      setError('Error al refrescar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Función para guardar datos
  const saveData = async (nuevasCategorias: Categoria[]): Promise<boolean> => {
    try {
      setLoading(true);
      const success = await saveCategoriasToFirebase(nuevasCategorias);
      if (success) {
        setCategorias(nuevasCategorias);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error al guardar datos:', err);
      setError('Error al guardar los datos');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider value={{ 
      categorias, 
      setCategorias, 
      loading, 
      error, 
      refreshData,
      saveData 
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData debe usarse dentro de un DataProvider');
  }
  return context;
}
