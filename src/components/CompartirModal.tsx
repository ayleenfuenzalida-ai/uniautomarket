import { X, Link, Facebook, Twitter, MessageCircle, Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { Negocio } from '@/types';

interface CompartirModalProps {
  isOpen: boolean;
  onClose: () => void;
  negocio: Negocio | null;
}

export function CompartirModal({ isOpen, onClose, negocio }: CompartirModalProps) {
  const [copiado, setCopiado] = useState(false);

  if (!isOpen || !negocio) return null;

  const url = typeof window !== 'undefined' 
    ? `${window.location.origin}/negocio/${negocio.id}`
    : '';
  const texto = `Mira ${negocio.nombre} en Universal AutoMarket`;

  const handleCopiar = async () => {
    await navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(texto + ' ' + url)}`,
    email: `mailto:?subject=${encodeURIComponent(texto)}&body=${encodeURIComponent(url)}`
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Compartir</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 text-center mb-6">
            Comparte <span className="font-semibold text-gray-900">{negocio.nombre}</span> con tus contactos
          </p>

          {/* Redes sociales */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => window.open(shareLinks.facebook, '_blank')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Facebook className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-gray-600">Facebook</span>
            </button>

            <button
              onClick={() => window.open(shareLinks.twitter, '_blank')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-sky-50 transition-colors"
            >
              <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center">
                <Twitter className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-gray-600">Twitter</span>
            </button>

            <button
              onClick={() => window.open(shareLinks.whatsapp, '_blank')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-green-50 transition-colors"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-gray-600">WhatsApp</span>
            </button>

            <button
              onClick={() => window.open(shareLinks.email, '_blank')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-gray-600">Email</span>
            </button>
          </div>

          {/* Copiar link */}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">O copia el enlace</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-600 truncate">
                {url}
              </div>
              <Button
                onClick={handleCopiar}
                variant="outline"
                className={copiado ? 'bg-green-100 border-green-300' : ''}
              >
                {copiado ? (
                  <>
                    <Check className="w-4 h-4 mr-1 text-green-600" />
                    <span className="text-green-600">Copiado</span>
                  </>
                ) : (
                  <>
                    <Link className="w-4 h-4 mr-1" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
