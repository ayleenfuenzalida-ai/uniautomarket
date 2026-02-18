import { ArrowLeft, Star, MapPin, Phone, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';

interface CategoriaPageProps {
  categoriaId: string;
  onNegocioClick: (negocioId: string) => void;
  onBack: () => void;
}

export function CategoriaPage({ categoriaId, onNegocioClick, onBack }: CategoriaPageProps) {
  const { getCategoriaById } = useData();
  const categoria = getCategoriaById(categoriaId);

  if (!categoria) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Categoría no encontrada</h2>
          <Button 
            onClick={onBack}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/80 to-red-800/60 text-white border-b border-red-500/30">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-red-500/20 mb-4 -ml-4 border border-red-500/30"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{categoria.nombre}</h1>
          <p className="text-white/80 text-lg max-w-2xl">{categoria.descripcion}</p>
          <div className="mt-4 flex items-center gap-4">
            <Badge className="bg-red-500/30 text-red-300 border border-red-500/50">
              {categoria.negocios.length} negocios
            </Badge>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-black/80 border-b border-red-500/20 sticky top-0 z-40 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-white/70">Filtrar por:</span>
            <Button variant="outline" size="sm" className="text-sm border-red-500/30 text-white/80 hover:bg-red-500/20 hover:border-red-500/50 bg-black/50">
              Mejor Rating
            </Button>
            <Button variant="outline" size="sm" className="text-sm border-red-500/30 text-white/80 hover:bg-red-500/20 hover:border-red-500/50 bg-black/50">
              Más Cercano
            </Button>
            <Button variant="outline" size="sm" className="text-sm border-red-500/30 text-white/80 hover:bg-red-500/20 hover:border-red-500/50 bg-black/50">
              Abierto Ahora
            </Button>
          </div>
        </div>
      </div>

      {/* Businesses List */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categoria.negocios.map((negocio) => (
            <Card 
              key={negocio.id}
              className="group cursor-pointer overflow-hidden bg-black/60 border-red-500/20 hover:border-red-500/50 transition-all duration-300"
              onClick={() => onNegocioClick(negocio.id)}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-2/5 h-48 md:h-auto bg-gradient-to-br from-red-900/40 to-red-800/20 relative overflow-hidden">
                  {negocio.imagen ? (
                    <img 
                      src={negocio.imagen} 
                      alt={negocio.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-red-500/20 p-4 rounded-full border border-red-500/30">
                        <Star className="w-10 h-10 text-red-500" />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-red-500 text-white font-bold border-0">
                      <Star className="w-3 h-3 mr-1 fill-white" />
                      {negocio.rating}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-3/5 p-5">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                    {negocio.nombre}
                  </h3>
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">
                    {negocio.descripcion}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-white/70">
                      <MapPin className="w-4 h-4 mr-2 text-red-500/70" />
                      <span className="line-clamp-1">{negocio.direccion}</span>
                    </div>
                    <div className="flex items-center text-white/70">
                      <Phone className="w-4 h-4 mr-2 text-red-500/70" />
                      {negocio.telefono}
                    </div>
                    <div className="flex items-center text-white/70">
                      <Clock className="w-4 h-4 mr-2 text-red-500/70" />
                      <span className="line-clamp-1">{negocio.horario}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-red-500/20 flex items-center justify-between">
                    <span className="text-sm text-white/50">
                      {negocio.productos?.length || 0} productos
                      {negocio.servicios?.length ? ` • ${negocio.servicios.length} servicios` : ''}
                    </span>
                    <ChevronRight className="w-5 h-5 text-red-500/50 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {categoria.negocios.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-red-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <Star className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No hay negocios aún</h3>
            <p className="text-white/60">Sé el primero en publicar en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}
