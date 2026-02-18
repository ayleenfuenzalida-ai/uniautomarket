import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchCategoriasFromFirebase,
  saveCategoriaToFirebase,
  updateCategoriaInFirebase,
  deleteCategoriaFromFirebase,
  addNegocioToFirebase,
  updateNegocioInFirebase,
  deleteNegocioFromFirebase,
  subscribeToCategorias
} from './firebase';

// Create context
const DataContext = createContext(null);

// Initial categories (will be created in Firebase if empty)
const categoriasIniciales = [
  { id: 'desarmadurias', nombre: 'Desarmadurías', descripcion: 'Encuentra repuestos usados y piezas de vehículos desarmados', icono: '🔧', imagen: '/images/categorias/desarmadurias.jpg', color: '#F59E0B', destacada: true, orden: 1, negocios: [] },
  { id: 'talleres', nombre: 'Talleres Mecánicos', descripcion: 'Servicios de reparación, mantención y diagnóstico vehicular', icono: '🔩', imagen: '/images/categorias/talleres.jpg', color: '#3B82F6', destacada: true, orden: 2, negocios: [] },
  { id: 'herramientas', nombre: 'Herramientas', descripcion: 'Venta de herramientas especializadas para el rubro automotriz', icono: '🛠️', imagen: '/images/categorias/herramientas.jpg', color: '#10B981', destacada: true, orden: 3, negocios: [] },
  { id: 'repuestos', nombre: 'Repuestos', descripcion: 'Venta de repuestos nuevos originales y alternativos', icono: '📦', imagen: '/images/categorias/repuestos.jpg', color: '#8B5CF6', destacada: true, orden: 4, negocios: [] },
  { id: 'gruas', nombre: 'Grúas', descripcion: 'Servicios de remolque y traslado de vehículos', icono: '🚛', imagen: '/images/categorias/gruas.jpg', color: '#EF4444', destacada: true, orden: 5, negocios: [] },
  { id: 'pintura', nombre: 'Pintura y Desabolladura', descripcion: 'Reparación de carrocería, pintura y desabolladura profesional', icono: '🎨', imagen: '/images/categorias/pintura.jpg', color: '#06B6D4', destacada: true, orden: 6, negocios: [] },
  { id: 'scanner', nombre: 'Scanner y Diagnóstico', descripcion: 'Escaneo computacional y diagnóstico electrónico de vehículos', icono: '🔍', imagen: '/images/categorias/scanner.jpg', color: '#6366F1', destacada: true, orden: 7, negocios: [] },
  { id: 'electronica', nombre: 'Electrónica Automotriz', descripcion: 'Reparación de módulos, ECU, inyectores y sistemas electrónicos', icono: '⚡', imagen: '/images/categorias/electronica.jpg', color: '#EC4899', destacada: true, orden: 8, negocios: [] },
  { id: 'reprogramacion', nombre: 'Reprogramación ECU', descripcion: 'Stage 1, 2, 3. Optimización de potencia y consumo. DPF/EGR off', icono: '💻', imagen: '/images/categorias/reprogramacion.jpg', color: '#14B8A6', destacada: true, orden: 9, negocios: [] }
];

