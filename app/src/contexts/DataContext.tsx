import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Categoria, Negocio, Producto, Servicio } from '@/types';
import {
  fetchCategoriasFromFirebase,
  saveCategoriasToFirebase,
  subscribeToCategorias
} from '@/utils/firebase';

// Datos iniciales por defecto
const defaultCategorias: Categoria[] = [
  {
    id: '1',
    nombre: 'Desarmadurías',
    descripcion: 'Encuentra repuestos usados y piezas de vehículos desarmados',
    imagen: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800',
    icono: 'Car',
    negocios: []
  },
  {
    id: '2',
    nombre: 'Talleres Mecánicos',
    descripcion: 'Servicios de reparación y mantenimiento automotriz',
    imagen: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800',
    icono: 'Wrench',
    negocios: []
  },
  {
    id: '3',
    nombre: 'Herramientas',
    descripcion: 'Herramientas especializadas para mecánica automotriz',
    imagen: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=800',
    icono: 'Tool',
    negocios: []
  },
  {
    id: '4',
    nombre: 'Repuestos',
    descripcion: 'Repuestos nuevos para todo tipo de vehículos',
    imagen: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=800',
    icono: 'Package',
    negocios: []
  },
  {
    id: '5',
    nombre: 'Grúas',
    descripcion: 'Servicios de grúas y asistencia en ruta',
    imagen: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=800',
    icono: 'Truck',
    negocios: []
  },
  {
    id: '6',
    nombre: 'Pintura y Desabolladura',
    descripcion: 'Servicios de pintura y reparación de carrocería',
    imagen: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=800',
    icono: 'Paintbrush',
    negocios: []
  },
  {
    id: '7',
    nombre: 'Scanner y Diagnóstico',
    descripcion: 'Diagnóstico computacional de vehículos',
    imagen: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800',
    icono: 'Cpu',
    negocios: []
  },
  {
    id: '8',
    nombre: 'Electrónica Automotriz',
    descripcion: 'Reparación de sistemas electrónicos de vehículos',
    imagen: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800',
    icono: 'Zap',
    negocios: []
  },
  {
    id: '9',
    nombre: 'Reprogramación ECU',
    descripcion: 'Servicios de reprogramación de centralitas',
    imagen: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800',
    icono: 'Settings',
    negocios: []
  }
];

interface SearchResult {
  negocio: Negocio;
  categoria: Categoria;
}

interface ProductSearchResult {
  producto: Producto;
  negocio: Negocio;
  categoria: Categoria;
}

