import type { INodeProperties } from 'n8n-workflow';

// ========== SEARCH OPERATIONS ==========
export const searchOperations: INodeProperties[] = [
	{
		displayName: 'Operación',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['search'],
			},
		},
		options: [
			{
				name: 'Buscar Perfiles',
				value: 'searchProfiles',
				description: 'Buscar perfiles de LinkedIn',
				action: 'Buscar perfiles',
			},
			{
				name: 'Buscar Empresas',
				value: 'searchCompanies',
				description: 'Buscar empresas en LinkedIn',
				action: 'Buscar empresas',
			},
		],
		default: 'searchProfiles',
	},
];

// ========== SEARCH FIELDS ==========
export const searchFields: INodeProperties[] = [
	// Search Parameters
	{
		displayName: 'Parámetros de Búsqueda',
		name: 'searchParams',
		type: 'collection',
		placeholder: 'Añadir Parámetro',
		default: {},
		displayOptions: {
			show: {
				resource: ['search'],
				operation: ['searchProfiles', 'searchCompanies'],
			},
		},
		options: [
			{
				displayName: 'Consulta',
				name: 'query',
				type: 'string',
				default: '',
				description: 'Término de búsqueda principal',
				required: true,
			},
			{
				displayName: 'Ubicación',
				name: 'location',
				type: 'string',
				default: '',
				description: 'Ubicación para filtrar resultados',
			},
			{
				displayName: 'Industria',
				name: 'industry',
				type: 'string',
				default: '',
				description: 'Industria específica',
			},
			{
				displayName: 'Empresa',
				name: 'company',
				type: 'string',
				default: '',
				description: 'Empresa específica',
			},
			{
				displayName: 'Cargo',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Cargo o título específico',
			},
			{
				displayName: 'Universidad',
				name: 'school',
				type: 'string',
				default: '',
				description: 'Universidad o institución educativa',
			},
			{
				displayName: 'Idioma',
				name: 'language',
				type: 'string',
				default: '',
				description: 'Idioma preferido',
			},
			{
				displayName: 'Grado de Conexión',
				name: 'connectionDegree',
				type: 'options',
				options: [
					{ name: '1er Grado', value: '1' },
					{ name: '2do Grado', value: '2' },
					{ name: '3er Grado', value: '3' },
				],
				default: '1',
				description: 'Grado de conexión en LinkedIn',
			},
			{
				displayName: 'Ordenar Por',
				name: 'sortBy',
				type: 'options',
				options: [
					{ name: 'Relevancia', value: 'relevance' },
					{ name: 'Conexiones', value: 'connections' },
					{ name: 'Nombre', value: 'name' },
				],
				default: 'relevance',
				description: 'Criterio de ordenamiento',
			},
			{
				displayName: 'Orden',
				name: 'sortOrder',
				type: 'options',
				options: [
					{ name: 'Ascendente', value: 'asc' },
					{ name: 'Descendente', value: 'desc' },
				],
				default: 'desc',
				description: 'Orden de los resultados',
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
				resource: ['search'],
				operation: ['searchProfiles', 'searchCompanies'],
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
				resource: ['search'],
				operation: ['searchProfiles', 'searchCompanies'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		default: 100,
		description: 'Número máximo de resultados a devolver',
	},
];

// ========== PROFILE OPERATIONS ==========
export const profileOperations: INodeProperties[] = [
	{
		displayName: 'Operación',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['profile'],
			},
		},
		options: [
			{
				name: 'Visitar Perfil',
				value: 'visitProfile',
				description: 'Visitar un perfil de LinkedIn',
				action: 'Visitar un perfil',
			},
			{
				name: 'Obtener Información',
				value: 'getProfileInfo',
				description: 'Obtener información de un perfil',
				action: 'Obtener información del perfil',
			},
			{
				name: 'Obtener Todas las Visitas',
				value: 'getAllVisits',
				description: 'Obtener historial de visitas',
				action: 'Obtener todas las visitas',
			},
		],
		default: 'visitProfile',
	},
];

// ========== PROFILE FIELDS ==========
export const profileFields: INodeProperties[] = [
	// Profile Parameters
	{
		displayName: 'Parámetros del Perfil',
		name: 'profileParams',
		type: 'collection',
		placeholder: 'Añadir Parámetro',
		default: {},
		displayOptions: {
			show: {
				resource: ['profile'],
				operation: ['visitProfile'],
			},
		},
		options: [
			{
				displayName: 'URL del Perfil',
				name: 'profileUrl',
				type: 'string',
				default: '',
				description: 'URL completa del perfil de LinkedIn',
			},
			{
				displayName: 'ID del Perfil',
				name: 'profileId',
				type: 'string',
				default: '',
				description: 'ID del perfil de LinkedIn',
			},
			{
				displayName: 'Mensaje',
				name: 'message',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				description: 'Mensaje personalizado para la conexión',
			},
			{
				displayName: 'Asunto',
				name: 'subject',
				type: 'string',
				default: '',
				description: 'Asunto del mensaje',
			},
			{
				displayName: 'Nota de Conexión',
				name: 'connectionNote',
				type: 'string',
				typeOptions: {
					rows: 2,
				},
				default: '',
				description: 'Nota personalizada para la solicitud de conexión',
			},
			{
				displayName: 'Retraso (segundos)',
				name: 'delay',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 3600,
				},
				default: 30,
				description: 'Retraso antes de ejecutar la acción',
			},
		],
	},

	// Profile ID
	{
		displayName: 'Profile ID',
		name: 'profileId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['profile'],
				operation: ['getProfileInfo'],
			},
		},
		default: '',
		description: 'ID del perfil de LinkedIn',
	},

	// Return All - Profile
	{
		displayName: 'Devolver Todos',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['profile'],
				operation: ['getAllVisits'],
			},
		},
		default: false,
		description: 'Si devolver todos los resultados o solo un número limitado',
	},

	// Limit - Profile
	{
		displayName: 'Límite',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['profile'],
				operation: ['getAllVisits'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		default: 100,
		description: 'Número máximo de visitas a devolver',
	},

	// Filters - Profile
	{
		displayName: 'Filtros',
		name: 'filters',
		type: 'collection',
		placeholder: 'Añadir Filtro',
		default: {},
		displayOptions: {
			show: {
				resource: ['profile'],
				operation: ['getAllVisits'],
			},
		},
		options: [
			{
				displayName: 'Fecha Desde',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Fecha de inicio para filtrar visitas',
			},
			{
				displayName: 'Fecha Hasta',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'Fecha de fin para filtrar visitas',
			},
			{
				displayName: 'Estado',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Completado', value: 'completed' },
					{ name: 'Pendiente', value: 'pending' },
					{ name: 'Fallido', value: 'failed' },
				],
				default: '',
				description: 'Estado de las visitas',
			},
		],
	},
];

