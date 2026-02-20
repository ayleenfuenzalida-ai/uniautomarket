import { useState } from 'react';
import { ArrowLeft, Trash2, Store, Users, BarChart3, Settings, Plus, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useCompany } from '@/contexts/CompanyContext';
import { ImageUpload } from '@/components/ImageUpload';
import type { Negocio, Usuario, Producto, Categoria } from '@/types';

interface AdminPageProps {
  onBack: () => void;
}

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const ICONOS_CATEGORIA = [
  { value: 'Car', label: 'Auto' },
  { value: 'Wrench', label: 'Herramienta' },
  { value: 'Tool', label: 'Herramienta 2' },
  { value: 'Package', label: 'Paquete' },
  { value: 'Truck', label: 'Camión' },
  { value: 'Paintbrush', label: 'Pincel' },
  { value: 'Cpu', label: 'CPU' },
  { value: 'Zap', label: 'Electricidad' },
  { value: 'Settings', label: 'Configuración' },
  { value: 'Gauge', label: 'Medidor' },
  { value: 'Fuel', label: 'Combustible' },
  { value: 'Battery', label: 'Batería' },
];

const COLORES_CATEGORIA = [
  { value: '#EF4444', label: 'Rojo' },
  { value: '#F97316', label: 'Naranja' },
  { value: '#F59E0B', label: 'Ámbar' },
  { value: '#10B981', label: 'Verde' },
  { value: '#06B6D4', label: 'Cyan' },
  { value: '#3B82F6', label: 'Azul' },
  { value: '#6366F1', label: 'Índigo' },
  { value: '#8B5CF6', label: 'Violeta' },
  { value: '#EC4899', label: 'Rosa' },
  { value: '#6B7280', label: 'Gris' },
];

