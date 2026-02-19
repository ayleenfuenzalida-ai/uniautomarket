# Script de PowerShell para actualizar archivos de Firebase
# Ejecutar como: .\actualizar_firebase.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ACTUALIZACIÓN FIREBASE - UNIAUTOMARKET" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Ruta del proyecto
$proyectoPath = "C:\Users\aylee\Desktop\universal automarket\proyecto"

# Verificar que la carpeta existe
if (-not (Test-Path $proyectoPath)) {
    Write-Host "❌ Error: No se encontró la carpeta del proyecto en:" -ForegroundColor Red
    Write-Host "   $proyectoPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, verifica la ruta y modifica este script." -ForegroundColor Yellow
    exit 1
}

Set-Location $proyectoPath

Write-Host "📁 Proyecto encontrado en:" -ForegroundColor Green
Write-Host "   $proyectoPath" -ForegroundColor Gray
Write-Host ""

# Verificar estructura
Write-Host "🔍 Verificando estructura de carpetas..." -ForegroundColor Yellow

$appSrcUtilsPath = Join-Path $proyectoPath "app\src\utils"
$appSrcContextsPath = Join-Path $proyectoPath "app\src\contexts"
$srcUtilsPath = Join-Path $proyectoPath "src\utils"
$srcContextsPath = Join-Path $proyectoPath "src\contexts"

$tieneApp = Test-Path $appSrcUtilsPath
$tieneSrc = Test-Path $srcUtilsPath

Write-Host "   Carpeta app/src/utils existe: $tieneApp" -ForegroundColor $(if($tieneApp){"Green"}else{"Red"})
Write-Host "   Carpeta src/utils existe: $tieneSrc" -ForegroundColor $(if($tieneSrc){"Green"}else{"Red"})
Write-Host ""

# Función para copiar archivos
function Copiar-ArchivoSeguro {
    param(
        [string]$Origen,
        [string]$Destino,
        [string]$Nombre
    )
    
    if (Test-Path $Origen) {
        try {
            Copy-Item -Path $Origen -Destination $Destino -Force
            Write-Host "   ✅ $Nombre copiado exitosamente" -ForegroundColor Green
            return $true
        } catch {
            Write-Host "   ❌ Error copiando $Nombre`: $_" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "   ⚠️ No se encontró: $Origen" -ForegroundColor Yellow
        return $false
    }
}

# Copiar archivos desde app/ a raíz
Write-Host "📋 Copiando archivos desde app/ a raíz..." -ForegroundColor Yellow
Write-Host ""

$firebaseOrigen = Join-Path $appSrcUtilsPath "firebase.ts"
$firebaseDestino = Join-Path $srcUtilsPath "firebase.ts"
$dataContextOrigen = Join-Path $appSrcContextsPath "DataContext.tsx"
$dataContextDestino = Join-Path $srcContextsPath "DataContext.tsx"

$resultado1 = Copiar-ArchivoSeguro -Origen $firebaseOrigen -Destino $firebaseDestino -Nombre "firebase.ts"
$resultado2 = Copiar-ArchivoSeguro -Origen $dataContextOrigen -Destino $dataContextDestino -Nombre "DataContext.tsx"

Write-Host ""

# Verificar si los archivos ya existen en la raíz (podrían ser los correctos)
if (-not $resultado1 -or -not $resultado2) {
    Write-Host "⚠️ Algunos archivos no se encontraron en app/" -ForegroundColor Yellow
    Write-Host "   Verificando si ya existen en src/..." -ForegroundColor Yellow
    Write-Host ""
    
    if (Test-Path $firebaseDestino) {
        Write-Host "   ℹ️ firebase.ts ya existe en src/utils" -ForegroundColor Cyan
    }
    if (Test-Path $dataContextDestino) {
        Write-Host "   ℹ️ DataContext.tsx ya existe en src/contexts" -ForegroundColor Cyan
    }
}

# Verificar contenido de los archivos
Write-Host ""
Write-Host "🔍 Verificando contenido de los archivos..." -ForegroundColor Yellow

if (Test-Path $firebaseDestino) {
    $contenido = Get-Content $firebaseDestino -Raw
    if ($contenido -match "firebase") {
        Write-Host "   ✅ firebase.ts contiene referencias a Firebase" -ForegroundColor Green
    } else {
        Write-Host "   ❌ firebase.ts NO contiene referencias a Firebase" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ firebase.ts no existe en src/utils" -ForegroundColor Red
}

if (Test-Path $dataContextDestino) {
    $contenido = Get-Content $dataContextDestino -Raw
    if ($contenido -match "fetchCategoriasFromFirebase") {
        Write-Host "   ✅ DataContext.tsx importa desde Firebase" -ForegroundColor Green
    } else {
        Write-Host "   ❌ DataContext.tsx NO importa desde Firebase" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ DataContext.tsx no existe en src/contexts" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INSTRUCCIONES SIGUIENTES:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Si los archivos se copiaron correctamente:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Yellow
Write-Host "   git commit -m \"Migrar de GitHub/localStorage a Firebase\"" -ForegroundColor Yellow
Write-Host "   git push origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Espera a que Vercel haga el deploy automático" -ForegroundColor White
Write-Host ""
Write-Host "3. Verifica en la consola del navegador (F12) que:" -ForegroundColor White
Write-Host "   - NO aparezca: 'No GitHub token, saving to localStorage only'" -ForegroundColor Yellow
Write-Host "   - SÍ aparezca: mensajes de Firebase como 'Firebase inicializado'" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Prueba la sincronización:" -ForegroundColor White
Write-Host "   - Crea un negocio desde el Super Admin" -ForegroundColor Yellow
Write-Host "   - Ábrelo en otro dispositivo/celular" -ForegroundColor Yellow
Write-Host "   - Verifica que el negocio aparezca en ambos" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# Preguntar si quiere hacer git commit y push
$respuesta = Read-Host "¿Deseas hacer git commit y push ahora? (s/n)"
if ($respuesta -eq "s" -or $respuesta -eq "S") {
    Write-Host ""
    Write-Host "🚀 Ejecutando git commands..." -ForegroundColor Green
    
    git add .
    git commit -m "Migrar de GitHub/localStorage a Firebase"
    git push origin main
    
    Write-Host ""
    Write-Host "✅ Push completado!" -ForegroundColor Green
    Write-Host "   Revisa el estado del deploy en: https://vercel.com/dashboard" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "⏸️ Recuerda hacer git commit y push manualmente cuando estés listo." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
