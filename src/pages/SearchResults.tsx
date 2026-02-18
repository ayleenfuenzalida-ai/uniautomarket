import { Search, Star, MapPin, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';

interface SearchResultsProps {
  query: string;
  onNegocioClick: (negocioId: string) => void;
  onCategoriaClick: (categoriaId: string) => void;
}

export function SearchResults({ query, onNegocioClick, onCategoriaClick }: SearchResultsProps) {
  const { categorias } = useData();
  
  // Search in all businesses
  const allNegocios = categorias.flatMap(cat => 
    cat.negocios.map(neg => ({ ...neg, categoriaNombre: cat.nombre, categoriaId: cat.id }))
  );

  const filteredNegocios = allNegocios.filter(negocio => {
    const searchLower = query.toLowerCase();
    return (
      negocio.nombre.toLowerCase().includes(searchLower) ||
      negocio.descripcion.toLowerCase().includes(searchLower) ||
      negocio.direccion.toLowerCase().includes(searchLower) ||
      negocio.categoriaNombre.toLowerCase().includes(searchLower) ||
      negocio.productos?.some(p => 
        p.nombre.toLowerCase().includes(searchLower) ||
        p.descripcion.toLowerCase().includes(searchLower)
      ) ||
      negocio.servicios?.some(s => 
        s.nombre.toLowerCase().includes(searchLower) ||
        s.descripcion.toLowerCase().includes(searchLower)
      )
    );
  });

  // Search in categories
  const filteredCategorias = categorias.filter(cat =>
    cat.nombre.toLowerCase().includes(query.toLowerCase()) ||
    cat.descripcion.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Resultados de búsqueda
          </h1>
          <p className="text-gray-600">
            {filteredNegocios.length + filteredCategorias.length} resultados para "{query}"
          </p>
        </div>

        {/* Categories Results */}
        {filteredCategorias.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Categorías</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategorias.map((categoria) => (
                <Card 
                  key={categoria.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onCategoriaClick(categoria.id)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`${categoria.color} p-3 rounded-lg text-white`}>
                      <Search className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{categoria.nombre}</h3>
                      <p className="text-sm text-gray-500">{categoria.negocios.length} negocios</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Businesses Results */}
        {filteredNegocios.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Negocios</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredNegocios.map((negocio) => (
                <Card 
                  key={negocio.id}
                  className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300"
                  onClick={() => onNegocioClick(negocio.id)}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-2/5 h-48 md:h-auto bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/80 p-4 rounded-full">
                          <Star className="w-10 h-10 text-yellow-500" />
                        </div>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-yellow-400 text-gray-900 font-bold">
                          <Star className="w-3 h-3 mr-1 fill-gray-900" />
                          {negocio.rating}
                        </Badge>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <Badge className="bg-white/90 text-gray-900">
                          {negocio.categoriaNombre}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:w-3/5 p-5">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                        {negocio.nombre}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {negocio.descripcion}
                      </p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="line-clamp-1">{negocio.direccion}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {negocio.productos?.length || 0} productos
                          {negocio.servicios?.length ? ` • ${negocio.servicios.length} servicios` : ''}
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredNegocios.length === 0 && filteredCategorias.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron resultados</h3>
            <p className="text-gray-600">Intenta con otra búsqueda o revisa la ortografía</p>
          </div>
        )}
      </div>
    </div>
  );
}
