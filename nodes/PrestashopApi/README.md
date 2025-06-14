# n8n PrestaShop Node

Este nodo permite realizar operaciones avanzadas sobre la API de PrestaShop 1.7, incluyendo gestión completa de productos, clientes, pedidos, catálogo, características y valores de características.

## Recursos soportados

- **Productos**: CRUD, filtros, búsqueda
- **Clientes**: CRUD, filtros, búsqueda
- **Pedidos**: Obtener, listar, actualizar estado
- **Catálogo**: Categorías, fabricantes, proveedores
- **Características**: Crear, obtener, listar, actualizar, eliminar
- **Valores de Características**: Crear, obtener, listar, actualizar, eliminar

## Ejemplo de uso para Características

### Crear una característica

- Recurso: `Características`
- Operación: `Crear`
- Campos requeridos: Nombre

### Obtener una característica

- Recurso: `Características`
- Operación: `Obtener`
- Campos requeridos: Feature ID

### Listar todas las características

- Recurso: `Características`
- Operación: `Obtener Todas`

### Actualizar una característica

- Recurso: `Características`
- Operación: `Actualizar`
- Campos requeridos: Feature ID, Nombre

### Eliminar una característica

- Recurso: `Características`
- Operación: `Eliminar`
- Campos requeridos: Feature ID

## Ejemplo de uso para Valores de Características

### Crear un valor de característica

- Recurso: `Valores de Características`
- Operación: `Crear`
- Campos requeridos: ID de Característica, Valor

### Obtener un valor de característica

- Recurso: `Valores de Características`
- Operación: `Obtener`
- Campos requeridos: Feature Value ID

### Listar todos los valores de características

- Recurso: `Valores de Características`
- Operación: `Obtener Todos`

### Actualizar un valor de característica

- Recurso: `Valores de Características`
- Operación: `Actualizar`
- Campos requeridos: Feature Value ID, ID de Característica, Valor

### Eliminar un valor de característica

- Recurso: `Valores de Características`
- Operación: `Eliminar`
- Campos requeridos: Feature Value ID

---

Consulta la documentación oficial de la [API de PrestaShop 1.7](https://devdocs.prestashop-project.org/1.7/webservice/resources/) para más detalles sobre los recursos y su estructura.
