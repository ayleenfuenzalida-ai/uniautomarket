import { useState } from 'react';
import { Send, User, Building, Phone, Mail, FileText, CheckCircle, MapPin, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface VenderProductosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VenderProductosModal({ isOpen, onClose }: VenderProductosModalProps) {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    nombreEmpresa: '',
    rut: '',
    direccion: '',
    telefono: '',
    email: '',
    descripcion: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds and close
    setTimeout(() => {
      setFormData({
        nombreCompleto: '',
        nombreEmpresa: '',
        rut: '',
        direccion: '',
        telefono: '',
        email: '',
        descripcion: ''
      });
      setIsSubmitted(false);
      onClose();
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/95 border-red-500/30 backdrop-blur-xl max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="bg-red-500/20 p-2 rounded-lg border border-red-500/30">
              <Send className="w-6 h-6 text-red-500" />
            </div>
            Vender Productos
          </DialogTitle>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-12 text-center">
            <div className="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">¡Solicitud Enviada!</h3>
            <p className="text-white/70 max-w-sm mx-auto">
              Hemos recibido tu información. Nuestro equipo se pondrá en contacto contigo pronto.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <p className="text-white/60 text-sm mb-6">
              Completa el formulario y nos contactaremos contigo para ayudarte a publicar tus productos.
            </p>

            {/* Nombre Completo */}
            <div className="space-y-2">
              <Label htmlFor="nombreCompleto" className="text-white/80 flex items-center gap-2">
                <User className="w-4 h-4 text-red-500" />
                Nombre Completo *
              </Label>
              <Input
                id="nombreCompleto"
                name="nombreCompleto"
                type="text"
                required
                value={formData.nombreCompleto}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez González"
                className="bg-black/50 border-red-500/30 text-white placeholder:text-white/30 focus:border-red-500 focus:ring-red-500/20"
              />
            </div>

            {/* Nombre de Empresa */}
            <div className="space-y-2">
              <Label htmlFor="nombreEmpresa" className="text-white/80 flex items-center gap-2">
                <Building className="w-4 h-4 text-red-500" />
                Nombre de Empresa *
              </Label>
              <Input
                id="nombreEmpresa"
                name="nombreEmpresa"
                type="text"
                required
                value={formData.nombreEmpresa}
                onChange={handleChange}
                placeholder="Ej: Repuestos Auto Chile"
                className="bg-black/50 border-red-500/30 text-white placeholder:text-white/30 focus:border-red-500 focus:ring-red-500/20"
              />
            </div>

            {/* RUT */}
            <div className="space-y-2">
              <Label htmlFor="rut" className="text-white/80 flex items-center gap-2">
                <Hash className="w-4 h-4 text-red-500" />
                RUT de Empresa *
              </Label>
              <Input
                id="rut"
                name="rut"
                type="text"
                required
                value={formData.rut}
                onChange={handleChange}
                placeholder="Ej: 76.123.456-7"
                className="bg-black/50 border-red-500/30 text-white placeholder:text-white/30 focus:border-red-500 focus:ring-red-500/20"
              />
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <Label htmlFor="direccion" className="text-white/80 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                Dirección de Empresa *
              </Label>
              <Input
                id="direccion"
                name="direccion"
                type="text"
                required
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Ej: Av. Principal 123, Santiago"
                className="bg-black/50 border-red-500/30 text-white placeholder:text-white/30 focus:border-red-500 focus:ring-red-500/20"
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-white/80 flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500" />
                Teléfono de Contacto *
              </Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                required
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej: +56 9 1234 5678"
                className="bg-black/50 border-red-500/30 text-white placeholder:text-white/30 focus:border-red-500 focus:ring-red-500/20"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80 flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500" />
                Correo Electrónico *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Ej: contacto@tuempresa.cl"
                className="bg-black/50 border-red-500/30 text-white placeholder:text-white/30 focus:border-red-500 focus:ring-red-500/20"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-white/80 flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-500" />
                Descripción de tu Negocio o Intención de Venta *
              </Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                required
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Cuéntanos qué productos o servicios ofreces, tu experiencia en el mercado, ubicación, etc."
                rows={4}
                className="bg-black/50 border-red-500/30 text-white placeholder:text-white/30 focus:border-red-500 focus:ring-red-500/20 resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-6 shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] transition-all duration-300"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Enviar Solicitud
                </span>
              )}
            </Button>

            <p className="text-white/40 text-xs text-center">
              Al enviar, aceptas que nos contactemos contigo vía email o teléfono.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
