# 🔗 Nodo Phantombuster para n8n

Nodo personalizado de n8n para integrar con la API de Phantombuster, proporcionando automatización completa de LinkedIn y otras plataformas sociales.

## 📋 Índice

- [🚀 Instalación Rápida](#-instalación-rápida)
- [📦 Funcionalidades](#-funcionalidades)
- [🛠️ Configuración](#️-configuración)
- [📖 Guía de Uso](#-guía-de-uso)
- [🔧 Ejemplos Prácticos](#-ejemplos-prácticos)
- [🔄 Migración a AI Tools](#-migración-a-ai-tools)
- [🐳 Instalación con Docker](#-instalación-con-docker)
- [📚 Documentación Técnica](#-documentación-técnica)
- [🛠️ Solución de Problemas](#️-solución-de-problemas)

---

## 🚀 Instalación Rápida

### Opción 1: Instalación Automática (Recomendada)

```bash
# Desde el directorio del nodo
./install-for-docker.sh
```

### Opción 2: Instalación Manual

```bash
# 1. Instalar dependencias
npm install

# 2. Compilar el nodo
npm run build

# 3. Reiniciar n8n
docker restart <contenedor-n8n>
```

---

## 📦 Funcionalidades

### 🎯 Agentes de LinkedIn

- **Profile Visitor**: Visita perfiles automáticamente
- **Autoconnect**: Envía solicitudes de conexión
- **Message Sender**: Envía mensajes personalizados
- **Search Export**: Exporta resultados de búsqueda

### 📊 Gestión de Containers

- **Descargar resultados**: JSON y CSV
- **Listar containers**: Ver todos los containers
- **Eliminar containers**: Limpiar datos antiguos

### 👥 Gestión de Leads

- **Obtener leads**: Descargar desde containers
- **Guardar leads**: En CRM de Phantombuster
- **Buscar leads**: Búsqueda avanzada
- **Eliminar leads**: Gestión de datos

### 🔄 Operaciones de Sistema

- **Listar ejecuciones**: Historial de agentes
- **Renovar cookies**: Mantener sesiones activas
- **Verificar cookies**: Estado de autenticación
- **Obtener límites**: Monitoreo de uso

---

## 🛠️ Configuración

### 1. Credenciales de Phantombuster

1. Ve a **Settings > Credentials** en n8n
2. Haz clic en **"Add Credential"**
3. Busca **"Phantombuster Credentials API"**
4. Completa:
   - **API Key**: Tu clave API de Phantombuster
5. Haz clic en **"Save"**

### 2. Configuración de Agentes

Para usar agentes de LinkedIn:

1. Crea un agente en Phantombuster
2. Configura las cookies de LinkedIn
3. Ajusta los parámetros de seguridad
4. Obtén el ID del agente

---

## 📖 Guía de Uso

### Nodo Principal (Phantombuster)

1. **Agregar nodo**: Busca "Phantombuster" en la barra lateral
2. **Seleccionar herramienta**: Elige la operación deseada
3. **Configurar parámetros**: Completa los campos requeridos
4. **Ejecutar**: El nodo realizará la operación

### Nodos AI Tools

#### Phantombuster Tool

- **Uso**: Para AI Agents (n8n Cloud/AI/MCP Server)
- **Funcionalidad**: Expone operaciones como herramientas AI
- **Configuración**: Selecciona la operación y configura credenciales

#### Phantombuster MCP Tool

- **Uso**: Para integración con sub-workflows
- **Funcionalidad**: Llama workflows personalizados desde AI Agents
- **Configuración**: Especifica Workflow ID y parámetros

---

## 🔧 Ejemplos Prácticos

### Ejemplo 1: Ejecutar Agente y Descargar Resultados

```json
{
	"name": "Automatización LinkedIn",
	"nodes": [
		{
			"name": "Webhook Trigger",
			"type": "n8n-nodes-base.webhook",
			"parameters": {
				"httpMethod": "POST",
				"path": "linkedin-automation"
			}
		},
		{
			"name": "Ejecutar Agente",
			"type": "phantombusterTool",
			"parameters": {
				"tool": "runAgent",
				"agentId": "{{ $json.agentId }}"
			}
		},
		{
			"name": "Descargar Resultados",
			"type": "phantombusterTool",
			"parameters": {
				"tool": "downloadContainer",
				"containerId": "{{ $json.containerId }}",
				"format": "json"
			}
		}
	]
}
```

### Ejemplo 2: Flujo de Monitoreo

```json
{
	"name": "Monitoreo Phantombuster",
	"nodes": [
		{
			"name": "Cron Trigger",
			"type": "n8n-nodes-base.cron",
			"parameters": {
				"rule": "0 */6 * * *"
			}
		},
		{
			"name": "Obtener Límites",
			"type": "phantombusterTool",
			"parameters": {
				"tool": "getLimits"
			}
		},
		{
			"name": "Verificar Cookies",
			"type": "phantombusterTool",
			"parameters": {
				"tool": "verifyCookies",
				"agentId": "{{ $json.agentId }}"
			}
		}
	]
}
```

### Ejemplo 3: Gestión de Leads

```json
{
	"name": "Gestión de Leads",
	"nodes": [
		{
			"name": "Obtener Leads",
			"type": "phantombusterTool",
			"parameters": {
				"tool": "getLeadsJson",
				"containerId": "{{ $json.containerId }}"
			}
		},
		{
			"name": "Guardar Leads",
			"type": "phantombusterTool",
			"parameters": {
				"tool": "saveLeads",
				"leadListId": "{{ $json.leadListId }}",
				"leads": "{{ $json.leads }}"
			}
		}
	]
}
```

---

## 🔄 Migración a AI Tools

### ¿Qué son los AI Tools?

Los AI Tools permiten que los agentes de inteligencia artificial usen tus nodos de n8n de forma natural, interpretando comandos en lenguaje humano.

### Tipos de Nodos AI

1. **Phantombuster Tool**: Operaciones directas
2. **Phantombuster MCP Tool**: Integración con workflows

### Configuración para AI Agents

#### Phantombuster Tool

```typescript
// El nodo expone operaciones como herramientas AI
{
  name: 'phantombuster_run_agent',
  description: 'Ejecuta un agente de Phantombuster',
  schema: z.object({
    agentId: z.string().describe('ID del agente'),
    launchApp: z.string().optional().describe('Aplicación a lanzar')
  })
}
```

#### Phantombuster MCP Tool

```typescript
// Llama sub-workflows desde AI Agents
{
  name: 'phantombuster_automation',
  description: 'Automatiza operaciones de Phantombuster',
  schema: z.object({
    action: z.string().describe('Acción a realizar'),
    agentId: z.string().optional().describe('ID del agente')
  })
}
```

### Ejemplo de Uso con AI Agent

```bash
# El AI Agent puede usar comandos como:
"Ejecuta el agente abc123 de LinkedIn"
"Descarga los leads del container def456"
"Guarda estos leads en la lista principal"
```

---

## 🐳 Instalación con Docker

### Requisitos Previos

- Docker y Docker Compose
- Node.js 20.15 o superior
- n8n ejecutándose en Docker

### Pasos de Instalación

1. **Clonar el proyecto**

   ```bash
   git clone <tu-repositorio>
   cd n8n-nodes-custome
   ```

2. **Ejecutar script de instalación**

   ```bash
   ./install-for-docker.sh
   ```

3. **Iniciar servicios**

   ```bash
   cd ..
   docker compose up -d
   ```

4. **Verificar instalación**
   ```bash
   docker compose ps
   ```

### Configuración del Docker Compose

```yaml
services:
  n8n:
    image: n8nio/n8n:1.95.3
    environment:
      - N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom
    volumes:
      - ./n8n-nodes-custome/dist:/home/node/.n8n/custom:ro
```

---

## 📚 Documentación Técnica

### Estructura del Proyecto

```
n8n-nodes-custome/
├── nodes/PhantombusterApi/          # Código fuente de los nodos
│   ├── Phantombuster.node.ts        # Nodo principal
│   ├── PhantombusterTool.node.ts    # Nodo AI Tool
│   ├── PhantombusterMCPTool.node.ts # Nodo MCP Tool
│   ├── GenericFunctions.ts          # Funciones auxiliares
│   └── descriptions/                # Descripciones de operaciones
├── credentials/                     # Configuración de credenciales
├── dist/                           # Archivos compilados
└── package.json                    # Configuración del proyecto
```

### Operaciones Disponibles

| Operación           | Endpoint                        | Descripción           |
| ------------------- | ------------------------------- | --------------------- |
| `runAgent`          | `POST /agents/fetch-and-launch` | Ejecuta un agente     |
| `downloadContainer` | `GET /containers/fetch-output`  | Descarga resultados   |
| `getLeadsJson`      | `GET /containers/fetch-output`  | Obtiene leads en JSON |
| `listExecutions`    | `GET /agents/fetch-output`      | Lista ejecuciones     |
| `saveLeads`         | `POST /lead-lists/save-leads`   | Guarda leads          |
| `searchLeads`       | `GET /lead-lists/search-leads`  | Busca leads           |
| `listLeadLists`     | `GET /lead-lists`               | Lista listas de leads |
| `getUserInfo`       | `GET /user`                     | Info del usuario      |
| `getLimits`         | `GET /orgs/export-agent-usage`  | Límites de la cuenta  |
| `renewCookies`      | `POST /agents/renew-cookies`    | Renueva cookies       |
| `verifyCookies`     | `GET /agents/verify-cookies`    | Verifica cookies      |

### Parámetros Comunes

- **agentId**: ID del agente de Phantombuster
- **containerId**: ID del container con resultados
- **leadListId**: ID de la lista de leads
- **format**: Formato de descarga (json/csv)
- **limit**: Número máximo de resultados

---

## 🛠️ Solución de Problemas

### Error: "Tool not found"

```bash
# Verificar que el nodo esté instalado
ls -la dist/nodes/PhantombusterApi/

# Reiniciar n8n
docker restart <contenedor-n8n>
```

### Error: "Invalid API Key"

- Verifica que la credencial sea correcta
- Comprueba que la API Key esté activa en Phantombuster
- Revisa los permisos de la clave API

### Error: "Agent not found"

- Verifica que el agentId sea correcto
- Comprueba que el agente esté activo en Phantombuster
- Revisa que el agente tenga las cookies configuradas

### Error: "Container not found"

- Verifica que el containerId sea correcto
- Comprueba que el container exista y tenga resultados
- Asegúrate de que el agente haya terminado de ejecutarse

### Error de Compilación

```bash
# Limpiar y reinstalar
rm -rf node_modules dist
npm install
npm run build
```

### Logs de n8n

```bash
# Ver logs en tiempo real
docker logs <contenedor-n8n> -f

# Ver logs específicos
docker logs <contenedor-n8n> | grep -i phantombuster
```

---

## 🔍 Testing

### Test Básico

```bash
# Verificar que el nodo esté disponible
curl -X GET http://localhost:5678/webhook/test-phantombuster
```

### Test de Operaciones

```bash
# Ejecutar agente
curl -X POST http://localhost:5678/webhook/execute-agent \
  -H "Content-Type: application/json" \
  -d '{"agentId": "tu-agent-id"}'

# Obtener información de usuario
curl -X GET http://localhost:5678/webhook/user-info
```

---

## 📞 Soporte

### Recursos Útiles

- [Documentación de Phantombuster](https://phantombuster.com/api-docs/)
- [Documentación de n8n](https://docs.n8n.io/)
- [Comunidad n8n](https://community.n8n.io/)

### Logs y Debugging

- Revisa los logs de n8n para errores
- Verifica la configuración de credenciales
- Comprueba la conectividad con la API de Phantombuster

---

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE.md` para más detalles.

---

## 🤝 Contribuciones

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Push a la rama
5. Abre un Pull Request

---

¡Con esta documentación completa ya puedes usar el nodo Phantombuster en tu instancia de n8n! 🚀
