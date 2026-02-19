import { ArrowRight } from 'lucide-react';
import type { Categoria } from '@/types';

interface CategoriesSectionProps {
  categorias: Categoria[];
  onCategoriaClick: (categoriaId: string) => void;
}

export function CategoriesSection({ categorias, onCategoriaClick }: CategoriesSectionProps) {
  return (
    <section id="categorias" className="py-24 bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-red-600/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="text-red-500 text-sm font-bold tracking-widest">CATEGORÍAS</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4">
            EXPLORA POR <span className="text-red-600">CATEGORÍA</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Encuentra exactamente lo que necesitas navegando por nuestras 9 categorías especializadas
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((categoria, index) => (
            <button
              key={categoria.id}
              onClick={() => onCategoriaClick(categoria.id)}
              className="group relative overflow-hidden bg-black border-2 border-gray-900 hover:border-red-600 transition-all duration-500 text-left"
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={categoria.imagen}
                  alt={categoria.nombre}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/20 transition-colors duration-500" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                {/* Number */}
                <div className="absolute -top-8 right-4 text-7xl font-black text-gray-800 group-hover:text-red-600/30 transition-colors duration-500">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Icon */}
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {categoria.icono}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black text-white mb-2 group-hover:text-red-500 transition-colors duration-300">
                  {categoria.nombre.toUpperCase()}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 group-hover:text-gray-400 transition-colors">
                  {categoria.descripcion}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-red-600 font-bold text-sm">
                    {categoria.negocios.length} NEGOCIOS
                  </span>
                  <div className="w-10 h-10 border-2 border-gray-800 group-hover:border-red-600 group-hover:bg-red-600 flex items-center justify-center transition-all duration-300">
                    <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 left-0 w-0 h-0 border-t-[40px] border-t-red-600 border-r-[40px] border-r-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">¿No encuentras lo que buscas?</p>
          <button className="inline-flex items-center gap-2 text-red-600 font-bold hover:text-red-500 transition-colors">
            VER TODAS LAS CATEGORÍAS
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
