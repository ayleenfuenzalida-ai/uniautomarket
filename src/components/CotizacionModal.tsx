import { useState } from 'react';
import { X, Package, Wrench, ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import type { Negocio, Producto, Servicio } from '@/types';

interface CotizacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  negocio: Negocio | null;
  item?: Producto | Servicio | null;
  tipo?: 'producto' | 'servicio';
}

export function CotizacionModal({ isOpen, onClose, negocio, item, tipo }: CotizacionModalProps) {
  const { usuario, crearCotizacion } = useAuth();
  const [cantidad, setCantidad] = useState(1);
  const [descripcion, setDescripcion] = useState('');
  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [email, setEmail] = useState(usuario?.email || '');
  const [telefono, setTelefono] = useState(usuario?.telefono || '');
  const [enviado, setEnviado] = useState(false);

  if (!isOpen || !negocio) return null;

  const itemType = tipo || (item && 'precio' in item ? 'producto' : 'servicio');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!item) return;

    crearCotizacion({
      clienteId: usuario?.id || `guest-${Date.now()}`,
      clienteNombre: nombre,
      clienteEmail: email,
      clienteTelefono: telefono,
      negocioId: negocio.id,
      negocioNombre: negocio.nombre,
      tipo: itemType as 'producto' | 'servicio',
      itemId: item.id,
      itemNombre: item.nombre,
      cantidad,
      descripcion
    });

    setEnviado(true);
    setTimeout(() => {
      onClose();
      setEnviado(false);
      setCantidad(1);
      setDescripcion('');
    }, 2000);
  };

  const adjustCantidad = (delta: number) => {
    setCantidad(prev => Math.max(1, prev + delta));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-yellow-400 to-yellow-500">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg">
              {itemType === 'producto' ? (
                <Package className="w-5 h-5 text-gray-700" />
              ) : (
                <Wrench className="w-5 h-5 text-gray-700" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Solicitar Cotización</h2>
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

        {/* Content */}
        <div className="p-6">
          {enviado ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¡Cotización Enviada!</h3>
              <p className="text-gray-600">
                El negocio te responderá pronto con el precio.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Item Info */}
              {item && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg">
                      {itemType === 'producto' ? (
                        <Package className="w-6 h-6 text-yellow-500" />
                      ) : (
                        <Wrench className="w-6 h-6 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.nombre}</h4>
                      <p className="text-sm text-gray-500 line-clamp-1">{item.descripcion}</p>
                    </div>
                    <Badge variant="secondary">
                      {itemType === 'producto' ? 'Producto' : 'Servicio'}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Cantidad */}
              <div>
                <Label>Cantidad</Label>
                <div className="flex items-center gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => adjustCantidad(-1)}
                    className="w-10 h-10 border-2 border-gray-200 rounded-lg flex items-center justify-center hover:border-yellow-400 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{cantidad}</span>
                  <button
                    type="button"
                    onClick={() => adjustCantidad(1)}
                    className="w-10 h-10 border-2 border-gray-200 rounded-lg flex items-center justify-center hover:border-yellow-400 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <Label htmlFor="cot-descripcion">Detalles adicionales</Label>
                <Textarea
                  id="cot-descripcion"
                  placeholder="Describe tus necesidades específicas..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Contact Info */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Tus datos de contacto</h4>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="cot-nombre">Nombre</Label>
                    <Input
                      id="cot-nombre"
                      placeholder="Tu nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="cot-email">Email</Label>
                      <Input
                        id="cot-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cot-telefono">Teléfono</Label>
                      <Input
                        id="cot-telefono"
                        type="tel"
                        placeholder="+56 9 1234 5678"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Solicitar Cotización
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
