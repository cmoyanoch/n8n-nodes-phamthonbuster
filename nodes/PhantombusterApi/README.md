# n8n Phantombuster Node

Este nodo permite realizar operaciones avanzadas con la API de Phantombuster, incluyendo búsqueda de perfiles de LinkedIn, visitas de perfiles, gestión de cookies, monitoreo de agentes y configuración del sistema.

## Recursos soportados

- **🔍 Búsqueda de Perfiles**: Búsqueda avanzada en LinkedIn
- **👤 Visitas de Perfiles**: Visitar y gestionar perfiles
- **🍪 Gestión de Cookies**: Verificar y actualizar cookies de LinkedIn
- **🤖 Monitoreo de Agentes**: Estado y logs de agentes
- **⚙️ Sistema y Salud**: Estado del sistema y uso de API
- **🔧 Configuración**: Límites y configuración de la cuenta

## Ejemplo de uso para Búsqueda

### Buscar perfiles de LinkedIn

- Recurso: `Búsqueda de Perfiles`
- Operación: `Buscar Perfiles`
- Campos requeridos: Consulta
- Campos opcionales: Ubicación, Industria, Empresa, Cargo, etc.

### Buscar empresas

- Recurso: `Búsqueda de Perfiles`
- Operación: `Buscar Empresas`
- Campos requeridos: Consulta
- Campos opcionales: Ubicación, Industria, etc.

## Ejemplo de uso para Perfiles

### Visitar un perfil

- Recurso: `Visitas de Perfiles`
- Operación: `Visitar Perfil`
- Campos requeridos: URL del Perfil o ID del Perfil
- Campos opcionales: Mensaje, Asunto, Nota de Conexión, Retraso

### Obtener información del perfil

- Recurso: `Visitas de Perfiles`
- Operación: `Obtener Información`
- Campos requeridos: Profile ID

### Obtener historial de visitas

- Recurso: `Visitas de Perfiles`
- Operación: `Obtener Todas las Visitas`
- Campos opcionales: Filtros por fecha y estado

## Ejemplo de uso para Cookies

### Verificar cookie

- Recurso: `Gestión de Cookies`
- Operación: `Verificar Cookie`
- Campos requeridos: Cookie ID

### Actualizar cookie

- Recurso: `Gestión de Cookies`
- Operación: `Actualizar Cookie`
- Campos requeridos: Cookie ID
- Campos opcionales: Valor de Cookie, Plataforma, Estado, Notas

### Validar cookie

- Recurso: `Gestión de Cookies`
- Operación: `Validar Cookie`
- Campos requeridos: Cookie ID

### Obtener todas las cookies

- Recurso: `Gestión de Cookies`
- Operación: `Obtener Todas las Cookies`
- Campos opcionales: Filtros por estado y plataforma

## Ejemplo de uso para Agentes

### Obtener estado del agente

- Recurso: `Monitoreo de Agentes`
- Operación: `Obtener Estado`
- Campos requeridos: Agent ID

### Obtener logs del agente

- Recurso: `Monitoreo de Agentes`
- Operación: `Obtener Logs`
- Campos requeridos: Agent ID
- Campos opcionales: Filtros por nivel, fecha desde/hasta

### Obtener todos los agentes

- Recurso: `Monitoreo de Agentes`
- Operación: `Obtener Todos los Agentes`
- Campos opcionales: Filtros por estado y tipo

## Ejemplo de uso para Sistema

### Obtener salud del sistema

- Recurso: `Sistema y Salud`
- Operación: `Obtener Salud del Sistema`

### Obtener estado del sistema

- Recurso: `Sistema y Salud`
- Operación: `Obtener Estado del Sistema`

### Obtener uso de API

- Recurso: `Sistema y Salud`
- Operación: `Obtener Uso de API`
- Campos opcionales: Filtros por fecha desde/hasta

## Ejemplo de uso para Configuración

### Obtener límites

- Recurso: `Configuración`
- Operación: `Obtener Límites`

### Actualizar límites

- Recurso: `Configuración`
- Operación: `Actualizar Límites`
- Campos requeridos: Tipo de Cuenta
- Campos opcionales: Límite Diario, Límite por Hora, Retrasos

### Obtener configuración

- Recurso: `Configuración`
- Operación: `Obtener Configuración`

### Actualizar configuración

- Recurso: `Configuración`
- Operación: `Actualizar Configuración`
- Campos opcionales: Modo Seguro, Horas de Actividad, Días de Actividad, Notificaciones

---

Consulta la [documentación oficial de la API de Phantombuster](https://api.phantombuster.com/docs/) para más detalles sobre los endpoints y su estructura. 
