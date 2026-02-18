import { useState } from 'react';
import { Star, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';

interface ResenasSectionProps {
  negocioId: string;
}

export function ResenasSection({ negocioId }: ResenasSectionProps) {
  const { usuario, crearResena, responderResena, getResenasPorNegocio, getCalificacionPromedio } = useAuth();
  const [nuevaCalificacion, setNuevaCalificacion] = useState(5);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [respuesta, setRespuesta] = useState('');
  const [resenaRespondiendo, setResenaRespondiendo] = useState<string | null>(null);

  const resenasNegocio = getResenasPorNegocio(negocioId);
  const calificacionPromedio = getCalificacionPromedio(negocioId);
  const totalResenas = resenasNegocio.length;

  const handleSubmitResena = () => {
    if (!usuario || !nuevoComentario.trim()) return;

    crearResena({
      negocioId,
      clienteId: usuario.id,
      clienteNombre: usuario.nombre,
      calificacion: nuevaCalificacion,
      comentario: nuevoComentario.trim()
    });

    setNuevoComentario('');
    setNuevaCalificacion(5);
    setMostrarFormulario(false);
  };

  const handleResponder = (resenaId: string) => {
    if (!respuesta.trim()) return;
    responderResena(resenaId, respuesta.trim());
    setRespuesta('');
    setResenaRespondiendo(null);
  };

  const renderEstrellas = (calificacion: number, interactivo = false, onClick?: (n: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => interactivo && onClick?.(n)}
            className={`${interactivo ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactivo}
          >
            <Star
              className={`w-5 h-5 ${
                n <= calificacion ? 'fill-red-500 text-red-500' : 'text-gray-700'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header con promedio */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#111111] border border-gray-800 rounded-xl">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-red-500">{calificacionPromedio.toFixed(1)}</div>
            <div className="text-sm text-gray-500">de 5</div>
          </div>
          <div>
            {renderEstrellas(Math.round(calificacionPromedio))}
            <p className="text-gray-500 text-sm mt-2">{totalResenas} reseñas</p>
          </div>
        </div>

        {usuario?.tipo === 'cliente' && (
          <Button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white"
          >
            <Star className="w-4 h-4 mr-2" />
            Escribir reseña
          </Button>
        )}
      </div>

      {/* Formulario nueva reseña */}
      {mostrarFormulario && (
        <Card className="bg-[#111111] border-red-500/30">
          <CardContent className="p-6">
            <h4 className="font-semibold text-white mb-4">Califica tu experiencia</h4>
            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-2 block">Tu calificación</label>
              {renderEstrellas(nuevaCalificacion, true, setNuevaCalificacion)}
            </div>
            <Textarea
              placeholder="Cuéntanos tu experiencia con este negocio..."
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              className="mb-4 bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600 focus:border-red-500"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitResena}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white"
              >
                Publicar reseña
              </Button>
              <Button variant="outline" onClick={() => setMostrarFormulario(false)} className="border-gray-700 text-gray-400 hover:bg-gray-800">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de reseñas */}
      <div className="space-y-4">
        {resenasNegocio.length === 0 ? (
          <Card className="bg-[#111111] border-gray-800">
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white">Sin reseñas aún</h3>
              <p className="text-gray-500">Sé el primero en compartir tu experiencia</p>
            </CardContent>
          </Card>
        ) : (
          resenasNegocio.map((resena) => (
            <Card key={resena.id} className="bg-[#111111] border-gray-800">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-full flex items-center justify-center flex-shrink-0 border border-red-500/20">
                    <User className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white">{resena.clienteNombre}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {renderEstrellas(resena.calificacion || resena.rating || 0)}
                          <span className="text-sm text-gray-500">
                            {new Date(resena.fecha).toLocaleDateString('es-CL')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-400 mt-3">{resena.comentario}</p>

                    {/* Respuesta del negocio */}
                    {resena.respuestaNegocio && (
                      <div className="mt-4 pl-4 border-l-2 border-red-500/50">
                        <p className="text-sm text-gray-500 mb-1">Respuesta del negocio:</p>
                        <p className="text-gray-300">{resena.respuestaNegocio}</p>
                      </div>
                    )}

                    {/* Botón responder (solo para dueño del negocio) */}
                    {usuario?.tipo === 'negocio' && usuario.negocioId === negocioId && !resena.respuestaNegocio && (
                      <div className="mt-4">
                        {resenaRespondiendo === resena.id ? (
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Escribe tu respuesta..."
                              value={respuesta}
                              onChange={(e) => setRespuesta(e.target.value)}
                              className="text-sm bg-[#1a1a1a] border-gray-700 text-white"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleResponder(resena.id)}
                                className="bg-gradient-to-r from-red-600 to-red-700 text-white"
                              >
                                Responder
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setResenaRespondiendo(null)}
                                className="border-gray-700 text-gray-400"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setResenaRespondiendo(resena.id)}
                            className="border-gray-700 text-gray-400 hover:bg-gray-800"
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Responder
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