export function AdminPage({ onBack }: AdminPageProps) {
  const { usuario, isSuperAdmin, isAdmin, usuarios, deleteUser, createUser } = useAuth();
  const { categorias, deleteCategoria, deleteNegocio, addNegocio, addProducto, addCategoria } = useData();
  useCompany();

  const [isAddNegocioOpen, setIsAddNegocioOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddProductoOpen, setIsAddProductoOpen] = useState(false);
  const [isAddCategoriaOpen, setIsAddCategoriaOpen] = useState(false);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState('');
  const [selectedNegocioId, setSelectedNegocioId] = useState('');

  const [nuevoNegocio, setNuevoNegocio] = useState<Partial<Negocio> & { imagenes: string[] }>({
    nombre: '',
    descripcion: '',
    direccion: '',
    comuna: '',
    region: '',
    telefono: '',
    email: '',
    whatsapp: '',
    imagenes: [],
    destacado: false,
    verificado: false,
    horarios: DIAS_SEMANA.map(dia => ({ dia, abierto: dia !== 'Domingo', apertura: '09:00', cierre: '18:00' })),
    productos: [],
    resenas: [],
    visitas: 0,
    fechaRegistro: new Date().toISOString(),
  });

  const [nuevoProducto, setNuevoProducto] = useState<Partial<Producto> & { imagenes: string[] }>({
    nombre: '',
    descripcion: '',
    precio: 0,
    imagenes: [],
    stock: 0,
    sku: '',
    categoria: '',
  });

  const [nuevaCategoria, setNuevaCategoria] = useState<Partial<Categoria> & { imagenes: string[] }>({
    nombre: '',
    descripcion: '',
    imagenes: [],
    icono: 'Car',
    color: '#EF4444',
    destacada: false,
    orden: 0,
    negocios: [],
  });

  const [nuevoUsuario, setNuevoUsuario] = useState<Partial<Usuario>>({
    nombre: '',
    email: '',
    tipo: 'client',
    negocioId: undefined,
  });

  if (!usuario || (!isSuperAdmin && !isAdmin)) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No tienes permisos</p>
          <Button onClick={onBack}>Volver</Button>
        </div>
      </div>
    );
  }

  const stats = {
    totalNegocios: categorias.reduce((acc, cat) => acc + cat.negocios.length, 0),
    totalCategorias: categorias.length,
    totalUsuarios: usuarios.length,
  };

  const todosLosNegocios = categorias.flatMap(cat => cat.negocios.map(neg => ({ ...neg, categoriaNombre: cat.nombre })));

  const handleAddUsuario = async () => {
    if (!nuevoUsuario.nombre || !nuevoUsuario.email) return;

    await createUser({
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      tipo: nuevoUsuario.tipo as 'client' | 'business' | 'admin',
      negocioId: nuevoUsuario.negocioId,
      favoritos: []
    });

    setIsAddUserOpen(false);
    setNuevoUsuario({ nombre: '', email: '', tipo: 'client', negocioId: undefined });
  };

  const handleAddCategoria = async () => {
    if (!nuevaCategoria.nombre || nuevaCategoria.imagenes.length === 0) {
      alert('Por favor ingresa un nombre y sube al menos una imagen para la categoría');
      return;
    }

    const categoria: Categoria = {
      id: `categoria-${Date.now()}`,
      nombre: nuevaCategoria.nombre || '',
      descripcion: nuevaCategoria.descripcion || '',
      imagen: nuevaCategoria.imagenes[0] || '',
      icono: nuevaCategoria.icono || 'Car',
      color: nuevaCategoria.color || '#EF4444',
      destacada: nuevaCategoria.destacada || false,
      orden: categorias.length + 1,
      negocios: [],
    };

    await addCategoria(categoria);
    setIsAddCategoriaOpen(false);
    setNuevaCategoria({
      nombre: '',
      descripcion: '',
      imagenes: [],
      icono: 'Car',
      color: '#EF4444',
      destacada: false,
      orden: 0,
      negocios: [],
    });
  };

  const handleAddNegocio = async () => {
    if (!selectedCategoriaId || !nuevoNegocio.nombre || nuevoNegocio.imagenes.length === 0) return;

    const negocio: Negocio = {
      id: Date.now().toString(),
      nombre: nuevoNegocio.nombre || '',
      descripcion: nuevoNegocio.descripcion || '',
      categoriaId: selectedCategoriaId,
      direccion: nuevoNegocio.direccion || '',
      comuna: nuevoNegocio.comuna || '',
      region: nuevoNegocio.region || 'Metropolitana',
      telefono: nuevoNegocio.telefono || '',
      email: nuevoNegocio.email || '',
      whatsapp: nuevoNegocio.whatsapp || '',
      imagen: nuevoNegocio.imagenes[0] || '',
      destacado: nuevoNegocio.destacado || false,
      verificado: nuevoNegocio.verificado || false,
      horarios: nuevoNegocio.horarios || DIAS_SEMANA.map(dia => ({ dia, abierto: dia !== 'Domingo', apertura: '09:00', cierre: '18:00' })),
      productos: [],
      resenas: [],
      visitas: 0,
      fechaRegistro: new Date().toISOString(),
      galeria: nuevoNegocio.imagenes.slice(1) || [],
      servicios: [],
      estado: 'activo',
      rut: '',
      chats: [],
    };

    await addNegocio(selectedCategoriaId, negocio);
    setIsAddNegocioOpen(false);
    setNuevoNegocio({
      nombre: '', descripcion: '', direccion: '', comuna: '', region: '',
      telefono: '', email: '', whatsapp: '', imagenes: [],
      destacado: false, verificado: false,
      horarios: DIAS_SEMANA.map(dia => ({ dia, abierto: dia !== 'Domingo', apertura: '09:00', cierre: '18:00' })),
      productos: [], resenas: [], visitas: 0, fechaRegistro: new Date().toISOString(),
    });
    setSelectedCategoriaId('');
  };

  const handleAddProducto = async () => {
    if (!selectedCategoriaId || !selectedNegocioId || !nuevoProducto.nombre || nuevoProducto.imagenes.length === 0) return;

    const producto: Producto = {
      id: `producto-${Date.now()}`,
      nombre: nuevoProducto.nombre || '',
      descripcion: nuevoProducto.descripcion || '',
      precio: nuevoProducto.precio || 0,
      imagen: nuevoProducto.imagenes[0] || '',
      imagenes: nuevoProducto.imagenes,
      stock: nuevoProducto.stock || 0,
      sku: nuevoProducto.sku || '',
      categoria: nuevoProducto.categoria || '',
    };

    await addProducto(selectedCategoriaId, selectedNegocioId, producto);
    setIsAddProductoOpen(false);
    setNuevoProducto({
      nombre: '', descripcion: '', precio: 0, imagenes: [], stock: 0, sku: '', categoria: ''
    });
    setSelectedNegocioId('');
  };

  const negociosDeCategoria = selectedCategoriaId
    ? categorias.find(c => c.id === selectedCategoriaId)?.negocios || []
    : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="bg-[#111111] border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="text-gray-400 hover:text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
                <p className="text-gray-400 text-sm">Gestiona tu marketplace</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">{isSuperAdmin ? 'Super Admin' : 'Admin'}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard">
          <TabsList className="bg-[#111111] border border-gray-800 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2"><BarChart3 className="w-4 h-4" />Dashboard</TabsTrigger>
            <TabsTrigger value="negocios" className="flex items-center gap-2"><Store className="w-4 h-4" />Negocios</TabsTrigger>
            <TabsTrigger value="productos" className="flex items-center gap-2"><ImageIcon className="w-4 h-4" />Productos</TabsTrigger>
            <TabsTrigger value="categorias" className="flex items-center gap-2"><Settings className="w-4 h-4" />Categorías</TabsTrigger>
            {isSuperAdmin && <TabsTrigger value="usuarios" className="flex items-center gap-2"><Users className="w-4 h-4" />Usuarios</TabsTrigger>}
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-xl p-6 border border-gray-800">
                <p className="text-gray-400 text-sm">Total Negocios</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalNegocios}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-6 border border-gray-800">
                <p className="text-gray-400 text-sm">Categorías</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalCategorias}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-6 border border-gray-800">
                <p className="text-gray-400 text-sm">Usuarios</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalUsuarios}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="negocios">
            <div className="space-y-6">
              <div className="flex justify-end">
                <Dialog open={isAddNegocioOpen} onOpenChange={setIsAddNegocioOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />Agregar Negocio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#111111] border-gray-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Agregar Nuevo Negocio</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label className="text-gray-400">Categoría *</Label>
                        <Select value={selectedCategoriaId} onValueChange={setSelectedCategoriaId}>
                          <SelectTrigger className="bg-[#0a0a0a] border-gray-700 text-white">
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#111111] border-gray-700">
                            {categorias.map(cat => (
                              <SelectItem key={cat.id} value={cat.id} className="text-white">{cat.nombre}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <ImageUpload
                        images={nuevoNegocio.imagenes}
                        onChange={(imgs) => setNuevoNegocio({ ...nuevoNegocio, imagenes: imgs })}
                        maxImages={6}
                        label="Fotos del negocio * (máx. 6, la primera será la principal)"
                      />

                      <div>
                        <Label className="text-gray-400">Nombre del Negocio *</Label>
                        <Input
                          value={nuevoNegocio.nombre}
                          onChange={(e) => setNuevoNegocio({...nuevoNegocio, nombre: e.target.value})}
                          className="bg-[#0a0a0a] border-gray-700 text-white"
                          placeholder="Ej: Repuestos El Rápido"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-400">Descripción</Label>
                        <Textarea
                          value={nuevoNegocio.descripcion}
                          onChange={(e) => setNuevoNegocio({...nuevoNegocio, descripcion: e.target.value})}
                          className="bg-[#0a0a0a] border-gray-700 text-white"
                          placeholder="Describe el negocio..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Dirección</Label>
                          <Input
                            value={nuevoNegocio.direccion}
                            onChange={(e) => setNuevoNegocio({...nuevoNegocio, direccion: e.target.value})}
                            className="bg-[#0a0a0a] border-gray-700 text-white"
                            placeholder="Av. Principal 123"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-400">Comuna</Label>
                          <Input
                            value={nuevoNegocio.comuna}
                            onChange={(e) => setNuevoNegocio({...nuevoNegocio, comuna: e.target.value})}
                            className="bg-[#0a0a0a] border-gray-700 text-white"
                            placeholder="Providencia"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Teléfono</Label>
                          <Input
                            value={nuevoNegocio.telefono}
                            onChange={(e) => setNuevoNegocio({...nuevoNegocio, telefono: e.target.value})}
                            className="bg-[#0a0a0a] border-gray-700 text-white"
                            placeholder="+56 9 1234 5678"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-400">WhatsApp</Label>
                          <Input
                            value={nuevoNegocio.whatsapp}
                            onChange={(e) => setNuevoNegocio({...nuevoNegocio, whatsapp: e.target.value})}
                            className="bg-[#0a0a0a] border-gray-700 text-white"
                            placeholder="+56 9 1234 5678"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Email</Label>
                        <Input
                          value={nuevoNegocio.email}
                          onChange={(e) => setNuevoNegocio({...nuevoNegocio, email: e.target.value})}
                          className="bg-[#0a0a0a] border-gray-700 text-white"
                          placeholder="contacto@negocio.cl"
                          type="email"
                        />
                      </div>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={nuevoNegocio.destacado}
                            onChange={(e) => setNuevoNegocio({...nuevoNegocio, destacado: e.target.checked})}
                            className="w-4 h-4"
                          />
                          <span className="text-gray-400">Destacado</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={nuevoNegocio.verificado}
                            onChange={(e) => setNuevoNegocio({...nuevoNegocio, verificado: e.target.checked})}
                            className="w-4 h-4"
                          />
                          <span className="text-gray-400">Verificado</span>
                        </label>
                      </div>
                      <Button
                        onClick={handleAddNegocio}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                        disabled={!selectedCategoriaId || !nuevoNegocio.nombre || nuevoNegocio.imagenes.length === 0}
                      >
                        Guardar Negocio
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {categorias.map((categoria) => (
                <div key={categoria.id} className="bg-[#111111] rounded-xl border border-gray-800 overflow-hidden">
                  <div className="p-4 bg-gray-800/50 border-b border-gray-800">
                    <h3 className="font-semibold text-white">{categoria.nombre}</h3>
                    <p className="text-gray-400 text-sm">{categoria.negocios.length} negocios</p>
                  </div>
                  <div className="divide-y divide-gray-800">
                    {categoria.negocios.map((negocio) => (
                      <div key={negocio.id} className="p-4 flex items-center justify-between hover:bg-gray-800/30">
                        <div className="flex items-center gap-4">
                          <img src={negocio.imagen || '/images/placeholder-business.jpg'} alt={negocio.nombre} className="w-16 h-16 rounded-lg object-cover" />
                          <div>
                            <h4 className="font-medium text-white">{negocio.nombre}</h4>
                            <p className="text-gray-400 text-sm">{negocio.comuna}</p>
                            <p className="text-gray-500 text-xs">{negocio.productos.length} productos</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => deleteNegocio(categoria.id, negocio.id)} className="text-gray-400 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="productos">
            <div className="space-y-6">
              <div className="flex justify-end">
                <Dialog open={isAddProductoOpen} onOpenChange={setIsAddProductoOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />Agregar Producto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#111111] border-gray-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label className="text-gray-400">Categoría *</Label>
                        <Select value={selectedCategoriaId} onValueChange={setSelectedCategoriaId}>
                          <SelectTrigger className="bg-[#0a0a0a] border-gray-700 text-white">
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#111111] border-gray-700">
                            {categorias.map(cat => (
                              <SelectItem key={cat.id} value={cat.id} className="text-white">{cat.nombre}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedCategoriaId && (
                        <div>
                          <Label className="text-gray-400">Negocio *</Label>
                          <Select value={selectedNegocioId} onValueChange={setSelectedNegocioId}>
                            <SelectTrigger className="bg-[#0a0a0a] border-gray-700 text-white">
                              <SelectValue placeholder="Selecciona un negocio" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111111] border-gray-700">
                              {negociosDeCategoria.map(neg => (
                                <SelectItem key={neg.id} value={neg.id} className="text-white">{neg.nombre}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <ImageUpload
                        images={nuevoProducto.imagenes}
                        onChange={(imgs) => setNuevoProducto({ ...nuevoProducto, imagenes: imgs })}
                        maxImages={5}
                        label="Fotos del producto * (máx. 5, la primera será la principal)"
                      />

                      <div>
                        <Label className="text-gray-400">Nombre del Producto *</Label>
                        <Input
                          value={nuevoProducto.nombre}
                          onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
                          className="bg-[#0a0a0a] border-gray-700 text-white"
                          placeholder="Ej: Filtro de aceite Toyota"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-400">Descripción</Label>
                        <Textarea
                          value={nuevoProducto.descripcion}
                          onChange={(e) => setNuevoProducto({...nuevoProducto, descripcion: e.target.value})}
                          className="bg-[#0a0a0a] border-gray-700 text-white"
                          placeholder="Describe el producto..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Precio *</Label>
                          <Input
                            type="number"
                            value={nuevoProducto.precio}
                            onChange={(e) => setNuevoProducto({...nuevoProducto, precio: Number(e.target.value)})}
                            className="bg-[#0a0a0a] border-gray-700 text-white"
                            placeholder="29990"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-400">Stock</Label>
                          <Input
                            type="number"
                            value={nuevoProducto.stock}
                            onChange={(e) => setNuevoProducto({...nuevoProducto, stock: Number(e.target.value)})}
                            className="bg-[#0a0a0a] border-gray-700 text-white"
                            placeholder="10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">SKU</Label>
                        <Input
                          value={nuevoProducto.sku}
                          onChange={(e) => setNuevoProducto({...nuevoProducto, sku: e.target.value})}
                          className="bg-[#0a0a0a] border-gray-700 text-white"
                          placeholder="ABC-123"
                        />
                      </div>
                      <Button
                        onClick={handleAddProducto}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                        disabled={!selectedCategoriaId || !selectedNegocioId || !nuevoProducto.nombre || nuevoProducto.imagenes.length === 0}
                      >
                        Guardar Producto
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {categorias.map((categoria) => (
                <div key={categoria.id} className="bg-[#111111] rounded-xl border border-gray-800 overflow-hidden">
                  <div className="p-4 bg-gray-800/50 border-b border-gray-800">
                    <h3 className="font-semibold text-white">{categoria.nombre}</h3>
                  </div>
                  <div className="divide-y divide-gray-800">
                    {categoria.negocios.map((negocio) => (
                      negocio.productos.length > 0 && (
                        <div key={negocio.id} className="p-4">
                          <h4 className="text-white font-medium mb-3">{negocio.nombre}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {negocio.productos.map((producto) => (
                              <div key={producto.id} className="bg-[#0a0a0a] rounded-lg overflow-hidden border border-gray-800">
                                <img src={producto.imagen} alt={producto.nombre} className="w-full h-24 object-cover" />
                                <div className="p-2">
                                  <p className="text-white text-sm truncate">{producto.nombre}</p>
                                  <p className="text-red-400 text-sm font-medium">${producto.precio.toLocaleString('es-CL')}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categorias">
            <div className="space-y-6">
              <div className="flex justify-end">
                <Dialog open={isAddCategoriaOpen} onOpenChange={setIsAddCategoriaOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />Agregar Categoría
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#111111] border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Agregar Nueva Categoría</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <ImageUpload
                        images={nuevaCategoria.imagenes}
                        onChange={(imgs) => setNuevaCategoria({ ...nuevaCategoria, imagenes: imgs })}
                        maxImages={1}
                        label="Imagen de la categoría * (será la imagen de fondo)"
                      />

                      <div>
                        <Label className="text-gray-400">Nombre de la Categoría *</Label>
                        <Input
                          value={nuevaCategoria.nombre}
                          onChange={(e) => setNuevaCategoria({...nuevaCategoria, nombre: e.target.value})}
                          className="bg-[#0a0a0a] border-gray-700 text-white"
                          placeholder="Ej: Desarmadurías"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-400">Descripción</Label>
                        <Textarea
                          value={nuevaCategoria.descripcion}
                          onChange={(e) => setNuevaCategoria({...nuevaCategoria, descripcion: e.target.value})}
                          className="bg-[#0a0a0a] border-gray-700 text-white"
                          placeholder="Describe la categoría..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Icono</Label>
                          <Select 
                            value={nuevaCategoria.icono} 
                            onValueChange={(v) => setNuevaCategoria({...nuevaCategoria, icono: v})}
                          >
                            <SelectTrigger className="bg-[#0a0a0a] border-gray-700 text-white">
                              <SelectValue placeholder="Selecciona un icono" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111111] border-gray-700">
                              {ICONOS_CATEGORIA.map(icono => (
                                <SelectItem key={icono.value} value={icono.value} className="text-white">
                                  {icono.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-gray-400">Color</Label>
                          <Select 
                            value={nuevaCategoria.color} 
                            onValueChange={(v) => setNuevaCategoria({...nuevaCategoria, color: v})}
                          >
                            <SelectTrigger className="bg-[#0a0a0a] border-gray-700 text-white">
                              <SelectValue placeholder="Selecciona un color" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111111] border-gray-700">
                              {COLORES_CATEGORIA.map(color => (
                                <SelectItem key={color.value} value={color.value} className="text-white">
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className="w-4 h-4 rounded-full" 
                                      style={{ backgroundColor: color.value }}
                                    />
                                    {color.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={nuevaCategoria.destacada}
                          onChange={(e) => setNuevaCategoria({...nuevaCategoria, destacada: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <Label className="text-gray-400 cursor-pointer">Categoría destacada</Label>
                      </div>

                      <Button
                        onClick={handleAddCategoria}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                        disabled={!nuevaCategoria.nombre || nuevaCategoria.imagenes.length === 0}
                      >
                        Guardar Categoría
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorias.map((categoria) => (
                  <div key={categoria.id} className="bg-[#111111] rounded-xl overflow-hidden border border-gray-800 group">
                    <div className="relative h-40">
                      <img src={categoria.imagen} alt={categoria.nombre} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-semibold text-white">{categoria.nombre}</h3>
                        <p className="text-gray-300 text-sm">{categoria.negocios.length} negocios</p>
                      </div>
                      {categoria.destacada && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 bg-amber-500 text-black text-xs font-semibold rounded">
                            Destacada
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex justify-end">
                      <Button variant="ghost" size="sm" onClick={() => deleteCategoria(categoria.id)} className="text-gray-400 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {isSuperAdmin && (
            <TabsContent value="usuarios">
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-red-600 hover:bg-red-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />Crear Usuario
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#111111] border-gray-800 text-white max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label className="text-gray-400">Nombre completo</Label>
                          <Input
                            value={nuevoUsuario.nombre}
                            onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})}
                            className="bg-[#0a0a0a] border-gray-700 text-white"
                            placeholder="Juan Pérez"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-400">Email</Label>
                          <Input
                            value={nuevoUsuario.email}
                            onChange={(e) => setNuevoUsuario({...nuevoUsuario, email: e.target.value})}
                            className="bg-[#0a0a0a] border-gray-700 text-white"
                            placeholder="usuario@ejemplo.cl"
                            type="email"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-400">Tipo de usuario</Label>
                          <Select
                            value={nuevoUsuario.tipo}
                            onValueChange={(v) => setNuevoUsuario({...nuevoUsuario, tipo: v as 'client' | 'business' | 'admin', negocioId: v === 'business' ? nuevoUsuario.negocioId : undefined})}
                          >
                            <SelectTrigger className="bg-[#0a0a0a] border-gray-700 text-white">
                              <SelectValue placeholder="Selecciona el tipo" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111111] border-gray-700">
                              <SelectItem value="client">Cliente</SelectItem>
                              <SelectItem value="business">Dueño de Negocio</SelectItem>
                              <SelectItem value="admin">Administrador</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {nuevoUsuario.tipo === 'business' && (
                          <div>
                            <Label className="text-gray-400">Negocio asignado</Label>
                            <Select
                              value={nuevoUsuario.negocioId}
                              onValueChange={(v) => setNuevoUsuario({...nuevoUsuario, negocioId: v})}
                            >
                              <SelectTrigger className="bg-[#0a0a0a] border-gray-700 text-white">
                                <SelectValue placeholder="Selecciona un negocio" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#111111] border-gray-700 max-h-[200px]">
                                {todosLosNegocios.map(neg => (
                                  <SelectItem key={neg.id} value={neg.id} className="text-white">
                                    {neg.nombre} ({neg.categoriaNombre})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-gray-500 text-xs mt-2">El usuario podrá administrar este negocio</p>
                          </div>
                        )}
                        <Button
                          onClick={handleAddUsuario}
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                          disabled={!nuevoUsuario.nombre || !nuevoUsuario.email}
                        >
                          Crear Usuario
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="bg-[#111111] rounded-xl border border-gray-800 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Nombre</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Tipo</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Negocio</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {usuarios.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-800/30">
                          <td className="px-4 py-3 text-white">{user.nombre}</td>
                          <td className="px-4 py-3 text-gray-400">{user.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              user.tipo === 'superadmin' ? 'bg-amber-500/20 text-amber-400' :
                              user.tipo === 'admin' ? 'bg-blue-500/20 text-blue-400' :
                              user.tipo === 'business' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {user.tipo === 'superadmin' ? 'Super Admin' :
                               user.tipo === 'admin' ? 'Admin' :
                               user.tipo === 'business' ? 'Negocio' : 'Cliente'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400">
                            {user.negocioId ? (() => {
                              const neg = todosLosNegocios.find(n => n.id === user.negocioId);
                              return neg ? neg.nombre : '-';
                            })() : '-'}
                          </td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm" onClick={() => deleteUser(user.id)} className="text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}