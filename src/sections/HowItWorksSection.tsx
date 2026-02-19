import { Search, Store, MessageCircle, CheckCircle } from 'lucide-react';

const steps = [
  { icon: Search, title: 'Busca', description: 'Encuentra repuestos, talleres o servicios automotrices cerca de ti.', color: '#EF4444' },
  { icon: Store, title: 'Compara', description: 'Revisa perfiles, productos, servicios y reseñas de diferentes negocios.', color: '#3B82F6' },
  { icon: MessageCircle, title: 'Contacta', description: 'Comunícate directamente con el negocio por WhatsApp o teléfono.', color: '#22C55E' },
  { icon: CheckCircle, title: 'Resuelve', description: 'Acude al negocio o coordina el servicio. ¡Tu vehículo como nuevo!', color: '#F59E0B' }
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-3xl" /></div>
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Cómo <span className="text-red-500">funciona</span>?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">En solo 4 simples pasos, encuentra lo que necesitas para tu vehículo</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto" style={{ backgroundColor: `${step.color}15` }}>
                    <step.icon className="w-10 h-10" style={{ color: step.color }} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: step.color, color: '#fff' }}>{index + 1}</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
