import type { INodeProperties } from 'n8n-workflow';

// ========== PRODUCT OPERATIONS ==========
export const productOperations: INodeProperties[] = [
	{
		displayName: 'Operación',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['product'],
			},
		},
		options: [
			{
				name: 'Crear',
				value: 'create',
				description: 'Crear un nuevo producto',
				action: 'Crear un producto',
			},
			{
				name: 'Eliminar',
				value: 'delete',
				description: 'Eliminar un producto',
				action: 'Eliminar un producto',
			},
			{
				name: 'Obtener',
				value: 'get',
				description: 'Obtener un producto',
				action: 'Obtener un producto',
			},
			{
				name: 'Obtener Todos',
				value: 'getAll',
				description: 'Obtener todos los productos',
				action: 'Obtener todos los productos',
			},
			{
				name: 'Actualizar',
				value: 'update',
				description: 'Actualizar un producto',
				action: 'Actualizar un producto',
			},
		],
		default: 'get',
	},
];

// ========== PRODUCT FIELDS ==========
export const productFields: INodeProperties[] = [
	// Product ID
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'ID del producto',
	},

	// Product Data
	{
		displayName: 'Datos del Producto',
		name: 'productData',
		type: 'collection',
		placeholder: 'Añadir Campo',
		default: {},
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Nombre',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Nombre del producto',
			},
			{
				displayName: 'Descripción',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				description: 'Descripción del producto',
			},
			{
				displayName: 'Precio',
				name: 'price',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
					minValue: 0,
				},
				default: 0,
				description: 'Precio del producto',
			},
			{
				displayName: 'Referencia',
				name: 'reference',
				type: 'string',
				default: '',
				description: 'Referencia/SKU del producto',
			},
			{
				displayName: 'Cantidad',
				name: 'quantity',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Cantidad en stock',
			},
			{
				displayName: 'Activo',
				name: 'active',
				type: 'boolean',
				default: true,
				description: 'Si el producto está activo',
			},
			{
				displayName: 'Peso',
				name: 'weight',
				type: 'number',
				typeOptions: {
					numberPrecision: 3,
					minValue: 0,
				},
				default: 0,
				description: 'Peso del producto en kg',
			},
		],
	},

	// Return All
	{
		displayName: 'Devolver Todos',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Si devolver todos los resultados o solo un número limitado',
	},

	// Limit
	{
		displayName: 'Límite',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Número máximo de productos a devolver',
	},

	// Filters
	{
		displayName: 'Filtros',
		name: 'filters',
		type: 'collection',
		placeholder: 'Añadir Filtro',
		default: {},
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Activo',
				name: 'active',
				type: 'options',
				options: [
					{
						name: 'Todos',
						value: '',
					},
					{
						name: 'Solo Activos',
						value: '1',
					},
					{
						name: 'Solo Inactivos',
						value: '0',
					},
				],
				default: '',
				description: 'Filtrar por estado activo/inactivo',
			},
			{
				displayName: 'Nombre',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filtrar por nombre del producto',
			},
			{
				displayName: 'Referencia',
				name: 'reference',
				type: 'string',
				default: '',
				description: 'Filtrar por referencia del producto',
			},
		],
	},
];

// ========== CUSTOMER OPERATIONS ==========
export const customerOperations: INodeProperties[] = [
	{
		displayName: 'Operación',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customer'],
			},
		},
		options: [
			{
				name: 'Crear',
				value: 'create',
				description: 'Crear un nuevo cliente',
				action: 'Crear un cliente',
			},
			{
				name: 'Eliminar',
				value: 'delete',
				description: 'Eliminar un cliente',
				action: 'Eliminar un cliente',
			},
			{
				name: 'Obtener',
				value: 'get',
				description: 'Obtener un cliente',
				action: 'Obtener un cliente',
			},
			{
				name: 'Obtener Todos',
				value: 'getAll',
				description: 'Obtener todos los clientes',
				action: 'Obtener todos los clientes',
			},
			{
				name: 'Actualizar',
				value: 'update',
				description: 'Actualizar un cliente',
				action: 'Actualizar un cliente',
			},
		],
		default: 'get',
	},
];

