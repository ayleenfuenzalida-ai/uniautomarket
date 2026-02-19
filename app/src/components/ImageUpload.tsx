import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  minImages?: number;
  label?: string;
}

export function ImageUpload({ images, onChange, maxImages = 5, minImages = 1, label = 'Imágenes' }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (images.length >= maxImages) return;
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onChange([...images, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const isExact = images.length === maxImages && minImages === maxImages;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-gray-400 text-sm">{label}</label>
        <span className={`text-sm ${isExact ? 'text-green-400' : images.length < minImages ? 'text-amber-400' : 'text-gray-500'}`}>
          {images.length} / {maxImages} imágenes
          {minImages === maxImages && images.length !== maxImages && ' (exactamente ' + maxImages + ' requeridas)'}
        </span>
      </div>
      
      {/* Warning if not enough images */}
      {images.length < minImages && (
        <div className="flex items-center gap-2 text-amber-400 text-sm bg-amber-500/10 p-2 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>Faltan {minImages - images.length} imágenes (mínimo {minImages} requeridas)</span>
        </div>
      )}

      {/* Success message */}
      {isExact && (
        <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 p-2 rounded-lg">
          <span>✓ Exactamente {maxImages} imágenes cargadas correctamente</span>
        </div>
      )}
      
      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-700 group">
              <img src={image} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded">
                  Principal
                </span>
              )}
            </div>
          ))}
          {/* Empty slots */}
          {Array.from({ length: Math.max(0, maxImages - images.length) }).map((_, idx) => (
            <div key={`empty-${idx}`} className="aspect-square rounded-lg border-2 border-dashed border-gray-800 flex items-center justify-center">
              <span className="text-gray-600 text-xs">{images.length + idx + 1}</span>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-red-500 bg-red-500/10'
              : 'border-gray-700 hover:border-gray-600 bg-[#0a0a0a]'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
              {isDragging ? (
                <Upload className="w-6 h-6 text-red-500" />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-500" />
              )}
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                {isDragging ? 'Suelta las imágenes aquí' : 'Arrastra imágenes o haz click para seleccionar'}
              </p>
              <p className="text-gray-600 text-xs mt-1">
                JPG, PNG • Máximo {maxImages} imágenes
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
