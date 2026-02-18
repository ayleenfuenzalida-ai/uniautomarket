import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useCompany } from '@/contexts/CompanyContext';
import { useAuth, type UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  ChevronDown, 
  ChevronRight,
  Package,
  Wrench,
  Settings,
  Truck,
  Paintbrush,
  Star,
  Cpu,
  Code,
  Zap,
  Building2,
  Save,
  Users,
  Shield,
  UserPlus,
  AlertTriangle,
  MessageCircle,
  Phone
} from 'lucide-react';
import { ImageUpload } from '@/components/ImageUpload';
import { downloadDataFile } from '@/utils/dataExport';
import type { Categoria, Negocio, Producto, Servicio } from '@/types';

const iconOptions = [
  { value: 'Wrench', label: 'Herramienta', icon: Wrench },
  { value: 'Settings', label: 'Configuración', icon: Settings },
  { value: 'Package', label: 'Paquete', icon: Package },
  { value: 'Truck', label: 'Camión', icon: Truck },
  { value: 'Paintbrush', label: 'Pincel', icon: Paintbrush },
  { value: 'Cpu', label: 'Scanner', icon: Cpu },
  { value: 'Zap', label: 'Electrónica', icon: Zap },
  { value: 'Code', label: 'Código', icon: Code },
];

const colorOptions = [
  { value: 'bg-amber-600', label: 'Ámbar', class: 'bg-amber-600' },
  { value: 'bg-blue-600', label: 'Azul', class: 'bg-blue-600' },
  { value: 'bg-emerald-600', label: 'Esmeralda', class: 'bg-emerald-600' },
  { value: 'bg-purple-600', label: 'Púrpura', class: 'bg-purple-600' },
  { value: 'bg-red-600', label: 'Rojo', class: 'bg-red-600' },
  { value: 'bg-cyan-600', label: 'Cyan', class: 'bg-cyan-600' },
  { value: 'bg-orange-600', label: 'Naranja', class: 'bg-orange-600' },
  { value: 'bg-indigo-600', label: 'Índigo', class: 'bg-indigo-600' },
  { value: 'bg-violet-600', label: 'Violeta', class: 'bg-violet-600' },
  { value: 'bg-fuchsia-600', label: 'Fucsia', class: 'bg-fuchsia-600' },
  { value: 'bg-pink-600', label: 'Rosa', class: 'bg-pink-600' },
];

interface AdminPageProps {
  onBack: () => void;
}

