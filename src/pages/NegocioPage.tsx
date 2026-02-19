import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, Mail, Clock, Star, MessageCircle, Share2, Heart, Navigation, Send, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Chat, MensajeChat } from '@/types';

interface NegocioPageProps {
  negocioId: string;
  onBack: () => void;
}

export function NegocioPage({ negocioId, onBack }: NegocioPageProps) {
  const { getNegocioById, getCategoriaByNegocioId, incrementarVisitas, addChat, addMensajeToChat } = useData();
  const { usuario, isAdmin, isBusinessOwner, getBusinessIdForUser } = useAuth();
  const [isFavorito, setIsFavorito] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [chatActual, setChatActual] = useState<Chat | null>(null);
  const [galeriaIndex, setGaleriaIndex] = useState(0);
  const [productoGaleria, setProductoGaleria] = useState<{ imagenes: string[]; nombre: string } | null>(null);

  const negocio = getNegocioById(negocioId);
  const categoria = getCategoriaByNegocioId(negocioId);

  const esDuenoNegocio = isBusinessOwner && getBusinessIdForUser() === negocioId;
  const puedeVerTodosLosChats = isAdmin || esDuenoNegocio;

  useEffect(() => {
    if (negocioId) incrementarVisitas(negocioId);
  }, [negocioId, incrementarVisitas]);

  useEffect(() => {
    if (chatActual && negocio) {
      const chatActualizado = negocio.chats.find(c => c.id === chatActual.id);
      if (chatActualizado) {
        setChatActual(chatActualizado);
      }
    }
  }, [negocio?.chats, chatActual?.id]);

  if (!negocio || !categoria) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Negocio no encontrado</p>
          <Button onClick={onBack} className="mt-4">Volver</Button>
        </div>
      </div>
    );
  }

  const promedioCalificacion = negocio.resenas.length > 0 ? negocio.resenas.reduce((acc, r) => acc + r.calificacion, 0) / negocio.resenas.length : 0;
  const horarioHoy = negocio.horarios[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const estaAbierto = horarioHoy?.abierto;

  // Fotos del negocio (imagen principal + galería)
  const fotosNegocio = [negocio.imagen, ...(negocio.galeria || [])].filter(Boolean);

  const handleWhatsApp = () => {
    const mensaje = `Hola, vi su negocio en Universal AutoMarket y me gustaría obtener más información.`;
    const url = `https://wa.me/${negocio.whatsapp || negocio.telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  const handleIniciarChat = async () => {
    if (!usuario) return;
    const chatExistente = negocio.chats.find(c => c.clienteId === usuario.id);
    
    if (chatExistente) {
      setChatActual(chatExistente);
    } else {
      const nuevoChat: Omit<Chat, 'id' | 'ultimaActualizacion'> = {
        negocioId: negocio.id,
        clienteId: usuario.id,
        clienteNombre: usuario.nombre,
        mensajes: []
      };
      await addChat(categoria.id, negocio.id, nuevoChat);
      const negocioActualizado = getNegocioById(negocioId);
      if (negocioActualizado) {
        const chatCreado = negocioActualizado.chats.find(c => c.clienteId === usuario.id);
        if (chatCreado) setChatActual(chatCreado);
      }
    }
    setChatOpen(true);
  };

  const handleEnviarMensaje = async () => {
    if (!chatActual || !nuevoMensaje.trim() || !usuario) return;

    const mensaje: Omit<MensajeChat, 'id'> = {
      autorId: usuario.id,
      autorNombre: esDuenoNegocio ? negocio.nombre : usuario.nombre,
      mensaje: nuevoMensaje.trim(),
      fecha: new Date().toISOString(),
      leido: false
    };

    await addMensajeToChat(categoria.id, negocio.id, chatActual.id, mensaje);
    setNuevoMensaje('');
    const negocioActualizado = getNegocioById(negocioId);
    if (negocioActualizado) {
      const chatActualizado = negocioActualizado.chats.find(c => c.id === chatActual.id);
      if (chatActualizado) setChatActual(chatActualizado);
    }
  };

  const handleSeleccionarChat = (chat: Chat) => {
    setChatActual(chat);
    setChatOpen(true);
  };

  const nextGaleriaFoto = () => setGaleriaIndex((prev) => (prev + 1) % fotosNegocio.length);
  const prevGaleriaFoto = () => setGaleriaIndex((prev) => (prev - 1 + fotosNegocio.length) % fotosNegocio.length);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero con galería de fotos del negocio */}
      <div className="relative h-[500px] overflow-hidden">
        {fotosNegocio.length > 0 ? (
          <>
            <img 
              src={fotosNegocio[galeriaIndex]} 
              alt={negocio.nombre} 
              className="w-full h-full object-cover transition-transform duration-700"
            />
            {/* Galería thumbnails */}
            {fotosNegocio.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {fotosNegocio.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setGaleriaIndex(idx)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === galeriaIndex ? 'border-red-500 scale-110' : 'border-white/30'
                    }`}
                  >
                    <img src={fotosNegocio[idx]} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {/* Navigation arrows */}
            {fotosNegocio.length > 1 && (
              <>
                <button
                  onClick={prevGaleriaFoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextGaleriaFoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <ImageIcon className="w-20 h-20 text-gray-600" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
        
        {/* Header buttons */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
          <Button variant="secondary" size="icon" onClick={onBack} className="bg-black/50 backdrop-blur-sm hover:bg-black/70">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" size="icon" onClick={() => setIsFavorito(!isFavorito)} className={`bg-black/50 backdrop-blur-sm hover:bg-black/70 ${isFavorito ? 'text-red-500' : ''}`}>
              <Heart className={`w-5 h-5 ${isFavorito ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="secondary" size="icon" className="bg-black/50 backdrop-blur-sm hover:bg-black/70">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <div className="container mx-auto">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{categoria.nombre}</Badge>
                  {negocio.verificado && <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Verificado</Badge>}
                  {negocio.destacado && <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Destacado</Badge>}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{negocio.nombre}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {promedioCalificacion > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-medium">{promedioCalificacion.toFixed(1)}</span>
                      <span className="text-gray-400">({negocio.resenas.length})</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span>{negocio.comuna}, {negocio.region}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${estaAbierto ? 'text-green-400' : 'text-red-400'}`}>
                    <Clock className="w-4 h-4" />
                    <span>{estaAbierto ? 'Abierto ahora' : 'Cerrado'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleWhatsApp} className="bg-green-600 hover:bg-green-700 text-white">
              <MessageCircle className="w-4 h-4 mr-2" />WhatsApp
            </Button>
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
              <Phone className="w-4 h-4 mr-2" />Llamar
            </Button>
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
              <Navigation className="w-4 h-4 mr-2" />Cómo llegar
            </Button>
            {usuario && !esDuenoNegocio && (
              <Button onClick={handleIniciarChat} variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/20">
                <MessageCircle className="w-4 h-4 mr-2" />Chat
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="info" className="space-y-6">
              <TabsList className="bg-[#111111] border border-gray-800">
                <TabsTrigger value="info">Información</TabsTrigger>
                {negocio.productos.length > 0 && <TabsTrigger value="productos">Productos</TabsTrigger>}
                {negocio.servicios.length > 0 && <TabsTrigger value="servicios">Servicios</TabsTrigger>}
              </TabsList>

              <TabsContent value="info" className="space-y-6">
                <div className="bg-[#111111] rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Sobre nosotros</h3>
                  <p className="text-gray-400">{negocio.descripcion}</p>
                </div>
                <div className="bg-[#111111] rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Contacto</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Phone className="w-5 h-5 text-red-500" />
                      <span>{negocio.telefono}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <Mail className="w-5 h-5 text-red-500" />
                      <span>{negocio.email}</span>
                    </div>
                    <div className="flex items-start gap-3 text-gray-400">
                      <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                      <span>{negocio.direccion}, {negocio.comuna}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {negocio.productos.length > 0 && (
                <TabsContent value="productos">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {negocio.productos.map((producto) => (
                      <div key={producto.id} className="bg-[#111111] rounded-xl overflow-hidden border border-gray-800 group hover:border-red-500/50 transition-all">
                        {/* Producto imagen principal */}
                        <div 
                          className="relative h-48 overflow-hidden cursor-pointer"
                          onClick={() => setProductoGaleria({ imagenes: producto.imagenes?.length ? producto.imagenes : [producto.imagen], nombre: producto.nombre })}
                        >
                          <img 
                            src={producto.imagen} 
                            alt={producto.nombre}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          {producto.imagenes?.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" />
                              {producto.imagenes.length} fotos
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-white mb-1">{producto.nombre}</h4>
                          <p className="text-gray-400 text-sm mb-2 line-clamp-2">{producto.descripcion}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-red-400 font-bold text-lg">${producto.precio.toLocaleString('es-CL')}</span>
                            <span className="text-gray-500 text-sm">SKU: {producto.sku}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}

              {negocio.servicios.length > 0 && (
                <TabsContent value="servicios">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {negocio.servicios.map((servicio) => (
                      <div key={servicio.id} className="bg-[#111111] rounded-xl p-6 border border-gray-800">
                        <h4 className="font-semibold text-white mb-1">{servicio.nombre}</h4>
                        <p className="text-gray-400 text-sm mb-3">{servicio.descripcion}</p>
                        <span className="text-red-400 font-medium">Desde ${servicio.precioDesde.toLocaleString('es-CL')}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Panel lateral de chats */}
          {puedeVerTodosLosChats && negocio.chats.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-[#111111] rounded-xl border border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-800">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-red-500" />
                    Chats ({negocio.chats.length})
                  </h3>
                </div>
                <div className="divide-y divide-gray-800 max-h-[400px] overflow-y-auto">
                  {negocio.chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => handleSeleccionarChat(chat)}
                      className={`w-full p-4 text-left hover:bg-gray-800/50 transition-colors ${chatActual?.id === chat.id ? 'bg-gray-800/50' : ''}`}
                    >
                      <p className="text-white font-medium text-sm">{chat.clienteNombre}</p>
                      <p className="text-gray-500 text-xs">
                        {chat.mensajes.length > 0 ? `${chat.mensajes.length} mensajes` : 'Sin mensajes'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Galería Producto */}
      {productoGaleria && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setProductoGaleria(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl w-full">
            <h3 className="text-white text-xl mb-4">{productoGaleria.nombre}</h3>
            <div className="relative">
              <img 
                src={productoGaleria.imagenes[galeriaIndex % productoGaleria.imagenes.length]} 
                alt="" 
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />
              {productoGaleria.imagenes.length > 1 && (
                <>
                  <button
                    onClick={() => setGaleriaIndex((prev) => (prev - 1 + productoGaleria.imagenes.length) % productoGaleria.imagenes.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setGaleriaIndex((prev) => (prev + 1) % productoGaleria.imagenes.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {productoGaleria.imagenes.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {productoGaleria.imagenes.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setGaleriaIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      idx === galeriaIndex % productoGaleria.imagenes.length ? 'border-red-500' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat flotante */}
      {chatOpen && chatActual && (
        <div className="fixed bottom-4 right-4 w-full max-w-md bg-[#111111] rounded-xl border border-gray-800 shadow-2xl z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div>
              <p className="text-white font-medium">
                {esDuenoNegocio ? chatActual.clienteNombre : negocio.nombre}
              </p>
              <p className="text-gray-500 text-xs">
                {esDuenoNegocio ? 'Cliente' : 'Negocio'}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="h-[300px] overflow-y-auto p-4 space-y-3">
            {chatActual.mensajes.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-8">
                Inicia la conversación enviando un mensaje
              </p>
            ) : (
              chatActual.mensajes.map((mensaje) => {
                const esPropio = mensaje.autorId === usuario?.id;
                return (
                  <div key={mensaje.id} className={`flex ${esPropio ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-xl px-4 py-2 ${
                      esPropio ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-200'
                    }`}>
                      <p className="text-xs opacity-75 mb-1">{mensaje.autorNombre}</p>
                      <p className="text-sm">{mensaje.mensaje}</p>
                      <p className="text-xs opacity-50 mt-1 text-right">
                        {new Date(mensaje.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <Input
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEnviarMensaje()}
                placeholder="Escribe un mensaje..."
                className="bg-[#0a0a0a] border-gray-700 text-white flex-1"
              />
              <Button 
                onClick={handleEnviarMensaje} 
                disabled={!nuevoMensaje.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
