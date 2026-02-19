import { useState } from 'react';
import { ArrowLeft, MapPin, Phone, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';

interface CategoriaPageProps {
  categoriaId: string;
  onNegocioClick: (negocioId: string) => void;
  onBack: () => void;
}

export function CategoriaPage({ categoriaId, onNegocioClick, onBack }: CategoriaPageProps) {
  const { categorias } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroComuna, setFiltroComuna] = useState('');
  
  const categoria = categorias.find(c => c.id === categoriaId);
  
  if (!categoria) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Categoría no encontrada</p>
          <Button onClick={onBack} className="mt-4">Volver</Button>
        </div>
      </div>
    );
  }

  const negociosFiltrados = categoria.negocios.filter(negocio => {
    const matchesSearch = negocio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         negocio.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesComuna = !filtroComuna || negocio.comuna.toLowerCase().includes(filtroComuna.toLowerCase());
    return matchesSearch && matchesComuna && negocio.estado === 'activo';
  });

  const comunas = [...new Set(categoria.negocios.map(n => n.comuna))];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${categoria.imagen})` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/90 to-[#0a0a0a]" />
        </div>
        <div className="relative container mx-auto px-4 py-12">
          <Button variant="ghost" onClick={onBack} className="mb-6 text-gray-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />Volver
          </Button>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{categoria.nombre}</h1>
            <p className="text-xl text-gray-400">{categoria.descripcion}</p>
            <div className="mt-6 flex items-center gap-4">
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{categoria.negocios.length} negocios</Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{categoria.negocios.filter(n => n.verificado).length} verificados</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 border-b border-gray-800">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input placeholder="Buscar negocios..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-[#111111] border-gray-700 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select value={filtroComuna} onChange={(e) => setFiltroComuna(e.target.value)} className="bg-[#111111] border border-gray-700 text-white rounded-md px-3 py-2">
              <option value="">Todas las comunas</option>
              {comunas.map(comuna => <option key={comuna} value={comuna}>{comuna}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {negociosFiltrados.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No se encontraron negocios</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {negociosFiltrados.map((negocio) => (
              <div key={negocio.id} onClick={() => onNegocioClick(negocio.id)} className="group bg-[#111111] rounded-xl overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img src={negocio.imagen || '/images/placeholder-business.jpg'} alt={negocio.nombre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                  {negocio.destacado && <div className="absolute top-3 left-3"><Badge className="bg-amber-500 text-black font-semibold">Destacado</Badge></div>}
                  {negocio.verificado && <div className="absolute top-3 right-3"><Badge className="bg-blue-500/80 text-white">Verificado</Badge></div>}
                  <div className="absolute bottom-3 left-3 right-3"><h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">{negocio.nombre}</h3></div>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-gray-400 text-sm line-clamp-2">{negocio.descripcion}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin className="w-4 h-4" /><span>{negocio.comuna}</span></div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><Phone className="w-4 h-4" /><span>{negocio.telefono}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
