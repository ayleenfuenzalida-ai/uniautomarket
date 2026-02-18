import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  folder?: 'negocios' | 'productos' | 'categorias' | 'servicios';
}

export function ImageUpload({ 
  value, 
  onChange, 
  label = 'Imagen',
  placeholder = 'URL de la imagen o subir nueva',
  folder = 'negocios'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máximo 2MB para base64)
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no debe superar los 2MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convertir imagen a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        // Guardar la imagen como base64 directamente
        onChange(result);
      };
      reader.readAsDataURL(file);
      
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      alert('Error al subir la imagen. Intenta nuevamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setPreview(url || null);
    onChange(url);
  };

  const clearImage = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-medium text-white">{label}</label>}
      
      {/* Preview */}
      {preview && (
        <div className="relative w-full h-40 bg-[#1a1a1a] rounded-lg border border-gray-700 overflow-hidden group">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={clearImage}
              className="bg-red-600 hover:bg-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Eliminar
            </Button>
          </div>
        </div>
      )}

      {/* Input URL */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-[#222222] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-red-500"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="border-gray-700 text-gray-300 hover:bg-gray-800 whitespace-nowrap"
        >
          {isUploading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
              Subiendo...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Subir
            </span>
          )}
        </Button>
      </div>

      {/* Opciones rápidas de imágenes de ejemplo */}
      {!preview && (
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs text-gray-500">Imágenes de ejemplo:</span>
          {[
            `/images/${folder}/default.jpg`,
            `/images/${folder}/example1.jpg`,
            `/images/${folder}/example2.jpg`,
          ].map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleUrlChange(img)}
              className="w-10 h-10 bg-[#1a1a1a] border border-gray-700 rounded hover:border-red-500 transition-colors flex items-center justify-center"
            >
              <ImageIcon className="w-4 h-4 text-gray-500" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
