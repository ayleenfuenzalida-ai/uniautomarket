import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompany } from '@/contexts/CompanyContext';
import { useData } from '@/contexts/DataContext';

interface FooterProps {
  onNavigateHome: () => void;
}

export function Footer({ onNavigateHome }: FooterProps) {
  const { companyData } = useCompany();
  const { categorias } = useData();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', url: companyData.redesSociales.facebook },
    { icon: Instagram, label: 'Instagram', url: companyData.redesSociales.instagram },
    { icon: Twitter, label: 'Twitter', url: companyData.redesSociales.twitter },
    { icon: Youtube, label: 'YouTube', url: companyData.redesSociales.youtube },
  ].filter(social => social.url);

  return (
    <footer className="relative bg-[#0a0a0a] border-t border-red-500/20">
      {/* Neon top line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
      
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-900/10 to-transparent pointer-events-none" />
      
      {/* Main footer */}
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <button 
              onClick={onNavigateHome}
              className="flex items-center gap-3 mb-6 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                <img 
                  src="/images/logo.png" 
                  alt={companyData.nombre}
                  className="relative h-14 w-auto object-contain rounded-lg"
                />
              </div>
            </button>
            <p className="text-gray-400 text-sm mb-2 font-medium">{companyData.slogan}</p>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              {companyData.descripcion}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, label, url }) => (
                  <a 
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-3 rounded-xl bg-[#111111] border border-gray-800 hover:border-red-500/50 transition-all duration-300"
                    title={label}
                  >
                    <div className="absolute inset-0 bg-red-500/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity" />
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-red-400 relative transition-colors" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Enlaces Rápidos
            </h3>
            <ul className="space-y-3">
              {['Sobre Nosotros', 'Cómo Funciona', 'Vende en Universal AutoMarket', 'Blog', 'Preguntas Frecuentes'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-red-400 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-red-500 transition-colors" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories - Dynamic from data */}
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Categorías
            </h3>
            <ul className="space-y-3">
              {categorias.slice(0, 6).map((categoria) => (
                <li key={categoria.id}>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateHome();
                    }}
                    className="text-gray-400 hover:text-red-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-red-500 transition-colors" />
                    {categoria.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - Dynamic from company data */}
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Contacto
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <MapPin className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-gray-400 text-sm">{companyData.direccion}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Phone className="w-4 h-4 text-red-500" />
                </div>
                <a 
                  href={`tel:${companyData.telefono.replace(/\s/g, '')}`}
                  className="text-gray-400 text-sm hover:text-red-400 transition-colors"
                >
                  {companyData.telefono}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Mail className="w-4 h-4 text-red-500" />
                </div>
                <a 
                  href={`mailto:${companyData.email}`}
                  className="text-gray-400 text-sm hover:text-red-400 transition-colors"
                >
                  {companyData.email}
                </a>
              </li>
              {companyData.horario && (
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <span className="w-4 h-4 text-red-500 text-xs flex items-center justify-center font-bold">H</span>
                  </div>
                  <span className="text-gray-400 text-sm">{companyData.horario}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} <span className="text-red-500">{companyData.nombre}</span>. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a href={companyData.links.terminos} className="text-sm text-gray-500 hover:text-red-400 transition-colors">Términos y Condiciones</a>
              <a href={companyData.links.privacidad} className="text-sm text-gray-500 hover:text-red-400 transition-colors">Política de Privacidad</a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <Button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-[0_0_20px_rgba(255,0,0,0.4)] hover:shadow-[0_0_30px_rgba(255,0,0,0.6)] transition-all z-40"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
    </footer>
  );
}
