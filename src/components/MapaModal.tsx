import { X, MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Negocio } from '@/types';

interface MapaModalProps {
  isOpen: boolean;
  onClose: () => void;
  negocio: Negocio | null;
}

export function MapaModal({ isOpen, onClose, negocio }: MapaModalProps) {
  if (!isOpen || !negocio) return null;

  // Simulación de coordenadas (en producción vendrían del backend)
  const coordenadas = {
    lat: -33.4489,
    lng: -70.6693
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(negocio.direccion)}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-400 to-yellow-500">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Ubicación</h2>
              <p className="text-sm text-gray-700">{negocio.nombre}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mapa simulado */}
        <div className="relative h-80 bg-gray-100">
          {/* Placeholder del mapa */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-gray-900" />
              </div>
              <p className="text-gray-600 font-medium">{negocio.direccion}</p>
              <p className="text-sm text-gray-400 mt-1">
                {coordenadas.lat.toFixed(4)}, {coordenadas.lng.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Marcadores decorativos */}
          <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-400 rounded-full opacity-50" />
          <div className="absolute top-8 right-8 w-2 h-2 bg-gray-400 rounded-full opacity-30" />
          <div className="absolute bottom-12 left-12 w-2 h-2 bg-gray-400 rounded-full opacity-30" />
        </div>

        {/* Acciones */}
        <div className="p-4 border-t">
          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900"
              onClick={() => window.open(googleMapsUrl, '_blank')}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Cómo llegar
            </Button>
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => {
                navigator.clipboard.writeText(negocio.direccion);
              }}
            >
              Copiar dirección
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
