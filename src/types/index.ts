export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  disponible: boolean;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precioDesde: number;
  imagen: string;
}

export interface Negocio {
  id: string;
  nombre: string;
  categoriaId: string;
  imagen: string;
  direccion: string;
  telefono: string;
  email: string;
  horario: string;
  descripcion: string;
  rating: number;
  whatsapp?: string;
  productos?: Producto[];
  servicios?: Servicio[];
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  icono: string;
  color: string;
  negocios: Negocio[];
}

// Tipos de usuario
export type UserRole = 'superadmin' | 'admin' | 'business' | 'client';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  tipo: 'cliente' | 'negocio';
  role: UserRole;
  fechaRegistro: string;
  favoritos: string[];
  negocioId?: string;
  categoriaId?: string;
  negocioAsignado?: string;
}

export interface Mensaje {
  id: string;
  de: string;
  deNombre: string;
  para: string;
  negocioId: string;
  asunto: string;
  contenido: string;
  fecha: string;
  leido: boolean;
  remitenteId?: string;
  remitenteNombre?: string;
  remitenteEmail?: string;
  respuesta?: string;
}

export interface Chat {
  id: string;
  de: string;
  deNombre: string;
  para: string;
  negocioId: string;
  mensaje: string;
  fecha: string;
  leido: boolean;
  clienteId?: string;
  clienteNombre?: string;
  negocioNombre?: string;
  mensajesNoLeidos?: number;
  ultimoMensaje?: string;
  fechaUltimoMensaje?: string;
}

export interface Cotizacion {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail?: string;
  clienteTelefono?: string;
  negocioId: string;
  negocioNombre?: string;
  producto: string;
  itemNombre?: string;
  descripcion: string;
  cantidad: number;
  fecha: string;
  fechaSolicitud?: string;
  estado: 'pendiente' | 'respondida' | 'aceptada' | 'rechazada';
  respuesta?: string;
  precioEstimado?: number;
  precioCotizado?: number;
  fechaEntrega?: string;
  tipo?: 'producto' | 'servicio';
}

export interface Notificacion {
  id: string;
  tipo: 'mensaje' | 'chat' | 'cotizacion' | 'resena' | 'sistema';
  titulo: string;
  mensaje: string;
  contenido?: string;
  para: string;
  usuarioId?: string;
  fecha: string;
  leida: boolean;
}

export interface Resena {
  id: string;
  negocioId: string;
  clienteId: string;
  clienteNombre: string;
  rating: number;
  calificacion?: number;
  comentario: string;
  texto?: string;
  fecha: string;
  fechaResena?: string;
  respuesta?: string;
  respuestaNegocio?: string;
}