// ========== COOKIE OPERATIONS ==========
export const cookieOperations: INodeProperties[] = [
	{
		displayName: 'Operación',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['cookie'],
			},
		},
		options: [
			{
				name: 'Verificar Cookie',
				value: 'checkCookie',
				description: 'Verificar el estado de una cookie',
				action: 'Verificar una cookie',
			},
			{
				name: 'Actualizar Cookie',
				value: 'updateCookie',
				description: 'Actualizar una cookie existente',
				action: 'Actualizar una cookie',
			},
			{
				name: 'Validar Cookie',
				value: 'verifyCookie',
				description: 'Validar la funcionalidad de una cookie',
				action: 'Validar una cookie',
			},
			{
				name: 'Obtener Todas las Cookies',
				value: 'getAllCookies',
				description: 'Obtener todas las cookies disponibles',
				action: 'Obtener todas las cookies',
			},
		],
		default: 'checkCookie',
	},
];

// ========== COOKIE FIELDS ==========
export const cookieFields: INodeProperties[] = [
	// Cookie Parameters
	{
		displayName: 'Parámetros de Cookie',
		name: 'cookieParams',
		type: 'collection',
		placeholder: 'Añadir Parámetro',
		default: {},
		displayOptions: {
			show: {
				resource: ['cookie'],
				operation: ['checkCookie', 'updateCookie', 'verifyCookie'],
			},
		},
		options: [
			{
				displayName: 'Cookie ID',
				name: 'cookieId',
				type: 'string',
				default: '',
				description: 'ID de la cookie de LinkedIn',
				required: true,
			},
			{
				displayName: 'Valor de Cookie',
				name: 'cookieValue',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				description: 'Valor de la cookie (para actualizar)',
			},
			{
				displayName: 'Plataforma',
				name: 'platform',
				type: 'options',
				options: [
					{ name: 'LinkedIn', value: 'linkedin' },
					{ name: 'Sales Navigator', value: 'sales_navigator' },
				],
				default: 'linkedin',
				description: 'Plataforma de la cookie',
			},
			{
				displayName: 'Estado',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Activo', value: 'active' },
					{ name: 'Inactivo', value: 'inactive' },
					{ name: 'Expirado', value: 'expired' },
				],
				default: 'active',
				description: 'Estado de la cookie',
			},
			{
				displayName: 'Notas',
				name: 'notes',
				type: 'string',
				typeOptions: {
					rows: 2,
				},
				default: '',
				description: 'Notas adicionales sobre la cookie',
			},
		],
	},

	// Return All - Cookie
	{
		displayName: 'Devolver Todos',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['cookie'],
				operation: ['getAllCookies'],
			},
		},
		default: false,
		description: 'Si devolver todos los resultados o solo un número limitado',
	},

	// Limit - Cookie
	{
		displayName: 'Límite',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['cookie'],
				operation: ['getAllCookies'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		default: 100,
		description: 'Número máximo de cookies a devolver',
	},

	// Filters - Cookie
	{
		displayName: 'Filtros',
		name: 'filters',
		type: 'collection',
		placeholder: 'Añadir Filtro',
		default: {},
		displayOptions: {
			show: {
				resource: ['cookie'],
				operation: ['getAllCookies'],
			},
		},
		options: [
			{
				displayName: 'Estado',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Todos', value: '' },
					{ name: 'Activo', value: 'active' },
					{ name: 'Inactivo', value: 'inactive' },
					{ name: 'Expirado', value: 'expired' },
				],
				default: '',
				description: 'Estado de las cookies',
			},
			{
				displayName: 'Plataforma',
				name: 'platform',
				type: 'options',
				options: [
					{ name: 'Todos', value: '' },
					{ name: 'LinkedIn', value: 'linkedin' },
					{ name: 'Sales Navigator', value: 'sales_navigator' },
				],
				default: '',
				description: 'Plataforma de las cookies',
			},
		],
	},
];

