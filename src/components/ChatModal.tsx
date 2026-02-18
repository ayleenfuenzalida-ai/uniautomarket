import { useState, useEffect, useRef } from 'react';
import { X, Send, User, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import type { Negocio } from '@/types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  negocio: Negocio | null;
}

export function ChatModal({ isOpen, onClose, negocio }: ChatModalProps) {
  const { usuario, crearChat, enviarChatMensaje, getChatMensajes, marcarChatMensajesLeidos, chats } = useAuth();
  const [chatId, setChatId] = useState<string>('');
  const [mensaje, setMensaje] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Encontrar o crear chat
  useEffect(() => {
    if (!isOpen || !negocio || !usuario) return;

    const existingChat = chats.find(c => 
      c.clienteId === usuario.id && c.negocioId === negocio.id
    );

    if (existingChat) {
      setChatId(existingChat.id);
      marcarChatMensajesLeidos(existingChat.id, usuario.id);
    } else {
      const newChatId = crearChat(usuario.id, usuario.nombre, negocio.id, negocio.nombre);
      setChatId(newChatId);
    }
  }, [isOpen, negocio, usuario, chats, crearChat, marcarChatMensajesLeidos]);

  // Scroll al final de mensajes
  const chatMensajes = chatId ? getChatMensajes(chatId) : [];
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMensajes]);

  if (!isOpen || !negocio) return null;

  const handleSend = () => {
    if (!mensaje.trim() || !chatId) return;
    
    enviarChatMensaje(chatId, mensaje.trim());
    setMensaje('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Store className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{negocio.nombre}</h3>
              <p className="text-xs text-gray-700 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                En línea
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {chatMensajes.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-yellow-500" />
              </div>
              <h4 className="font-medium text-gray-900">Inicia la conversación</h4>
              <p className="text-gray-500 text-sm mt-1">
                Envía un mensaje a {negocio.nombre}
              </p>
            </div>
          ) : (
            chatMensajes.map((msg, index) => {
              const isMe = msg.remitenteId === usuario?.id;
              const showAvatar = index === 0 || chatMensajes[index - 1].remitenteId !== msg.remitenteId;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : ''}`}>
                    {showAvatar && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isMe ? 'bg-yellow-400' : 'bg-gray-300'
                      }`}>
                        {isMe ? (
                          <User className="w-4 h-4 text-gray-900" />
                        ) : (
                          <Store className="w-4 h-4 text-gray-700" />
                        )}
                      </div>
                    )}
                    {!showAvatar && <div className="w-8" />}
                    
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isMe
                          ? 'bg-yellow-400 text-gray-900 rounded-br-none'
                          : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.contenido}</p>
                      <span className={`text-xs mt-1 block ${isMe ? 'text-gray-700' : 'text-gray-400'}`}>
                        {new Date(msg.fecha).toLocaleTimeString('es-CL', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white rounded-b-2xl">
          <div className="flex gap-2">
            <Input
              placeholder="Escribe un mensaje..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleSend}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
              disabled={!mensaje.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Presiona Enter para enviar
          </p>
        </div>
      </div>
    </div>
  );
}
