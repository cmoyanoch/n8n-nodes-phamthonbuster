![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-starter

Starter template para crear nodos personalizados de n8n.

---

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

## Prerequisites

You need the following installed on your development machine:

- [git](https://git-scm.com/downloads)
- Node.js and npm. Minimum version Node 20. You can find instructions on how to install both using nvm (Node Version Manager) for Linux, Mac, and WSL [here](https://github.com/nvm-sh/nvm). For Windows users, refer to Microsoft's guide to [Install NodeJS on Windows](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows).
- Install n8n with:
  ```
  npm install n8n -g
  ```
- Recommended: follow n8n's guide to [set up your development environment](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/).

## Using this starter

These are the basic steps for working with the starter. For detailed guidance on creating and publishing nodes, refer to the [documentation](https://docs.n8n.io/integrations/creating-nodes/).

1. [Generate a new repository](https://github.com/n8n-io/n8n-nodes-starter/generate) from this template repository.
2. Clone your new repo:
   ```
   git clone https://github.com/<your organization>/<your-repo-name>.git
   ```
3. Run `npm i` to install dependencies.
4. Open the project in your editor.
5. Browse the examples in `/nodes` and `/credentials`. Modify the examples, or replace them with your own nodes.
6. Update the `package.json` to match your details.
7. Run `npm run lint` to check for errors or `npm run lintfix` to automatically fix errors when possible.
8. Test your node locally. Refer to [Run your node locally](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/) for guidance.
9. Replace this README with documentation for your node. Use the [README_TEMPLATE](README_TEMPLATE.md) to get started.
10. Update the LICENSE file to use your details.
11. [Publish](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry) your package to npm.

## More information

Refer to our [documentation on creating nodes](https://docs.n8n.io/integrations/creating-nodes/) for detailed information on building your own nodes.

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
