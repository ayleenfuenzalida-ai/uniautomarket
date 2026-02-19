import { useState } from 'react';
import { ArrowLeft, MessageCircle, Eye, CheckCircle, Plus, Search, User, Building2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBlog, categoriasBlog } from '@/contexts/BlogContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import type { Pregunta } from '@/types';

interface BlogPageProps {
  onBack: () => void;
}

export function BlogPage({ onBack }: BlogPageProps) {
  const { addPregunta, addRespuesta, marcarResuelta, incrementarVistasPregunta, getPreguntasByCategoria, getPreguntaById } = useBlog();
  const { usuario, isAdmin, isBusinessOwner, getBusinessIdForUser } = useAuth();
  const { getNegocioById } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState<Pregunta | null>(null);
  const [nuevaPreguntaOpen, setNuevaPreguntaOpen] = useState(false);
  const [nuevaPregunta, setNuevaPregunta] = useState({ titulo: '', contenido: '', categoria: 'General' });
  const [nuevaRespuesta, setNuevaRespuesta] = useState('');

  const preguntasFiltradas = getPreguntasByCategoria(categoriaFiltro).filter(p => 
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contenido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerPregunta = (pregunta: Pregunta) => {
    setPreguntaSeleccionada(pregunta);
    incrementarVistasPregunta(pregunta.id);
  };

  const handleCrearPregunta = async () => {
    if (!usuario || !nuevaPregunta.titulo.trim() || !nuevaPregunta.contenido.trim()) return;
    
    await addPregunta({
      titulo: nuevaPregunta.titulo,
      contenido: nuevaPregunta.contenido,
      autor: usuario.nombre,
      autorId: usuario.id,
      categoria: nuevaPregunta.categoria
    });
    
    setNuevaPregunta({ titulo: '', contenido: '', categoria: 'General' });
    setNuevaPreguntaOpen(false);
  };

  const handleResponder = async () => {
    if (!usuario || !preguntaSeleccionada || !nuevaRespuesta.trim()) return;

    const negocioId = isBusinessOwner ? getBusinessIdForUser() : undefined;
    const negocio = negocioId ? getNegocioById(negocioId) : null;

    await addRespuesta(preguntaSeleccionada.id, {
      autor: negocio ? negocio.nombre : usuario.nombre,
      autorId: usuario.id,
      contenido: nuevaRespuesta,
      esNegocio: !!negocio,
      negocioId: negocio?.id
    });

    setNuevaRespuesta('');
    setPreguntaSeleccionada(getPreguntaById(preguntaSeleccionada.id) || null);
  };

  const handleMarcarResuelta = async () => {
    if (!preguntaSeleccionada) return;
    await marcarResuelta(preguntaSeleccionada.id);
    setPreguntaSeleccionada(getPreguntaById(preguntaSeleccionada.id) || null);
  };

  // Vista de detalle de pregunta
  if (preguntaSeleccionada) {
    const puedeResponder = usuario && (isAdmin || isBusinessOwner || usuario.id === preguntaSeleccionada.autorId);
    const esAutor = usuario?.id === preguntaSeleccionada.autorId;

    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => setPreguntaSeleccionada(null)} className="mb-6 text-gray-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />Volver al foro
          </Button>

          <div className="max-w-4xl mx-auto">
            {/* Pregta principal */}
            <div className="bg-[#111111] rounded-xl p-6 border border-gray-800 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{preguntaSeleccionada.autor}</p>
                    <p className="text-gray-500 text-sm">{new Date(preguntaSeleccionada.fecha).toLocaleDateString('es-CL')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{preguntaSeleccionada.categoria}</Badge>
                  {preguntaSeleccionada.resuelta && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />Resuelta
                    </Badge>
                  )}
                </div>
              </div>

              <h1 className="text-2xl font-bold text-white mb-4">{preguntaSeleccionada.titulo}</h1>
              <p className="text-gray-300 leading-relaxed mb-4">{preguntaSeleccionada.contenido}</p>

              <div className="flex items-center gap-4 text-gray-500 text-sm">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{preguntaSeleccionada.vistas} vistas</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{preguntaSeleccionada.respuestas.length} respuestas</span>
                </div>
              </div>

              {esAutor && !preguntaSeleccionada.resuelta && preguntaSeleccionada.respuestas.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <Button onClick={handleMarcarResuelta} variant="outline" className="border-green-600 text-green-400 hover:bg-green-600/20">
                    <CheckCircle className="w-4 h-4 mr-2" />Marcar como resuelta
                  </Button>
                </div>
              )}
            </div>

            {/* Respuestas */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-white">
                {preguntaSeleccionada.respuestas.length} {preguntaSeleccionada.respuestas.length === 1 ? 'Respuesta' : 'Respuestas'}
              </h3>

              {preguntaSeleccionada.respuestas.map((respuesta) => (
                <div key={respuesta.id} className={`bg-[#111111] rounded-xl p-6 border ${respuesta.esNegocio ? 'border-red-500/30' : 'border-gray-800'}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${respuesta.esNegocio ? 'bg-red-500/20' : 'bg-gray-700'}`}>
                      {respuesta.esNegocio ? <Building2 className="w-5 h-5 text-red-400" /> : <User className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{respuesta.autor}</p>
                        {respuesta.esNegocio && (
                          <Badge className="bg-red-500/20 text-red-400 text-xs">Negocio</Badge>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm">{new Date(respuesta.fecha).toLocaleDateString('es-CL')}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{respuesta.contenido}</p>
                </div>
              ))}

              {preguntaSeleccionada.respuestas.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aún no hay respuestas. ¡Sé el primero en responder!</p>
                </div>
              )}
            </div>

            {/* Formulario de respuesta */}
            {puedeResponder && !preguntaSeleccionada.resuelta && (
              <div className="bg-[#111111] rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">Tu respuesta</h3>
                <Textarea
                  value={nuevaRespuesta}
                  onChange={(e) => setNuevaRespuesta(e.target.value)}
                  placeholder="Escribe tu respuesta..."
                  className="bg-[#0a0a0a] border-gray-700 text-white mb-4 min-h-[120px]"
                />
                <Button onClick={handleResponder} disabled={!nuevaRespuesta.trim()} className="bg-red-600 hover:bg-red-700 text-white">
                  <Send className="w-4 h-4 mr-2" />Enviar respuesta
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Vista de lista de preguntas
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-transparent" />
        <div className="relative container mx-auto px-4 py-12">
          <Button variant="ghost" onClick={onBack} className="mb-6 text-gray-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />Volver
          </Button>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog Mecánico</h1>
            <p className="text-xl text-gray-400">Foro de preguntas y respuestas de la comunidad automotriz</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 border-b border-gray-800">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full md:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Buscar preguntas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#111111] border-gray-700 text-white"
              />
            </div>
            <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
              <SelectTrigger className="w-full sm:w-[180px] bg-[#111111] border-gray-700 text-white">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent className="bg-[#111111] border-gray-700">
                <SelectItem value="Todas">Todas las categorías</SelectItem>
                {categoriasBlog.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {usuario && (
            <Dialog open={nuevaPreguntaOpen} onOpenChange={setNuevaPreguntaOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />Nueva pregunta
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#111111] border-gray-800 text-white max-w-lg">
                <DialogHeader>
                  <DialogTitle>Hacer una pregunta</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Título</label>
                    <Input
                      value={nuevaPregunta.titulo}
                      onChange={(e) => setNuevaPregunta({ ...nuevaPregunta, titulo: e.target.value })}
                      placeholder="Resume tu pregunta"
                      className="bg-[#0a0a0a] border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Categoría</label>
                    <Select value={nuevaPregunta.categoria} onValueChange={(v) => setNuevaPregunta({ ...nuevaPregunta, categoria: v })}>
                      <SelectTrigger className="bg-[#0a0a0a] border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111111] border-gray-700">
                        {categoriasBlog.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Detalle</label>
                    <Textarea
                      value={nuevaPregunta.contenido}
                      onChange={(e) => setNuevaPregunta({ ...nuevaPregunta, contenido: e.target.value })}
                      placeholder="Describe tu problema o pregunta en detalle..."
                      className="bg-[#0a0a0a] border-gray-700 text-white min-h-[120px]"
                    />
                  </div>
                  <Button 
                    onClick={handleCrearPregunta} 
                    disabled={!nuevaPregunta.titulo.trim() || !nuevaPregunta.contenido.trim()}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    Publicar pregunta
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {preguntasFiltradas.map((pregunta) => (
            <div
              key={pregunta.id}
              onClick={() => handleVerPregunta(pregunta)}
              className="bg-[#111111] rounded-xl p-6 border border-gray-800 hover:border-red-500/50 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{pregunta.autor}</p>
                    <p className="text-gray-500 text-xs">{new Date(pregunta.fecha).toLocaleDateString('es-CL')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">{pregunta.categoria}</Badge>
                  {pregunta.resuelta && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />Resuelta
                    </Badge>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-red-400 transition-colors">
                {pregunta.titulo}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2 mb-4">{pregunta.contenido}</p>

              <div className="flex items-center gap-4 text-gray-500 text-sm">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{pregunta.vistas}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{pregunta.respuestas.length} respuestas</span>
                </div>
              </div>
            </div>
          ))}

          {preguntasFiltradas.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No hay preguntas aún</p>
              <p className="text-sm">Sé el primero en hacer una pregunta a la comunidad</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
