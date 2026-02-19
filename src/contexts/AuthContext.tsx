import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Usuario, Notificacion } from '@/types';
import {
  fetchUsuariosFromFirebase,
  saveUsuarioToFirebase,
  updateUsuarioInFirebase,
  deleteUsuarioFromFirebase,
  subscribeToUsuarios
} from '@/utils/firebase';
import type { AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPER_ADMIN: Usuario = {
  id: 'superadmin-1',
  nombre: 'Super Administrador',
  email: 'admin@uniautomarket.cl',
  tipo: 'superadmin',
  fechaRegistro: '2024-01-01T00:00:00.000Z',
  favoritos: []
};

const ADMIN_USER: Usuario = {
  id: 'admin-1',
  nombre: 'Administrador',
  email: 'soporte@uniautomarket.cl',
  tipo: 'admin',
  fechaRegistro: '2024-01-01T00:00:00.000Z',
  favoritos: []
};

const USER_PASSWORDS: Record<string, string> = {
  'admin@uniautomarket.cl': 'UniAuto2024!',
  'soporte@uniautomarket.cl': 'Admin2024!'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([SUPER_ADMIN, ADMIN_USER]);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('uniautomarket_user');
    if (storedUser) {
      try {
        setUsuario(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('uniautomarket_user');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        const firebaseUsers = await fetchUsuariosFromFirebase();
        if (firebaseUsers.length > 0) {
          const combinedUsers = [SUPER_ADMIN, ADMIN_USER, ...firebaseUsers.filter(u => 
            u.email !== SUPER_ADMIN.email && u.email !== ADMIN_USER.email
          )];
          setUsuarios(combinedUsers);
        }
        setInitialized(true);
      } catch (err) {
        setInitialized(true);
      }
    };
    loadUsuarios();
  }, []);

  useEffect(() => {
    if (!initialized) return;
    const unsubscribe = subscribeToUsuarios((updatedUsers) => {
      const firebaseUsers = updatedUsers.filter(u => 
        u.email !== SUPER_ADMIN.email && u.email !== ADMIN_USER.email
      );
      setUsuarios([SUPER_ADMIN, ADMIN_USER, ...firebaseUsers]);
    });
    return () => unsubscribe();
  }, [initialized]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (USER_PASSWORDS[email] === password) {
      if (email === SUPER_ADMIN.email) {
        setUsuario(SUPER_ADMIN);
        localStorage.setItem('uniautomarket_user', JSON.stringify(SUPER_ADMIN));
        return true;
      }
      if (email === ADMIN_USER.email) {
        setUsuario(ADMIN_USER);
        localStorage.setItem('uniautomarket_user', JSON.stringify(ADMIN_USER));
        return true;
      }
    }
    
    const user = usuarios.find(u => u.email === email);
    if (user) {
      setUsuario(user);
      localStorage.setItem('uniautomarket_user', JSON.stringify(user));
      return true;
    }
    
    return false;
  }, [usuarios]);

  const logout = useCallback(() => {
    setUsuario(null);
    localStorage.removeItem('uniautomarket_user');
  }, []);

  const isSuperAdmin = usuario?.tipo === 'superadmin';
  const isAdmin = usuario?.tipo === 'admin' || usuario?.tipo === 'superadmin';
  const isBusinessOwner = usuario?.tipo === 'business';

  const canEditBusiness = useCallback((businessId: string): boolean => {
    if (isSuperAdmin || isAdmin) return true;
    if (isBusinessOwner && usuario?.negocioId === businessId) return true;
    return false;
  }, [isSuperAdmin, isAdmin, isBusinessOwner, usuario]);

  const getBusinessIdForUser = useCallback((): string | undefined => {
    if (usuario?.tipo === 'business') return usuario.negocioId;
    return undefined;
  }, [usuario]);

  const createUser = useCallback(async (userData: Omit<Usuario, 'id' | 'fechaRegistro'>) => {
    if (!isSuperAdmin) throw new Error('No tienes permisos');
    
    const newUser: Usuario = {
      ...userData,
      id: `user-${Date.now()}`,
      fechaRegistro: new Date().toISOString()
    };
    
    await saveUsuarioToFirebase(newUser);
    setUsuarios(prev => [...prev, newUser]);
  }, [isSuperAdmin]);

  const updateUser = useCallback(async (id: string, data: Partial<Usuario>) => {
    if (!isSuperAdmin) throw new Error('No tienes permisos');
    if (id === SUPER_ADMIN.id || id === ADMIN_USER.id) throw new Error('No se pueden modificar usuarios predefinidos');
    
    await updateUsuarioInFirebase(id, data);
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
  }, [isSuperAdmin]);

  const deleteUser = useCallback(async (id: string) => {
    if (!isSuperAdmin) throw new Error('No tienes permisos');
    if (id === SUPER_ADMIN.id || id === ADMIN_USER.id) throw new Error('No se pueden eliminar usuarios predefinidos');
    
    await deleteUsuarioFromFirebase(id);
    setUsuarios(prev => prev.filter(u => u.id !== id));
  }, [isSuperAdmin]);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    const user = usuarios.find(u => u.email === email);
    if (user) {
      console.log(`Enviando correo de recuperación a: ${email}`);
      return true;
    }
    return false;
  }, [usuarios]);

  const getNotificacionesNoLeidas = useCallback((): number => {
    if (!usuario) return 0;
    return notificaciones.filter(n => n.usuarioId === usuario.id && !n.leido).length;
  }, [notificaciones, usuario]);

  const marcarNotificacionLeida = useCallback((id: string) => {
    setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leido: true } : n));
  }, []);

  const addNotificacion = useCallback((notificacion: Omit<Notificacion, 'id' | 'fecha'>) => {
    const nuevaNotificacion: Notificacion = {
      ...notificacion,
      id: `notif-${Date.now()}`,
      fecha: new Date().toISOString()
    };
    setNotificaciones(prev => [nuevaNotificacion, ...prev]);
  }, []);

  const getChatNoLeidos = useCallback((): number => {
    return 0;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      usuario, login, logout,
      isSuperAdmin, isAdmin, isBusinessOwner, canEditBusiness, getBusinessIdForUser,
      usuarios, createUser, updateUser, deleteUser, resetPassword,
      notificaciones, getNotificacionesNoLeidas, marcarNotificacionLeida, addNotificacion,
      getChatNoLeidos
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
