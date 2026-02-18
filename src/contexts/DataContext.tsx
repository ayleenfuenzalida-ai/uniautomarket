import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Categoria, Negocio, Producto, Servicio } from '@/types';
import { categorias as initialCategorias } from '@/data/marketplace';
import { fetchCategoriasFromGitHub, saveCategoriasToGitHub } from '@/utils/githubData';

interface DataContextType {
  categorias: Categoria[];
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
  isLoading: boolean;
  syncData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [categorias, setCategorias] = useState<Categoria[]>(initialCategorias);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar categorías desde GitHub al iniciar
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCategoriasFromGitHub();
        if (data && data.length > 0) {
          setCategorias(data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Recargar datos cada 30 segundos para mantener sincronizado
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Función para sincronizar datos manualmente
  const syncData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCategoriasFromGitHub();
      if (data && data.length > 0) {
        setCategorias(data);
      }
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCategoria = useCallback(async (categoria: Categoria) => {
    const newCategorias = categorias.map(c => c.id === categoria.id ? categoria : c);
    setCategorias(newCategorias);
    await saveCategoriasToGitHub(newCategorias);
  }, [categorias]);

  const deleteCategoria = useCallback(async (id: string) => {
    const newCategorias = categorias.filter(c => c.id !== id);
    setCategorias(newCategorias);
    await saveCategoriasToGitHub(newCategorias);
  }, [categorias]);

  const addCategoria = useCallback(async (categoria: Categoria) => {
    const newCategorias = [...categorias, categoria];
    setCategorias(newCategorias);
    await saveCategoriasToGitHub(newCategorias);
  }, [categorias]);

  const updateNegocio = useCallback(async (categoriaId: string, negocio: Negocio) => {
    const newCategorias = categorias.map(cat => {
      if (cat.id === categoriaId) {
        return {
          ...cat,
          negocios: cat.negocios.map(n => n.id === negocio.id ? negocio : n)
        };
      }
      return cat;
    });
    setCategorias(newCategorias);
    await saveCategoriasToGitHub(newCategorias);
  }, [categorias]);

  const deleteNegocio = useCallback(async (categoriaId: string, negocioId: string) => {
    const newCategorias = categorias.map(cat => {
      if (cat.id === categoriaId) {
        return {
          ...cat,
          negocios: cat.negocios.filter(n => n.id !== negocioId)
        };
      }
      return cat;
    });
    setCategorias(newCategorias);
    await saveCategoriasToGitHub(newCategorias);
  }, [categorias]);

  const addNegocio = useCallback(async (categoriaId: string, negocio: Negocio) => {
    const newCategorias = categorias.map(cat => {
      if (cat.id === categoriaId) {
        return {
          ...cat,
          negocios: [...cat.negocios, negocio]
        };
      }
      return cat;
    });
    setCategorias(newCategorias);
    await saveCategoriasToGitHub(newCategorias);
  }, [categorias]);

  const updateProducto = useCallback(async (categoriaId: string, negocioId: string, producto: Producto) => {
    const newCategorias = categorias.map(cat => {
      if (cat.id === categoriaId) {
        return {
          ...cat,
          negocios: cat.negocios.map(n => {
            if (n.id === negocioId && n.productos) {
              return {
                ...n,
                productos: n.productos.map(p => p.id === producto.id ? producto : p)
              };
            }
            return n;
          })
        };
      }
      return cat;
    });
    setCategorias(newCategorias);
    await saveCategoriasToGitHub(newCategorias);
  }, [categorias]);

  const deleteProducto = useCallback(async (categoriaId: string, negocioId: string, productoId: string) => {
    const newCategorias = categorias.map(cat => {
      if (cat.id === categoriaId) {
        return {
          ...cat,
          negocios: cat.negocios.map(n => {
            if (n.id === negocioId && n.productos) {
              return {
                ...n,
                productos: n.productos.filter(p => p.id !== productoId)
              };
            }
            return n;
          })
        };
      }
      return cat;
    });
    setCategorias(newCategorias);
    await saveCategoriasToGitHub(newCategorias);
  }, [categorias]);

  const addProducto = useCallback(async (categoriaId: string, negocioId: string, producto: Producto) => {
    const newCategorias = categorias.map(cat => {
      if (cat.id === categoriaId) {
        return {
          ...cat,
          negocios: cat.negocios.map(n => {
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
      return cat;
    });
    setCategorias(newCategorias);
    await saveCategoriasToGitHub(newCategorias);
  }, [categorias]);

  const updateServicio = useCallback(async (categoriaId: string, negocioId: string, servicio: Servicio) => {
    const newCategorias = categorias.map(cat => {
      if (cat.id === categoriaId) {
        return {
          ...cat,
          negocios: cat.negocios.map(n => {
            if (n.id === negocioId && n.servicios) {
              return {
                ...n,
                servicios: n.servicios.map(s => s.id === servicio.id ? servicio : s)
              };
            }
            return n;
          })
        };
      }
      return cat;
    });
    setCategorias(newCategorias);
    await saveCategoriasToGitHub(newCategorias);
  }, [categorias]);

  const deleteServicio = useCallback(async (categoriaId: string, negocioId: string, servicioId: string) => {
    const newCategorias = categorias.map(cat => {
      if (cat.id === categoriaId) {
        return {
          ...cat,
          negocios: cat.negocios.map(n => {
            if (n.id === negocioId && n.servicios) {
              return {
                ...n,
                servicios: n.servicios.filter(s => s.id !== servicioId)
              };
            }
            return n;
          })
        };
      }
      return cat;
    });
    setCategorias(newCategorias);
    await saveCategoriasToGitHub(newCategorias);
  }, [categorias]);

  const addServicio = useCallback(async (categoriaId: string, negocioId: string, servicio: Servicio) => {
    const newCategorias = categorias.map(cat => {
      if (cat.id === categoriaId) {
        return {
          ...cat,
          negocios: cat.negocios.map(n => {
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
      return cat;
    });
    setCategorias(newCategorias);
    await saveCategoriasToGitHub(newCategorias);
  }, [categorias]);

  const getNegocioById = useCallback((id: string) => {
    return categorias.flatMap(c => c.negocios).find(n => n.id === id);
  }, [categorias]);

  const getCategoriaById = useCallback((id: string) => {
    return categorias.find(c => c.id === id);
  }, [categorias]);

  return (
    <DataContext.Provider value={{
      categorias,
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
      isLoading,
      syncData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