// ========== AGENT OPERATIONS ==========
export const agentOperations: INodeProperties[] = [
	{
		displayName: 'Operación',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['agent'],
			},
		},
		options: [
			{
				name: 'Obtener Estado',
				value: 'getAgentStatus',
				description: 'Obtener el estado de un agente',
				action: 'Obtener estado del agente',
			},
			{
				name: 'Obtener Logs',
				value: 'getAgentLogs',
				description: 'Obtener logs de un agente',
				action: 'Obtener logs del agente',
			},
			{
				name: 'Obtener Todos los Agentes',
				value: 'getAllAgents',
				description: 'Obtener todos los agentes disponibles',
				action: 'Obtener todos los agentes',
			},
		],
		default: 'getAgentStatus',
	},
];

// ========== AGENT FIELDS ==========
export const agentFields: INodeProperties[] = [
	// Agent ID
	{
		displayName: 'Agent ID',
		name: 'agentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['getAgentStatus', 'getAgentLogs'],
			},
		},
		default: '',
		description: 'ID del agente de Phantombuster',
	},

	// Return All - Agent
	{
		displayName: 'Devolver Todos',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['getAgentLogs', 'getAllAgents'],
			},
		},
		default: false,
		description: 'Si devolver todos los resultados o solo un número limitado',
	},

	// Limit - Agent
	{
		displayName: 'Límite',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['getAgentLogs', 'getAllAgents'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		default: 100,
		description: 'Número máximo de elementos a devolver',
	},

	// Filters - Agent
	{
		displayName: 'Filtros',
		name: 'filters',
		type: 'collection',
		placeholder: 'Añadir Filtro',
		default: {},
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['getAgentLogs', 'getAllAgents'],
			},
		},
		options: [
			{
				displayName: 'Nivel de Log',
				name: 'level',
				type: 'options',
				displayOptions: {
					show: {
						'/resource': ['agent'],
						'/operation': ['getAgentLogs'],
					},
				},
				options: [
					{ name: 'Todos', value: '' },
					{ name: 'Error', value: 'error' },
					{ name: 'Warning', value: 'warning' },
					{ name: 'Info', value: 'info' },
					{ name: 'Debug', value: 'debug' },
				],
				default: '',
				description: 'Nivel de los logs',
			},
			{
				displayName: 'Fecha Desde',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Fecha de inicio para filtrar',
			},
			{
				displayName: 'Fecha Hasta',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'Fecha de fin para filtrar',
			},
			{
				displayName: 'Estado',
				name: 'status',
				type: 'options',
				displayOptions: {
					show: {
						'/resource': ['agent'],
						'/operation': ['getAllAgents'],
					},
				},
				options: [
					{ name: 'Todos', value: '' },
					{ name: 'Activo', value: 'active' },
					{ name: 'Inactivo', value: 'inactive' },
					{ name: 'Pausado', value: 'paused' },
				],
				default: '',
				description: 'Estado de los agentes',
			},
			{
				displayName: 'Tipo',
				name: 'type',
				type: 'options',
				displayOptions: {
					show: {
						'/resource': ['agent'],
						'/operation': ['getAllAgents'],
					},
				},
				options: [
					{ name: 'Todos', value: '' },
					{ name: 'LinkedIn', value: 'linkedin' },
					{ name: 'Sales Navigator', value: 'sales_navigator' },
				],
				default: '',
				description: 'Tipo de agente',
			},
		],
	},
];