// ========== CUSTOMER FIELDS ==========
export const customerFields: INodeProperties[] = [
	// Customer ID
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'ID del cliente',
	},

	// Customer Data
	{
		displayName: 'Datos del Cliente',
		name: 'customerData',
		type: 'collection',
		placeholder: 'Añadir Campo',
		default: {},
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'cliente@ejemplo.com',
				default: '',
				description: 'Email del cliente',
			},
			{
				displayName: 'Contraseña',
				name: 'passwd',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'Contraseña del cliente',
			},
			{
				displayName: 'Nombre',
				name: 'firstname',
				type: 'string',
				default: '',
				description: 'Nombre del cliente',
			},
			{
				displayName: 'Apellido',
				name: 'lastname',
				type: 'string',
				default: '',
				description: 'Apellido del cliente',
			},
			{
				displayName: 'Activo',
				name: 'active',
				type: 'boolean',
				default: true,
				description: 'Si el cliente está activo',
			},
		],
	},

	// Return All - Customer
	{
		displayName: 'Devolver Todos',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Si devolver todos los resultados o solo un número limitado',
	},

	// Limit - Customer
	{
		displayName: 'Límite',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Número máximo de clientes a devolver',
	},

	// Filters - Customer
	{
		displayName: 'Filtros',
		name: 'filters',
		type: 'collection',
		placeholder: 'Añadir Filtro',
		default: {},
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Activo',
				name: 'active',
				type: 'options',
				options: [
					{
						name: 'Todos',
						value: '',
					},
					{
						name: 'Solo Activos',
						value: '1',
					},
					{
						name: 'Solo Inactivos',
						value: '0',
					},
				],
				default: '',
				description: 'Filtrar por estado activo/inactivo',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Filtrar por email del cliente',
			},
		],
	},
];

// ========== ORDER OPERATIONS ==========
export const orderOperations: INodeProperties[] = [
	{
		displayName: 'Operación',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['order'],
			},
		},
		options: [
			{
				name: 'Obtener',
				value: 'get',
				description: 'Obtener un pedido',
				action: 'Obtener un pedido',
			},
			{
				name: 'Obtener Todos',
				value: 'getAll',
				description: 'Obtener todos los pedidos',
				action: 'Obtener todos los pedidos',
			},
			{
				name: 'Actualizar Estado',
				value: 'updateStatus',
				description: 'Actualizar el estado de un pedido',
				action: 'Actualizar estado del pedido',
			},
		],
		default: 'get',
	},
];

// ========== ORDER FIELDS ==========
export const orderFields: INodeProperties[] = [
	// Order ID
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['get', 'updateStatus'],
			},
		},
		default: '',
		description: 'ID del pedido',
	},

	// New State
	{
		displayName: 'Nuevo Estado',
		name: 'newState',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['updateStatus'],
			},
		},
		options: [
			{
				name: 'Esperando pago',
				value: '1',
			},
			{
				name: 'Pago aceptado',
				value: '2',
			},
			{
				name: 'Preparación en curso',
				value: '3',
			},
			{
				name: 'Enviado',
				value: '4',
			},
			{
				name: 'Entregado',
				value: '5',
			},
			{
				name: 'Cancelado',
				value: '6',
			},
			{
				name: 'Reembolsado',
				value: '7',
			},
			{
				name: 'Error de pago',
				value: '8',
			},
		],
		default: '2',
		description: 'Nuevo estado para el pedido',
	},

	// Send Email Notification
	{
		displayName: 'Enviar Email de Notificación',
		name: 'sendEmailNotification',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['updateStatus'],
			},
		},
		default: true,
		description: 'Enviar email de notificación al cliente sobre el cambio de estado',
	},

	// Return All - Order
	{
		displayName: 'Devolver Todos',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Si devolver todos los resultados o solo un número limitado',
	},

	// Limit - Order
	{
		displayName: 'Límite',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Número máximo de pedidos a devolver',
	},

	// Filters - Order
	{
		displayName: 'Filtros',
		name: 'filters',
		type: 'collection',
		placeholder: 'Añadir Filtro',
		default: {},
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'ID del Cliente',
				name: 'customer_id',
				type: 'string',
				default: '',
				description: 'Filtrar por ID del cliente',
			},
			{
				displayName: 'Estado Actual',
				name: 'current_state',
				type: 'string',
				default: '',
				description: 'Filtrar por estado actual del pedido',
			},
		],
	},
];

// ========== CATALOG OPERATIONS ==========
export const catalogOperations: INodeProperties[] = [
	{
		displayName: 'Operación',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['catalog'],
			},
		},
		options: [
			{
				name: 'Obtener Categorías',
				value: 'getCategories',
				description: 'Obtener todas las categorías',
				action: 'Obtener categorías',
			},
			{
				name: 'Obtener Fabricantes',
				value: 'getManufacturers',
				description: 'Obtener todos los fabricantes',
				action: 'Obtener fabricantes',
			},
			{
				name: 'Obtener Proveedores',
				value: 'getSuppliers',
				description: 'Obtener todos los proveedores',
				action: 'Obtener proveedores',
			},
		],
		default: 'getCategories',
	},
];

