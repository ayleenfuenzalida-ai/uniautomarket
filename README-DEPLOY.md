# Universal AutoMarket - Deploy en Vercel

## Paso 1: Subir a GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `uniautomarket`
3. Haz clic en "Create repository"
4. Sube los archivos:
   - Arrastra todos los archivos de esta carpeta al GitHub
   - O usa el botón "uploading an existing file"

## Paso 2: Conectar a Vercel

1. Ve a https://vercel.com/new
2. Inicia sesión con tu cuenta de GitHub
3. Selecciona el repositorio `uniautomarket`
4. Configuración:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Haz clic en "Deploy"

## Paso 3: Conectar tu dominio

1. En Vercel, entra a tu proyecto
2. Ve a "Settings" → "Domains"
3. Agrega: `uniautomarket.cl`
4. Vercel te dará registros DNS tipo A y CNAME

## Paso 4: Configurar DNS en GoDaddy

1. Ve a https://godaddy.com → "My Products" → "DNS"
2. Busca tu dominio `uniautomarket.cl`
3. Ve a "Manage DNS"
4. Agrega estos registros que te dio Vercel:
   - Tipo A: @ → IP de Vercel
   - Tipo CNAME: www → cname.vercel-dns.com

## ¡Listo!

Tu marketplace estará en: https://uniautomarket.cl

---

## Cuenta de Admin (para editar datos)

- Email: admin@uniautomarket.com
- Contraseña: admin123

O usa el botón "Admin" en el header.