// ========== SYSTEM OPERATIONS ==========
export const systemOperations: INodeProperties[] = [
	{
		displayName: 'Operación',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['system'],
			},
		},
		options: [
			{
				name: 'Obtener Salud del Sistema',
				value: 'getSystemHealth',
				description: 'Obtener el estado de salud del sistema',
				action: 'Obtener salud del sistema',
			},
			{
				name: 'Obtener Estado del Sistema',
				value: 'getSystemStatus',
				description: 'Obtener el estado general del sistema',
				action: 'Obtener estado del sistema',
			},
			{
				name: 'Obtener Uso de API',
				value: 'getApiUsage',
				description: 'Obtener estadísticas de uso de la API',
				action: 'Obtener uso de API',
			},
		],
		default: 'getSystemHealth',
	},
];

// ========== SYSTEM FIELDS ==========
export const systemFields: INodeProperties[] = [
	// Return All - System
	{
		displayName: 'Devolver Todos',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['system'],
				operation: ['getApiUsage'],
			},
		},
		default: false,
		description: 'Si devolver todos los resultados o solo un número limitado',
	},

	// Limit - System
	{
		displayName: 'Límite',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['system'],
				operation: ['getApiUsage'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		default: 100,
		description: 'Número máximo de registros a devolver',
	},

	// Filters - System
	{
		displayName: 'Filtros',
		name: 'filters',
		type: 'collection',
		placeholder: 'Añadir Filtro',
		default: {},
		displayOptions: {
			show: {
				resource: ['system'],
				operation: ['getApiUsage'],
			},
		},
		options: [
			{
				displayName: 'Fecha Desde',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Fecha de inicio para filtrar uso',
			},
			{
				displayName: 'Fecha Hasta',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'Fecha de fin para filtrar uso',
			},
		],
	},
];

