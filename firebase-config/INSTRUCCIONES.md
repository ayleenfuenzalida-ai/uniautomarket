# 🔥 INSTRUCCIONES PARA AGREGAR FIREBASE A UNIAUTOMARKET

## PASO 1: Instalar Firebase en tu proyecto

Abre la terminal en la carpeta de tu proyecto y ejecuta:

```bash
npm install firebase
```

## PASO 2: Crear el archivo de Firebase

1. Crea una carpeta llamada `src/utils` (si no existe)
2. Crea un archivo llamado `firebase.ts` dentro de `src/utils`
3. Copia y pega el contenido del archivo `firebase.ts` que te di

## PASO 3: Actualizar el DataContext

1. Busca tu archivo `DataContext.tsx` (generalmente en `src/contexts/`)
2. Reemplázalo completamente con el archivo `DataContext.tsx` que te di

## PASO 4: Configurar variables de entorno en Vercel

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Entra a tu proyecto **uniautomarket**
3. Ve a **Settings** → **Environment Variables**
4. Agrega estas variables una por una:

```
VITE_FIREBASE_API_KEY = AIzaSyCWPzLCFQbS6BOMnkT8R7AkfNm1I0r4cAI
VITE_FIREBASE_AUTH_DOMAIN = uniautomarket-f6ffa.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = uniautomarket-f6ffa
VITE_FIREBASE_STORAGE_BUCKET = uniautomarket-f6ffa.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 419809946130
VITE_FIREBASE_APP_ID = 1:419809946130:web:b19c58f9203fb42b9d46cb
```

## PASO 5: Subir los cambios a Vercel

### Opción A: Si usas GitHub
1. Haz commit y push de tus cambios:
```bash
git add .
git commit -m "Agregar Firebase para sincronización en tiempo real"
git push
```
2. Vercel hará deploy automático

### Opción B: Si subes manualmente
1. En tu computador, crea un ZIP con todos los archivos
2. Ve a Vercel → tu proyecto → **Deployments**
3. Arrastra el ZIP o selecciona "Upload"

## PASO 6: Verificar que funciona

1. Abre tu sitio: https://uniautomarket.cl
2. Crea un negocio desde el Super Admin
3. Abre el sitio en tu celular u otra computadora
4. El negocio debería aparecer automáticamente

## ⚠️ IMPORTANTE

- Los datos ahora se guardan en la nube (Firebase)
- Cualquier cambio se ve instantáneamente en todos los dispositivos
- No necesitas recargar la página para ver nuevos negocios

## 🆘 Si tienes problemas

Escríbeme el error exacto que aparece y te ayudo a solucionarlo.
