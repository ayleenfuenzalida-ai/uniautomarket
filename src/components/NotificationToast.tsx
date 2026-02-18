import { useEffect, useState } from 'react';
import { X, MessageSquare, ShoppingCart, Bell, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { Notificacion } from '@/types';

interface Toast {
  id: string;
  notificacion: Notificacion;
}

export function NotificationToast() {
  const { usuario, notificaciones, marcarNotificacionLeida } = useAuth();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [prevNotificacionesCount, setPrevNotificacionesCount] = useState(0);

  // Detectar nuevas notificaciones
  useEffect(() => {
    if (!usuario) return;

    const userNotificaciones = notificaciones.filter(n => n.para === usuario.id);
    const noLeidas = userNotificaciones.filter(n => !n.leida);

    if (noLeidas.length > prevNotificacionesCount && prevNotificacionesCount > 0) {
      // Hay nuevas notificaciones
      const nuevasNotificaciones = noLeidas.slice(0, noLeidas.length - prevNotificacionesCount);
      
      nuevasNotificaciones.forEach(not => {
        const toastId = `toast-${Date.now()}-${Math.random()}`;
        setToasts(prev => [...prev, { id: toastId, notificacion: not }]);

        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== toastId));
        }, 5000);
      });
    }

    setPrevNotificacionesCount(noLeidas.length);
  }, [notificaciones, usuario, prevNotificacionesCount]);

  const removeToast = (toastId: string, notificacionId: string) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
    marcarNotificacionLeida(notificacionId);
  };

  const getIcon = (tipo: Notificacion['tipo']) => {
    switch (tipo) {
      case 'mensaje':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'chat':
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'cotizacion':
        return <ShoppingCart className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBgColor = (tipo: Notificacion['tipo']) => {
    switch (tipo) {
      case 'mensaje':
        return 'bg-blue-900/30 border-blue-500/30';
      case 'chat':
        return 'bg-green-900/30 border-green-500/30';
      case 'cotizacion':
        return 'bg-yellow-900/30 border-yellow-500/30';
      default:
        return 'bg-gray-800 border-gray-700';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`w-80 p-4 rounded-lg shadow-lg border-2 animate-in slide-in-from-right ${getBgColor(toast.notificacion.tipo)}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(toast.notificacion.tipo)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white text-sm">
                {toast.notificacion.titulo}
              </h4>
              <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                {toast.notificacion.mensaje}
              </p>
              <span className="text-xs text-gray-500 mt-2 block">
                {new Date(toast.notificacion.fecha).toLocaleTimeString('es-CL', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id, toast.notificacion.id)}
              className="flex-shrink-0 p-1 hover:bg-black/5 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
