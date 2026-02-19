import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Pregunta, Respuesta } from '@/types';
import {
  fetchPreguntasFromFirebase,
  savePreguntaToFirebase,
  updatePreguntaInFirebase,
  addRespuestaToFirebase,
  subscribeToPreguntas
} from '@/utils/firebase';
import type { BlogContextType } from '@/types';

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const categoriasBlog = [
  'General',
  'Mecánica',
  'Electricidad',
  'Repuestos',
  'Carrocería',
  'Diagnóstico',
  'Mantenimiento',
  'Neumáticos',
  'Frenos',
  'Suspensión'
];

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const preguntasData = await fetchPreguntasFromFirebase();
        setPreguntas(preguntasData);
        setInitialized(true);
      } catch (err) {
        console.error('Error cargando preguntas:', err);
        setInitialized(true);
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, []);

  useEffect(() => {
    if (!initialized) return;
    const unsubscribe = subscribeToPreguntas((updatedPreguntas) => {
      setPreguntas(updatedPreguntas);
    });
    return () => unsubscribe();
  }, [initialized]);

  const addPregunta = useCallback(async (pregunta: Omit<Pregunta, 'id' | 'fecha' | 'respuestas' | 'vistas' | 'resuelta'>) => {
    const nuevaPregunta: Pregunta = {
      ...pregunta,
      id: `pregunta-${Date.now()}`,
      fecha: new Date().toISOString(),
      respuestas: [],
      vistas: 0,
      resuelta: false
    };
    
    await savePreguntaToFirebase(nuevaPregunta);
    setPreguntas(prev => [nuevaPregunta, ...prev]);
  }, []);

  const addRespuesta = useCallback(async (preguntaId: string, respuesta: Omit<Respuesta, 'id' | 'fecha' | 'preguntaId'>) => {
    const nuevaRespuesta: Respuesta = {
      ...respuesta,
      id: `respuesta-${Date.now()}`,
      preguntaId,
      fecha: new Date().toISOString()
    };
    
    await addRespuestaToFirebase(preguntaId, nuevaRespuesta);
    
    setPreguntas(prev => prev.map(p => {
      if (p.id === preguntaId) {
        return { ...p, respuestas: [...p.respuestas, nuevaRespuesta] };
      }
      return p;
    }));
  }, []);

  const marcarResuelta = useCallback(async (preguntaId: string) => {
    await updatePreguntaInFirebase(preguntaId, { resuelta: true });
    setPreguntas(prev => prev.map(p => 
      p.id === preguntaId ? { ...p, resuelta: true } : p
    ));
  }, []);

  const incrementarVistasPregunta = useCallback(async (preguntaId: string) => {
    const pregunta = preguntas.find(p => p.id === preguntaId);
    if (!pregunta) return;
    
    await updatePreguntaInFirebase(preguntaId, { vistas: (pregunta.vistas || 0) + 1 });
    setPreguntas(prev => prev.map(p => 
      p.id === preguntaId ? { ...p, vistas: (p.vistas || 0) + 1 } : p
    ));
  }, [preguntas]);

  const getPreguntasByCategoria = useCallback((categoria: string): Pregunta[] => {
    if (categoria === 'Todas') return preguntas;
    return preguntas.filter(p => p.categoria === categoria);
  }, [preguntas]);

  const getPreguntaById = useCallback((id: string): Pregunta | undefined => {
    return preguntas.find(p => p.id === id);
  }, [preguntas]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <BlogContext.Provider value={{
      preguntas,
      addPregunta,
      addRespuesta,
      marcarResuelta,
      incrementarVistasPregunta,
      getPreguntasByCategoria,
      getPreguntaById
    }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) throw new Error('useBlog debe usarse dentro de BlogProvider');
  return context;
}

export { categoriasBlog };
