import { useState } from 'react';
import { X, Send, Mail, Phone, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import type { Negocio } from '@/types';

interface MensajeModalProps {
  isOpen: boolean;
  onClose: () => void;
  negocio: Negocio | null;
}

export function MensajeModal({ isOpen, onClose, negocio }: MensajeModalProps) {
  const { usuario, enviarMensaje } = useAuth();
  const [asunto, setAsunto] = useState('');
  const [contenido, setContenido] = useState('');
  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [email, setEmail] = useState(usuario?.email || '');
  const [telefono, setTelefono] = useState(usuario?.telefono || '');
  const [enviado, setEnviado] = useState(false);

  if (!isOpen || !negocio) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    enviarMensaje({
      remitenteId: usuario?.id || `guest-${Date.now()}`,
      remitenteNombre: nombre,
      remitenteEmail: email,
      remitenteTelefono: telefono,
      destinatarioId: negocio.id,
      destinatarioNegocioId: negocio.id,
      asunto,
      contenido
    });

    setEnviado(true);
    setTimeout(() => {
      onClose();
      setEnviado(false);
      setAsunto('');
      setContenido('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-yellow-400 to-yellow-500">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Enviar Mensaje</h2>
            <p className="text-sm text-gray-700">A: {negocio.nombre}</p>
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
                <Send className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¡Mensaje Enviado!</h3>
              <p className="text-gray-600">
                El negocio recibirá tu mensaje y te contactará pronto.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Contact Info */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-gray-900 text-sm">Tus datos de contacto</h3>
                
                <div>
                  <Label htmlFor="msg-nombre" className="text-sm">Nombre</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="msg-nombre"
                      type="text"
                      placeholder="Tu nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="msg-email" className="text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="msg-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="msg-telefono" className="text-sm">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="msg-telefono"
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="msg-asunto">Asunto</Label>
                <Input
                  id="msg-asunto"
                  type="text"
                  placeholder="¿Sobre qué quieres consultar?"
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="msg-contenido">Mensaje</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Textarea
                    id="msg-contenido"
                    placeholder="Escribe tu mensaje detallado aquí..."
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    className="pl-10 min-h-[120px]"
                    required
                  />
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
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Mensaje
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
