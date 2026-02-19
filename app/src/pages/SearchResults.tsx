import { useState } from 'react';
import { Search, MapPin, Phone, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';

interface SearchResultsProps {
  query: string;
  onNegocioClick: (negocioId: string) => void;
  onCategoriaClick: (categoriaId: string) => void;
}

export function SearchResults({ query, onNegocioClick, onCategoriaClick }: SearchResultsProps) {
  const { searchNegocios, searchProductos } = useData();
  const [searchTerm, setSearchTerm] = useState(query);

  const negociosResults = searchNegocios(searchTerm);
  const productosResults = searchProductos(searchTerm);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="bg-[#111111] border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => onCategoriaClick('')} className="mb-4 text-gray-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />Volver al inicio
          </Button>
          <h1 className="text-3xl font-bold text-white mb-4">Resultados de búsqueda</h1>
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 h-14 bg-[#0a0a0a] border-gray-700 rounded-xl text-white text-lg" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="negocios">
          <TabsList className="bg-[#111111] border border-gray-800 mb-6">
            <TabsTrigger value="negocios">Negocios ({negociosResults.length})</TabsTrigger>
            <TabsTrigger value="productos">Productos ({productosResults.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="negocios">
            {negociosResults.length === 0 ? (
              <div className="text-center py-16"><p className="text-gray-400 text-lg">No se encontraron negocios</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {negociosResults.map(({ negocio, categoria }) => (
                  <div key={negocio.id} onClick={() => onNegocioClick(negocio.id)} className="group bg-[#111111] rounded-xl overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img src={negocio.imagen || '/images/placeholder-business.jpg'} alt={negocio.nombre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute top-3 left-3"><Badge className="bg-red-500/80 text-white">{categoria.nombre}</Badge></div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="text-lg font-bold text-white">{negocio.nombre}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin className="w-4 h-4" /><span>{negocio.comuna}</span></div>
                      <div className="flex items-center gap-2 text-sm text-gray-500"><Phone className="w-4 h-4" /><span>{negocio.telefono}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="productos">
            {productosResults.length === 0 ? (
              <div className="text-center py-16"><p className="text-gray-400 text-lg">No se encontraron productos</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productosResults.map(({ producto, negocio, categoria }) => (
                  <div key={producto.id} onClick={() => onNegocioClick(negocio.id)} className="group bg-[#111111] rounded-xl p-4 border border-gray-800 hover:border-red-500/50 transition-all cursor-pointer">
                    <Badge className="mb-2 bg-red-500/20 text-red-400 border-red-500/30">{categoria.nombre}</Badge>
                    <h4 className="font-semibold text-white mb-1">{producto.nombre}</h4>
                    <p className="text-gray-400 text-sm mb-2">{negocio.nombre}</p>
                    <p className="text-red-400 font-bold">${producto.precio.toLocaleString('es-CL')}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
