import { useState } from 'react';
import { 
  ArrowLeft, Mail, MessageSquare, LogOut, 
  Send, Check, Store, Edit, Phone, MapPin, Clock,
  ShoppingCart, Bell, MessageCircle, User, Package, Wrench,
  DollarSign, Calendar, Heart, Star, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { getNegocioById } from '@/data/marketplace';
import type { Negocio } from '@/types';

interface MiCuentaPageProps {
  onBack: () => void;
}

export function MiCuentaPage({ onBack }: MiCuentaPageProps) {
  const { 
    usuario, 
    logout, 
    getMensajesRecibidos, 
    marcarMensajeLeido, 
    responderMensaje,
    getChatsPorUsuario,
    getChatMensajes,
    enviarChatMensaje,
    marcarChatMensajesLeidos,
    getChatNoLeidos,
    getCotizacionesPorNegocio,
    getCotizacionesPorCliente,
    responderCotizacion,
    getCotizacionesPendientes,
    getNotificacionesPorUsuario,
    getNotificacionesNoLeidas,
    marcarNotificacionLeida,
    eliminarFavorito,
    getCalificacionPromedio
  } = useAuth();
  
  const [selectedMensaje, setSelectedMensaje] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState('');
  const [activeTab, setActiveTab] = useState('notificaciones');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatMensaje, setChatMensaje] = useState('');
  const [selectedCotizacion, setSelectedCotizacion] = useState<string | null>(null);
  const [precioCotizado, setPrecioCotizado] = useState('');
  const [respuestaCotizacion, setRespuestaCotizacion] = useState('');

  if (!usuario) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Debes iniciar sesión</h2>
        <Button onClick={onBack}>Volver al inicio</Button>
      </div>
    );
  }

  const mensajesRecibidos = usuario.tipo === 'negocio' && usuario.negocioId 
    ? getMensajesRecibidos(usuario.negocioId) 
    : [];
  const chats = getChatsPorUsuario(usuario.id, usuario.tipo);
  const cotizaciones = usuario.tipo === 'negocio' && usuario.negocioId
    ? getCotizacionesPorNegocio(usuario.negocioId)
    : getCotizacionesPorCliente(usuario.id);
  const notificaciones = getNotificacionesPorUsuario(usuario.id);
  
  const negocio = usuario.negocioId ? getNegocioById(usuario.negocioId) : null;

  const handleResponder = (mensajeId: string) => {
    if (respuesta.trim()) {
      responderMensaje(mensajeId, respuesta.trim());
      setRespuesta('');
      setSelectedMensaje(null);
    }
  };

  const handleVerMensaje = (mensajeId: string) => {
    marcarMensajeLeido(mensajeId);
    setSelectedMensaje(mensajeId);
  };

  const handleEnviarChat = () => {
    if (!chatMensaje.trim() || !selectedChat) return;
    enviarChatMensaje(selectedChat, chatMensaje.trim());
    setChatMensaje('');
  };

  const handleResponderCotizacion = () => {
    if (!precioCotizado || !respuestaCotizacion.trim() || !selectedCotizacion) return;
    responderCotizacion(selectedCotizacion, parseInt(precioCotizado), respuestaCotizacion.trim());
    setPrecioCotizado('');
    setRespuestaCotizacion('');
    setSelectedCotizacion(null);
  };

  const chatNoLeidos = getChatNoLeidos(usuario.id, usuario.tipo);
  const cotizacionesPendientes = usuario.negocioId ? getCotizacionesPendientes(usuario.negocioId) as number : 0;
  const notificacionesNoLeidas = getNotificacionesNoLeidas(usuario.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mi Cuenta</h1>
              <p className="text-gray-600">{usuario.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={logout} className="text-red-600 border-red-200 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {usuario.nombre.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{usuario.nombre}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <Badge variant={usuario.tipo === 'negocio' ? 'default' : 'secondary'}>
                    {usuario.tipo === 'negocio' ? 'Dueño de Negocio' : 'Cliente'}
                  </Badge>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-500 text-sm">Miembro desde {usuario.fechaRegistro}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {notificacionesNoLeidas > 0 && (
                  <Badge className="bg-red-500">
                    <Bell className="w-3 h-3 mr-1" />
                    {notificacionesNoLeidas}
                  </Badge>
                )}
                {chatNoLeidos > 0 && (
                  <Badge className="bg-blue-500">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    {chatNoLeidos}
                  </Badge>
                )}
                {usuario.tipo === 'negocio' && cotizacionesPendientes > 0 && (
                  <Badge className="bg-yellow-500">
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    {cotizacionesPendientes}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="notificaciones" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notificaciones
              {notificacionesNoLeidas > 0 && (
                <Badge className="bg-red-500 text-white text-xs ml-1">
                  {notificacionesNoLeidas}
                </Badge>
              )}
            </TabsTrigger>
            
            {usuario.tipo === 'cliente' && (
              <TabsTrigger value="favoritos" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Favoritos
                {usuario.favoritos && usuario.favoritos.length > 0 && (
                  <Badge className="bg-red-500 text-white text-xs ml-1">
                    {usuario.favoritos.length}
                  </Badge>
                )}
              </TabsTrigger>
            )}
            
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat
              {chatNoLeidos > 0 && (
                <Badge className="bg-blue-500 text-white text-xs ml-1">
                  {chatNoLeidos}
                </Badge>
              )}
            </TabsTrigger>
            
            <TabsTrigger value="cotizaciones" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Cotizaciones
              {usuario.tipo === 'negocio' && cotizacionesPendientes > 0 && (
                <Badge className="bg-yellow-500 text-white text-xs ml-1">
                  {cotizacionesPendientes}
                </Badge>
              )}
            </TabsTrigger>
            
            {usuario.tipo === 'negocio' && (
              <TabsTrigger value="mensajes" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Mensajes
                {mensajesRecibidos.filter(m => !m.leido).length > 0 && (
                  <Badge className="bg-green-500 text-white text-xs ml-1">
                    {mensajesRecibidos.filter(m => !m.leido).length}
                  </Badge>
                )}
              </TabsTrigger>
            )}
            
            {usuario.tipo === 'negocio' && negocio && (
              <TabsTrigger value="negocio" className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                Mi Negocio
              </TabsTrigger>
            )}
          </TabsList>

          {/* Notificaciones */}
          <TabsContent value="notificaciones">
            <div className="space-y-3">
              {notificaciones.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No tienes notificaciones</h3>
                  </CardContent>
                </Card>
              ) : (
                notificaciones.map((not) => (
                  <Card 
                    key={not.id} 
                    className={`overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${
                      !not.leida ? 'border-yellow-400 border-2' : ''
                    }`}
                    onClick={() => marcarNotificacionLeida(not.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          not.tipo === 'mensaje' ? 'bg-blue-100' :
                          not.tipo === 'chat' ? 'bg-green-100' :
                          not.tipo === 'cotizacion' ? 'bg-yellow-100' :
                          'bg-gray-100'
                        }`}>
                          {not.tipo === 'mensaje' ? <MessageSquare className="w-5 h-5 text-blue-600" /> :
                           not.tipo === 'chat' ? <MessageCircle className="w-5 h-5 text-green-600" /> :
                           not.tipo === 'cotizacion' ? <ShoppingCart className="w-5 h-5 text-yellow-600" /> :
                           <Bell className="w-5 h-5 text-gray-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{not.titulo}</h4>
                            {!not.leida && (
                              <Badge className="bg-yellow-400 text-gray-900 text-xs">Nueva</Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{not.contenido}</p>
                          <span className="text-xs text-gray-400 mt-2 block">
                            {new Date(not.fecha).toLocaleString('es-CL')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Favoritos */}
          {usuario.tipo === 'cliente' && (
            <TabsContent value="favoritos">
              <div className="space-y-4">
                {(!usuario.favoritos || usuario.favoritos.length === 0) ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No tienes favoritos</h3>
                      <p className="text-gray-500">Guarda tus negocios favoritos para acceder rápidamente</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {usuario.favoritos.map((negocioId) => {
                      const favNegocio = getNegocioById(negocioId);
                      if (!favNegocio) return null;
                      const rating = getCalificacionPromedio(negocioId) || favNegocio.rating;
                      
                      return (
                        <Card key={negocioId} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Star className="w-8 h-8 text-yellow-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate">{favNegocio.nombre}</h4>
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                  <span className="text-sm text-gray-600">{rating}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{favNegocio.direccion}</p>
                              </div>
                              <button
                                onClick={() => eliminarFavorito(negocioId)}
                                className="p-2 hover:bg-red-50 rounded-full transition-colors"
                              >
                                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                              </button>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="flex-1"
                                onClick={() => window.open(`tel:${favNegocio.telefono.replace(/\s/g, '')}`)}
                              >
                                <Phone className="w-4 h-4 mr-1" />
                                Llamar
                              </Button>
                              <Button 
                                size="sm"
                                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                                onClick={() => {
                                  // Navegar al negocio
                                  onBack();
                                }}
                              >
                                <ChevronRight className="w-4 h-4 mr-1" />
                                Ver
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          )}

          {/* Chat */}
          <TabsContent value="chat">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Chat List */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Conversaciones</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {chats.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No tienes conversaciones
                    </div>
                  ) : (
                    <div className="divide-y">
                      {chats.map((chat) => (
                        <button
                          key={chat.id}
                          onClick={() => {
                            setSelectedChat(chat.id);
                            marcarChatMensajesLeidos(chat.id, usuario.id);
                          }}
                          className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                            selectedChat === chat.id ? 'bg-yellow-50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {usuario.tipo === 'cliente' ? chat.negocioNombre : chat.clienteNombre}
                            </span>
                            {(chat.mensajesNoLeidos || 0) > 0 && (
                              <Badge className="bg-blue-500 text-white">
                                {chat.mensajesNoLeidos}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                            {chat.ultimoMensaje || 'Sin mensajes'}
                          </p>
                          <span className="text-xs text-gray-400 mt-1 block">
                            {chat.fechaUltimoMensaje ? new Date(chat.fechaUltimoMensaje).toLocaleTimeString('es-CL', {
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : ''}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Chat Messages */}
              <Card className="md:col-span-2">
                <CardContent className="p-4">
                  {selectedChat ? (
                    <div className="h-[400px] flex flex-col">
                      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                        {getChatMensajes(selectedChat).map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.remitenteId === usuario.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                              msg.remitenteId === usuario.id
                                ? 'bg-yellow-400 text-gray-900 rounded-br-none'
                                : 'bg-gray-100 text-gray-900 rounded-bl-none'
                            }`}>
                              <p className="text-sm">{msg.contenido}</p>
                              <span className="text-xs opacity-70 mt-1 block">
                                {new Date(msg.fecha).toLocaleTimeString('es-CL', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Escribe un mensaje..."
                          value={chatMensaje}
                          onChange={(e) => setChatMensaje(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleEnviarChat()}
                        />
                        <Button 
                          onClick={handleEnviarChat}
                          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[400px] flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2" />
                        <p>Selecciona una conversación</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cotizaciones */}
          <TabsContent value="cotizaciones">
            <div className="space-y-4">
              {cotizaciones.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No tienes cotizaciones</h3>
                  </CardContent>
                </Card>
              ) : (
                cotizaciones.map((cot) => (
                  <Card key={cot.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className={`p-3 rounded-lg ${
                          cot.tipo === 'producto' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          {cot.tipo === 'producto' ? (
                            <Package className="w-6 h-6 text-blue-600" />
                          ) : (
                            <Wrench className="w-6 h-6 text-green-600" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{cot.itemNombre}</h4>
                            <Badge className={
                              cot.estado === 'pendiente' ? 'bg-yellow-400 text-gray-900' :
                              cot.estado === 'respondida' ? 'bg-blue-500 text-white' :
                              cot.estado === 'aceptada' ? 'bg-green-500 text-white' :
                              'bg-red-500 text-white'
                            }>
                              {cot.estado.charAt(0).toUpperCase() + cot.estado.slice(1)}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{cot.descripcion}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {usuario.tipo === 'cliente' ? cot.negocioNombre : cot.clienteNombre}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(cot.fechaSolicitud || cot.fecha).toLocaleDateString('es-CL')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              Cantidad: {cot.cantidad}
                            </span>
                          </div>

                          {cot.estado === 'respondida' && cot.precioCotizado && (
                            <div className="mt-3 p-3 bg-green-50 rounded-lg">
                              <p className="text-sm">
                                <span className="font-medium">Precio cotizado:</span>{' '}
                                <span className="text-lg font-bold text-green-600">
                                  ${cot.precioCotizado.toLocaleString('es-CL')}
                                </span>
                              </p>
                              {cot.respuesta && (
                                <p className="text-sm text-gray-600 mt-1">{cot.respuesta}</p>
                              )}
                            </div>
                          )}

                          {usuario.tipo === 'negocio' && cot.estado === 'pendiente' && (
                            <div className="mt-3">
                              {selectedCotizacion === cot.id ? (
                                <div className="space-y-2">
                                  <div className="flex gap-2">
                                    <div className="relative flex-1">
                                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                      <Input
                                        type="number"
                                        placeholder="Precio"
                                        value={precioCotizado}
                                        onChange={(e) => setPrecioCotizado(e.target.value)}
                                        className="pl-10"
                                      />
                                    </div>
                                  </div>
                                  <Textarea
                                    placeholder="Mensaje para el cliente..."
                                    value={respuestaCotizacion}
                                    onChange={(e) => setRespuestaCotizacion(e.target.value)}
                                    className="min-h-[80px]"
                                  />
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm"
                                      onClick={handleResponderCotizacion}
                                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                                    >
                                      <Check className="w-4 h-4 mr-1" />
                                      Enviar Cotización
                                    </Button>
                                    <Button 
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setSelectedCotizacion(null)}
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedCotizacion(cot.id)}
                                >
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  Responder Cotización
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
          </TabsContent>

          {/* Mensajes (solo negocios) */}
          {usuario.tipo === 'negocio' && (
            <TabsContent value="mensajes">
              <div className="space-y-4">
                {mensajesRecibidos.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No tienes mensajes</h3>
                    </CardContent>
                  </Card>
                ) : (
                  mensajesRecibidos.map((mensaje) => (
                    <Card 
                      key={mensaje.id} 
                      className={`overflow-hidden ${!mensaje.leido ? 'border-yellow-400 border-2' : ''}`}
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{mensaje.remitenteNombre}</h3>
                              {!mensaje.leido && (
                                <Badge className="bg-yellow-400 text-gray-900 text-xs">Nuevo</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{mensaje.remitenteEmail}</p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(mensaje.fecha).toLocaleDateString('es-CL')}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <h4 className="font-medium text-gray-900 mb-1">{mensaje.asunto}</h4>
                        <p className="text-gray-600 text-sm mb-3">{mensaje.contenido}</p>
                        
                        {mensaje.respuesta ? (
                          <div className="bg-green-50 p-3 rounded-lg mt-3">
                            <p className="text-sm text-green-800">
                              <span className="font-medium">Tu respuesta:</span> {mensaje.respuesta}
                            </p>
                          </div>
                        ) : selectedMensaje === mensaje.id ? (
                          <div className="mt-3 space-y-2">
                            <Textarea
                              placeholder="Escribe tu respuesta..."
                              value={respuesta}
                              onChange={(e) => setRespuesta(e.target.value)}
                              className="min-h-[80px]"
                            />
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleResponder(mensaje.id)}
                                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                              >
                                <Send className="w-4 h-4 mr-1" />
                                Enviar Respuesta
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedMensaje(null)}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleVerMensaje(mensaje.id)}
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Responder
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          )}

          {/* Mi Negocio */}
          {usuario.tipo === 'negocio' && negocio && (
            <TabsContent value="negocio">
              <EditarNegocioForm negocio={negocio} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}

// Componente para editar el negocio
function EditarNegocioForm({ negocio }: { negocio: Negocio }) {
  const [formData, setFormData] = useState({
    nombre: negocio.nombre,
    descripcion: negocio.descripcion,
    direccion: negocio.direccion,
    telefono: negocio.telefono,
    email: negocio.email,
    horario: negocio.horario,
    sitioWeb: '',
    facebook: '',
    instagram: '',
    whatsapp: '',
  });
  const [guardado, setGuardado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGuardado(true);
    setTimeout(() => setGuardado(false), 3000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="neg-nombre">Nombre del negocio</Label>
              <Input
                id="neg-nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="neg-descripcion">Descripción</Label>
              <Textarea
                id="neg-descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="neg-direccion" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Dirección
                </Label>
                <Input
                  id="neg-direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="neg-telefono" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Teléfono
                </Label>
                <Input
                  id="neg-telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="neg-email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="neg-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="neg-horario" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Horario
                </Label>
                <Input
                  id="neg-horario"
                  value={formData.horario}
                  onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="neg-sitioweb">Sitio Web</Label>
              <Input
                id="neg-sitioweb"
                placeholder="https://tunegocio.cl"
                value={formData.sitioWeb}
                onChange={(e) => setFormData({ ...formData, sitioWeb: e.target.value })}
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Redes Sociales</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="neg-facebook">Facebook</Label>
                  <Input
                    id="neg-facebook"
                    placeholder="@tunegocio"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="neg-instagram">Instagram</Label>
                  <Input
                    id="neg-instagram"
                    placeholder="@tunegocio"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="neg-whatsapp">WhatsApp</Label>
                  <Input
                    id="neg-whatsapp"
                    placeholder="+56 9 1234 5678"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button 
                type="submit" 
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold"
              >
                <Check className="w-4 h-4 mr-2" />
                Guardar Cambios
              </Button>
              {guardado && (
                <span className="text-green-600 text-sm flex items-center">
                  <Check className="w-4 h-4 mr-1" />
                  Cambios guardados
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Productos y Servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5" />
              Productos ({negocio.productos?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm mb-4">
              Gestiona los productos que ofreces a tus clientes.
            </p>
            <Button variant="outline" className="w-full">
              <Edit className="w-4 h-4 mr-2" />
              Gestionar Productos
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Servicios ({negocio.servicios?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm mb-4">
              Gestiona los servicios que ofreces a tus clientes.
            </p>
            <Button variant="outline" className="w-full">
              <Edit className="w-4 h-4 mr-2" />
              Gestionar Servicios
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
