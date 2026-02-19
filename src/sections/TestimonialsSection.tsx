import { Star, Quote } from 'lucide-react';

const testimonials = [
  { id: '1', nombre: 'Carlos Martínez', rol: 'Propietario de taller', avatar: 'CM', contenido: 'Universal AutoMarket ha transformado mi negocio. Desde que me uní, he duplicado mis clientes.', calificacion: 5, color: '#EF4444' },
  { id: '2', nombre: 'María González', rol: 'Cliente satisfecha', avatar: 'MG', contenido: 'Encontré el repuesto que buscaba en minutos. El sistema de reseñas me ayudó a elegir un negocio confiable.', calificacion: 5, color: '#3B82F6' },
  { id: '3', nombre: 'Juan Pérez', rol: 'Mecánico profesional', avatar: 'JP', contenido: 'Como profesional del rubro, valoro la calidad de los negocios verificados. Es una plataforma seria.', calificacion: 5, color: '#22C55E' }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-3xl translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl -translate-x-1/3" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Lo que dicen nuestros <span className="text-red-500">usuarios</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Miles de personas confían en Universal AutoMarket</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="relative bg-[#111111] rounded-2xl p-8 border border-gray-800">
              <div className="absolute -top-4 left-8 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: t.color }}><Quote className="w-4 h-4 text-white" /></div>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.calificacion)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-gray-300 mb-6">"{t.contenido}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: `${t.color}30`, color: t.color }}>{t.avatar}</div>
                <div><h4 className="font-semibold text-white">{t.nombre}</h4><p className="text-gray-500 text-sm">{t.rol}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