// ========== CATALOG FIELDS ==========
export const catalogFields: INodeProperties[] = [
	// Return All - Catalog
	{
		displayName: 'Devolver Todos',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['getCategories', 'getManufacturers', 'getSuppliers'],
			},
		},
		default: false,
		description: 'Si devolver todos los resultados o solo un número limitado',
	},

	// Limit - Catalog
	{
		displayName: 'Límite',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['getCategories', 'getManufacturers', 'getSuppliers'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Número máximo de elementos a devolver',
	},
];

// ========== FEATURE OPERATIONS ==========
export const featureOperations: INodeProperties[] = [
	{
		displayName: 'Operación',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['feature'],
			},
		},
		options: [
			{
				name: 'Crear',
				value: 'create',
				description: 'Crear una nueva característica',
				action: 'Crear una característica',
			},
			{
				name: 'Eliminar',
				value: 'delete',
				description: 'Eliminar una característica',
				action: 'Eliminar una característica',
			},
			{
				name: 'Obtener',
				value: 'get',
				description: 'Obtener una característica',
				action: 'Obtener una característica',
			},
			{
				name: 'Obtener Todas',
				value: 'getAll',
				description: 'Obtener todas las características',
				action: 'Obtener todas las características',
			},
			{
				name: 'Actualizar',
				value: 'update',
				description: 'Actualizar una característica',
				action: 'Actualizar una característica',
			},
		],
		default: 'get',
	},
];

// ========== FEATURE FIELDS ==========
export const featureFields: INodeProperties[] = [
	{
		displayName: 'Feature ID',
		name: 'featureId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['feature'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'ID de la característica',
	},
	{
		displayName: 'Datos de la Característica',
		name: 'featureData',
		type: 'collection',
		placeholder: 'Añadir Campo',
		default: {},
		displayOptions: {
			show: {
				resource: ['feature'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Nombre',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Nombre de la característica',
			},
		],
	},
	{
		displayName: 'Devolver Todas',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['feature'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Si devolver todos los resultados o solo un número limitado',
	},
	{
		displayName: 'Límite',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['feature'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Número máximo de características a devolver',
	},
];

// ========== FEATURE VALUE OPERATIONS ==========
export const featureValueOperations: INodeProperties[] = [
	{
		displayName: 'Operación',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['featureValue'],
			},
		},
		options: [
			{
				name: 'Crear',
				value: 'create',
				description: 'Crear un nuevo valor de característica',
				action: 'Crear un valor de característica',
			},
			{
				name: 'Eliminar',
				value: 'delete',
				description: 'Eliminar un valor de característica',
				action: 'Eliminar un valor de característica',
			},
			{
				name: 'Obtener',
				value: 'get',
				description: 'Obtener un valor de característica',
				action: 'Obtener un valor de característica',
			},
			{
				name: 'Obtener Todos',
				value: 'getAll',
				description: 'Obtener todos los valores de características',
				action: 'Obtener todos los valores de características',
			},
			{
				name: 'Actualizar',
				value: 'update',
				description: 'Actualizar un valor de característica',
				action: 'Actualizar un valor de característica',
			},
		],
		default: 'get',
	},
];

// ========== FEATURE VALUE FIELDS ==========
export const featureValueFields: INodeProperties[] = [
	{
		displayName: 'Feature Value ID',
		name: 'featureValueId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['featureValue'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'ID del valor de característica',
	},
	{
		displayName: 'Datos del Valor de Característica',
		name: 'featureValueData',
		type: 'collection',
		placeholder: 'Añadir Campo',
		default: {},
		displayOptions: {
			show: {
				resource: ['featureValue'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'ID de Característica',
				name: 'id_feature',
				type: 'string',
				default: '',
				description: 'ID de la característica a la que pertenece este valor',
			},
			{
				displayName: 'Valor',
				name: 'value',
				type: 'string',
				default: '',
				description: 'Valor de la característica',
			},
		],
	},
	{
		displayName: 'Devolver Todos',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['featureValue'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Si devolver todos los resultados o solo un número limitado',
	},
	{
		displayName: 'Límite',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['featureValue'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Número máximo de valores a devolver',
	},
];
