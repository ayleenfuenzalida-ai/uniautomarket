import { useState } from 'react';
import { 
  ArrowLeft, Star, MapPin, Phone, Mail, Clock, X, Package, Wrench, 
  MessageCircle, ShoppingCart, Heart, Share2, Navigation, MessageSquare
} from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';
import { MensajeModal } from '@/components/MensajeModal';
import { ChatModal } from '@/components/ChatModal';
import { CotizacionModal } from '@/components/CotizacionModal';
import { CompartirModal } from '@/components/CompartirModal';
import { MapaModal } from '@/components/MapaModal';
import { ResenasSection } from '@/components/ResenasSection';
import { useAuth } from '@/contexts/AuthContext';
import type { Producto, Servicio } from '@/types';

interface NegocioPageProps {
  negocioId: string;
  onBack: () => void;
}

export function NegocioPage({ negocioId, onBack }: NegocioPageProps) {
  const { getNegocioById } = useData();
  const negocio = getNegocioById(negocioId);
  const { usuario, agregarFavorito, eliminarFavorito, esFavorito, getCalificacionPromedio } = useAuth();
  
  const [isMensajeModalOpen, setIsMensajeModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isCotizacionModalOpen, setIsCotizacionModalOpen] = useState(false);
  const [isCompartirModalOpen, setIsCompartirModalOpen] = useState(false);
  const [isMapaModalOpen, setIsMapaModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Producto | Servicio | null>(null);
  const [selectedTipo, setSelectedTipo] = useState<'producto' | 'servicio'>('producto');

  if (!negocio) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Negocio no encontrado</h2>
          <Button 
            onClick={onBack}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white"
          >
            Volver
          </Button>
        </div>
      </div>
    );
  }

  const hasProductos = negocio.productos && negocio.productos.length > 0;
  const hasServicios = negocio.servicios && negocio.servicios.length > 0;
  const isFav = esFavorito(negocio.id);
  const calificacionReal = getCalificacionPromedio(negocio.id);
  const rating = calificacionReal > 0 ? calificacionReal : negocio.rating;

  const handleCotizar = (item: Producto | Servicio, tipo: 'producto' | 'servicio') => {
    setSelectedItem(item);
    setSelectedTipo(tipo);
    setIsCotizacionModalOpen(true);
  };

  const toggleFavorito = () => {
    if (isFav) {
      eliminarFavorito(negocio.id);
    } else {
      agregarFavorito(negocio.id);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a]">
        {/* Hero Section */}
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-[#0a0a0a] to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-grid opacity-30" />
          
          <div className="container mx-auto px-4 py-8 relative">
            <Button 
              variant="ghost" 
              className="text-gray-400 hover:text-white hover:bg-red-500/10 mb-6"
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </Button>

            <div className="flex flex-col lg:flex-row lg:items-end gap-6">
              {/* Logo/Avatar */}
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 blur-3xl opacity-30" />
                <div className="relative w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl border border-gray-800 flex items-center justify-center">
                  <Star className="w-12 h-12 lg:w-16 lg:h-16 text-red-500" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
                    <Star className="w-3 h-3 mr-1 fill-red-500" />
                    {rating.toFixed(1)}
                  </Badge>
                  <span className="text-gray-500">•</span>
                  <Badge className="bg-gray-800 text-gray-300 border-0">
                    Negocio verificado
                  </Badge>
                  {calificacionReal > 0 && (
                    <>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400 text-sm">{calificacionReal.toFixed(1)} estrellas</span>
                    </>
                  )}
                </div>
                <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3">
                  {negocio.nombre}
                </h1>
                <p className="text-gray-400 max-w-2xl leading-relaxed">
                  {negocio.descripcion}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {usuario?.tipo === 'cliente' && (
                  <Button 
                    variant="outline"
                    size="icon"
                    className={`border-gray-700 ${isFav ? 'bg-red-500/20 border-red-500/50' : 'hover:border-red-500/50'}`}
                    onClick={toggleFavorito}
                  >
                    <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </Button>
                )}
                <Button 
                  variant="outline"
                  size="icon"
                  className="border-gray-700 hover:border-red-500/50"
                  onClick={() => setIsCompartirModalOpen(true)}
                >
                  <Share2 className="w-5 h-5 text-gray-400" />
                </Button>
                <Button 
                  variant="outline"
                  size="icon"
                  className="border-gray-700 hover:border-red-500/50"
                  onClick={() => setIsMapaModalOpen(true)}
                >
                  <Navigation className="w-5 h-5 text-gray-400" />
                </Button>
                <Button 
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white"
                  onClick={() => window.open(`tel:${negocio.telefono.replace(/\s/g, '')}`)}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Llamar
                </Button>
                {/* WhatsApp Button */}
                {negocio.whatsapp && (
                  <Button 
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white"
                    onClick={() => window.open(`https://wa.me/${negocio.whatsapp?.replace(/\D/g, '')}`, '_blank')}
                  >
                    <SiWhatsapp className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                )}
                <Button 
                  variant="outline"
                  className="border-red-500/50 text-white hover:bg-red-500/10"
                  onClick={() => setIsChatModalOpen(true)}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="border-y border-gray-800 bg-[#111111]/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <button 
                className="flex items-center text-gray-400 hover:text-red-400 transition-colors"
                onClick={() => setIsMapaModalOpen(true)}
              >
                <MapPin className="w-4 h-4 mr-2 text-red-500" />
                {negocio.direccion}
              </button>
              <div className="flex items-center text-gray-400">
                <Phone className="w-4 h-4 mr-2 text-red-500" />
                {negocio.telefono}
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-2 text-red-500" />
                {negocio.email}
              </div>
              <div className="flex items-center text-gray-400">
                <Clock className="w-4 h-4 mr-2 text-red-500" />
                {negocio.horario}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="productos" className="w-full">
            <TabsList className="mb-6 bg-[#111111] border border-gray-800 p-1">
              <TabsTrigger 
                value="productos" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white"
              >
                <Package className="w-4 h-4 mr-2" />
                Productos ({negocio.productos?.length || 0})
              </TabsTrigger>
              <TabsTrigger 
                value="servicios"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white"
              >
                <Wrench className="w-4 h-4 mr-2" />
                Servicios ({negocio.servicios?.length || 0})
              </TabsTrigger>
              <TabsTrigger 
                value="resenas"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Reseñas
              </TabsTrigger>
              <TabsTrigger 
                value="info"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white"
              >
                Información
              </TabsTrigger>
            </TabsList>

            {/* Productos Tab */}
            <TabsContent value="productos">
              {hasProductos ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {negocio.productos?.map((producto: Producto) => (
                    <Card key={producto.id} className="overflow-hidden bg-[#111111] border-gray-800 hover:border-red-500/30 transition-all duration-300 group">
                      <div className="h-48 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
                        <div className="relative bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 group-hover:border-red-500/30 transition-all">
                          <Package className="w-10 h-10 text-red-500" />
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-white mb-1 line-clamp-1 group-hover:text-red-400 transition-colors">{producto.nombre}</h3>
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{producto.descripcion}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl font-bold text-red-500">
                            ${producto.precio.toLocaleString('es-CL')}
                          </span>
                          <Badge className={producto.disponible ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-800 text-gray-400'}>
                            {producto.disponible ? 'Disponible' : 'Agotado'}
                          </Badge>
                        </div>
                        <Button 
                          variant="outline"
                          className="w-full border-gray-700 hover:border-red-500/50 hover:bg-red-500/10"
                          onClick={() => handleCotizar(producto, 'producto')}
                          disabled={!producto.disponible}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Solicitar Cotización
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-[#111111] border-gray-800">
                  <CardContent className="p-8 text-center">
                    <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white">No hay productos</h3>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Servicios Tab */}
            <TabsContent value="servicios">
              {hasServicios ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {negocio.servicios?.map((servicio: Servicio) => (
                    <Card key={servicio.id} className="overflow-hidden bg-[#111111] border-gray-800 hover:border-red-500/30 transition-all duration-300 group">
                      <div className="h-40 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
                        <div className="relative bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 group-hover:border-red-500/30 transition-all">
                          <Wrench className="w-10 h-10 text-red-500" />
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-white mb-1 group-hover:text-red-400 transition-colors">{servicio.nombre}</h3>
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{servicio.descripcion}</p>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-xs text-gray-500">Desde</span>
                            <span className="text-xl font-bold text-red-500 ml-1">
                              ${servicio.precioDesde.toLocaleString('es-CL')}
                            </span>
                          </div>
                        </div>
                        <Button 
                          variant="outline"
                          className="w-full border-gray-700 hover:border-red-500/50 hover:bg-red-500/10"
                          onClick={() => handleCotizar(servicio, 'servicio')}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Solicitar Cotización
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-[#111111] border-gray-800">
                  <CardContent className="p-8 text-center">
                    <Wrench className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white">No hay servicios</h3>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Reseñas Tab */}
            <TabsContent value="resenas">
              <ResenasSection negocioId={negocio.id} />
            </TabsContent>

            {/* Info Tab */}
            <TabsContent value="info">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[#111111] border-gray-800">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full" />
                      Información de Contacto
                    </h3>
                    <div className="space-y-4">
                      <button 
                        className="flex items-start gap-3 w-full text-left hover:bg-[#1a1a1a] p-3 rounded-lg transition-colors"
                        onClick={() => setIsMapaModalOpen(true)}
                      >
                        <div className="p-2 bg-red-500/10 rounded-lg">
                          <MapPin className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium text-white">Dirección</p>
                          <p className="text-gray-400">{negocio.direccion}</p>
                        </div>
                      </button>
                      <div className="flex items-start gap-3 p-3">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                          <Phone className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium text-white">Teléfono</p>
                          <p className="text-gray-400">{negocio.telefono}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                          <Mail className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium text-white">Email</p>
                          <p className="text-gray-400">{negocio.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                          <Clock className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium text-white">Horario de Atención</p>
                          <p className="text-gray-400">{negocio.horario}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#111111] border-gray-800">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full" />
                      Sobre el Negocio
                    </h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">{negocio.descripcion}</p>
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-500">{rating.toFixed(1)}</div>
                        <div className="text-sm text-gray-500">Rating</div>
                      </div>
                      <div className="w-px h-10 bg-gray-800" />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          {negocio.productos?.length || 0}
                        </div>
                        <div className="text-sm text-gray-500">Productos</div>
                      </div>
                      <div className="w-px h-10 bg-gray-800" />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          {negocio.servicios?.length || 0}
                        </div>
                        <div className="text-sm text-gray-500">Servicios</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      <MensajeModal 
        isOpen={isMensajeModalOpen} 
        onClose={() => setIsMensajeModalOpen(false)} 
        negocio={negocio}
      />
      
      <ChatModal 
        isOpen={isChatModalOpen} 
        onClose={() => setIsChatModalOpen(false)} 
        negocio={negocio}
      />
      
      <CotizacionModal 
        isOpen={isCotizacionModalOpen} 
        onClose={() => setIsCotizacionModalOpen(false)} 
        negocio={negocio}
        item={selectedItem}
        tipo={selectedTipo}
      />

      <CompartirModal 
        isOpen={isCompartirModalOpen} 
        onClose={() => setIsCompartirModalOpen(false)} 
        negocio={negocio}
      />

      <MapaModal 
        isOpen={isMapaModalOpen} 
        onClose={() => setIsMapaModalOpen(false)} 
        negocio={negocio}
      />
    </>
  );
}
