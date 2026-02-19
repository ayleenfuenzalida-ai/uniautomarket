import { useState, useEffect } from 'react';
import { Search, Menu, X, User, LogOut, Shield, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { LoginModal } from './LoginModal';

interface HeaderProps {
  onNavigateHome: () => void;
  onSearch: (query: string) => void;
  onMiCuenta: () => void;
  onAdmin?: () => void;
  onBlog?: () => void;
}

export function Header({ onNavigateHome, onSearch, onMiCuenta, onAdmin, onBlog }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { usuario, logout, isSuperAdmin, isAdmin } = useAuth();
  const { categorias } = useData();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) onSearch(searchValue.trim());
  };

  const handleLogout = () => {
    logout();
    onNavigateHome();
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-black/95 backdrop-blur-xl border-b-2 border-red-600' 
            : 'bg-transparent'
        }`}
      >
        {/* Top accent line */}
        <div className="h-[3px] bg-red-600" />
        
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <button onClick={onNavigateHome} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-red-600 blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-12 h-12 bg-black border-2 border-red-600 flex items-center justify-center">
                  <span className="text-red-600 font-black text-2xl">U</span>
                </div>
              </div>
              <div className="hidden md:block">
                <span className="block text-white font-black text-xl tracking-tight">UNIAUTO</span>
                <span className="block text-red-600 font-bold text-xs tracking-widest">MARKET</span>
              </div>
            </button>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl">
              <div className="relative group">
                <div className="absolute -inset-[2px] bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center">
                  <Input 
                    type="text" 
                    placeholder="Buscar repuestos, talleres..." 
                    value={searchValue} 
                    onChange={(e) => setSearchValue(e.target.value)} 
                    className="w-full pl-5 pr-12 py-3 h-12 bg-black border-2 border-gray-800 text-white placeholder:text-gray-600 focus:border-red-600 rounded-none" 
                  />
                  <Button 
                    type="submit" 
                    variant="ghost" 
                    className="absolute right-0 top-0 h-full px-4 bg-red-600 hover:bg-red-700 rounded-none"
                  >
                    <Search className="w-5 h-5 text-white" />
                  </Button>
                </div>
              </div>
            </form>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {onBlog && (
                <Button 
                  variant="ghost" 
                  className="text-gray-400 hover:text-red-600 hover:bg-red-600/10 font-bold tracking-wide"
                  onClick={onBlog}
                >
                  <BookOpen className="w-5 h-5 mr-2" /> BLOG
                </Button>
              )}
              
              {usuario ? (
                <>
                  {(isSuperAdmin || isAdmin) && onAdmin && (
                    <Button 
                      variant="outline" 
                      className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold rounded-none"
                      onClick={onAdmin}
                    >
                      <Shield className="w-4 h-4 mr-2" /> ADMIN
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="border-gray-700 text-white hover:border-red-600 hover:text-red-600 font-bold rounded-none"
                    onClick={onMiCuenta}
                  >
                    <User className="w-4 h-4 mr-2" /> {usuario.nombre.split(' ')[0].toUpperCase()}
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout} 
                    className="text-gray-500 hover:text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold rounded-none"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  <User className="w-4 h-4 mr-2" /> ACCEDER
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              className="lg:hidden text-white hover:text-red-600 hover:bg-red-600/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Category Nav */}
        <nav className="hidden lg:block border-t border-gray-900">
          <div className="container mx-auto px-4">
            <ul className="flex items-center gap-1 py-2 overflow-x-auto">
              {categorias.map((categoria) => (
                <li key={categoria.id}>
                  <button 
                    onClick={() => onNavigateHome()} 
                    className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-600/10 transition-all whitespace-nowrap uppercase tracking-wide"
                  >
                    {categoria.nombre}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black border-t-2 border-red-600">
            <div className="container mx-auto px-4 py-4">
              {usuario ? (
                <div className="flex flex-col gap-3 mb-4">
                  <div className="p-4 bg-red-600/10 border border-red-600/30">
                    <p className="font-black text-white">{usuario.nombre.toUpperCase()}</p>
                    <p className="text-sm text-gray-500">{usuario.email}</p>
                  </div>
                  {(isSuperAdmin || isAdmin) && onAdmin && (
                    <Button 
                      variant="outline" 
                      className="border-red-600 text-red-600 rounded-none"
                      onClick={() => { onAdmin(); setIsMenuOpen(false); }}
                    >
                      <Shield className="w-4 h-4 mr-2" /> ADMIN
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="border-gray-700 text-white rounded-none"
                    onClick={() => { onMiCuenta(); setIsMenuOpen(false); }}
                  >
                    <User className="w-4 h-4 mr-2" /> MI CUENTA
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-red-600 text-red-600 rounded-none"
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  >
                    <LogOut className="w-4 h-4 mr-2" /> CERRAR SESIÓN
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full border-red-600 text-red-600 mb-4 rounded-none"
                  onClick={() => { setIsLoginModalOpen(true); setIsMenuOpen(false); }}
                >
                  <User className="w-4 h-4 mr-2" /> ACCEDER
                </Button>
              )}
              {onBlog && (
                <Button 
                  variant="outline" 
                  className="w-full border-gray-700 text-gray-400 mb-4 rounded-none"
                  onClick={() => { onBlog(); setIsMenuOpen(false); }}
                >
                  <BookOpen className="w-4 h-4 mr-2" /> BLOG
                </Button>
              )}
            </div>
          </div>
        )}
      </header>
      
      {/* Spacer */}
      <div className="h-[80px] lg:h-[100px]" />
      
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
