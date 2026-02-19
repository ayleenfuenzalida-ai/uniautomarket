import { Button } from '@/components/ui/button';
import { ArrowRight, Store, Users } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-red-500/10 to-red-600/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-red-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full mb-8">
            <Store className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">¿Tienes un negocio automotriz?</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Únete a Universal <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">AutoMarket</span></h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Llega a miles de clientes potenciales. Publica tus productos y servicios.</p>

          <div className="flex flex-wrap justify-center gap-8 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-red-400" /></div>
              <div className="text-left"><div className="text-2xl font-bold text-white">100k+</div><div className="text-gray-500 text-sm">Clientes activos</div></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center"><Store className="w-6 h-6 text-red-400" /></div>
              <div className="text-left"><div className="text-2xl font-bold text-white">500+</div><div className="text-gray-500 text-sm">Negocios</div></div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg rounded-xl">Registrar mi negocio<ArrowRight className="w-5 h-5 ml-2" /></Button>
          </div>
        </div>
      </div>
    </section>
  );
}
