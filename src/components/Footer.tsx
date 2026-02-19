import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { useCompany } from '@/contexts/CompanyContext';

interface FooterProps {
  onNavigateHome: () => void;
}

export function Footer({ onNavigateHome }: FooterProps) {
  const { empresaInfo } = useCompany();

  return (
    <footer className="bg-black border-t-2 border-red-600 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-red-600/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-black border-2 border-red-600 flex items-center justify-center">
                <span className="text-red-600 font-black text-2xl">U</span>
              </div>
              <div>
                <span className="block text-white font-black text-lg tracking-tight">UNIAUTO</span>
                <span className="block text-red-600 font-bold text-xs tracking-widest">MARKET</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              El marketplace #1 de repuestos y servicios automotrices en Chile. 
              Conectamos dueños de vehículos con los mejores proveedores.
            </p>
            <div className="flex gap-3">
              <a 
                href={empresaInfo.redesSociales.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 hover:border-red-600 hover:text-red-600 transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href={empresaInfo.redesSociales.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 hover:border-red-600 hover:text-red-600 transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href={empresaInfo.redesSociales.twitter} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 hover:border-red-600 hover:text-red-600 transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-black text-sm tracking-widest mb-6 uppercase">
              <span className="text-red-600">//</span> Contacto
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-gray-500 text-sm">
                <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{empresaInfo.direccion}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-sm">
                <Phone className="w-5 h-5 text-red-600" />
                <span>{empresaInfo.telefono}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-sm">
                <Mail className="w-5 h-5 text-red-600" />
                <span>{empresaInfo.email}</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white font-black text-sm tracking-widest mb-6 uppercase">
              <span className="text-red-600">//</span> Horario
            </h4>
            <p className="text-gray-500 text-sm leading-relaxed">{empresaInfo.horarioAtencion}</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-black text-sm tracking-widest mb-6 uppercase">
              <span className="text-red-600">//</span> Enlaces
            </h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={onNavigateHome} 
                  className="text-gray-500 hover:text-red-600 text-sm transition-colors uppercase tracking-wide"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button className="text-gray-500 hover:text-red-600 text-sm transition-colors uppercase tracking-wide">
                  Términos y condiciones
                </button>
              </li>
              <li>
                <button className="text-gray-500 hover:text-red-600 text-sm transition-colors uppercase tracking-wide">
                  Política de privacidad
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-900 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © 2024 <span className="text-red-600 font-bold">{empresaInfo.nombre}</span>. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="text-gray-600 text-xs uppercase tracking-widest">Sistema operativo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
