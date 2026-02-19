# INSTRUCCIONES DE INSTALACIÓN - FIREBASE FIX

## PASOS PARA INSTALAR

### 1. COPIAR ARCHIVOS
Copia estas carpetas a tu proyecto:
- `src/utils/` → Reemplaza tu carpeta `src/utils/`
- `src/contexts/` → Reemplaza tu carpeta `src/contexts/`

### 2. INSTALAR DEPENDENCIAS
```bash
npm install firebase
```

### 3. CONFIGURAR VARIABLES EN VERCEL
Ve a Vercel → Settings → Environment Variables y agrega:

```
VITE_FIREBASE_API_KEY = AIzaSyCWPzLCFQbS6BOMnkT8R7AkfNm1I0r4cAI
VITE_FIREBASE_AUTH_DOMAIN = uniautomarket-f6ffa.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = uniautomarket-f6ffa
VITE_FIREBASE_STORAGE_BUCKET = uniautomarket-f6ffa.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 419809946130
VITE_FIREBASE_APP_ID = 1:419809946130:web:b19c58f9203fb42b9d46cb
```

### 4. SUBIR A GITHUB
```bash
git add .
git commit -m "Implementar Firebase para sincronizacion en tiempo real"
git push
```

### 5. VERIFICAR
Espera 2-3 minutos a que Vercel haga el deploy.
Abre tu sitio y prueba crear un negocio.
Debería sincronizarse en todos los dispositivos.
