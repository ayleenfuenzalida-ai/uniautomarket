import { useEffect, useRef, useState } from 'react';
import { Wrench, Settings, Package, Truck, Paintbrush, Star, MapPin, ChevronRight, Zap, TrendingUp, Shield, Cpu, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { VenderProductosModal } from '@/components/VenderProductosModal';

interface HomePageProps {
  onCategoriaClick: (categoriaId: string) => void;
  onNegocioClick: (negocioId: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Wrench,
  Settings,
  Package,
  Truck,
  Paintbrush,
  Cpu,
  Zap,
  Code,
};

// Animation hook
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = ref.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
}

export function HomePage({ onCategoriaClick, onNegocioClick }: HomePageProps) {
  const animatedRef = useScrollAnimation();
  const { categorias } = useData();
  const [isVenderModalOpen, setIsVenderModalOpen] = useState(false);
  
  // Get featured businesses
  const negociosDestacados = categorias.flatMap(cat => 
    cat.negocios.slice(0, 1).map(neg => ({ ...neg, categoriaNombre: cat.nombre }))
  );

  return (
    <div ref={animatedRef} className="min-h-screen">
      {/* Hero Section - Transparent to see car exterior */}
      <section id="hero-section" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <Badge className="bg-black/60 backdrop-blur-md text-red-400 border border-red-500/30 mb-6 px-4 py-2 text-sm font-medium tracking-wider uppercase">
                <Zap className="w-4 h-4 mr-2" />
                Marketplace Automotriz #1 de Chile
              </Badge>
            </div>

            {/* Title */}
            <h1 className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100 text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Encuentra todo para tu</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-600 glow-text-red drop-shadow-[0_2px_10px_rgba(255,0,0,0.5)]">
                vehículo
              </span>
            </h1>

            {/* Description */}
            <p className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200 text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Repuestos, talleres, herramientas y servicios automotrices en un solo lugar. 
              Conectamos dueños de vehículos con los mejores proveedores.
            </p>

            {/* CTA Buttons */}
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-lg px-8 py-6 shadow-[0_0_30px_rgba(255,0,0,0.4)] hover:shadow-[0_0_40px_rgba(255,0,0,0.6)] transition-all duration-300 group"
                onClick={() => document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explorar Categorías
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-red-500/50 text-white hover:bg-red-500/20 hover:border-red-500 font-bold text-lg px-8 py-6 backdrop-blur-sm bg-black/30 transition-all duration-300"
                onClick={() => setIsVenderModalOpen(true)}
              >
                Vender Productos
              </Button>
            </div>

            {/* Stats */}
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-500 mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { value: '500+', label: 'Negocios', icon: TrendingUp },
                { value: '50K+', label: 'Productos', icon: Package },
                { value: '100K+', label: 'Usuarios', icon: Shield },
                { value: '4.8', label: 'Rating', icon: Star },
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl group-hover:border-red-500/30 transition-all duration-300">
                    <stat.icon className="w-6 h-6 text-red-500 mx-auto mb-2" />
                    <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{stat.value}</div>
                    <div className="text-white/70 text-sm uppercase tracking-wider">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-red-500/50 rounded-full flex justify-center pt-2 bg-black/30 backdrop-blur-sm">
            <div className="w-1 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Categories Section - Transparent to see hood open */}
      <section id="categorias" className="min-h-screen py-24 relative flex items-center">
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <Badge className="bg-black/60 backdrop-blur-md text-red-400 border border-red-500/20 mb-4">
              CATEGORÍAS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              Explora por <span className="text-red-500">Categoría</span>
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Encuentra exactamente lo que necesitas navegando por nuestras categorías especializadas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorias.map((categoria, index) => {
              const IconComponent = iconMap[categoria.icono] || Wrench;
              return (
                <Card 
                  key={categoria.id}
                  className="group cursor-pointer overflow-hidden bg-black/60 backdrop-blur-md border-white/10 hover:border-red-500/50 transition-all duration-500 animate-on-scroll opacity-0 translate-y-8"
                  style={{ transitionDelay: `${index * 100}ms` }}
                  onClick={() => onCategoriaClick(categoria.id)}
                >
                  {/* Imagen de categoría */}
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={categoria.imagen} 
                      alt={categoria.nombre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <div className={`${categoria.color} p-2 rounded-lg text-white`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                      {categoria.nombre}
                    </h3>
                    <p className="text-white/70 text-sm mb-3 line-clamp-2">
                      {categoria.descripcion}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">
                        {categoria.negocios.length} negocios
                      </span>
                      <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Businesses - Transparent to see engine */}
      <section id="featured-section" className="min-h-screen py-24 relative flex items-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <div>
              <Badge className="bg-black/60 backdrop-blur-md text-red-400 border border-red-500/20 mb-4">
                DESTACADOS
              </Badge>
              <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Negocios <span className="text-red-500">Destacados</span>
              </h2>
              <p className="text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Los mejores proveedores de cada categoría
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0 border-red-500/50 text-white hover:bg-red-500/20 backdrop-blur-sm bg-black/30"
              onClick={() => document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver Todos
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {negociosDestacados.map((negocio, index) => (
              <Card 
                key={negocio.id}
                className="group cursor-pointer overflow-hidden bg-black/60 backdrop-blur-md border-white/10 hover:border-red-500/50 transition-all duration-500 animate-on-scroll opacity-0 translate-y-8"
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => onNegocioClick(negocio.id)}
              >
                {/* Imagen del negocio */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={negocio.imagen} 
                    alt={negocio.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-black/60 backdrop-blur-md text-white border border-white/20">
                      <Star className="w-3 h-3 text-red-500 mr-1 fill-red-500" />
                      {negocio.rating}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
                      {negocio.categoriaNombre}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                    {negocio.nombre}
                  </h3>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">
                    {negocio.descripcion}
                  </p>
                  <div className="flex items-center text-sm text-white/60">
                    <MapPin className="w-4 h-4 mr-1 text-red-500" />
                    {negocio.direccion}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works - Transparent to see interior */}
      <section id="how-it-works" className="min-h-screen py-24 relative flex items-center">
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <Badge className="bg-black/60 backdrop-blur-md text-red-400 border border-red-500/20 mb-4">
              CÓMO FUNCIONA
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              En simples <span className="text-red-500">pasos</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Elige una Categoría', desc: 'Selecciona el tipo de servicio o producto que necesitas' },
              { step: '02', title: 'Compara Negocios', desc: 'Revisa ratings, precios y disponibilidad' },
              { step: '03', title: 'Contacta Directo', desc: 'Comunícate con el negocio por teléfono o chat' },
              { step: '04', title: 'Recibe el Servicio', desc: 'Visita el local o coordina el servicio a domicilio' },
            ].map((item, index) => (
              <div 
                key={index} 
                className="relative group animate-on-scroll opacity-0 translate-y-8"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Connector line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-[2px] bg-gradient-to-r from-red-500/50 to-transparent" />
                )}
                
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-red-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                    <div className="relative w-24 h-24 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 group-hover:border-red-500/50 flex items-center justify-center transition-all duration-300">
                      <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                        {item.step}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{item.title}</h3>
                  <p className="text-white/70 text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Transparent to see brakes */}
      <section id="cta-section" className="min-h-screen py-24 relative flex items-center overflow-hidden">
        <div className="container mx-auto px-4 relative text-center">
          <div className="max-w-2xl mx-auto animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              ¿Tienes un negocio <span className="text-red-500">automotriz</span>?
            </h2>
            <p className="text-white/80 text-lg mb-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Únete a Universal AutoMarket y llega a miles de clientes que buscan tus servicios
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-lg px-8 py-6 shadow-[0_0_30px_rgba(255,0,0,0.4)] hover:shadow-[0_0_40px_rgba(255,0,0,0.6)] transition-all"
                onClick={() => setIsVenderModalOpen(true)}
              >
                Publicar mi Negocio
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-red-500/50 text-white hover:bg-red-500/20 hover:border-red-500 font-bold text-lg px-8 py-6 backdrop-blur-sm bg-black/30"
              >
                Conocer Más
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Vender Productos Modal */}
      <VenderProductosModal 
        isOpen={isVenderModalOpen} 
        onClose={() => setIsVenderModalOpen(false)} 
      />
    </div>
  );
}
