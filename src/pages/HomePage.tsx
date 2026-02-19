import { useData } from '@/contexts/DataContext';
import { HeroSection } from '@/sections/HeroSection';
import { CategoriesSection } from '@/sections/CategoriesSection';
import { FeaturedBusinessesSection } from '@/sections/FeaturedBusinessesSection';
import { HowItWorksSection } from '@/sections/HowItWorksSection';
import { TestimonialsSection } from '@/sections/TestimonialsSection';
import { CTASection } from '@/sections/CTASection';

interface HomePageProps {
  onCategoriaClick: (categoriaId: string) => void;
  onNegocioClick: (negocioId: string) => void;
}

export function HomePage({ onCategoriaClick, onNegocioClick }: HomePageProps) {
  const { categorias, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <HeroSection />
      <CategoriesSection categorias={categorias} onCategoriaClick={onCategoriaClick} />
      <FeaturedBusinessesSection categorias={categorias} onNegocioClick={onNegocioClick} />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
