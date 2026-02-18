import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Usuario, Mensaje, Chat, Cotizacion, Notificacion, Resena, UserRole } from '@/types';

export type { UserRole };

interface UsuarioConRol extends Usuario {
  password: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (userData: any) => boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isBusinessOwner: boolean;
  canEditBusiness: (negocioId: string) => boolean;
  
  // Mensajes
  mensajes: Mensaje[];
  enviarMensaje: (mensaje: any) => void;
  marcarMensajeLeido: (id: string) => void;
  getMensajesPorNegocio: (negocioId: string) => Mensaje[];
  getMensajesRecibidos: (negocioId?: string) => Mensaje[];
  responderMensaje: (id: string, respuesta: string) => void;
  
  // Chat
  chats: Chat[];
  enviarChat: (chat: any) => void;
  marcarChatLeido: (id: string) => void;
  getChatNoLeidos: (_userId?: string, _tipo?: string) => number;
  getChatsPorUsuario: (_userId?: string, _tipo?: string) => Chat[];
  getChatMensajes: (chatId: string) => any[];
  enviarChatMensaje: (chatId: string, mensaje: string) => void;
  marcarChatMensajesLeidos: (chatId: string, _userId?: string) => void;
  crearChat: (data: any, extra?: any, _negocioId?: string, _negocioNombre?: string) => string;
  
  // Cotizaciones
  cotizaciones: Cotizacion[];
  crearCotizacion: (cotizacion: any) => void;
  actualizarCotizacion: (id: string, estado: Cotizacion['estado']) => void;
  getCotizacionesPorNegocio: (negocioId: string) => Cotizacion[];
  getCotizacionesPorCliente: (_clienteId?: string) => Cotizacion[];
  getCotizacionesPendientes: (negocioId?: string) => number | Cotizacion[];
  responderCotizacion: (id: string, respuesta: any, _mensaje?: string) => void;
  
  // Notificaciones
  notificaciones: Notificacion[];
  agregarNotificacion: (notificacion: any) => void;
  marcarNotificacionLeida: (id: string) => void;
  getNotificacionesNoLeidas: (_userId?: string) => number;
  getNotificacionesPorUsuario: (_userId?: string) => Notificacion[];
  eliminarNotificacion: (id: string) => void;
  
  // Reseñas
  resenas: Resena[];
  agregarResena: (resena: any) => void;
  getResenasPorNegocio: (negocioId: string) => Resena[];
  crearResena: (resena: any) => void;
  responderResena: (resenaId: string, respuesta: string) => void;
  getCalificacionPromedio: (negocioId: string) => number;
  
  // Favoritos
  favoritos: string[];
  toggleFavorito: (negocioId: string) => void;
  isFavorito: (negocioId: string) => boolean;
  agregarFavorito: (negocioId: string) => void;
  eliminarFavorito: (negocioId: string) => void;
  esFavorito: (negocioId: string) => boolean;
  
  // Gestión de usuarios (solo superadmin)
  usuarios: UsuarioConRol[];
  crearUsuario: (usuario: any) => boolean;
  eliminarUsuario: (id: string) => boolean;
  getUsuariosPorNegocio: (negocioId: string) => UsuarioConRol[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuario Super Admin (la dueña)
const SUPER_ADMIN: UsuarioConRol = {
  id: 'superadmin-1',
  nombre: 'Administradora',
  email: 'admin@uniautomarket.cl',
  telefono: '+56 2 2345 6789',
  tipo: 'cliente',
  role: 'superadmin',
  fechaRegistro: '2024-01-01',
  password: 'UniAuto2024!',
  favoritos: []
};

// Usuarios de negocios de ejemplo
const USUARIOS_NEGOCIOS: UsuarioConRol[] = [
  {
    id: 'business-1',
    nombre: 'Juan Pérez',
    email: 'juan@desarmaduriapropia.cl',
    telefono: '+56 9 1234 5678',
    tipo: 'negocio',
    role: 'business',
    negocioId: 'desarmaduria-el-pitazo',
    categoriaId: 'desarmadurias',
    fechaRegistro: '2024-01-15',
    password: 'Negocio123!',
    favoritos: []
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  // Estado del usuario
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Cargar usuario desde localStorage al iniciar (solo en cliente)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('uniautomarket_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        setUsuario(parsed);
        console.log('Usuario cargado desde localStorage:', parsed.email);
      }
    } catch (e) {
      console.error('Error cargando usuario:', e);
    }
    setIsLoaded(true);
  }, []);

