import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { CategoriaPage } from '@/pages/CategoriaPage';
import { NegocioPage } from '@/pages/NegocioPage';
import { SearchResults } from '@/pages/SearchResults';
import { MiCuentaPage } from '@/pages/MiCuentaPage';
import { AdminPage } from '@/pages/AdminPage';
import { BlogPage } from '@/pages/BlogPage';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { CompanyProvider } from '@/contexts/CompanyContext';
import { NotificationToast } from '@/components/NotificationToast';
import { CarBackgroundScroll } from '@/components/CarBackgroundScroll';

export type Page = 'home' | 'categoria' | 'negocio' | 'search' | 'micuenta' | 'admin' | 'blog';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string>('');
  const [selectedNegocioId, setSelectedNegocioId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const navigateToHome = () => {
    setCurrentPage('home');
    setSelectedCategoriaId('');
    setSelectedNegocioId('');
    window.scrollTo(0, 0);
  };

  const navigateToCategoria = (categoriaId: string) => {
    setSelectedCategoriaId(categoriaId);
    setCurrentPage('categoria');
    window.scrollTo(0, 0);
  };

  const navigateToNegocio = (negocioId: string) => {
    setSelectedNegocioId(negocioId);
    setCurrentPage('negocio');
    window.scrollTo(0, 0);
  };

  const navigateToSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('search');
    window.scrollTo(0, 0);
  };

  const navigateToMiCuenta = () => {
    setCurrentPage('micuenta');
    window.scrollTo(0, 0);
  };

  const navigateToAdmin = () => {
    setCurrentPage('admin');
    window.scrollTo(0, 0);
  };

  const navigateToBlog = () => {
    setCurrentPage('blog');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Car background animation - only on home page */}
      {currentPage === 'home' && <CarBackgroundScroll />}
      
      <Header 
        onNavigateHome={navigateToHome}
        onSearch={navigateToSearch}
        onMiCuenta={navigateToMiCuenta}
        onAdmin={navigateToAdmin}
        onBlog={navigateToBlog}
      />
      
      <main className="flex-1 relative z-10">
        {currentPage === 'home' && (
          <HomePage 
            onCategoriaClick={navigateToCategoria}
            onNegocioClick={navigateToNegocio}
          />
        )}
        
        {currentPage === 'categoria' && (
          <CategoriaPage 
            categoriaId={selectedCategoriaId}
            onNegocioClick={navigateToNegocio}
            onBack={navigateToHome}
          />
        )}
        
        {currentPage === 'negocio' && (
          <NegocioPage 
            negocioId={selectedNegocioId}
            onBack={() => selectedCategoriaId ? navigateToCategoria(selectedCategoriaId) : navigateToHome()}
          />
        )}

        {currentPage === 'search' && (
          <SearchResults 
            query={searchQuery}
            onNegocioClick={navigateToNegocio}
            onCategoriaClick={navigateToCategoria}
          />
        )}

        {currentPage === 'micuenta' && (
          <MiCuentaPage 
            onBack={navigateToHome}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPage 
            onBack={navigateToHome}
          />
        )}

        {currentPage === 'blog' && (
          <BlogPage 
            onBack={navigateToHome}
          />
        )}
      </main>
      
      <Footer onNavigateHome={navigateToHome} />
      
      {/* Notificaciones Toast */}
      <NotificationToast />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <CompanyProvider>
          <AppContent />
        </CompanyProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
