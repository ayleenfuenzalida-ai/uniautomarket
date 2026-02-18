import { createContext, useContext, useState, type ReactNode } from 'react';

export interface CompanyData {
  nombre: string;
  slogan: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  email: string;
  horario: string;
  redesSociales: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    whatsapp: string;
  };
  links: {
    terminos: string;
    privacidad: string;
    ayuda: string;
  };
}

const defaultCompanyData: CompanyData = {
  nombre: 'Universal AutoMarket',
  slogan: 'El marketplace automotriz #1 de Chile',
  descripcion: 'Conectamos dueños de vehículos con los mejores proveedores de repuestos, talleres, herramientas y servicios automotrices.',
  direccion: 'Av. Las Condes 1234, Oficina 501, Las Condes, Santiago, Chile',
  telefono: '+56 2 2345 6789',
  email: 'contacto@universalautomarket.com',
  horario: 'Lunes a Viernes: 9:00 - 18:00 hrs',
  redesSociales: {
    facebook: 'https://facebook.com/universalautomarket',
    instagram: 'https://instagram.com/universalautomarket',
    twitter: 'https://twitter.com/universalauto',
    youtube: 'https://youtube.com/universalautomarket',
    whatsapp: 'https://wa.me/56912345678'
  },
  links: {
    terminos: '/terminos',
    privacidad: '/privacidad',
    ayuda: '/ayuda'
  }
};

interface CompanyContextType {
  companyData: CompanyData;
  updateCompanyData: (data: Partial<CompanyData>) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companyData, setCompanyData] = useState<CompanyData>(defaultCompanyData);

  const updateCompanyData = (data: Partial<CompanyData>) => {
    setCompanyData(prev => ({ ...prev, ...data }));
  };

  return (
    <CompanyContext.Provider value={{ companyData, updateCompanyData }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}
