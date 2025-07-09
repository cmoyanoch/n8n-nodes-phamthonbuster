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
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose no está instalado. Por favor instala docker-compose primero."
    exit 1
fi

print_status "Verificando dependencias..."

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

# Verificar que el docker-compose.yml existe en el directorio padre
DOCKER_COMPOSE_PATH="../docker-compose.yml"
if [ ! -f "$DOCKER_COMPOSE_PATH" ]; then
    print_error "No se encontró docker-compose.yml en el directorio padre."
    print_error "Asegúrate de que el docker-compose.yml esté en el directorio correcto."
    exit 1
fi

print_success "✅ Nodo construido correctamente."
print_success "✅ docker-compose.yml encontrado."

# Verificar la estructura de archivos
print_status "Verificando archivos del nodo..."
if [ -d "dist/nodes/PhantombusterApi" ] && [ -f "dist/credentials/PhantombusterCredentialsApi.credentials.js" ]; then
    print_success "✅ Archivos del nodo verificados correctamente."
else
    print_error "❌ No se encontraron los archivos del nodo en dist/"
    exit 1
fi

# Mostrar información de configuración
echo ""
print_status "📋 Configuración del docker-compose.yml:"
echo "   • Imagen corregida: n8nio/n8n:1.95.3"
echo "   • Nodos personalizados montados en: /home/node/.n8n/custom"
echo "   • Variables de entorno configuradas"
echo ""

print_status "🚀 Para iniciar n8n con el nodo Phantombuster:"
echo ""
echo "1. Ve al directorio donde está tu docker-compose.yml:"
echo "   cd .."
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
    echo "docker compose restart n8n"
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
