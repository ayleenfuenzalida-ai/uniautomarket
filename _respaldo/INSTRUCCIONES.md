# INSTRUCCIONES PARA SOLUCIONAR LA SINCRONIZACIÓN

## 📋 Resumen del Problema
El sitio web **uniautomarket.cl** NO está sincronizando datos entre dispositivos porque todavía está usando `localStorage/GitHub` en lugar de **Firebase**.

He verificado el código en producción y **NO contiene referencias a Firebase**, lo que confirma que los archivos actualizados no se han copiado correctamente.

## 🔧 Solución

Necesitas copiar los archivos actualizados desde la carpeta `app/` a la raíz del proyecto, donde Vercel los compila.

## 📁 Archivos que Necesitas

Te he preparado 3 archivos:

1. **firebase.ts** - Configuración de Firebase
2. **DataContext.tsx** - Contexto actualizado que usa Firebase
3. **actualizar_firebase.ps1** - Script de PowerShell para automatizar la copia

## 🚀 Método 1: Script Automático (Recomendado)

1. Copia el archivo `actualizar_firebase.ps1` a tu carpeta del proyecto:
   ```
   C:\Users\aylee\Desktop\universal automarket\proyecto\
   ```

2. Abre PowerShell como Administrador

3. Navega a la carpeta del proyecto:
   ```powershell
   cd "C:\Users\aylee\Desktop\universal automarket\proyecto"
   ```

4. Ejecuta el script:
   ```powershell
   .\actualizar_firebase.ps1
   ```

5. El script te preguntará si quieres hacer git commit y push. Selecciona `s` para sí.

## 📝 Método 2: Manual

Si prefieres hacerlo manualmente:

### Paso 1: Copiar firebase.ts
```powershell
copy "app\src\utils\firebase.ts" "src\utils\firebase.ts"
```

### Paso 2: Copiar DataContext.tsx
```powershell
copy "app\src\contexts\DataContext.tsx" "src\contexts\DataContext.tsx"
```

### Paso 3: Verificar que Firebase está instalado
```powershell
npm list firebase
```

Si no está instalado:
```powershell
npm install firebase
```

### Paso 4: Hacer commit y push
```powershell
git add .
git commit -m "Migrar de GitHub/localStorage a Firebase"
git push origin main
```

## ✅ Verificación

Después del deploy en Vercel (toma 2-3 minutos):

1. Abre **uniautomarket.cl** en tu navegador
2. Presiona **F12** para abrir la consola
3. Recarga la página con **Ctrl+Shift+R** (sin caché)
4. Verifica que:
   - ❌ **NO** aparezca: `"No GitHub token, saving to localStorage only"`
   - ✅ **SÍ** aparezca: `"Firebase inicializado correctamente"` o `"Obteniendo datos desde Firebase"`

5. Prueba la sincronización:
   - Crea un negocio desde el Super Admin en tu computador
   - Abre el sitio en tu celular u otro dispositivo
   - Verifica que el negocio aparezca en ambos

## 🆘 Si los Archivos no Existen en app/

Si los archivos `firebase.ts` o `DataContext.tsx` no existen en `app/src/`, usa los archivos que te he preparado:

1. Copia **firebase.ts** a: `src/utils/firebase.ts`
2. Copia **DataContext.tsx** a: `src/contexts/DataContext.tsx`

## 📞 Variables de Entorno (Ya Configuradas)

Las variables de entorno de Firebase ya están configuradas en Vercel:
- ✅ VITE_FIREBASE_API_KEY
- ✅ VITE_FIREBASE_AUTH_DOMAIN
- ✅ VITE_FIREBASE_PROJECT_ID
- ✅ VITE_FIREBASE_STORAGE_BUCKET
- ✅ VITE_FIREBASE_MESSAGING_SENDER_ID
- ✅ VITE_FIREBASE_APP_ID

## ⚠️ Importante

- **NO** modifiques los archivos en la carpeta `app/` - esa es tu copia de respaldo
- **SÍ** modifica los archivos en la raíz (`src/`) - esos son los que usa Vercel
- Después de cada cambio, espera 2-3 minutos a que Vercel haga el deploy

## 🎯 Resultado Esperado

Una vez completado:
- ✅ Los negocios creados en el Super Admin se verán en tiempo real en todos los dispositivos
- ✅ Los datos se guardan en Firebase (nube) y no en localStorage
- ✅ La sincronización es automática (tiempo real)
- ✅ No más mensajes de "No GitHub token"

---

**¿Tienes problemas?** Avísame y te ayudo paso a paso.
