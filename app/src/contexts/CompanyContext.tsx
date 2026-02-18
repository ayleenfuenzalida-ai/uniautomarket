import React, { createContext, useContext, useState, useEffect } from 'react';
import type { EmpresaInfo, CompanyContextType } from '@/types';

const defaultEmpresaInfo: EmpresaInfo = {
  nombre: 'Universal AutoMarket',
  direccion: 'Av. Providencia 1234, Oficina 501, Providencia, Santiago',
  telefono: '+56 2 2345 6789',
  email: 'contacto@uniautomarket.cl',
  horarioAtencion: 'Lunes a Viernes: 9:00 - 18:00 hrs',
  redesSociales: {
    facebook: 'https://facebook.com/uniautomarket',
    instagram: 'https://instagram.com/uniautomarket',
    twitter: 'https://twitter.com/uniautomarket',
    youtube: 'https://youtube.com/uniautomarket'
  }
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [empresaInfo, setEmpresaInfo] = useState<EmpresaInfo>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('uniautomarket_empresa');
      if (stored) {
        try {
          return { ...defaultEmpresaInfo, ...JSON.parse(stored) };
        } catch (e) {
          console.error('Error parsing empresa info:', e);
        }
      }
    }
    return defaultEmpresaInfo;
  });

  useEffect(() => {
    localStorage.setItem('uniautomarket_empresa', JSON.stringify(empresaInfo));
  }, [empresaInfo]);

  const updateEmpresaInfo = (info: Partial<EmpresaInfo>) => {
    setEmpresaInfo(prev => ({ ...prev, ...info }));
  };

  return (
    <CompanyContext.Provider value={{ empresaInfo, updateEmpresaInfo }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) throw new Error('useCompany debe usarse dentro de CompanyProvider');
  return context;
}