interface DataContextType {
  categorias: Categoria[];
  loading: boolean;
  isLoading: boolean;
  updateCategoria: (categoria: Categoria) => Promise<void>;
  deleteCategoria: (id: string) => Promise<void>;
  addCategoria: (categoria: Categoria) => Promise<void>;
  updateNegocio: (categoriaId: string, negocio: Negocio) => Promise<void>;
  deleteNegocio: (categoriaId: string, negocioId: string) => Promise<void>;
  addNegocio: (categoriaId: string, negocio: Negocio) => Promise<void>;
  updateProducto: (categoriaId: string, negocioId: string, producto: Producto) => Promise<void>;
  deleteProducto: (categoriaId: string, negocioId: string, productoId: string) => Promise<void>;
  addProducto: (categoriaId: string, negocioId: string, producto: Producto) => Promise<void>;
  updateServicio: (categoriaId: string, negocioId: string, servicio: Servicio) => Promise<void>;
  deleteServicio: (categoriaId: string, negocioId: string, servicioId: string) => Promise<void>;
  addServicio: (categoriaId: string, negocioId: string, servicio: Servicio) => Promise<void>;
  getNegocioById: (id: string) => Negocio | undefined;
  getCategoriaById: (id: string) => Categoria | undefined;
  getCategoriaByNegocioId: (negocioId: string) => Categoria | undefined;
  searchNegocios: (query: string) => SearchResult[];
  searchProductos: (query: string) => ProductSearchResult[];
  incrementarVisitas: (categoriaId: string, negocioId: string) => Promise<void>;
  addChat: (categoriaId: string, negocioId: string, chat: any) => Promise<void>;
  addMensajeToChat: (categoriaId: string, negocioId: string, chatId: string, mensaje: any) => Promise<void>;
  syncData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [categorias, setCategorias] = useState<Categoria[]>(defaultCategorias);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar categorias desde Firebase al iniciar
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCategoriasFromFirebase();
        if (data && data.length > 0) {
          setCategorias(data);
        }
      } catch (error) {
        console.error('Error loading data from Firebase:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Suscribirse a actualizaciones en tiempo real de Firebase
  useEffect(() => {
    const unsubscribe = subscribeToCategorias((updatedCategorias) => {
      setCategorias(updatedCategorias);
    });

    return () => unsubscribe();
  }, []);

  // Funcion para sincronizar datos manualmente
  const syncData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCategoriasFromFirebase();
      if (data && data.length > 0) {
        setCategorias(data);
      }
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar categorias en Firebase
  const saveToFirebase = useCallback(async (newCategorias: Categoria[]) => {
    try {
      await saveCategoriasToFirebase(newCategorias);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
    }
  }, []);

  // ==================== CATEGORIAS ====================

  const addCategoria = useCallback(async (categoria: Categoria) => {
    const newCategorias = [...categorias, categoria];
    setCategorias(newCategorias);
    await saveToFirebase(newCategorias);
  }, [categorias, saveToFirebase]);

  const updateCategoria = useCallback(async (categoria: Categoria) => {
    const newCategorias = categorias.map(c => c.id === categoria.id ? categoria : c);
    setCategorias(newCategorias);
    await saveToFirebase(newCategorias);
  }, [categorias, saveToFirebase]);

  const deleteCategoria = useCallback(async (id: string) => {
    const newCategorias = categorias.filter(c => c.id !== id);
    setCategorias(newCategorias);
    await saveToFirebase(newCategorias);
  }, [categorias, saveToFirebase]);

  // ==================== NEGOCIOS ====================

  const addNegocio = useCallback(async (categoriaId: string, negocio: Negocio) => {
    const newCategorias = categorias.map(c => {
      if (c.id === categoriaId) {
        return {
          ...c,
          negocios: [...(c.negocios || []), negocio]
        };
      }
      return c;
    });
    setCategorias(newCategorias);
    await saveToFirebase(newCategorias);
  }, [categorias, saveToFirebase]);

  const updateNegocio = useCallback(async (categoriaId: string, negocio: Negocio) => {
    const newCategorias = categorias.map(c => {
      if (c.id === categoriaId) {
        return {
          ...c,
          negocios: (c.negocios || []).map(n => n.id === negocio.id ? negocio : n)
        };
      }
      return c;
    });
    setCategorias(newCategorias);
    await saveToFirebase(newCategorias);
  }, [categorias, saveToFirebase]);

  const deleteNegocio = useCallback(async (categoriaId: string, negocioId: string) => {
    const newCategorias = categorias.map(c => {
      if (c.id === categoriaId) {
        return {
          ...c,
          negocios: (c.negocios || []).filter(n => n.id !== negocioId)
        };
      }
      return c;
    });
    setCategorias(newCategorias);
    await saveToFirebase(newCategorias);
  }, [categorias, saveToFirebase]);

  // ==================== PRODUCTOS ====================

  const addProducto = useCallback(async (categoriaId: string, negocioId: string, producto: Producto) => {
    const newCategorias = categorias.map(c => {
      if (c.id === categoriaId) {
        return {
          ...c,
          negocios: (c.negocios || []).map(n => {
            if (n.id === negocioId) {
              return {
                ...n,
                productos: [...(n.productos || []), producto]
              };
            }
            return n;
          })
        };
      }
      return c;
    });
    setCategorias(newCategorias);
    await saveToFirebase(newCategorias);
  }, [categorias, saveToFirebase]);

  const updateProducto = useCallback(async (categoriaId: string, negocioId: string, producto: Producto) => {
    const newCategorias = categorias.map(c => {
      if (c.id === categoriaId) {
        return {
          ...c,
          negocios: (c.negocios || []).map(n => {
            if (n.id === negocioId) {
              return {
                ...n,
                productos: (n.productos || []).map(p => p.id === producto.id ? producto : p)
              };
            }
            return n;
          })
        };
      }
      return c;
    });
    setCategorias(newCategorias);
    await saveToFirebase(newCategorias);
  }, [categorias, saveToFirebase]);

  const deleteProducto = useCallback(async (categoriaId: string, negocioId: string, productoId: string) => {
    const newCategorias = categorias.map(c => {
      if (c.id === categoriaId) {
        return {
          ...c,
          negocios: (c.negocios || []).map(n => {
            if (n.id === negocioId) {
              return {
                ...n,
                productos: (n.productos || []).filter(p => p.id !== productoId)
              };
            }
            return n;
          })
        };
      }
      return c;
    });
    setCategorias(newCategorias);
    await saveToFirebase(newCategorias);
  }, [categorias, saveToFirebase]);

  // ==================== SERVICIOS ====================

  const addServicio = useCallback(async (categoriaId: string, negocioId: string, servicio: Servicio) => {
    const newCategorias = categorias.map(c => {
      if (c.id === categoriaId) {
        return {
          ...c,
          negocios: (c.negocios || []).map(n => {
            if (n.id === negocioId) {
              return {
                ...n,
                servicios: [...(n.servicios || []), servicio]
              };
            }
            return n;
          })
        };
      }
      return c;
    });
    setCategorias(newCategorias);
    await saveToFirebase(newCategorias);
  }, [categorias, saveToFirebase]);

  const updateServicio = useCallback(async (categoriaId: string, negocioId: string, servicio: Servicio) => {
    const newCategorias = categorias.map(c => {
      if (c.id === categoriaId) {
        return {
          ...c,
          negocios: (c.negocios || []).map(n => {
            if (n.id === negocioId) {
              return {
                ...n,
                servicios: (n.servicios || []).map(s => s.id === servicio.id ? servicio : s)
              };
            }
            return n;
          })
        };
      }
      return c;
    });
    setCategorias(newCategorias);
    await saveToFirebase(newCategorias);
  }, [categorias, saveToFirebase]);

  const deleteServicio = useCallback(async (categoriaId: string, negocioId: string, servicioId: string) => {
    const newCategorias = categorias.map(c => {
      if (c.id === categoriaId) {
        return {
          ...c,
          negocios: (c.negocios || []).map(n => {
            if (n.id === negocioId) {
              return {
                ...n,
                servicios: (n.servicios || []).filter(s => s.id !== servicioId)
              };
            }
            return n;
          })
        };
      }
      return c;
    });
    setCategorias(newCategorias);
    await saveToFirebase(newCategorias);
  }, [categorias, saveToFirebase]);

  // ==================== HELPERS ====================

  const getNegocioById = useCallback((id: string) => {
    for (const categoria of categorias) {
      const negocio = categoria.negocios?.find(n => n.id === id);
      if (negocio) return negocio;
    }
    return undefined;
  }, [categorias]);

  const getCategoriaById = useCallback((id: string) => {
    return categorias.find(c => c.id === id);
  }, [categorias]);

  const getCategoriaByNegocioId = useCallback((negocioId: string) => {
    for (const categoria of categorias) {
      const negocio = categoria.negocios?.find(n => n.id === negocioId);
      if (negocio) return categoria;
    }
    return undefined;
  }, [categorias]);

  // ==================== BÚSQUEDA ====================

  const searchNegocios = useCallback((query: string): SearchResult[] => {
    if (!query.trim()) return [];
    
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();
    
    for (const categoria of categorias) {
      for (const negocio of categoria.negocios || []) {
        if (
          negocio.nombre?.toLowerCase().includes(lowerQuery) ||
          negocio.descripcion?.toLowerCase().includes(lowerQuery) ||
          negocio.direccion?.toLowerCase().includes(lowerQuery)
        ) {
          results.push({ negocio, categoria });
        }
      }
    }
    
    return results;
  }, [categorias]);

  const searchProductos = useCallback((query: string): ProductSearchResult[] => {
    if (!query.trim()) return [];
    
    const results: ProductSearchResult[] = [];
    const lowerQuery = query.toLowerCase();
    
    for (const categoria of categorias) {
      for (const negocio of categoria.negocios || []) {
        for (const producto of negocio.productos || []) {
          if (
            producto.nombre?.toLowerCase().includes(lowerQuery) ||
            producto.descripcion?.toLowerCase().includes(lowerQuery)
          ) {
            results.push({ producto, negocio, categoria });
          }
        }
      }
    }
    
    return results;
  }, [categorias]);

  // ==================== VISITAS Y CHAT ====================

  const incrementarVisitas = useCallback(async (categoriaId: string, negocioId: string) => {
    const newCategorias = categorias.map(c => {
      if (c.id === categoriaId) {
        return {
          ...c,
          negocios: (c.negocios || []).map(n => {
            if (n.id === negocioId) {
              return {
                ...n,
                visitas: (n.visitas || 0) + 1
              };
            }
            return n;
          })
        };
      }
      return c;
    });
    setCategorias(newCategorias);
    await saveToFirebase(newCategorias);
  }, [categorias, saveToFirebase]);

  const addChat = useCallback(async (categoriaId: string, negocioId: string, chat: any) => {
    const newCategorias = categorias.map(c => {
      if (c.id === categoriaId) {
        return {
          ...c,
          negocios: (c.negocios || []).map(n => {
            if (n.id === negocioId) {
              return {
                ...n,
                chats: [...(n.chats || []), chat]
              };
            }
            return n;
          })
        };
      }
      return c;
    });
    setCategorias(newCategorias);
    await saveToFirebase(newCategorias);
  }, [categorias, saveToFirebase]);

  const addMensajeToChat = useCallback(async (categoriaId: string, negocioId: string, chatId: string, mensaje: any) => {
    const newCategorias = categorias.map(c => {
      if (c.id === categoriaId) {
        return {
          ...c,
          negocios: (c.negocios || []).map(n => {
            if (n.id === negocioId) {
              return {
                ...n,
                chats: (n.chats || []).map(ch => {
                  if (ch.id === chatId) {
                    return {
                      ...ch,
                      mensajes: [...(ch.mensajes || []), mensaje]
                    };
                  }
                  return ch;
                })
              };
            }
            return n;
          })
        };
      }
      return c;
    });
    setCategorias(newCategorias);
    await saveToFirebase(newCategorias);
  }, [categorias, saveToFirebase]);

  return (
    <DataContext.Provider value={{
      categorias,
      loading: isLoading,
      isLoading,
      updateCategoria,
      deleteCategoria,
      addCategoria,
      updateNegocio,
      deleteNegocio,
      addNegocio,
      updateProducto,
      deleteProducto,
      addProducto,
      updateServicio,
      deleteServicio,
      addServicio,
      getNegocioById,
      getCategoriaById,
      getCategoriaByNegocioId,
      searchNegocios,
      searchProductos,
      incrementarVisitas,
      addChat,
      addMensajeToChat,
      syncData
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
