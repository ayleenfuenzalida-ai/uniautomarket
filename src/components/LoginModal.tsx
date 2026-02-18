import { useState } from 'react';
import { X, User, Lock, Shield, AlertCircle, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Lista de usuarios para recuperación (esto debe coincidir con AuthContext)
const USUARIOS_SISTEMA = [
  { email: 'admin@uniautomarket.cl', password: 'UniAuto2024!', nombre: 'Administradora' },
  { email: 'juan@desarmaduriapropia.cl', password: 'Negocio123!', nombre: 'Juan Pérez' },
];

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = login(email, password);
    
    if (success) {
      setEmail('');
      setPassword('');
      onClose();
    } else {
      setError('Email o contraseña incorrectos');
    }
    
    setIsLoading(false);
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');
    
    // Buscar el usuario
    const usuario = USUARIOS_SISTEMA.find(u => 
      u.email.toLowerCase() === recoveryEmail.toLowerCase()
    );
    
    if (!usuario) {
      setRecoveryError('No se encontró una cuenta con ese email');
      return;
    }
    
    // Enviar correo con la contraseña usando formsubmit
    const form = document.createElement('form');
    form.action = 'https://formsubmit.co/admin@uniautomarket.cl';
    form.method = 'POST';
    form.style.display = 'none';
    
    const fields = [
      { name: '_subject', value: `Recuperación de contraseña - ${usuario.nombre}` },
      { name: 'Para', value: usuario.email },
      { name: 'Mensaje', value: `Hola ${usuario.nombre},\n\nTu contraseña es: ${usuario.password}\n\nPor seguridad, te recomendamos cambiarla después de iniciar sesión.` },
      { name: '_template', value: 'table' },
      { name: '_captcha', value: 'false' },
    ];
    
    fields.forEach(field => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = field.name;
      input.value = field.value;
      form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    
    setRecoverySent(true);
  };

  const resetRecovery = () => {
    setShowRecovery(false);
    setRecoverySent(false);
    setRecoveryEmail('');
    setRecoveryError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#111111] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-900/30 to-transparent p-6 border-b border-gray-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {showRecovery && (
            <button
              onClick={resetRecovery}
              className="absolute top-4 left-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/30">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {showRecovery ? 'Recuperar Contraseña' : 'Acceso Empresas'}
              </h2>
              <p className="text-gray-400 text-sm">
                {showRecovery 
                  ? 'Te enviaremos tu contraseña por correo' 
                  : 'Ingreso exclusivo para empresas registradas'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {showRecovery ? (
            // Formulario de recuperación
            recoverySent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">¡Correo enviado!</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Hemos enviado tu contraseña a:<br />
                  <strong className="text-white">{recoveryEmail}</strong>
                </p>
                <p className="text-gray-500 text-xs mb-6">
                  Revisa tu bandeja de entrada (y spam).<br />
                  El correo llegará en unos minutos.
                </p>
                <Button
                  onClick={resetRecovery}
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Volver al login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleRecovery} className="space-y-4">
                {recoveryError && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm">{recoveryError}</p>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="recoveryEmail" className="text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-red-500" />
                    Email de tu cuenta
                  </Label>
                  <Input
                    id="recoveryEmail"
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="tu@empresa.cl"
                    className="mt-2 bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600 focus:border-red-500 focus:ring-red-500/30"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-6 shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] transition-all"
                >
                  Enviar contraseña
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  Te enviaremos un correo con tu contraseña actual.
                </p>
              </form>
            )
          ) : (
            // Formulario de login
            <>
              {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                    <User className="w-4 h-4 text-red-500" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@empresa.cl"
                    className="mt-2 bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600 focus:border-red-500 focus:ring-red-500/30"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-red-500" />
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-2 bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600 focus:border-red-500 focus:ring-red-500/30"
                    required
                  />
                </div>

                {/* Olvidé mi contraseña */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowRecovery(true)}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-6 shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Ingresando...' : 'Ingresar'}
                </Button>
              </form>

              {/* Info */}
              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <p className="text-amber-400 text-sm text-center">
                  <strong>¿No tienes acceso?</strong><br />
                  Contacta a administración para solicitar una cuenta
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
