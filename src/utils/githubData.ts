// Utilidad para leer y escribir datos directamente en GitHub
// Esto permite que los datos se sincronicen entre todos los dispositivos

import type { Categoria } from '@/types';

// Token de GitHub - En producción esto debería estar en variables de entorno
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';
const REPO_OWNER = 'ayleenfuenzalida-ai';
const REPO_NAME = 'uniautomarket';
const FILE_PATH = 'src/data/marketplace.ts';

// Leer datos desde GitHub
export async function fetchCategoriasFromGitHub(): Promise<Categoria[]> {
  try {
    // Si no hay token, usar datos locales
    if (!GITHUB_TOKEN) {
      console.log('No GitHub token, using local data');
      return getLocalCategorias();
    }
    
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=main`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Error fetching data from GitHub');
    }
    
    const data = await response.json();
    const content = atob(data.content);
    
    // Extraer el array de categorías del contenido del archivo
    const match = content.match(/export const categorias: Categoria\[\] = (\[.*?\]);/s);
    if (match) {
      return JSON.parse(match[1]);
    }
    
    throw new Error('Could not parse categorias from file');
  } catch (error) {
    console.error('Error reading from GitHub:', error);
    // Fallback: leer desde localStorage o datos iniciales
    return getLocalCategorias();
  }
}

// Guardar datos en GitHub
export async function saveCategoriasToGitHub(categorias: Categoria[]): Promise<boolean> {
  try {
    // Si no hay token, solo guardar en localStorage
    if (!GITHUB_TOKEN) {
      console.log('No GitHub token, saving to localStorage only');
      localStorage.setItem('uniautomarket_categorias', JSON.stringify(categorias));
      return false;
    }
    
    // Primero obtener el SHA actual del archivo
    const getResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=main`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    if (!getResponse.ok) {
      throw new Error('Error getting file SHA');
    }
    
    const fileData = await getResponse.json();
    const sha = fileData.sha;
    
    // Crear el nuevo contenido del archivo
    const fileContent = `import type { Categoria } from '@/types';

export const categorias: Categoria[] = ${JSON.stringify(categorias, null, 2)};
`;
    
    // Actualizar el archivo
    const updateResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update categorias from admin panel',
          content: btoa(fileContent),
          sha: sha,
          branch: 'main'
        })
      }
    );
    
    if (!updateResponse.ok) {
      throw new Error('Error updating file on GitHub');
    }
    
    // También guardar en localStorage como backup
    localStorage.setItem('uniautomarket_categorias', JSON.stringify(categorias));
    
    return true;
  } catch (error) {
    console.error('Error saving to GitHub:', error);
    // Guardar solo en localStorage como fallback
    localStorage.setItem('uniautomarket_categorias', JSON.stringify(categorias));
    return false;
  }
}

// Obtener categorías desde localStorage (fallback)
function getLocalCategorias(): Categoria[] {
  const saved = localStorage.getItem('uniautomarket_categorias');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing local categorias:', e);
    }
  }
  // Si no hay nada en localStorage, retornar array vacío
  // (los datos iniciales se cargarán desde el import)
  return [];
}
