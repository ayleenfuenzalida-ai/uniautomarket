import { useState, useEffect } from 'react';
import { Search, Menu, X, User, LogOut, Heart, Bell, BookOpen, Shield } from 'lucide-react';
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { usuario, logout, isSuperAdmin, isAdmin, getNotificacionesNoLeidas, getChatNoLeidos } = useAuth();
  const { categorias } = useData();

  // Detect scroll for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const handleLogout = () => {
    logout();
    onNavigateHome();
  };

  const unreadNotifications = usuario ? getNotificacionesNoLeidas() : 0;
  const unreadChats = usuario ? getChatNoLeidos() : 0;
  const totalUnread = unreadNotifications + unreadChats;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-red-500/20' 
          : 'bg-transparent'
      }`}>
        {/* Top bar - Neon line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
        
        {/* Main header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <button 
              onClick={onNavigateHome}
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
                <img 
                  src="/images/logo.png" 
                  alt="Universal AutoMarket" 
                  className="relative h-16 w-auto object-contain rounded-lg transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(255,0,0,0.5)]"
                />
              </div>
            </button>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-800 rounded-full opacity-30 group-hover:opacity-60 transition-opacity blur" />
                <div className="relative flex items-center">
                  <Input
                    type="text"
                    placeholder="Buscar repuestos, talleres, servicios..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full pl-5 pr-12 py-3 h-12 bg-[#111111] border border-gray-700 rounded-full text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-2 hover:bg-red-500/20 rounded-full transition-colors"
                  >
                    <Search className="w-5 h-5 text-red-500" />
                  </Button>
                </div>
              </div>
            </form>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Blog button - visible for everyone */}
              {onBlog && (
                <Button 
                  variant="ghost" 
                  className="text-gray-300 hover:text-white hover:bg-red-500/20"
                  onClick={onBlog}
                  title="Blog de Mecánica"
                >
                  <BookOpen className="w-5 h-5" />
                </Button>
              )}

              {usuario ? (
                <>
                  {/* Favoritos - solo para clientes */}
                  {usuario.tipo === 'cliente' && (
                    <Button 
                      variant="ghost" 
                      className="text-gray-300 hover:text-white hover:bg-red-500/20 relative"
                      onClick={onMiCuenta}
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                  )}
                  
                  {/* Notificaciones */}
                  <Button 
                    variant="ghost" 
                    className="text-gray-300 hover:text-white hover:bg-red-500/20 relative"
                    onClick={onMiCuenta}
                  >
                    <Bell className="w-5 h-5" />
                    {totalUnread > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold animate-pulse">
                        {totalUnread}
                      </span>
                    )}
                  </Button>

                  {/* Admin button - SOLO para superadmin/admin */}
                  {(isSuperAdmin || isAdmin) && onAdmin && (
                    <Button 
                      variant="outline"
                      className="border-amber-500/50 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500"
                      onClick={onAdmin}
                      title="Panel de Administración"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  )}

                  {/* User menu */}
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      className="border-red-500/50 text-white hover:bg-red-500/20 hover:border-red-500 flex items-center gap-2"
                      onClick={onMiCuenta}
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <span className="max-w-[100px] truncate">{usuario.nombre.split(' ')[0]}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={handleLogout}
                      className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="w-5 h-5" />
                    </Button>
                  </div>
                </>
              ) : (
                /* Solo botón de Login - NO hay registro público */
                <Button 
                  variant="outline" 
                  className="border-red-500/50 text-white hover:bg-red-500/20 hover:border-red-500"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Acceso Empresas
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="lg:hidden text-white hover:bg-red-500/20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Categories navigation */}
        <nav className="hidden lg:block border-t border-gray-800/50">
          <div className="container mx-auto px-4">
            <ul className="flex items-center gap-1 py-2">
              {categorias.map((categoria) => (
                <li key={categoria.id}>
                  <button
                    onClick={() => onNavigateHome()}
                    className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300 relative group"
                  >
                    {categoria.nombre}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-red-500 group-hover:w-3/4 transition-all duration-300" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-red-500/20">
            <div className="container mx-auto px-4 py-4">
              {usuario ? (
                <div className="flex flex-col gap-3 mb-4">
                  <div className="p-4 bg-gradient-to-r from-red-900/30 to-transparent rounded-xl border border-red-500/20">
                    <p className="font-semibold text-white">{usuario.nombre}</p>
                    <p className="text-sm text-gray-400">{usuario.email}</p>
                    {isSuperAdmin && (
                      <p className="text-xs text-amber-400 mt-1">Super Administrador</p>
                    )}
                    {isAdmin && !isSuperAdmin && (
                      <p className="text-xs text-amber-400 mt-1">Administrador</p>
                    )}
                  </div>
                  
                  {/* Admin button mobile - SOLO para admin */}
                  {(isSuperAdmin || isAdmin) && onAdmin && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-center border-amber-500/50 text-amber-400 hover:bg-amber-500/10 mb-2"
                      onClick={() => {
                        onAdmin();
                        setIsMenuOpen(false);
                      }}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Panel Admin
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-center border-red-500/50 text-white hover:bg-red-500/20"
                    onClick={() => {
                      onMiCuenta();
                      setIsMenuOpen(false);
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mi Cuenta
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-center text-red-400 border-red-500/30 hover:bg-red-500/10"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mb-4">
                  {/* Solo login - no registro */}
                  <Button 
                    variant="outline" 
                    className="w-full justify-center border-red-500/50 text-white hover:bg-red-500/20"
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Acceso Empresas
                  </Button>
                </div>
              )}

              {/* Blog button mobile */}
              {onBlog && (
                <Button 
                  variant="outline" 
                  className="w-full justify-center border-amber-500/50 text-amber-400 hover:bg-amber-500/10 mb-4"
                  onClick={() => {
                    onBlog();
                    setIsMenuOpen(false);
                  }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Blog de Mecánica
                </Button>
              )}

              <nav>
                <p className="text-xs font-semibold text-red-500 uppercase mb-2 tracking-wider">Categorías</p>
                <ul className="space-y-1">
                  {categorias.map((categoria) => (
                    <li key={categoria.id}>
                      <button
                        onClick={() => {
                          onNavigateHome();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        {categoria.nombre}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[100px] lg:h-[120px]" />

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}