export function DataProvider({ children }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize data from Firebase
  useEffect(() => {
    const init = async () => {
      try {
        const cats = await fetchCategoriasFromFirebase();
        
        if (cats.length === 0) {
          // Create initial categories in Firebase
          for (const cat of categoriasIniciales) {
            await saveCategoriaToFirebase(cat);
          }
          setCategorias(categoriasIniciales);
        } else {
          setCategorias(cats);
        }
        
        setInitialized(true);
      } catch (err) {
        console.error('Error initializing:', err);
        setInitialized(true);
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!initialized) return;
    
    const unsubscribe = subscribeToCategorias((updatedCategorias) => {
      setCategorias(updatedCategorias);
    });
    
    return () => unsubscribe();
  }, [initialized]);

  // ==================== CATEGORY FUNCTIONS ====================

  const addCategoria = useCallback(async (categoria) => {
    const nuevaCategoria = {
      ...categoria,
      id: categoria.id || `cat-${Date.now()}`,
      negocios: []
    };
    
    await saveCategoriaToFirebase(nuevaCategoria);
    return nuevaCategoria;
  }, []);

  const updateCategoria = useCallback(async (id, data) => {
    await updateCategoriaInFirebase(id, data);
  }, []);

  const deleteCategoria = useCallback(async (id) => {
    await deleteCategoriaFromFirebase(id);
  }, []);

  // ==================== BUSINESS FUNCTIONS ====================

  const addNegocio = useCallback(async (categoriaId, negocio) => {
    const nuevoNegocio = {
      ...negocio,
      id: negocio.id || `neg-${Date.now()}`,
      categoriaId,
      fechaRegistro: new Date().toISOString(),
      visitas: 0,
      productos: negocio.productos || [],
      resenas: negocio.resenas || [],
      chats: negocio.chats || [],
      servicios: negocio.servicios || [],
      galeria: negocio.galeria || []
    };
    
    await addNegocioToFirebase(categoriaId, nuevoNegocio);
    return nuevoNegocio;
  }, []);

  const updateNegocio = useCallback(async (categoriaId, negocioId, data) => {
    await updateNegocioInFirebase(categoriaId, negocioId, data);
  }, []);

  const deleteNegocio = useCallback(async (categoriaId, negocioId) => {
    await deleteNegocioFromFirebase(categoriaId, negocioId);
  }, []);

  // ==================== HELPER FUNCTIONS ====================

  const getNegocioById = useCallback((negocioId) => {
    for (const cat of categorias) {
      const negocio = cat.negocios?.find(n => n.id === negocioId);
      if (negocio) return negocio;
    }
    return null;
  }, [categorias]);

  const getCategoriaByNegocioId = useCallback((negocioId) => {
    return categorias.find(cat => cat.negocios?.some(n => n.id === negocioId)) || null;
  }, [categorias]);

  const incrementarVisitas = useCallback(async (negocioId) => {
    const categoria = getCategoriaByNegocioId(negocioId);
    if (!categoria) return;
    
    const negocio = getNegocioById(negocioId);
    if (!negocio) return;
    
    await updateNegocio(categoria.id, negocioId, {
      visitas: (negocio.visitas || 0) + 1
    });
  }, [getCategoriaByNegocioId, getNegocioById, updateNegocio]);

  const addProducto = useCallback(async (categoriaId, negocioId, producto) => {
    const categoria = categorias.find(c => c.id === categoriaId);
    if (!categoria) return;
    
    const negocio = categoria.negocios?.find(n => n.id === negocioId);
    if (!negocio) return;
    
    const productos = [...(negocio.productos || []), producto];
    await updateNegocio(categoriaId, negocioId, { productos });
  }, [categorias, updateNegocio]);

  const addChat = useCallback(async (categoriaId, negocioId, chat) => {
    const categoria = categorias.find(c => c.id === categoriaId);
    if (!categoria) return;
    
    const negocio = categoria.negocios?.find(n => n.id === negocioId);
    if (!negocio) return;
    
    const chats = [...(negocio.chats || []), { ...chat, id: `chat-${Date.now()}`, ultimaActualizacion: new Date().toISOString() }];
    await updateNegocio(categoriaId, negocioId, { chats });
  }, [categorias, updateNegocio]);

  const addMensajeToChat = useCallback(async (categoriaId, negocioId, chatId, mensaje) => {
    const categoria = categorias.find(c => c.id === categoriaId);
    if (!categoria) return;
    
    const negocio = categoria.negocios?.find(n => n.id === negocioId);
    if (!negocio) return;
    
    const chats = (negocio.chats || []).map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          mensajes: [...(c.mensajes || []), { ...mensaje, id: `msg-${Date.now()}` }],
          ultimaActualizacion: new Date().toISOString()
        };
      }
      return c;
    });
    
    await updateNegocio(categoriaId, negocioId, { chats });
  }, [categorias, updateNegocio]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{
      categorias,
      loading,
      addCategoria,
      updateCategoria,
      deleteCategoria,
      addNegocio,
      updateNegocio,
      deleteNegocio,
      getNegocioById,
      getCategoriaByNegocioId,
      incrementarVisitas,
      addProducto,
      addChat,
      addMensajeToChat
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
