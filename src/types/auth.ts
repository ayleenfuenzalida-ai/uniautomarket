export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  tipo: 'cliente' | 'negocio';
  negocioId?: string;
  fechaRegistro: string;
  favoritos?: string[];
}

export interface Mensaje {
  id: string;
  remitenteId: string;
  remitenteNombre: string;
  remitenteEmail: string;
  remitenteTelefono: string;
  destinatarioId: string;
  destinatarioNegocioId: string;
  asunto: string;
  contenido: string;
  fecha: string;
  leido: boolean;
  respuesta?: string;
}

export interface ChatMensaje {
  id: string;
  chatId: string;
  remitenteId: string;
  remitenteNombre: string;
  remitenteTipo: 'cliente' | 'negocio';
  contenido: string;
  fecha: string;
  leido: boolean;
}

export interface Chat {
  id: string;
  clienteId: string;
  clienteNombre: string;
  negocioId: string;
  negocioNombre: string;
  ultimoMensaje: string;
  fechaUltimoMensaje: string;
  mensajesNoLeidos: number;
}

export interface Cotizacion {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  negocioId: string;
  negocioNombre: string;
  tipo: 'producto' | 'servicio';
  itemId: string;
  itemNombre: string;
  cantidad: number;
  descripcion: string;
  fechaSolicitud: string;
  estado: 'pendiente' | 'respondida' | 'aceptada' | 'rechazada';
  precioCotizado?: number;
  respuesta?: string;
  fechaRespuesta?: string;
}

export interface Notificacion {
  id: string;
  usuarioId: string;
  tipo: 'mensaje' | 'chat' | 'cotizacion' | 'sistema';
  titulo: string;
  contenido: string;
  fecha: string;
  leida: boolean;
  link?: string;
  data?: Record<string, string>;
}

export interface Resena {
  id: string;
  negocioId: string;
  clienteId: string;
  clienteNombre: string;
  calificacion: number;
  comentario: string;
  fecha: string;
  respuestaNegocio?: string;
  fechaRespuesta?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  tipo: 'cliente' | 'negocio';
  negocioId?: string;
}
