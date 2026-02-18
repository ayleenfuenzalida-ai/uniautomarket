import { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Wrench, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  ChevronDown, 
  ChevronRight,
  Battery,
  Droplets,
  Thermometer,
  Disc,
  Gauge,
  Sparkles,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BlogPageProps {
  onBack: () => void;
}

// Artículos de reparaciones fáciles
const articulosReparacion = [
  {
    id: 'cambio-aceite',
    titulo: 'Cómo cambiar el aceite de tu auto',
    descripcion: 'Guía paso a paso para cambiar el aceite del motor en casa. Ahorra dinero y mantén tu motor saludable.',
    dificultad: 'Fácil',
    tiempo: '30-45 min',
    herramientas: ['Llave de filtro', 'Bandeja recolectora', 'Aceite nuevo', 'Filtro nuevo'],
    pasos: [
      'Calienta el motor 5 minutos para que el aceite fluya mejor',
      'Coloca la bandeja recolectora debajo del cárter',
      'Afloja el tapón de drenaje con la llave correspondiente',
      'Deja que drene todo el aceite viejo (5-10 min)',
      'Retira el filtro de aceite antiguo',
      'Lubrica la junta del nuevo filtro con aceite nuevo',
      'Instala el nuevo filtro apretando a mano + 1/4 de vuelta',
      'Coloca el tapón de drenaje con su arandela nueva',
      'Llena con aceite nuevo según la capacidad del manual',
      'Revisa el nivel con la bayeta y busca fugas'
    ],
    consejos: 'Nunca aprietes en exceso el filtro. Usa guantes para no quemarte. Recicla el aceite usado en un centro autorizado.',
    icono: Droplets,
    color: 'bg-amber-500'
  },
  {
    id: 'cambio-filtro-aire',
    titulo: 'Cambiar el filtro de aire del motor',
    descripcion: 'Un filtro de aire limpio mejora el rendimiento y el consumo de combustible. Aprende a cambiarlo en minutos.',
    dificultad: 'Muy fácil',
    tiempo: '5-10 min',
    herramientas: ['Destornillador plano (opcional)'],
    pasos: [
      'Abre el capó y localiza la caja del filtro de aire',
      'Suelta los seguros o tornillos que sujetan la tapa',
      'Retira el filtro viejo observando su posición',
      'Limpia el interior de la caja con un paño seco',
      'Coloca el filtro nuevo en la misma posición',
      'Asegúrate de que encaje perfectamente en su lugar',
      'Cierra la tapa y asegura los seguros o tornillos'
    ],
    consejos: 'Cambia el filtro cada 15,000-20,000 km o según las condiciones de manejo. Un filtro sucio puede aumentar el consumo hasta un 10%.',
    icono: Sparkles,
    color: 'bg-blue-500'
  },
  {
    id: 'revision-bateria',
    titulo: 'Revisar y mantener la batería',
    descripcion: 'Evita quedarte sin batería. Aprende a revisar el estado, limpiar terminales y medir voltaje.',
    dificultad: 'Fácil',
    tiempo: '15-20 min',
    herramientas: ['Multímetro', 'Agua destilada', 'Cepillo de alambre', 'Grasa vaselina'],
    pasos: [
      'Apaga todo y quita la llave del contacto',
      'Retira primero el terminal negativo (-), luego el positivo (+)',
      'Limpia los terminales con el cepillo y bicarbonato si están sulfatados',
      'Revisa el nivel de electrolito (baterías no selladas)',
      'Completa con agua destilada si es necesario',
      'Mide el voltaje con el multímetro (debe ser 12.6V o más)',
      'Aplica grasa vaselina en los terminales',
      'Conecta primero el positivo (+), luego el negativo (-)'
    ],
    consejos: 'Si la batería tiene más de 3 años, considera reemplazarla. En invierno, revisa más frecuentemente.',
    icono: Battery,
    color: 'bg-green-500'
  },
  {
    id: 'cambio-escobillas',
    titulo: 'Cambiar escobillas del limpiaparabrisas',
    descripcion: 'Visibilidad clara es seguridad. Cambia tus escobillas en segundos sin herramientas.',
    dificultad: 'Muy fácil',
    tiempo: '2-5 min',
    herramientas: ['Ninguna'],
    pasos: [
      'Levanta el brazo del limpiaparabrisas',
      'Busca el seguro o pestaña de liberación',
      'Presiona el seguro y desliza la escobilla hacia afuera',
      'Compara la nueva con la vieja para confirmar el modelo',
      'Desliza la nueva escobilla hasta escuchar un "click"',
      'Repite con el otro lado',
      'Prueba los limpiaparabrisas antes de salir'
    ],
    consejos: 'Cambia las escobillas cada 6-12 meses o cuando dejen rayas. Limpia el parabrisas regularmente para extender su vida.',
    icono: Sparkles,
    color: 'bg-cyan-500'
  },
  {
    id: 'revision-frenos',
    titulo: 'Revisar el estado de los frenos',
    descripcion: 'La seguridad primero. Aprende a inspeccionar pastillas, discos y nivel de líquido de frenos.',
    dificultad: 'Medio',
    tiempo: '20-30 min',
    herramientas: ['Gata', 'Llave de cruz', 'Linterna', 'Regla o calibre'],
    pasos: [
      'Asegura el vehículo con freno de mano y calzos',
      'Afloja las tuercas, levanta con la gata y retira la rueda',
      'Observa el espesor de las pastillas a través de la mordaza',
      'Mide el espesor: si es menor a 3mm, debes cambiarlos',
      'Revisa el disco: busca surcos profundos o grietas',
      'Verifica el nivel de líquido de frenos en el depósito',
      'Repite en las 4 ruedas',
      'Monta las ruedas y aprieta en cruz'
    ],
    consejos: 'Si escuchas chirridos o sientes vibraciones al frenar, revisa inmediatamente. El líquido de frenos debe cambiarse cada 2 años.',
    icono: Disc,
    color: 'bg-red-500'
  },
  {
    id: 'cambio-liquido-refrigerante',
    titulo: 'Cambiar el líquido refrigerante',
    descripcion: 'Evita el sobrecalentamiento. Mantén el sistema de enfriamiento en óptimas condiciones.',
    dificultad: 'Medio',
    tiempo: '45-60 min',
    herramientas: ['Bandeja recolectora', 'Destornillador', 'Refrigerante nuevo', 'Agua destilada'],
    pasos: [
      'Espera a que el motor esté frío (MUY IMPORTANTE)',
      'Coloca la bandeja debajo del radiador',
      'Abre el tapón del radiador y el de drenaje',
      'Deja drenar completamente el líquido viejo',
      'Cierra el tapón de drenaje',
      'Llena con agua destilada hasta la mitad',
      'Enciende el motor 10 minutos con calefacción al máximo',
      'Apaga, deja enfriar y drena nuevamente',
      'Llena con la mezcla recomendada (generalmente 50/50)',
      'Enciende y revisa que no haya fugas'
    ],
    consejos: 'Nunca abras el radiador con el motor caliente. El líquido puede salir expulsado y causar quemaduras graves.',
    icono: Thermometer,
    color: 'bg-orange-500'
  },
  {
    id: 'revision-neumaticos',
    titulo: 'Revisar y mantener neumáticos',
    descripcion: 'Los neumáticos son tu único contacto con la carretera. Aprende a revisar presión, desgaste y rotarlos.',
    dificultad: 'Fácil',
    tiempo: '15-20 min',
    herramientas: ['Medidor de presión', 'Manómetro', 'Moneda para test del dibujo'],
    pasos: [
      'Revisa la presión con los neumáticos fríos',
      'Compara con la presión recomendada (puerta o manual)',
      'Ajusta la presión en todas las ruedas incluyendo la de repuesto',
      'Inspecciona visualmente cortes, burbujas o clavos',
      'Usa una moneda para medir la profundidad del dibujo',
      'Si es menor a 1.6mm, debes cambiarlos',
      'Revisa el desgaste irregular (indica problemas de alineación)',
      'Rota los neumáticos cada 10,000 km para desgaste uniforme'
    ],
    consejos: 'La presión baja aumenta el consumo y el desgaste. Revisa al menos una vez al mes. No olvides la de repuesto.',
    icono: Gauge,
    color: 'bg-purple-500'
  }
];

// Preguntas frecuentes
const preguntasFrecuentes = [
  {
    categoria: 'Motor',
    preguntas: [
      {
        pregunta: '¿Cada cuánto debo cambiar el aceite del motor?',
        respuesta: 'Generalmente cada 5,000 a 10,000 km dependiendo del tipo de aceite. Los aceites sintéticos duran más (hasta 15,000 km). Consulta el manual de tu vehículo para el intervalo específico.'
      },
      {
        pregunta: '¿Qué pasa si no cambio el aceite a tiempo?',
        respuesta: 'El aceite viejo se contamina y pierde sus propiedades lubricantes, causando desgaste prematuro del motor, mayor consumo de combustible y posibles fallas graves que pueden dañar el motor permanentemente.'
      },
      {
        pregunta: '¿Por qué mi auto consume aceite?',
        respuesta: 'Es normal que un motor consuma algo de aceite (hasta 1 litro cada 1,000 km en algunos casos). Si consume más, puede indicar desgaste de aros, sellos de válvula dañados o fugas.'
      },
      {
        pregunta: '¿Qué significa la luz de Check Engine?',
        respuesta: 'Indica un problema en el sistema de emisiones o motor. Puede ser algo simple como una tapa de bencina floja o algo grave. Escanea los códigos de error para saber exactamente qué es.'
      }
    ]
  },
  {
    categoria: 'Frenos',
    preguntas: [
      {
        pregunta: '¿Cada cuánto cambiar las pastillas de freno?',
        respuesta: 'Depende del uso, pero generalmente cada 30,000 a 50,000 km. Revisa el espesor: si quedan menos de 3mm, es hora de cambiarlas.'
      },
      {
        pregunta: '¿Por qué chirrian los frenos?',
        respuesta: 'Generalmente indican que las pastillas están gastadas y tienen un indicador metálico que hace ruido. También puede ser por polvo, suciedad o discos en mal estado.'
      },
      {
        pregunta: '¿Qué es el líquido de frenos y cuándo cambiarlo?',
        respuesta: 'Es un fluido hidráulico que transmite la fuerza del pedal a los frenos. Absorbe humedad con el tiempo, reduciendo su efectividad. Cámbialo cada 2 años o 40,000 km.'
      }
    ]
  },
  {
    categoria: 'Batería',
    preguntas: [
      {
        pregunta: '¿Cuánto dura una batería de auto?',
        respuesta: 'En promedio 3 a 5 años. La vida útil depende del clima, uso y mantenimiento. En climas muy fríos o calurosos se acorta.'
      },
      {
        pregunta: '¿Cómo saber si mi batería se está muriendo?',
        respuesta: 'Señales: el motor arranca lento, las luces se ven débiles, hay sulfato (polvo blanco) en los terminales, o la batería tiene más de 3 años.'
      },
      {
        pregunta: '¿Puedo cargar la batería con el auto encendido?',
        respuesta: 'Sí, el alternador carga la batería mientras el motor funciona. Para cargarla completamente necesitas conducir al menos 30 minutos a velocidad constante.'
      }
    ]
  },
  {
    categoria: 'Neumáticos',
    preguntas: [
      {
        pregunta: '¿Cuál es la presión correcta de los neumáticos?',
        respuesta: 'Varía por vehículo. Generalmente entre 28-35 PSI. La presión correcta está en una etiqueta en el marco de la puerta del conductor o en el manual.'
      },
      {
        pregunta: '¿Cuándo debo cambiar los neumáticos?',
        respuesta: 'Cuando el dibujo llegue a 1.6mm de profundidad, tengan más de 6 años de antigüedad, o muestren grietas, burbujas o desgaste irregular.'
      },
      {
        pregunta: '¿Qué significan las letras y números en el neumático?',
        respuesta: 'Ejemplo: 205/55 R16. 205 = ancho en mm, 55 = perfil (% del ancho), R = radial, 16 = diámetro del rim en pulgadas.'
      }
    ]
  },
  {
    categoria: 'Transmisión',
    preguntas: [
      {
        pregunta: '¿Cada cuánto cambiar el aceite de la transmisión?',
        respuesta: 'Cada 60,000 a 100,000 km para automáticas, y 80,000 a 120,000 km para manuales. Consulta el manual de tu vehículo.'
      },
      {
        pregunta: '¿Por qué mi transmisión automática patina?',
        respuesta: 'Puede ser por aceite viejo o bajo, desgaste interno, o problemas con el embrague de la transmisión. Revisa el nivel de aceite primero.'
      }
    ]
  },
  {
    categoria: 'General',
    preguntas: [
      {
        pregunta: '¿Qué revisar antes de un viaje largo?',
        respuesta: 'Nivel de aceite, refrigerante, líquido de frenos, presión de neumáticos (incluyendo repuesto), luces, limpiaparabrisas y batería.'
      },
      {
        pregunta: '¿Es malo calentar mucho el motor antes de arrancar?',
        respuesta: 'En autos modernos no es necesario. Solo 30 segundos es suficiente. Lo importante es no acelerar fuerte hasta que alcance temperatura normal.'
      },
      {
        pregunta: '¿Por qué mi auto gasta más bencina de lo normal?',
        respuesta: 'Causas comunes: filtro de aire sucio, neumáticos con baja presión, bujías gastadas, inyectores sucios, o conducción agresiva.'
      }
    ]
  }
];

export function BlogPage({ onBack }: BlogPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);
  const [selectedArticulo, setSelectedArticulo] = useState<typeof articulosReparacion[0] | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedFaqs(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const filteredArticulos = articulosReparacion.filter(art => 
    art.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaqs = preguntasFrecuentes.map(cat => ({
    ...cat,
    preguntas: cat.preguntas.filter(p => 
      p.pregunta.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.respuesta.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.preguntas.length > 0);

  if (selectedArticulo) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        {/* Header */}
        <div className="bg-gradient-to-b from-red-900/20 to-[#0a0a0a]">
          <div className="container mx-auto px-4 py-8">
            <Button 
              variant="ghost" 
              className="text-gray-400 hover:text-white hover:bg-red-500/10 mb-6"
              onClick={() => setSelectedArticulo(null)}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al Blog
            </Button>

            <div className="flex items-center gap-4 mb-4">
              <div className={`${selectedArticulo.color} p-4 rounded-xl`}>
                <selectedArticulo.icono className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{selectedArticulo.titulo}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {selectedArticulo.dificultad}
                  </Badge>
                  <Badge className="bg-gray-800 text-gray-300">
                    {selectedArticulo.tiempo}
                  </Badge>
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-lg max-w-3xl">{selectedArticulo.descripcion}</p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Herramientas necesarias */}
              <Card className="bg-[#111111] border-gray-800">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-red-500" />
                    Herramientas Necesarias
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedArticulo.herramientas.map((herramienta, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-gray-800 text-gray-300 px-3 py-1">
                        {herramienta}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pasos */}
              <Card className="bg-[#111111] border-gray-800">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Play className="w-5 h-5 text-red-500" />
                    Pasos a Seguir
                  </h2>
                  <div className="space-y-4">
                    {selectedArticulo.pasos.map((paso, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {idx + 1}
                        </div>
                        <p className="text-gray-300 pt-1">{paso}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Consejos */}
              <Card className="bg-gradient-to-r from-amber-900/20 to-transparent border-amber-500/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Consejos Profesionales
                  </h2>
                  <p className="text-gray-300">{selectedArticulo.consejos}</p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-[#111111] border-gray-800">
                <CardContent className="p-6">
                  <h3 className="font-bold text-white mb-4">¿Necesitas ayuda?</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Si no te sientes seguro de hacer esta reparación, busca un taller profesional en nuestra plataforma.
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600"
                    onClick={onBack}
                  >
                    Buscar Taller
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-[#111111] border-gray-800">
                <CardContent className="p-6">
                  <h3 className="font-bold text-white mb-4">Otras Reparaciones</h3>
                  <div className="space-y-2">
                    {articulosReparacion.filter(a => a.id !== selectedArticulo.id).slice(0, 3).map(art => (
                      <button
                        key={art.id}
                        onClick={() => setSelectedArticulo(art)}
                        className="w-full text-left p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`${art.color} p-2 rounded`}>
                            <art.icono className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm text-gray-300">{art.titulo}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-red-900/20 via-[#0a0a0a] to-[#0a0a0a]">
        <div className="absolute inset-0 bg-grid opacity-30" />
        
        <div className="container mx-auto px-4 py-12 relative">
          <Button 
            variant="ghost" 
            className="text-gray-400 hover:text-white hover:bg-red-500/10 mb-6"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Button>

          <div className="text-center max-w-2xl mx-auto">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-4">
              <Wrench className="w-4 h-4 mr-2" />
              Centro de Ayuda
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Blog de <span className="text-red-500">Mecánica</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Aprende a reparar tu auto con nuestras guías paso a paso. 
              Desde lo más básico hasta reparaciones avanzadas.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Buscar guías, preguntas, consejos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 h-14 bg-[#111111] border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="guias" className="w-full">
          <TabsList className="bg-[#111111] border border-gray-800 p-1 mb-8 flex flex-wrap justify-center">
            <TabsTrigger 
              value="guias" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white"
            >
              <Wrench className="w-4 h-4 mr-2" />
              Guías de Reparación
            </TabsTrigger>
            <TabsTrigger 
              value="faq" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Preguntas Frecuentes
            </TabsTrigger>
          </TabsList>

          {/* Guías Tab */}
          <TabsContent value="guias">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticulos.map((articulo) => (
                <Card 
                  key={articulo.id}
                  className="group cursor-pointer bg-[#111111] border-gray-800 hover:border-red-500/50 transition-all duration-300 overflow-hidden"
                  onClick={() => setSelectedArticulo(articulo)}
                >
                  <div className={`h-2 ${articulo.color}`} />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${articulo.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                        <articulo.icono className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                          {articulo.dificultad}
                        </Badge>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                      {articulo.titulo}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {articulo.descripcion}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <span className="text-sm text-gray-500">
                        {articulo.tiempo}
                      </span>
                      <span className="text-red-500 text-sm font-medium group-hover:translate-x-1 transition-transform flex items-center">
                        Ver guía
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredArticulos.length === 0 && (
              <div className="text-center py-16">
                <Wrench className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No encontramos guías</h3>
                <p className="text-gray-400">Intenta con otra búsqueda</p>
              </div>
            )}
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <div className="max-w-3xl mx-auto space-y-6">
              {filteredFaqs.map((categoria) => (
                <Card key={categoria.categoria} className="bg-[#111111] border-gray-800">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-red-500" />
                      {categoria.categoria}
                    </h2>
                    <div className="space-y-3">
                      {categoria.preguntas.map((faq, idx) => {
                        const faqId = `${categoria.categoria}-${idx}`;
                        const isExpanded = expandedFaqs.includes(faqId);
                        return (
                          <div 
                            key={idx} 
                            className="border border-gray-800 rounded-lg overflow-hidden"
                          >
                            <button
                              onClick={() => toggleFaq(faqId)}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1a1a1a] transition-colors"
                            >
                              <span className="text-gray-300 font-medium pr-4">{faq.pregunta}</span>
                              {isExpanded ? 
                                <ChevronDown className="w-5 h-5 text-red-500 flex-shrink-0" /> : 
                                <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                              }
                            </button>
                            {isExpanded && (
                              <div className="px-4 pb-4">
                                <p className="text-gray-400 leading-relaxed">{faq.respuesta}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredFaqs.length === 0 && (
                <div className="text-center py-16">
                  <AlertTriangle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No encontramos preguntas</h3>
                  <p className="text-gray-400">Intenta con otra búsqueda</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
