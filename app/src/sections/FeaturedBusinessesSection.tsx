import { MapPin, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRef } from 'react';
import type { Categoria } from '@/types';

interface FeaturedBusinessesSectionProps {
  categorias: Categoria[];
  onNegocioClick: (negocioId: string) => void;
}

export function FeaturedBusinessesSection({ categorias, onNegocioClick }: FeaturedBusinessesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const negociosDestacados = categorias.flatMap(cat => cat.negocios.filter(n => n.destacado).map(n => ({ negocio: n, categoria: cat }))).slice(0, 8);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -400 : 400, behavior: 'smooth' });
    }
  };

  if (negociosDestacados.length === 0) return null;

  return (
    <section className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <Badge className="mb-4 bg-red-500/20 text-red-400 border-red-500/30">Destacados</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Negocios <span className="text-red-500">destacados</span></h2>
            <p className="text-gray-400 mt-2">Los mejores negocios verificados de nuestra plataforma</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll('left')} className="border-gray-700 text-gray-400 hover:text-white"><ChevronLeft className="w-5 h-5" /></Button>
            <Button variant="outline" size="icon" onClick={() => scroll('right')} className="border-gray-700 text-gray-400 hover:text-white"><ChevronRight className="w-5 h-5" /></Button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {negociosDestacados.map(({ negocio, categoria }) => (
            <div key={negocio.id} onClick={() => onNegocioClick(negocio.id)} className="group flex-shrink-0 w-[350px] bg-[#111111] rounded-2xl overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <img src={negocio.imagen || '/images/placeholder-business.jpg'} alt={negocio.nombre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                <div className="absolute top-3 left-3"><Badge className="bg-amber-500 text-black font-semibold">Destacado</Badge></div>
                {negocio.verificado && <div className="absolute top-3 right-3"><Badge className="bg-blue-500/80 text-white">Verificado</Badge></div>}
                <div className="absolute bottom-3 left-3"><span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${categoria.color}30`, color: categoria.color }}>{categoria.nombre}</span></div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-red-400 transition-colors">{negocio.nombre}</h3>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{negocio.descripcion}</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin className="w-4 h-4" /><span>{negocio.comuna}</span></div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><Phone className="w-4 h-4" /><span>{negocio.telefono}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
