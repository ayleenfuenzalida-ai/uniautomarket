// Tipos de usuario
export type UserRole = 'superadmin' | 'admin' | 'business' | 'client';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  tipo: UserRole;
  negocioId?: string;
  fechaRegistro: string;
  favoritos?: string[];
}

export interface Horario {
  dia: string;
  abierto: boolean;
  apertura: string;
  cierre: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string; // Imagen principal
  imagenes: string[]; // Galería de hasta 5 imágenes
  stock: number;
  sku: string;
  categoria: string;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precioDesde: number;
  duracion: string;
  imagen: string;
}

export interface Resena {
  id: string;
  autor: string;
  calificacion: number;
  comentario: string;
  fecha: string;
  avatar?: string;
}

export interface MensajeChat {
  id: string;
  autorId: string;
  autorNombre: string;
  mensaje: string;
  fecha: string;
  leido: boolean;
}

export interface Chat {
  id: string;
  negocioId: string;
  clienteId: string;
  clienteNombre: string;
  mensajes: MensajeChat[];
  ultimaActualizacion: string;
}

export interface Notificacion {
  id: string;
  usuarioId: string;
  tipo: 'chat' | 'sistema' | 'promocion';
  titulo: string;
  mensaje: string;
  fecha: string;
  leido: boolean;
  datos?: Record<string, unknown>;
}

export interface Negocio {
  id: string;
  nombre: string;
  descripcion: string;
  categoriaId: string;
  subcategoria?: string;
  direccion: string;
  comuna: string;
  region: string;
  telefono: string;
  whatsapp?: string;
  email: string;
  sitioWeb?: string;
  rut: string;
  horarios: Horario[];
  imagen: string;
  galeria: string[];
  productos: Producto[];
  servicios: Servicio[];
  resenas: Resena[];
  latitud?: number;
  longitud?: number;
  fechaRegistro: string;
  destacado: boolean;
  verificado: boolean;
  estado: 'activo' | 'inactivo' | 'pendiente';
  visitas: number;
  chats: Chat[];
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  imagen: string;
  color: string;
  negocios: Negocio[];
  destacada: boolean;
  orden: number;
}

export interface EmpresaInfo {
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  horarioAtencion: string;
  redesSociales: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

export interface DataContextType {
  categorias: Categoria[];
  loading: boolean;
  error: string | null;
  addCategoria: (categoria: Omit<Categoria, 'id' | 'negocios'>) => Promise<void>;
  updateCategoria: (id: string, data: Partial<Categoria>) => Promise<void>;
  deleteCategoria: (id: string) => Promise<void>;
  addNegocio: (categoriaId: string, negocio: Omit<Negocio, 'id' | 'fechaRegistro' | 'visitas' | 'chats'>) => Promise<void>;
  updateNegocio: (categoriaId: string, negocioId: string, data: Partial<Negocio>) => Promise<void>;
  deleteNegocio: (categoriaId: string, negocioId: string) => Promise<void>;
  getNegocioById: (negocioId: string) => Negocio | undefined;
  getCategoriaByNegocioId: (negocioId: string) => Categoria | undefined;
  incrementarVisitas: (negocioId: string) => Promise<void>;
  addProducto: (categoriaId: string, negocioId: string, producto: Omit<Producto, 'id'>) => Promise<void>;
  updateProducto: (categoriaId: string, negocioId: string, productoId: string, data: Partial<Producto>) => Promise<void>;
  deleteProducto: (categoriaId: string, negocioId: string, productoId: string) => Promise<void>;
  addServicio: (categoriaId: string, negocioId: string, servicio: Omit<Servicio, 'id'>) => Promise<void>;
  updateServicio: (categoriaId: string, negocioId: string, servicioId: string, data: Partial<Servicio>) => Promise<void>;
  deleteServicio: (categoriaId: string, negocioId: string, servicioId: string) => Promise<void>;
  addResena: (categoriaId: string, negocioId: string, resena: Omit<Resena, 'id'>) => Promise<void>;
  addChat: (categoriaId: string, negocioId: string, chat: Omit<Chat, 'id' | 'ultimaActualizacion'>) => Promise<void>;
  addMensajeToChat: (categoriaId: string, negocioId: string, chatId: string, mensaje: Omit<MensajeChat, 'id'>) => Promise<void>;
  marcarMensajesLeidos: (categoriaId: string, negocioId: string, chatId: string, usuarioId: string) => Promise<void>;
  searchNegocios: (query: string) => Array<{ negocio: Negocio; categoria: Categoria }>;
  searchProductos: (query: string) => Array<{ producto: Producto; negocio: Negocio; categoria: Categoria }>;
}

export interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isBusinessOwner: boolean;
  canEditBusiness: (businessId: string) => boolean;
  getBusinessIdForUser: () => string | undefined;
  usuarios: Usuario[];
  createUser: (userData: Omit<Usuario, 'id' | 'fechaRegistro'>) => Promise<void>;
  updateUser: (id: string, data: Partial<Usuario>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  notificaciones: Notificacion[];
  getNotificacionesNoLeidas: () => number;
  marcarNotificacionLeida: (id: string) => void;
  addNotificacion: (notificacion: Omit<Notificacion, 'id' | 'fecha'>) => void;
  getChatNoLeidos: () => number;
}

export interface CompanyContextType {
  empresaInfo: EmpresaInfo;
  updateEmpresaInfo: (info: Partial<EmpresaInfo>) => void;
}

// Tipos para el Blog/Preguntas
export interface Respuesta {
  id: string;
  preguntaId: string;
  autor: string;
  autorId: string;
  contenido: string;
  fecha: string;
  esNegocio: boolean;
  negocioId?: string;
}

export interface Pregunta {
  id: string;
  titulo: string;
  contenido: string;
  autor: string;
  autorId: string;
  fecha: string;
  categoria: string;
  respuestas: Respuesta[];
  vistas: number;
  resuelta: boolean;
}

export interface BlogContextType {
  preguntas: Pregunta[];
  addPregunta: (pregunta: Omit<Pregunta, 'id' | 'fecha' | 'respuestas' | 'vistas' | 'resuelta'>) => Promise<void>;
  addRespuesta: (preguntaId: string, respuesta: Omit<Respuesta, 'id' | 'fecha' | 'preguntaId'>) => Promise<void>;
  marcarResuelta: (preguntaId: string) => Promise<void>;
  incrementarVistasPregunta: (preguntaId: string) => Promise<void>;
  getPreguntasByCategoria: (categoria: string) => Pregunta[];
  getPreguntaById: (id: string) => Pregunta | undefined;
}