  const [usuarios, setUsuarios] = useState<UsuarioConRol[]>([SUPER_ADMIN, ...USUARIOS_NEGOCIOS]);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);

  // Login con roles - VERSIÓN SIMPLIFICADA Y ROBUSTA
  const login = useCallback((email: string, password: string): boolean => {
    console.log('Intentando login con:', email);
    
    // Buscar usuario (case insensitive para email)
    const user = usuarios.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );
    
    if (user) {
      console.log('Usuario encontrado:', user.email, 'Rol:', user.role);
      
      // Crear objeto sin password
      const { password: _, ...userWithoutPassword } = user;
      
      // Actualizar estado
      setUsuario(userWithoutPassword);
      
      // Guardar en localStorage
      try {
        localStorage.setItem('uniautomarket_user', JSON.stringify(userWithoutPassword));
        console.log('Usuario guardado en localStorage');
      } catch (e) {
        console.error('Error guardando en localStorage:', e);
      }
      
      return true;
    }
    
    console.log('Login fallido - usuario no encontrado o contraseña incorrecta');
    return false;
  }, [usuarios]);

  // Register - solo superadmin puede crear usuarios
  const register = useCallback((_userData: any): boolean => {
    return false;
  }, []);

  const logout = useCallback(() => {
    setUsuario(null);
    try {
      localStorage.removeItem('uniautomarket_user');
    } catch (e) {
      console.error('Error removiendo de localStorage:', e);
    }
  }, []);

  // Verificar permisos
  const isSuperAdmin = usuario?.role === 'superadmin';
  const isAdmin = usuario?.role === 'admin' || usuario?.role === 'superadmin';
  const isBusinessOwner = usuario?.role === 'business';
  const isAuthenticated = !!usuario;

  const canEditBusiness = useCallback((negocioId: string): boolean => {
    if (isSuperAdmin) return true;
    if (isBusinessOwner) {
      const businessUser = usuarios.find(u => u.id === usuario?.id);
      return businessUser?.negocioId === negocioId;
    }
    return false;
  }, [isSuperAdmin, isBusinessOwner, usuario?.id, usuarios]);

  // Gestión de usuarios
  const crearUsuario = useCallback((nuevoUsuario: any): boolean => {
    if (!isSuperAdmin) return false;
    const existe = usuarios.find(u => u.email === nuevoUsuario.email);
    if (existe) return false;
    const usuarioCompleto: UsuarioConRol = {
      ...nuevoUsuario,
      id: `user-${Date.now()}`,
      fechaRegistro: new Date().toISOString()
    };
    setUsuarios(prev => [...prev, usuarioCompleto]);
    return true;
  }, [isSuperAdmin, usuarios]);

  const eliminarUsuario = useCallback((id: string): boolean => {
    if (!isSuperAdmin) return false;
    if (id === 'superadmin-1') return false;
    setUsuarios(prev => prev.filter(u => u.id !== id));
    return true;
  }, [isSuperAdmin]);

  const getUsuariosPorNegocio = useCallback((negocioId: string): UsuarioConRol[] => {
    return usuarios.filter(u => u.negocioId === negocioId);
  }, [usuarios]);

  // Mensajes
  const enviarMensaje = useCallback((mensaje: any) => {
    const nuevoMensaje: Mensaje = {
      ...mensaje,
      id: `msg-${Date.now()}`,
      fecha: new Date().toISOString(),
      leido: false
    };
    setMensajes(prev => [nuevoMensaje, ...prev]);
  }, []);

  const marcarMensajeLeido = useCallback((id: string) => {
    setMensajes(prev => prev.map(m => m.id === id ? { ...m, leido: true } : m));
  }, []);

  const getMensajesPorNegocio = useCallback((negocioId: string) => {
    return mensajes.filter(m => m.negocioId === negocioId);
  }, [mensajes]);

  const getMensajesRecibidos = useCallback((negocioId?: string): Mensaje[] => {
    if (!usuario) return [];
    if (negocioId) {
      return mensajes.filter(m => m.negocioId === negocioId);
    }
    return mensajes.filter(m => m.para === usuario.id);
  }, [mensajes, usuario]);

  const responderMensaje = useCallback((id: string, _respuesta: string) => {
    setMensajes(prev => prev.map(m => m.id === id ? { ...m, respuesta: _respuesta } : m));
  }, []);

  // Chat
  const enviarChat = useCallback((chat: any) => {
    const nuevoChat: Chat = {
      ...chat,
      id: `chat-${Date.now()}`,
      fecha: new Date().toISOString(),
      leido: false
    };
    setChats(prev => [nuevoChat, ...prev]);
  }, []);

  const marcarChatLeido = useCallback((id: string) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, leido: true } : c));
  }, []);

  const getChatNoLeidos = useCallback((_userId?: string, _tipo?: string) => {
    if (!usuario) return 0;
    return chats.filter(c => c.para === usuario.id && !c.leido).length;
  }, [chats, usuario]);

  const getChatsPorUsuario = useCallback((_userId?: string, _tipo?: string): Chat[] => {
    if (!usuario) return [];
    return chats.filter(c => c.de === usuario.id || c.para === usuario.id);
  }, [chats, usuario]);

  const getChatMensajes = useCallback((chatId: string): any[] => {
    return chats.filter(c => c.id === chatId).map(c => ({
      id: c.id,
      de: c.de,
      deNombre: c.deNombre,
      mensaje: c.mensaje,
      fecha: c.fecha,
      leido: c.leido
    }));
  }, [chats]);

  const enviarChatMensaje = useCallback((chatId: string, mensaje: string) => {
    if (!usuario) return;
    const nuevoChat: Chat = {
      id: `chat-${Date.now()}`,
      de: usuario.id,
      deNombre: usuario.nombre,
      para: chatId,
      negocioId: '',
      mensaje,
      fecha: new Date().toISOString(),
      leido: false
    };
    setChats(prev => [nuevoChat, ...prev]);
  }, [usuario]);

  const marcarChatMensajesLeidos = useCallback((chatId: string, _userId?: string) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, leido: true } : c));
  }, []);

  const crearChat = useCallback((data: any, _extra?: any, _negocioId?: string, _negocioNombre?: string): string => {
    const id = `chat-${Date.now()}`;
    // If called with 4 params (from ChatModal), construct the chat object
    if (typeof data === 'string' && _extra && _negocioId && _negocioNombre) {
      const nuevoChat: Chat = {
        id,
        clienteId: data,
        clienteNombre: _extra,
        negocioId: _negocioId,
        negocioNombre: _negocioNombre,
        de: data,
        deNombre: _extra,
        para: _negocioId,
        mensaje: '',
        fecha: new Date().toISOString(),
        leido: false
      };
      setChats(prev => [nuevoChat, ...prev]);
      return id;
    }
    // Original behavior with object
    const nuevoChat: Chat = {
      ...data,
      id,
      fecha: new Date().toISOString(),
      leido: false
    };
    setChats(prev => [nuevoChat, ...prev]);
    return id;
  }, []);

  // Cotizaciones
  const crearCotizacion = useCallback((cotizacion: any) => {
    const nuevaCotizacion: Cotizacion = {
      ...cotizacion,
      id: `cot-${Date.now()}`,
      fecha: new Date().toISOString(),
      estado: 'pendiente'
    };
    setCotizaciones(prev => [nuevaCotizacion, ...prev]);
  }, []);

  const actualizarCotizacion = useCallback((id: string, estado: Cotizacion['estado']) => {
    setCotizaciones(prev => prev.map(c => c.id === id ? { ...c, estado } : c));
  }, []);

  const getCotizacionesPorNegocio = useCallback((negocioId: string) => {
    return cotizaciones.filter(c => c.negocioId === negocioId);
  }, [cotizaciones]);

  const getCotizacionesPorCliente = useCallback((_clienteId?: string): Cotizacion[] => {
    if (!usuario) return [];
    return cotizaciones.filter(c => c.clienteId === usuario.id);
  }, [cotizaciones, usuario]);

  const getCotizacionesPendientes = useCallback((negocioId?: string): Cotizacion[] | number => {
    if (!usuario) return negocioId ? 0 : [];
    if (negocioId) {
      return cotizaciones.filter(c => c.negocioId === negocioId && c.estado === 'pendiente').length;
    }
    return cotizaciones.filter(c => c.clienteId === usuario.id && c.estado === 'pendiente');
  }, [cotizaciones, usuario]);

  const responderCotizacion = useCallback((id: string, respuesta: any, _mensaje?: string) => {
    // If called with 3 params (from MiCuentaPage), respuesta is precio (number)
    if (typeof respuesta === 'number' && _mensaje) {
      setCotizaciones(prev => prev.map(c => c.id === id ? { 
        ...c, 
        estado: 'respondida',
        precioCotizado: respuesta,
        respuesta: _mensaje
      } : c));
    } else {
      // Original behavior with object
      setCotizaciones(prev => prev.map(c => c.id === id ? { ...c, ...respuesta } : c));
    }
  }, []);

  // Notificaciones
  const agregarNotificacion = useCallback((notificacion: any) => {
    const nuevaNotificacion: Notificacion = {
      ...notificacion,
      id: `notif-${Date.now()}`,
      fecha: new Date().toISOString(),
      leida: false
    };
    setNotificaciones(prev => [nuevaNotificacion, ...prev]);
  }, []);

  const marcarNotificacionLeida = useCallback((id: string) => {
    setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
  }, []);

  const getNotificacionesNoLeidas = useCallback((_userId?: string) => {
    if (!usuario) return 0;
    return notificaciones.filter(n => n.para === usuario.id && !n.leida).length;
  }, [notificaciones, usuario]);

  const getNotificacionesPorUsuario = useCallback((_userId?: string): Notificacion[] => {
    if (!usuario) return [];
    return notificaciones.filter(n => n.para === usuario.id);
  }, [notificaciones, usuario]);

  const eliminarNotificacion = useCallback((id: string) => {
    setNotificaciones(prev => prev.filter(n => n.id !== id));
  }, []);

  // Reseñas
  const agregarResena = useCallback((resena: any) => {
    const nuevaResena: Resena = {
      ...resena,
      id: `res-${Date.now()}`,
      fecha: new Date().toISOString()
    };
    setResenas(prev => [nuevaResena, ...prev]);
  }, []);

  const getResenasPorNegocio = useCallback((negocioId: string) => {
    return resenas.filter(r => r.negocioId === negocioId);
  }, [resenas]);

  const crearResena = useCallback((resena: any) => {
    agregarResena(resena);
  }, [agregarResena]);

  const responderResena = useCallback((resenaId: string, respuesta: string) => {
    setResenas(prev => prev.map(r => r.id === resenaId ? { ...r, respuesta } : r));
  }, []);

  const getCalificacionPromedio = useCallback((negocioId: string, _extra?: any): number => {
    const resenasNegocio = resenas.filter(r => r.negocioId === negocioId);
    if (resenasNegocio.length === 0) return 0;
    const promedio = resenasNegocio.reduce((acc, r) => acc + r.rating, 0) / resenasNegocio.length;
    return Math.round(promedio * 10) / 10;
  }, [resenas]);

  // Favoritos
  const toggleFavorito = useCallback((negocioId: string) => {
    if (!usuario) return;
    setFavoritos(prev => {
      if (prev.includes(negocioId)) {
        return prev.filter(id => id !== negocioId);
      }
      return [...prev, negocioId];
    });
  }, [usuario]);

  const isFavorito = useCallback((negocioId: string) => {
    return favoritos.includes(negocioId);
  }, [favoritos]);

  const agregarFavorito = useCallback((negocioId: string) => {
    if (!favoritos.includes(negocioId)) {
      setFavoritos(prev => [...prev, negocioId]);
    }
  }, [favoritos]);

  const eliminarFavorito = useCallback((negocioId: string) => {
    setFavoritos(prev => prev.filter(id => id !== negocioId));
  }, []);

  const esFavorito = isFavorito;

  // No renderizar hasta que se cargue el usuario de localStorage
  if (!isLoaded) {
    return null;
  }

  return (
    <AuthContext.Provider value={{
      usuario,
      login,
      logout,
      register,
      isAuthenticated,
      isSuperAdmin,
      isAdmin,
      isBusinessOwner,
      canEditBusiness,
      mensajes,
      enviarMensaje,
      marcarMensajeLeido,
      getMensajesPorNegocio,
      getMensajesRecibidos,
      responderMensaje,
      chats,
      enviarChat,
      marcarChatLeido,
      getChatNoLeidos,
      getChatsPorUsuario,
      getChatMensajes,
      enviarChatMensaje,
      marcarChatMensajesLeidos,
      crearChat,
      cotizaciones,
      crearCotizacion,
      actualizarCotizacion,
      getCotizacionesPorNegocio,
      getCotizacionesPorCliente,
      getCotizacionesPendientes,
      responderCotizacion,
      notificaciones,
      agregarNotificacion,
      marcarNotificacionLeida,
      getNotificacionesNoLeidas,
      getNotificacionesPorUsuario,
      eliminarNotificacion,
      resenas,
      agregarResena,
      getResenasPorNegocio,
      crearResena,
      responderResena,
      getCalificacionPromedio,
      favoritos,
      toggleFavorito,
      isFavorito,
      agregarFavorito,
      eliminarFavorito,
      esFavorito,
      usuarios,
      crearUsuario,
      eliminarUsuario,
      getUsuariosPorNegocio
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