// ========== CONFIG OPERATIONS ==========
export const configOperations: INodeProperties[] = [
	{
		displayName: 'Operación',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['config'],
			},
		},
		options: [
			{
				name: 'Obtener Límites',
				value: 'getLimits',
				description: 'Obtener límites de la cuenta',
				action: 'Obtener límites',
			},
			{
				name: 'Actualizar Límites',
				value: 'updateLimits',
				description: 'Actualizar límites de la cuenta',
				action: 'Actualizar límites',
			},
			{
				name: 'Obtener Configuración',
				value: 'getSettings',
				description: 'Obtener configuración actual',
				action: 'Obtener configuración',
			},
			{
				name: 'Actualizar Configuración',
				value: 'updateSettings',
				description: 'Actualizar configuración',
				action: 'Actualizar configuración',
			},
		],
		default: 'getLimits',
	},
];

// ========== CONFIG FIELDS ==========
export const configFields: INodeProperties[] = [
	// Limits Data
	{
		displayName: 'Datos de Límites',
		name: 'limitsData',
		type: 'collection',
		placeholder: 'Añadir Campo',
		default: {},
		displayOptions: {
			show: {
				resource: ['config'],
				operation: ['updateLimits'],
			},
		},
		options: [
			{
				displayName: 'Tipo de Cuenta',
				name: 'accountType',
				type: 'options',
				options: [
					{ name: 'LinkedIn', value: 'linkedin' },
					{ name: 'Sales Navigator', value: 'sales_navigator' },
				],
				default: 'linkedin',
				description: 'Tipo de cuenta para configurar límites',
				required: true,
			},
			{
				displayName: 'Límite Diario',
				name: 'dailyLimit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 10000,
				},
				default: 100,
				description: 'Límite diario de acciones',
			},
			{
				displayName: 'Límite por Hora',
				name: 'hourlyLimit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 1000,
				},
				default: 10,
				description: 'Límite por hora de acciones',
			},
			{
				displayName: 'Retraso Mínimo (segundos)',
				name: 'minDelay',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 3600,
				},
				default: 30,
				description: 'Retraso mínimo entre acciones',
			},
			{
				displayName: 'Retraso Máximo (segundos)',
				name: 'maxDelay',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 3600,
				},
				default: 120,
				description: 'Retraso máximo entre acciones',
			},
		],
	},

	// Settings Data
	{
		displayName: 'Datos de Configuración',
		name: 'settingsData',
		type: 'collection',
		placeholder: 'Añadir Campo',
		default: {},
		displayOptions: {
			show: {
				resource: ['config'],
				operation: ['updateSettings'],
			},
		},
		options: [
			{
				displayName: 'Modo Seguro',
				name: 'safeMode',
				type: 'boolean',
				default: true,
				description: 'Activar modo seguro para evitar baneos',
			},
			{
				displayName: 'Horas de Actividad',
				name: 'activityHours',
				type: 'string',
				default: '9-18',
				description: 'Horas de actividad (formato: 9-18)',
			},
			{
				displayName: 'Días de Actividad',
				name: 'activityDays',
				type: 'multiOptions',
				options: [
					{ name: 'Lunes', value: 'monday' },
					{ name: 'Martes', value: 'tuesday' },
					{ name: 'Miércoles', value: 'wednesday' },
					{ name: 'Jueves', value: 'thursday' },
					{ name: 'Viernes', value: 'friday' },
					{ name: 'Sábado', value: 'saturday' },
					{ name: 'Domingo', value: 'sunday' },
				],
				default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
				description: 'Días de la semana para actividad',
			},
			{
				displayName: 'Notificaciones',
				name: 'notifications',
				type: 'boolean',
				default: true,
				description: 'Activar notificaciones de estado',
			},
		],
	},
];
