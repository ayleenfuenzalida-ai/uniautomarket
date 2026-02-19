import { ArrowLeft, User, Heart, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

interface MiCuentaPageProps {
  onBack: () => void;
}

export function MiCuentaPage({ onBack }: MiCuentaPageProps) {
  const { usuario, logout, getNotificacionesNoLeidas } = useAuth();

  if (!usuario) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Debes iniciar sesión</p>
          <Button onClick={onBack}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    onBack();
  };

  const notificacionesNoLeidas = getNotificacionesNoLeidas();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="bg-[#111111] border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={onBack} className="mb-4 text-gray-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />Volver
          </Button>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{usuario.nombre}</h1>
              <p className="text-gray-400">{usuario.email}</p>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                usuario.tipo === 'superadmin' ? 'bg-amber-500/20 text-amber-400' :
                usuario.tipo === 'admin' ? 'bg-blue-500/20 text-blue-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {usuario.tipo === 'superadmin' ? 'Super Admin' : usuario.tipo === 'admin' ? 'Admin' : 'Cliente'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="perfil">
          <TabsList className="bg-[#111111] border border-gray-800 mb-6">
            <TabsTrigger value="perfil" className="flex items-center gap-2"><User className="w-4 h-4" />Perfil</TabsTrigger>
            <TabsTrigger value="favoritos" className="flex items-center gap-2"><Heart className="w-4 h-4" />Favoritos</TabsTrigger>
            <TabsTrigger value="notificaciones" className="flex items-center gap-2"><Bell className="w-4 h-4" />Notificaciones {notificacionesNoLeidas > 0 && <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{notificacionesNoLeidas}</span>}</TabsTrigger>
          </TabsList>

          <TabsContent value="perfil">
            <div className="bg-[#111111] rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">Información personal</h3>
              <div className="space-y-4">
                <div><label className="text-sm text-gray-500">Nombre</label><p className="text-white">{usuario.nombre}</p></div>
                <div><label className="text-sm text-gray-500">Email</label><p className="text-white">{usuario.email}</p></div>
                <div><label className="text-sm text-gray-500">Tipo</label><p className="text-white capitalize">{usuario.tipo}</p></div>
              </div>
              <div className="pt-6 border-t border-gray-800 mt-6">
                <Button onClick={handleLogout} variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/20">
                  <LogOut className="w-4 h-4 mr-2" />Cerrar sesión
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="favoritos">
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No tienes favoritos guardados</p>
            </div>
          </TabsContent>

          <TabsContent value="notificaciones">
            <div className="text-center py-16">
              <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No tienes notificaciones</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
