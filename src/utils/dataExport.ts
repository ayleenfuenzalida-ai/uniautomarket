// Utilidad para exportar datos del localStorage a un archivo descargable
// que luego puede ser subido al repositorio

import type { Categoria } from '@/types';

const STORAGE_KEY = 'uniautomarket_categorias';

export function exportDataToFile(): string {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    throw new Error('No hay datos para exportar');
  }
  
  const categorias: Categoria[] = JSON.parse(data);
  
  // Generar el contenido del archivo marketplace.ts
  const fileContent = `import type { Categoria } from '@/types';

export const categorias: Categoria[] = ${JSON.stringify(categorias, null, 2)};
`;
  
  return fileContent;
}

export function downloadDataFile() {
  const content = exportDataToFile();
  const blob = new Blob([content], { type: 'text/typescript' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'marketplace.ts';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function getCurrentData(): Categoria[] | null {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}
