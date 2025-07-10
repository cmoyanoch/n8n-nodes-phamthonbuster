#!/bin/bash

# Script de instalación del nodo Phantombuster para n8n en Docker
# Autor: Cristian
# Fecha: $(date)

set -e

echo "🐳 Instalando nodo Phantombuster para n8n en Docker..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Ejecuta este script desde el directorio del proyecto."
    exit 1
fi

# Verificar que Docker está instalado
if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar que docker-compose está instalado
if ! command -v docker compose &> /dev/null; then
    print_error "docker compose no está instalado. Por favor instala docker compose primero."
    exit 1
fi

print_status "Verificando dependencias..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Por favor instala Node.js primero:"
    echo ""
    echo "Opción 1 - Usando curl:"
    echo "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs"
    echo ""
    echo "Opción 2 - Usando snap:"
    echo "sudo snap install node --classic"
    echo ""
    echo "Opción 3 - Descarga manual desde: https://nodejs.org/"
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado. Por favor instala npm primero."
    exit 1
fi

# Instalar dependencias si no están instaladas
if [ ! -d "node_modules" ]; then
    print_status "Instalando dependencias..."
    npm install
else
    print_status "Dependencias ya instaladas."
fi

# Construir el proyecto
print_status "Construyendo el nodo..."
npm run build

# Verificar que el docker-compose.yml existe en /root
DOCKER_COMPOSE_PATH="/root/docker-compose.yml"
if [ ! -f "$DOCKER_COMPOSE_PATH" ]; then
    print_error "No se encontró docker-compose.yml en /root."
    print_error "Asegúrate de que el docker-compose.yml esté en /root."
    exit 1
fi

print_success "✅ Nodo construido correctamente."
print_success "✅ docker-compose.yml encontrado en /root."

# Verificar la estructura de archivos
print_status "Verificando archivos del nodo..."
if [ -d "dist/nodes/PhantombusterApi" ] && [ -f "dist/credentials/PhantombusterCredentialsApi.credentials.js" ]; then
    print_success "✅ Archivos del nodo verificados correctamente."
else
    print_error "❌ No se encontraron los archivos del nodo en dist/"
    print_error "Estructura esperada:"
    echo "   dist/nodes/PhantombusterApi/"
    echo "   dist/credentials/PhantombusterCredentialsApi.credentials.js"
    exit 1
fi

# Mostrar información de configuración
echo ""
print_status "📋 Configuración del docker-compose.yml:"
echo "   • Imagen: docker.n8n.io/n8nio/n8n:1.95.3"
echo "   • Nodos personalizados montados en: /home/node/.n8n/custom"
echo "   • Variables de entorno configuradas"
echo ""

print_status "🚀 Para iniciar n8n con el nodo Phantombuster:"
echo ""
echo "1. Ve al directorio donde está tu docker-compose.yml:"
echo "   cd /root"
echo ""
echo "2. Inicia los servicios:"
echo "   docker compose up -d"
echo ""
echo "3. Verifica que n8n esté corriendo:"
echo "   docker compose ps"
echo ""
echo "4. Accede a n8n:"
echo "   http://localhost:5678"
echo ""

print_status "🔧 Para configurar las credenciales:"
echo "1. Abre n8n en tu navegador"
echo "2. Ve a Credentials → Add Credential"
echo "3. Busca 'Phantombuster Credentials API'"
echo "4. Ingresa tu API Key de Phantombuster"
echo ""

print_status "🎯 Para usar el nodo:"
echo "1. Crea un nuevo workflow en n8n"
echo "2. Haz clic en Add Node"
echo "3. Busca 'Phantombuster' en la lista"
echo "4. Selecciona el recurso y operación deseada"
echo ""

# Verificar si n8n ya está corriendo
if docker ps | grep -q n8n; then
    print_warning "⚠️  n8n ya está corriendo. Necesitarás reiniciarlo para cargar el nuevo nodo."
    echo ""
    echo "Para reiniciar n8n:"
    echo "cd /root && docker compose restart n8n"
    echo ""
fi

print_success "🎉 ¡Instalación completada! El nodo Phantombuster está listo para usar con Docker."
echo ""
print_status "📁 Archivos instalados:"
echo "   • dist/nodes/PhantombusterApi/ (montado en Docker)"
echo "   • dist/credentials/PhantombusterCredentialsApi.credentials.js"
echo ""

print_status "🔍 Funcionalidades disponibles:"
echo "   • 🔍 Búsqueda de perfiles de LinkedIn"
echo "   • 👤 Visitas de perfiles automatizadas"
echo "   • 🍪 Gestión de cookies de LinkedIn"
echo "   • 🤖 Monitoreo de agentes"
echo "   • ⚙️ Configuración de límites y seguridad"

print_status "📝 Notas importantes:"
echo "   • El docker-compose.yml debe estar en /root"
echo "   • Asegúrate de que la ruta del nodo en docker-compose.yml sea correcta"
echo "   • Si el directorio se llama 'n8n-nodes-phamthonbuster', actualiza el docker-compose.yml"
echo ""

print_status "🔧 Comandos útiles:"
echo "   • Verificar montaje: docker exec root-n8n-1 ls -la /home/node/.n8n/custom/phantombuster/"
echo "   • Ver logs: docker compose logs n8n"
echo "   • Reiniciar: cd /root && docker compose restart n8n"