// Componente para acceso denegado
function AccessDenied({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <Card className="bg-[#111111] border-red-500/30 max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Acceso Denegado</h1>
          <p className="text-gray-400 mb-6">
            No tienes permisos para acceder al panel de administración.
          </p>
          <Button 
            onClick={onBack}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600"
          >
            Volver al Inicio
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminPage({ onBack }: AdminPageProps) {
  const { 
    usuario, 
    isSuperAdmin, 
    isAdmin, 
    isBusinessOwner,
    usuarios: todosLosUsuarios,
    crearUsuario,
    eliminarUsuario
  } = useAuth();
  const { 
    categorias, 
    updateCategoria, 
    deleteCategoria, 
    addCategoria,
    updateNegocio,
    deleteNegocio,
    addNegocio,
    updateProducto,
    deleteProducto,
    addProducto,
    updateServicio,
    deleteServicio,
    addServicio
  } = useData();

  const [expandedCategorias, setExpandedCategorias] = useState<string[]>([]);
  const [expandedNegocios, setExpandedNegocios] = useState<string[]>([]);

  const toggleCategoria = (id: string) => {
    setExpandedCategorias(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleNegocio = (id: string) => {
    setExpandedNegocios(prev => 
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    );
  };

  // Verificar acceso - solo admin, superadmin o business owners
  if (!usuario || (!isSuperAdmin && !isAdmin && !isBusinessOwner)) {
    return <AccessDenied onBack={onBack} />;
  }

  const generateId = (prefix: string) => `${prefix}-${Date.now()}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
            <p className="text-gray-400">Gestiona categorías, negocios, productos y servicios</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="border-gray-700 text-white hover:bg-gray-800">
              <X className="w-4 h-4 mr-2" />
              Cerrar
            </Button>
          </div>
        </div>

        {/* Info del usuario */}
        <Card className="bg-[#111111] border-gray-800 mb-6">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-white font-medium">{usuario.nombre}</p>
                <p className="text-gray-400 text-sm">
                  {isSuperAdmin && 'Super Administrador'}
                  {isAdmin && !isSuperAdmin && 'Administrador'}
                  {isBusinessOwner && 'Dueño de Negocio'}
                </p>
              </div>
            </div>
            {isBusinessOwner && (
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                Solo tu negocio
              </Badge>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue={isBusinessOwner ? "negocios" : "categorias"} className="w-full">
          <TabsList className="bg-[#111111] border border-gray-800 mb-6 flex flex-wrap">
            {/* Categorías - solo para superadmin/admin */}
            {(isSuperAdmin || isAdmin) && (
              <TabsTrigger value="categorias" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                Categorías
              </TabsTrigger>
            )}
            
            <TabsTrigger value="negocios" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Negocios
            </TabsTrigger>
            
            <TabsTrigger value="productos" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Productos
            </TabsTrigger>
            
            <TabsTrigger value="servicios" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Servicios
            </TabsTrigger>
            
            {/* Chat - para todos los usuarios autenticados */}
            <TabsTrigger value="chat" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            
            {/* Empresa - solo para superadmin */}
            {isSuperAdmin && (
              <TabsTrigger value="empresa" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Building2 className="w-4 h-4 mr-2" />
                Empresa
              </TabsTrigger>
            )}
            
            {/* Usuarios - solo para superadmin */}
            {isSuperAdmin && (
              <TabsTrigger value="usuarios" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                Usuarios
              </TabsTrigger>
            )}
          </TabsList>

          {/* CATEGORIAS TAB */}
          <TabsContent value="categorias">
            <Card className="bg-[#111111] border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Categorías</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Categoría
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#1a1a1a] border-gray-700 text-white max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Crear Nueva Categoría</DialogTitle>
                    </DialogHeader>
                    <CategoriaForm 
                      onSave={async (categoria) => await addCategoria({ ...categoria, id: generateId('cat'), negocios: [] })} 
                    />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categorias.map(categoria => (
                    <Card key={categoria.id} className="bg-[#1a1a1a] border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`${categoria.color} p-3 rounded-lg`}>
                              {iconOptions.find(i => i.value === categoria.icono)?.icon && 
                                (() => {
                                  const Icon = iconOptions.find(i => i.value === categoria.icono)!.icon;
                                  return <Icon className="w-5 h-5 text-white" />;
                                })()
                              }
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{categoria.nombre}</h3>
                              <p className="text-sm text-gray-400">{categoria.negocios.length} negocios</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700">
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-[#1a1a1a] border-gray-700 text-white max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Editar Categoría</DialogTitle>
                                </DialogHeader>
                                <CategoriaForm 
                                  categoria={categoria}
                                  onSave={async (c) => await updateCategoria(c)} 
                                />
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                              onClick={async () => await deleteCategoria(categoria.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NEGOCIOS TAB */}
          <TabsContent value="negocios">
            <Card className="bg-[#111111] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Negocios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categorias.map(categoria => (
                    <div key={categoria.id} className="border border-gray-800 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleCategoria(categoria.id)}
                        className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-[#222222] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`${categoria.color} p-2 rounded`}>
                            {iconOptions.find(i => i.value === categoria.icono)?.icon && 
                              (() => {
                                const Icon = iconOptions.find(i => i.value === categoria.icono)!.icon;
                                return <Icon className="w-4 h-4 text-white" />;
                              })()
                            }
                          </div>
                          <span className="font-medium text-white">{categoria.nombre}</span>
                          <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                            {categoria.negocios.length} negocios
                          </Badge>
                        </div>
                        {expandedCategorias.includes(categoria.id) ? 
                          <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        }
                      </button>
                      
                      {expandedCategorias.includes(categoria.id) && (
                        <div className="p-4 bg-[#0a0a0a] space-y-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar Negocio
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#1a1a1a] border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Nuevo Negocio - {categoria.nombre}</DialogTitle>
                              </DialogHeader>
                              <NegocioForm 
                                onSave={async (negocio) => {
                                  await addNegocio(categoria.id, { 
                                    ...negocio, 
                                    id: generateId('neg'), 
                                    categoriaId: categoria.id,
                                    productos: [],
                                    servicios: []
                                  });
                                }} 
                              />
                            </DialogContent>
                          </Dialog>

                          {categoria.negocios.map(negocio => (
                            <Card key={negocio.id} className="bg-[#1a1a1a] border-gray-700">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium text-white">{negocio.nombre}</h4>
                                      <div className="flex items-center text-yellow-500">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="text-xs ml-1">{negocio.rating}</span>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1">{negocio.direccion}</p>
                                    <p className="text-sm text-gray-500">{negocio.telefono}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700">
                                          <Edit2 className="w-4 h-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="bg-[#1a1a1a] border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                          <DialogTitle>Editar Negocio</DialogTitle>
                                        </DialogHeader>
                                        <NegocioForm 
                                          negocio={negocio}
                                          onSave={async (n) => await updateNegocio(categoria.id, n)} 
                                        />
                                      </DialogContent>
                                    </Dialog>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                                      onClick={async () => await deleteNegocio(categoria.id, negocio.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PRODUCTOS TAB */}
          <TabsContent value="productos">
            <Card className="bg-[#111111] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Productos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categorias.map(categoria => (
                    <div key={categoria.id} className="border border-gray-800 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleCategoria(categoria.id)}
                        className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-[#222222] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`${categoria.color} p-2 rounded`}>
                            {iconOptions.find(i => i.value === categoria.icono)?.icon && 
                              (() => {
                                const Icon = iconOptions.find(i => i.value === categoria.icono)!.icon;
                                return <Icon className="w-4 h-4 text-white" />;
                              })()
                            }
                          </div>
                          <span className="font-medium text-white">{categoria.nombre}</span>
                        </div>
                        {expandedCategorias.includes(categoria.id) ? 
                          <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        }
                      </button>
                      
                      {expandedCategorias.includes(categoria.id) && (
                        <div className="p-4 bg-[#0a0a0a] space-y-3">
                          {categoria.negocios.map(negocio => (
                            <div key={negocio.id} className="border border-gray-800 rounded-lg overflow-hidden">
                              <button
                                onClick={() => toggleNegocio(negocio.id)}
                                className="w-full flex items-center justify-between p-3 bg-[#151515] hover:bg-[#1a1a1a] transition-colors"
                              >
                                <span className="text-sm font-medium text-gray-300">{negocio.nombre}</span>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="bg-gray-800 text-gray-400">
                                    {negocio.productos?.length || 0} productos
                                  </Badge>
                                  {expandedNegocios.includes(negocio.id) ? 
                                    <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                  }
                                </div>
                              </button>

                              {expandedNegocios.includes(negocio.id) && (
                                <div className="p-3 space-y-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                                        <Plus className="w-3 h-3 mr-2" />
                                        Agregar Producto
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-[#1a1a1a] border-gray-700 text-white max-w-lg">
                                      <DialogHeader>
                                        <DialogTitle>Nuevo Producto - {negocio.nombre}</DialogTitle>
                                      </DialogHeader>
                                      <ProductoForm 
                                        onSave={async (producto) => {
                                          await addProducto(categoria.id, negocio.id, { 
                                            ...producto, 
                                            id: generateId('prod')
                                          });
                                        }} 
                                      />
                                    </DialogContent>
                                  </Dialog>

                                  {negocio.productos?.map(producto => (
                                    <div key={producto.id} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded border border-gray-800">
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-white font-medium">{producto.nombre}</span>
                                          {producto.disponible ? (
                                            <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">Disponible</Badge>
                                          ) : (
                                            <Badge className="bg-red-600/20 text-red-400 border-red-600/30 text-xs">Agotado</Badge>
                                          )}
                                        </div>
                                        <p className="text-sm text-gray-400">${producto.precio.toLocaleString()}</p>
                                      </div>
                                      <div className="flex gap-1">
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                                              <Edit2 className="w-3 h-3" />
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent className="bg-[#1a1a1a] border-gray-700 text-white max-w-lg">
                                            <DialogHeader>
                                              <DialogTitle>Editar Producto</DialogTitle>
                                            </DialogHeader>
                                            <ProductoForm 
                                              producto={producto}
                                              onSave={async (p) => await updateProducto(categoria.id, negocio.id, p)} 
                                            />
                                          </DialogContent>
                                        </Dialog>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8 text-gray-400 hover:text-red-500"
                                          onClick={async () => await deleteProducto(categoria.id, negocio.id, producto.id)}
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SERVICIOS TAB */}
          <TabsContent value="servicios">
            <Card className="bg-[#111111] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Servicios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categorias.map(categoria => (
                    <div key={categoria.id} className="border border-gray-800 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleCategoria(categoria.id)}
                        className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-[#222222] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`${categoria.color} p-2 rounded`}>
                            {iconOptions.find(i => i.value === categoria.icono)?.icon && 
                              (() => {
                                const Icon = iconOptions.find(i => i.value === categoria.icono)!.icon;
                                return <Icon className="w-4 h-4 text-white" />;
                              })()
                            }
                          </div>
                          <span className="font-medium text-white">{categoria.nombre}</span>
                        </div>
                        {expandedCategorias.includes(categoria.id) ? 
                          <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        }
                      </button>
                      
                      {expandedCategorias.includes(categoria.id) && (
                        <div className="p-4 bg-[#0a0a0a] space-y-3">
                          {categoria.negocios.filter(n => n.servicios && n.servicios.length > 0).map(negocio => (
                            <div key={negocio.id} className="border border-gray-800 rounded-lg overflow-hidden">
                              <button
                                onClick={() => toggleNegocio(negocio.id)}
                                className="w-full flex items-center justify-between p-3 bg-[#151515] hover:bg-[#1a1a1a] transition-colors"
                              >
                                <span className="text-sm font-medium text-gray-300">{negocio.nombre}</span>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="bg-gray-800 text-gray-400">
                                    {negocio.servicios?.length || 0} servicios
                                  </Badge>
                                  {expandedNegocios.includes(negocio.id) ? 
                                    <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                  }
                                </div>
                              </button>

                              {expandedNegocios.includes(negocio.id) && (
                                <div className="p-3 space-y-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                                        <Plus className="w-3 h-3 mr-2" />
                                        Agregar Servicio
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-[#1a1a1a] border-gray-700 text-white max-w-lg">
                                      <DialogHeader>
                                        <DialogTitle>Nuevo Servicio - {negocio.nombre}</DialogTitle>
                                      </DialogHeader>
                                      <ServicioForm 
                                        onSave={async (servicio) => {
                                          await addServicio(categoria.id, negocio.id, { 
                                            ...servicio, 
                                            id: generateId('serv')
                                          });
                                        }} 
                                      />
                                    </DialogContent>
                                  </Dialog>

                                  {negocio.servicios?.map(servicio => (
                                    <div key={servicio.id} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded border border-gray-800">
                                      <div>
                                        <span className="text-white font-medium">{servicio.nombre}</span>
                                        <p className="text-sm text-gray-400">Desde ${servicio.precioDesde.toLocaleString()}</p>
                                      </div>
                                      <div className="flex gap-1">
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                                              <Edit2 className="w-3 h-3" />
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent className="bg-[#1a1a1a] border-gray-700 text-white max-w-lg">
                                            <DialogHeader>
                                              <DialogTitle>Editar Servicio</DialogTitle>
                                            </DialogHeader>
                                            <ServicioForm 
                                              servicio={servicio}
                                              onSave={async (s) => await updateServicio(categoria.id, negocio.id, s)} 
                                            />
                                          </DialogContent>
                                        </Dialog>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8 text-gray-400 hover:text-red-500"
                                          onClick={async () => await deleteServicio(categoria.id, negocio.id, servicio.id)}
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CHAT TAB */}
          <TabsContent value="chat">
            <ChatAdminPanel categorias={categorias} />
          </TabsContent>

          {/* EMPRESA TAB */}
          {isSuperAdmin && (
            <TabsContent value="empresa">
              <CompanyDataForm />
              
              {/* Exportar Datos */}
              <Card className="bg-[#111111] border-gray-800 mt-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Save className="w-5 h-5 text-red-500" />
                    Exportar Datos del Sitio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm mb-4">
                    Descarga el archivo con todos los negocios, productos y categorías. 
                    Este archivo debe ser subido al repositorio de GitHub para que los cambios se vean en la página pública.
                  </p>
                  <Button
                    onClick={downloadDataFile}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Descargar marketplace.ts
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* USUARIOS TAB - Solo SuperAdmin */}
          {isSuperAdmin && (
            <TabsContent value="usuarios">
              <UsuariosAdminForm 
                usuarios={todosLosUsuarios}
                categorias={categorias}
                onCrearUsuario={crearUsuario}
                onEliminarUsuario={eliminarUsuario}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}

// FORM COMPONENTS

function CompanyDataForm() {
  const { companyData, updateCompanyData } = useCompany();
  const [formData, setFormData] = useState(companyData);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyData(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Card className="bg-[#111111] border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-red-500" />
          Datos de la Empresa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información General */}
          <div className="border border-gray-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Información General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre de la Empresa</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  className="bg-[#222222] border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="slogan">Slogan</Label>
                <Input
                  id="slogan"
                  value={formData.slogan}
                  onChange={e => setFormData({ ...formData, slogan: e.target.value })}
                  className="bg-[#222222] border-gray-700 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                  className="bg-[#222222] border-gray-700 text-white"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="border border-gray-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Información de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="direccion">Dirección Completa</Label>
                <Textarea
                  id="direccion"
                  value={formData.direccion}
                  onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                  className="bg-[#222222] border-gray-700 text-white"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                  className="bg-[#222222] border-gray-700 text-white"
                  placeholder="+56 2 XXXX XXXX"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="bg-[#222222] border-gray-700 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="horario">Horario de Atención</Label>
                <Input
                  id="horario"
                  value={formData.horario}
                  onChange={e => setFormData({ ...formData, horario: e.target.value })}
                  className="bg-[#222222] border-gray-700 text-white"
                  placeholder="Lunes a Viernes: 9:00 - 18:00 hrs"
                />
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="border border-gray-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Redes Sociales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input
                  id="facebook"
                  value={formData.redesSociales.facebook}
                  onChange={e => setFormData({ 
                    ...formData, 
                    redesSociales: { ...formData.redesSociales, facebook: e.target.value }
                  })}
                  className="bg-[#222222] border-gray-700 text-white"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram URL</Label>
                <Input
                  id="instagram"
                  value={formData.redesSociales.instagram}
                  onChange={e => setFormData({ 
                    ...formData, 
                    redesSociales: { ...formData.redesSociales, instagram: e.target.value }
                  })}
                  className="bg-[#222222] border-gray-700 text-white"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter URL</Label>
                <Input
                  id="twitter"
                  value={formData.redesSociales.twitter}
                  onChange={e => setFormData({ 
                    ...formData, 
                    redesSociales: { ...formData.redesSociales, twitter: e.target.value }
                  })}
                  className="bg-[#222222] border-gray-700 text-white"
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <Label htmlFor="youtube">YouTube URL</Label>
                <Input
                  id="youtube"
                  value={formData.redesSociales.youtube}
                  onChange={e => setFormData({ 
                    ...formData, 
                    redesSociales: { ...formData.redesSociales, youtube: e.target.value }
                  })}
                  className="bg-[#222222] border-gray-700 text-white"
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="whatsapp">WhatsApp Link</Label>
                <Input
                  id="whatsapp"
                  value={formData.redesSociales.whatsapp}
                  onChange={e => setFormData({ 
                    ...formData, 
                    redesSociales: { ...formData.redesSociales, whatsapp: e.target.value }
                  })}
                  className="bg-[#222222] border-gray-700 text-white"
                  placeholder="https://wa.me/569..."
                />
              </div>
            </div>
          </div>

          {/* Botón Guardar */}
          <div className="flex items-center gap-4">
            <Button 
              type="submit" 
              className="bg-red-600 hover:bg-red-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
            {saved && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                ¡Cambios guardados!
              </Badge>
            )}
          </div>

          {/* Vista Previa */}
          <div className="border border-gray-800 rounded-lg p-4 mt-6">
            <h3 className="text-white font-semibold mb-4">Vista Previa del Footer</h3>
            <div className="bg-[#0a0a0a] rounded-lg p-4 border border-gray-800">
              <p className="text-gray-400 text-sm"><strong className="text-white">Nombre:</strong> {formData.nombre}</p>
              <p className="text-gray-400 text-sm"><strong className="text-white">Slogan:</strong> {formData.slogan}</p>
              <p className="text-gray-400 text-sm"><strong className="text-white">Dirección:</strong> {formData.direccion}</p>
              <p className="text-gray-400 text-sm"><strong className="text-white">Teléfono:</strong> {formData.telefono}</p>
              <p className="text-gray-400 text-sm"><strong className="text-white">Email:</strong> {formData.email}</p>
              <p className="text-gray-400 text-sm"><strong className="text-white">Horario:</strong> {formData.horario}</p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function CategoriaForm({ categoria, onSave }: { categoria?: Categoria; onSave: (c: Categoria) => void }) {
  const [formData, setFormData] = useState<Partial<Categoria>>(categoria || {
    nombre: '',
    descripcion: '',
    icono: 'Wrench',
    color: 'bg-red-600',
    imagen: '/images/categorias/default.jpg',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Categoria);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={e => setFormData({ ...formData, nombre: e.target.value })}
          className="bg-[#222222] border-gray-700 text-white"
          placeholder="Ej: Desarmadurías"
        />
      </div>
      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
          className="bg-[#222222] border-gray-700 text-white"
          placeholder="Descripción de la categoría..."
        />
      </div>
      <div>
        <Label>Icono</Label>
        <div className="grid grid-cols-5 gap-2 mt-2">
          {iconOptions.map(icon => (
            <button
              key={icon.value}
              type="button"
              onClick={() => setFormData({ ...formData, icono: icon.value })}
              className={`p-3 rounded-lg border transition-all ${
                formData.icono === icon.value 
                  ? 'border-red-500 bg-red-500/20' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <icon.icon className={`w-5 h-5 mx-auto ${formData.icono === icon.value ? 'text-red-500' : 'text-gray-400'}`} />
              <span className="text-xs text-gray-500 mt-1 block">{icon.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label>Color</Label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {colorOptions.map(color => (
            <button
              key={color.value}
              type="button"
              onClick={() => setFormData({ ...formData, color: color.value })}
              className={`p-3 rounded-lg border transition-all ${
                formData.color === color.value 
                  ? 'border-white' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className={`w-6 h-6 rounded mx-auto ${color.class}`} />
              <span className="text-xs text-gray-500 mt-1 block">{color.label}</span>
            </button>
          ))}
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" className="border-gray-700 text-gray-300">Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="submit" className="bg-red-600 hover:bg-red-700">Guardar</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}

function NegocioForm({ negocio, onSave }: { negocio?: Negocio; onSave: (n: Negocio) => void }) {
  const [formData, setFormData] = useState<Partial<Negocio>>(negocio || {
    nombre: '',
    descripcion: '',
    direccion: '',
    telefono: '',
    email: '',
    horario: '',
    whatsapp: '',
    rating: 4.5,
    imagen: '/images/negocios/default.jpg',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Negocio);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {/* Imagen del Negocio */}
      <ImageUpload
        value={formData.imagen || ''}
        onChange={(url) => setFormData({ ...formData, imagen: url })}
        label="Imagen del Negocio"
        folder="negocios"
      />

      <div>
        <Label htmlFor="nombre">Nombre del Negocio *</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={e => setFormData({ ...formData, nombre: e.target.value })}
          className="bg-[#222222] border-gray-700 text-white"
          required
        />
      </div>
      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
          className="bg-[#222222] border-gray-700 text-white"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            value={formData.direccion}
            onChange={e => setFormData({ ...formData, direccion: e.target.value })}
            className="bg-[#222222] border-gray-700 text-white"
          />
        </div>
        <div>
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            value={formData.telefono}
            onChange={e => setFormData({ ...formData, telefono: e.target.value })}
            className="bg-[#222222] border-gray-700 text-white"
            placeholder="+56 9 XXXX XXXX"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="bg-[#222222] border-gray-700 text-white"
          />
        </div>
        <div>
          <Label htmlFor="rating">Rating (0-5)</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={e => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
            className="bg-[#222222] border-gray-700 text-white"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="horario">Horario</Label>
        <Input
          id="horario"
          value={formData.horario}
          onChange={e => setFormData({ ...formData, horario: e.target.value })}
          className="bg-[#222222] border-gray-700 text-white"
          placeholder="Lun - Vie: 9:00 - 18:00"
        />
      </div>
      <div>
        <Label htmlFor="whatsapp" className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-green-500" />
          WhatsApp (número con código de país)
        </Label>
        <Input
          id="whatsapp"
          value={formData.whatsapp}
          onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
          className="bg-[#222222] border-gray-700 text-white"
          placeholder="56912345678"
        />
        <p className="text-xs text-gray-500 mt-1">
          Ingresa el número sin espacios ni signos. Ej: 56912345678
        </p>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" className="border-gray-700 text-gray-300">Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="submit" className="bg-red-600 hover:bg-red-700">Guardar</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}

function ProductoForm({ producto, onSave }: { producto?: Producto; onSave: (p: Producto) => void }) {
  const [formData, setFormData] = useState<Partial<Producto>>(producto || {
    nombre: '',
    descripcion: '',
    precio: 0,
    disponible: true,
    imagen: '/images/productos/default.jpg',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Producto);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Imagen del Producto */}
      <ImageUpload
        value={formData.imagen || ''}
        onChange={(url) => setFormData({ ...formData, imagen: url })}
        label="Imagen del Producto"
        folder="productos"
      />

      <div>
        <Label htmlFor="nombre">Nombre del Producto *</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={e => setFormData({ ...formData, nombre: e.target.value })}
          className="bg-[#222222] border-gray-700 text-white"
          required
        />
      </div>
      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
          className="bg-[#222222] border-gray-700 text-white"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="precio">Precio ($)</Label>
        <Input
          id="precio"
          type="number"
          value={formData.precio}
          onChange={e => setFormData({ ...formData, precio: parseInt(e.target.value) || 0 })}
          className="bg-[#222222] border-gray-700 text-white"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="disponible"
          checked={formData.disponible}
          onChange={e => setFormData({ ...formData, disponible: e.target.checked })}
          className="w-4 h-4 rounded border-gray-700 bg-[#222222]"
        />
        <Label htmlFor="disponible" className="mb-0">Disponible</Label>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" className="border-gray-700 text-gray-300">Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="submit" className="bg-red-600 hover:bg-red-700">Guardar</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}

function ServicioForm({ servicio, onSave }: { servicio?: Servicio; onSave: (s: Servicio) => void }) {
  const [formData, setFormData] = useState<Partial<Servicio>>(servicio || {
    nombre: '',
    descripcion: '',
    precioDesde: 0,
    imagen: '/images/servicios/default.jpg',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Servicio);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nombre">Nombre del Servicio</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={e => setFormData({ ...formData, nombre: e.target.value })}
          className="bg-[#222222] border-gray-700 text-white"
        />
      </div>
      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
          className="bg-[#222222] border-gray-700 text-white"
        />
      </div>
      <div>
        <Label htmlFor="precioDesde">Precio Desde ($)</Label>
        <Input
          id="precioDesde"
          type="number"
          value={formData.precioDesde}
          onChange={e => setFormData({ ...formData, precioDesde: parseInt(e.target.value) || 0 })}
          className="bg-[#222222] border-gray-700 text-white"
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" className="border-gray-700 text-gray-300">Cancelar</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="submit" className="bg-red-600 hover:bg-red-700">Guardar</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}


// Componente para gestionar chats de negocios
// Super Admin ve todos los negocios, cada negocio ve solo sus chats
function ChatAdminPanel({ categorias }: { categorias: Categoria[] }) {
  const { 
    chats, 
    enviarChatMensaje, 
    marcarChatMensajesLeidos,
    getChatMensajes,
    usuario,
    isSuperAdmin,
    isBusinessOwner
  } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [expandedNegocios, setExpandedNegocios] = useState<string[]>([]);

  // Obtener el negocio asignado al usuario business
  const miNegocio = isBusinessOwner && usuario?.negocioId 
    ? categorias.flatMap(c => c.negocios).find(n => n.id === usuario.negocioId)
    : null;

  const toggleNegocio = (negocioId: string) => {
    setExpandedNegocios(prev => 
      prev.includes(negocioId) 
        ? prev.filter(id => id !== negocioId) 
        : [...prev, negocioId]
    );
  };

  // Obtener negocios según el rol del usuario
  const negociosConChats = isSuperAdmin 
    ? categorias.flatMap(cat => 
        cat.negocios.map(neg => ({
          ...neg,
          categoriaNombre: cat.nombre,
          categoriaId: cat.id
        }))
      )
    : miNegocio 
      ? [{ ...miNegocio, categoriaNombre: categorias.find(c => c.negocios.some(n => n.id === miNegocio.id))?.nombre || '', categoriaId: miNegocio.categoriaId }]
      : [];

  // Obtener chats de un negocio específico
  const getChatsPorNegocio = (negocioId: string) => {
    return chats.filter(chat => chat.negocioId === negocioId || chat.para === negocioId);
  };

  // Contar mensajes no leídos por negocio
  const getMensajesNoLeidosPorNegocio = (negocioId: string) => {
    return chats.filter(chat => 
      (chat.negocioId === negocioId || chat.para === negocioId) && !chat.leido
    ).length;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    enviarChatMensaje(selectedChat, newMessage);
    setNewMessage('');
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
    if (usuario) {
      marcarChatMensajesLeidos(chatId, usuario.id);
    }
  };

  // Agrupar chats por cliente
  const getChatsAgrupados = (negocioId: string) => {
    const chatsNegocio = getChatsPorNegocio(negocioId);
    const agrupados: { [key: string]: typeof chats } = {};
    
    chatsNegocio.forEach(chat => {
      const clienteId = chat.clienteId || chat.de;
      if (!agrupados[clienteId]) {
        agrupados[clienteId] = [];
      }
      agrupados[clienteId].push(chat);
    });
    
    return agrupados;
  };

  return (
    <Card className="bg-[#111111] border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-red-500" />
          {isSuperAdmin ? 'Chat de Todos los Negocios' : `Chat - ${miNegocio?.nombre || 'Mi Negocio'}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
          {/* Lista de Negocios (Super Admin) o Chats (Business Owner) */}
          <div className="bg-[#0a0a0a] rounded-lg border border-gray-800 overflow-hidden flex flex-col">
            <div className="p-3 bg-[#1a1a1a] border-b border-gray-800">
              <h3 className="text-white font-medium">
                {isSuperAdmin ? 'Negocios' : 'Conversaciones'}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {isSuperAdmin ? (
                // Vista Super Admin: lista de todos los negocios
                negociosConChats.map(negocio => {
                  const mensajesNoLeidos = getMensajesNoLeidosPorNegocio(negocio.id);
                  const isExpanded = expandedNegocios.includes(negocio.id);
                  
                  return (
                    <div key={negocio.id} className="border border-gray-800 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleNegocio(negocio.id)}
                        className="w-full flex items-center justify-between p-3 bg-[#1a1a1a] hover:bg-[#222222] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <img 
                            src={negocio.imagen} 
                            alt={negocio.nombre}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <div className="text-left">
                            <span className="text-sm font-medium text-white block">{negocio.nombre}</span>
                            <span className="text-xs text-gray-500">{negocio.categoriaNombre}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {mensajesNoLeidos > 0 && (
                            <Badge className="bg-red-500 text-white text-xs">
                              {mensajesNoLeidos}
                            </Badge>
                          )}
                          {isExpanded ? 
                            <ChevronDown className="w-4 h-4 text-gray-400" /> : 
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          }
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <div className="p-2 bg-[#0a0a0a] space-y-1">
                          {Object.entries(getChatsAgrupados(negocio.id)).map(([clienteId, clienteChats]) => {
                            const ultimoChat = clienteChats[clienteChats.length - 1];
                            const noLeidos = clienteChats.filter(c => !c.leido).length;
                            
                            return (
                              <button
                                key={clienteId}
                                onClick={() => handleSelectChat(clienteChats[0].id)}
                                className={`w-full p-2 rounded text-left transition-colors ${
                                  selectedChat === clienteChats[0].id 
                                    ? 'bg-red-500/20 border border-red-500/30' 
                                    : 'hover:bg-[#1a1a1a]'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-white">{ultimoChat.clienteNombre || ultimoChat.deNombre}</span>
                                  {noLeidos > 0 && (
                                    <Badge className="bg-red-500 text-white text-xs">
                                      {noLeidos}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 truncate">{ultimoChat.mensaje || 'Sin mensajes'}</p>
                              </button>
                            );
                          })}
                          {Object.keys(getChatsAgrupados(negocio.id)).length === 0 && (
                            <p className="text-xs text-gray-600 text-center py-2">Sin conversaciones</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                // Vista Business Owner: solo sus chats
                miNegocio && Object.entries(getChatsAgrupados(miNegocio.id)).map(([clienteId, clienteChats]) => {
                  const ultimoChat = clienteChats[clienteChats.length - 1];
                  const noLeidos = clienteChats.filter(c => !c.leido).length;
                  
                  return (
                    <button
                      key={clienteId}
                      onClick={() => handleSelectChat(clienteChats[0].id)}
                      className={`w-full p-3 rounded text-left transition-colors border border-gray-800 ${
                        selectedChat === clienteChats[0].id 
                          ? 'bg-red-500/20 border-red-500/30' 
                          : 'bg-[#1a1a1a] hover:bg-[#222222]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                          <span className="text-sm font-medium text-red-400">
                            {(ultimoChat.clienteNombre || ultimoChat.deNombre || 'C').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">{ultimoChat.clienteNombre || ultimoChat.deNombre}</span>
                            {noLeidos > 0 && (
                              <Badge className="bg-red-500 text-white text-xs">
                                {noLeidos}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{ultimoChat.mensaje || 'Sin mensajes'}</p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
              {negociosConChats.length === 0 && (
                <p className="text-xs text-gray-600 text-center py-4">No tienes negocios asignados</p>
              )}
              {miNegocio && Object.keys(getChatsAgrupados(miNegocio.id)).length === 0 && (
                <p className="text-xs text-gray-600 text-center py-4">Sin conversaciones aún</p>
              )}
            </div>
          </div>

          {/* Área de Chat */}
          <div className="lg:col-span-2 bg-[#0a0a0a] rounded-lg border border-gray-800 flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-3 bg-[#1a1a1a] border-b border-gray-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">
                      {chats.find(c => c.id === selectedChat)?.clienteNombre || 'Cliente'}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {negociosConChats.find(n => 
                        getChatsPorNegocio(n.id).some(c => c.id === selectedChat)
                      )?.nombre}
                    </p>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {getChatMensajes(selectedChat).map((msg, idx) => (
                    <div 
                      key={idx}
                      className={`flex ${msg.de === usuario?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        msg.de === usuario?.id 
                          ? 'bg-red-600 text-white' 
                          : 'bg-[#1a1a1a] text-white border border-gray-700'
                      }`}>
                        <p className="text-sm">{msg.mensaje}</p>
                        <span className="text-xs opacity-70">
                          {new Date(msg.fecha).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 bg-[#1a1a1a] border-t border-gray-800">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="bg-[#222222] border-gray-700 text-white flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Enviar
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">Selecciona un chat para ver la conversación</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para gestionar usuarios (solo SuperAdmin)
function UsuariosAdminForm({ 
  usuarios, 
  categorias,
  onCrearUsuario, 
  onEliminarUsuario 
}: { 
  usuarios: any[]; 
  categorias: Categoria[];
  onCrearUsuario: (usuario: any) => boolean;
  onEliminarUsuario: (id: string) => boolean;
}) {
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    role: 'business' as UserRole,
    tipo: 'negocio' as const,
    negocioId: '',
    categoriaId: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleCrearUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const exito = onCrearUsuario({
      ...nuevoUsuario,
      favoritos: []
    });

    if (exito) {
      setMensaje('Usuario creado exitosamente');
      setNuevoUsuario({
        nombre: '',
        email: '',
        telefono: '',
        password: '',
        role: 'business',
        tipo: 'negocio',
        negocioId: '',
        categoriaId: ''
      });
    } else {
      setError('El email ya está registrado');
    }
  };

  const negociosDisponibles = nuevoUsuario.categoriaId 
    ? categorias.find(c => c.id === nuevoUsuario.categoriaId)?.negocios || []
    : [];

  return (
    <div className="space-y-6">
      {/* Crear nuevo usuario */}
      <Card className="bg-[#111111] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-red-500" />
            Crear Nuevo Usuario
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mensaje && (
            <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <p className="text-green-400 text-sm">{mensaje}</p>
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleCrearUsuario} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nombre Completo</Label>
                <Input
                  value={nuevoUsuario.nombre}
                  onChange={e => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                  className="bg-[#222222] border-gray-700 text-white"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={nuevoUsuario.email}
                  onChange={e => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                  className="bg-[#222222] border-gray-700 text-white"
                  placeholder="usuario@empresa.cl"
                />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input
                  value={nuevoUsuario.telefono}
                  onChange={e => setNuevoUsuario({ ...nuevoUsuario, telefono: e.target.value })}
                  className="bg-[#222222] border-gray-700 text-white"
                  placeholder="+56 9 XXXX XXXX"
                />
              </div>
              <div>
                <Label>Contraseña</Label>
                <Input
                  type="password"
                  value={nuevoUsuario.password}
                  onChange={e => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
                  className="bg-[#222222] border-gray-700 text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Rol</Label>
                <select
                  value={nuevoUsuario.role}
                  onChange={e => setNuevoUsuario({ ...nuevoUsuario, role: e.target.value as UserRole })}
                  className="w-full mt-2 p-2 bg-[#222222] border border-gray-700 rounded-md text-white"
                >
                  <option value="business">Dueño de Negocio</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div>
                <Label>Categoría</Label>
                <select
                  value={nuevoUsuario.categoriaId}
                  onChange={e => setNuevoUsuario({ ...nuevoUsuario, categoriaId: e.target.value, negocioId: '' })}
                  className="w-full mt-2 p-2 bg-[#222222] border border-gray-700 rounded-md text-white"
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Negocio Asignado</Label>
                <select
                  value={nuevoUsuario.negocioId}
                  onChange={e => setNuevoUsuario({ ...nuevoUsuario, negocioId: e.target.value })}
                  className="w-full mt-2 p-2 bg-[#222222] border border-gray-700 rounded-md text-white"
                  disabled={!nuevoUsuario.categoriaId}
                >
                  <option value="">Seleccionar negocio</option>
                  {negociosDisponibles.map(neg => (
                    <option key={neg.id} value={neg.id}>{neg.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button 
              type="submit" 
              className="bg-red-600 hover:bg-red-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Crear Usuario
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      <Card className="bg-[#111111] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-red-500" />
            Usuarios Registrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {usuarios.filter(u => u.id !== 'superadmin-1').map(usuario => (
              <div 
                key={usuario.id} 
                className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-gray-800"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{usuario.nombre}</span>
                    <Badge className={
                      usuario.role === 'superadmin' ? 'bg-purple-500/20 text-purple-400' :
                      usuario.role === 'admin' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }>
                      {usuario.role === 'superadmin' ? 'Super Admin' :
                       usuario.role === 'admin' ? 'Admin' : 'Negocio'}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm">{usuario.email}</p>
                  {usuario.negocioId && (
                    <p className="text-gray-500 text-xs mt-1">
                      Negocio: {categorias.flatMap(c => c.negocios).find(n => n.id === usuario.negocioId)?.nombre || 'N/A'}
                    </p>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => {
                    if (confirm('¿Eliminar este usuario?')) {
                      onEliminarUsuario(usuario.id);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            {usuarios.filter(u => u.id !== 'superadmin-1').length === 0 && (
              <p className="text-gray-500 text-center py-8">No hay usuarios registrados</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
