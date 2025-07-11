import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	ISupplyDataFunctions,
	SupplyData,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

import {
	phantombusterApiRequest,
	phantombusterApiRequestAllItems,
} from './GenericFunctions';

export class PhantombusterTool implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Phantombuster Tool',
		name: 'phantombusterTool',
		icon: 'file:phantombuster.svg',
		group: ['ai_tools'],
		version: 1,
		subtitle: '={{$parameter["tool"]}}',
		description: 'Herramienta AI para automatización con Phantombuster',
		defaults: {
			name: 'Phantombuster Tool',
		},
		inputs: [] as NodeConnectionType[],
		outputs: [NodeConnectionType.AiTool] as NodeConnectionType[],
		credentials: [
			{
				name: 'phantombusterCredentialsApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Tool',
				name: 'tool',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: '🎯 Ejecutar Agente', value: 'runAgent' },
					{ name: '📊 Descargar Container', value: 'downloadContainer' },
					{ name: '👥 Obtener Leads JSON', value: 'getLeadsJson' },
					{ name: '📋 Listar Ejecuciones', value: 'listExecutions' },
					{ name: '💾 Guardar Leads', value: 'saveLeads' },
					{ name: '🔍 Buscar Leads', value: 'searchLeads' },
					{ name: '📁 Listar Listas de Leads', value: 'listLeadLists' },
					{ name: '👤 Obtener Info Usuario', value: 'getUserInfo' },
					{ name: '📈 Obtener Límites', value: 'getLimits' },
					{ name: '🔄 Renovar Cookies', value: 'renewCookies' },
					{ name: '✅ Verificar Cookies', value: 'verifyCookies' },
					{ name: '🗑️ Eliminar Agente', value: 'deleteAgent' },
					{ name: '🗑️ Eliminar Container', value: 'deleteContainer' },
					{ name: '🗑️ Eliminar Lista de Leads', value: 'deleteLeadList' },
					{ name: '🗑️ Eliminar Lead', value: 'deleteLead' },
					{ name: '💾 Guardar Muchos Leads', value: 'saveManyLeads' },
					{ name: '🔍 Buscar Leads Avanzado', value: 'searchLeadsAdvanced' },
					{ name: '📊 Listar Agentes', value: 'listAgents' },
				],
				default: 'runAgent',
				description: 'Selecciona la operación de Phantombuster',
			},
		],
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
		const tool = this.getNodeParameter('tool', itemIndex) as string;

		// Obtener credenciales
		const credentials = await this.getCredentials('phantombusterCredentialsApi');
		const apiKey = credentials.apiKey as string;

		// Crear tool basado en la operación seleccionada
		switch (tool) {
			case 'runAgent':
				return {
					response: new DynamicStructuredTool({
						name: 'phantombuster_run_agent',
						description: 'Ejecuta un agente de Phantombuster (Profile Visitor, Autoconnect, Message Sender, Search Export)',
						schema: z.object({
							agentId: z.string().describe('ID del agente a ejecutar'),
							launchApp: z.string().optional().describe('Aplicación a lanzar (opcional)'),
						}),
						func: async (input) => {
							try {
								// Crear un contexto de ejecución temporal
								const executeContext = {
									getCredentials: this.getCredentials.bind(this),
									helpers: this.helpers,
									getNode: this.getNode.bind(this),
								} as IExecuteFunctions;

								const response = await phantombusterApiRequest.call(
									executeContext,
									'POST',
									`agents/fetch-and-launch`,
									{
										id: input.agentId,
										...(input.launchApp && { launchApp: input.launchApp }),
									}
								);
								return JSON.stringify(response, null, 2);
							} catch (error) {
								throw new Error(`Error ejecutando agente: ${error}`);
							}
						},
					}),
				};

			case 'downloadContainer':
				return {
					response: new DynamicStructuredTool({
						name: 'phantombuster_download_container',
						description: 'Descarga los resultados de un container de Phantombuster',
						schema: z.object({
							containerId: z.string().describe('ID del container a descargar'),
							format: z.enum(['json', 'csv']).default('json').describe('Formato de descarga'),
						}),
						func: async (input) => {
							try {
								const executeContext = {
									getCredentials: this.getCredentials.bind(this),
									helpers: this.helpers,
									getNode: this.getNode.bind(this),
								} as IExecuteFunctions;

								const response = await phantombusterApiRequest.call(
									executeContext,
									'GET',
									`containers/fetch-output?id=${input.containerId}&format=${input.format}`
								);
								return JSON.stringify(response, null, 2);
							} catch (error) {
								throw new Error(`Error descargando container: ${error}`);
							}
						},
					}),
				};

			case 'getLeadsJson':
				return {
					response: new DynamicStructuredTool({
						name: 'phantombuster_get_leads_json',
						description: 'Obtiene leads en formato JSON desde un container',
						schema: z.object({
							containerId: z.string().describe('ID del container'),
							limit: z.number().optional().describe('Número máximo de leads a obtener'),
						}),
						func: async (input) => {
							try {
								const executeContext = {
									getCredentials: this.getCredentials.bind(this),
									helpers: this.helpers,
									getNode: this.getNode.bind(this),
								} as IExecuteFunctions;

								const qs: IDataObject = {};
								if (input.limit) {
									qs.limit = input.limit;
								}
								const response = await phantombusterApiRequest.call(
									executeContext,
									'GET',
									`containers/fetch-output?id=${input.containerId}&format=json`,
									{},
									qs
								);
								return JSON.stringify(response, null, 2);
							} catch (error) {
								throw new Error(`Error obteniendo leads: ${error}`);
							}
						},
					}),
				};

			case 'listExecutions':
				return {
					response: new DynamicStructuredTool({
						name: 'phantombuster_list_executions',
						description: 'Lista las ejecuciones de un agente específico',
						schema: z.object({
							agentId: z.string().describe('ID del agente de Phantombuster'),
							limit: z.number().optional().describe('Número máximo de ejecuciones (por defecto 10)'),
						}),
						func: async (input) => {
							try {
								const executeContext = {
									getCredentials: this.getCredentials.bind(this),
									helpers: this.helpers,
									getNode: this.getNode.bind(this),
								} as IExecuteFunctions;

								const qs: IDataObject = {
									id: input.agentId,
								};

								if (input.limit) {
									qs.limit = input.limit;
								}

								const response = await phantombusterApiRequest.call(
									executeContext,
									'GET',
									'agents/fetch-output',
									{},
									qs
								);
								return JSON.stringify(response, null, 2);
							} catch (error) {
								throw new Error(`Error listando ejecuciones: ${error}`);
							}
						},
					}),
				};

			case 'saveLeads':
				return {
					response: new DynamicStructuredTool({
						name: 'phantombuster_save_leads',
						description: 'Guarda leads en el CRM de Phantombuster',
						schema: z.object({
							leadListId: z.string().describe('ID de la lista de leads'),
							leads: z.array(z.object({
								email: z.string().optional(),
								firstName: z.string().optional(),
								lastName: z.string().optional(),
								company: z.string().optional(),
								position: z.string().optional(),
								phone: z.string().optional(),
								linkedInUrl: z.string().optional(),
								profileUrl: z.string().optional(),
								message: z.string().optional(),
								metadata: z.record(z.string(), z.any()).optional(),
							})).describe('Array de leads a guardar'),
						}),
						func: async (input) => {
							try {
								const executeContext = {
									getCredentials: this.getCredentials.bind(this),
									helpers: this.helpers,
									getNode: this.getNode.bind(this),
								} as IExecuteFunctions;

								const response = await phantombusterApiRequest.call(
									executeContext,
									'POST',
									`lead-lists/save-leads`,
									{
										id: input.leadListId,
										leads: input.leads,
									}
								);
								return JSON.stringify(response, null, 2);
							} catch (error) {
								throw new Error(`Error guardando leads: ${error}`);
							}
						},
					}),
				};

			case 'searchLeads':
				return {
					response: new DynamicStructuredTool({
						name: 'phantombuster_search_leads',
						description: 'Busca leads en el CRM de Phantombuster',
						schema: z.object({
							leadListId: z.string().describe('ID de la lista de leads'),
							query: z.string().describe('Término de búsqueda'),
							limit: z.number().optional().describe('Número máximo de resultados'),
						}),
						func: async (input) => {
							try {
								const executeContext = {
									getCredentials: this.getCredentials.bind(this),
									helpers: this.helpers,
									getNode: this.getNode.bind(this),
								} as IExecuteFunctions;

								const qs: IDataObject = {
									query: input.query,
								};
								if (input.limit) {
									qs.limit = input.limit;
								}
								const response = await phantombusterApiRequest.call(
									executeContext,
									'GET',
									`lead-lists/search-leads?id=${input.leadListId}`,
									{},
									qs
								);
								return JSON.stringify(response, null, 2);
							} catch (error) {
								throw new Error(`Error buscando leads: ${error}`);
							}
						},
					}),
				};

			case 'listLeadLists':
				return {
					response: new DynamicStructuredTool({
						name: 'phantombuster_list_lead_lists',
						description: 'Lista todas las listas de leads disponibles',
						schema: z.object({
							limit: z.number().optional().describe('Número máximo de listas'),
						}),
						func: async (input) => {
							try {
								const executeContext = {
									getCredentials: this.getCredentials.bind(this),
									helpers: this.helpers,
									getNode: this.getNode.bind(this),
								} as IExecuteFunctions;

								const qs: IDataObject = {};
								if (input.limit) {
									qs.limit = input.limit;
								}
								const response = await phantombusterApiRequest.call(
									executeContext,
									'GET',
									'lead-lists',
									{},
									qs
								);
								return JSON.stringify(response, null, 2);
							} catch (error) {
								throw new Error(`Error listando listas de leads: ${error}`);
							}
						},
					}),
				};

			case 'getUserInfo':
				return {
					response: new DynamicStructuredTool({
						name: 'phantombuster_get_user_info',
						description: 'Obtiene información del usuario actual',
						schema: z.object({}),
						func: async () => {
							try {
								const executeContext = {
									getCredentials: this.getCredentials.bind(this),
									helpers: this.helpers,
									getNode: this.getNode.bind(this),
								} as IExecuteFunctions;

								const response = await phantombusterApiRequest.call(
									executeContext,
									'GET',
									'user/me'
								);
								return JSON.stringify(response, null, 2);
							} catch (error) {
								throw new Error(`Error obteniendo información del usuario: ${error}`);
							}
						},
					}),
				};

			case 'getLimits':
				return {
					response: new DynamicStructuredTool({
						name: 'phantombuster_get_limits',
						description: 'Obtiene los límites y uso actual de la cuenta',
						schema: z.object({
							days: z.number().optional().describe('Cantidad de días a consultar (por defecto 30)'),
						}),
						func: async (input) => {
							try {
								const executeContext = {
									getCredentials: this.getCredentials.bind(this),
									helpers: this.helpers,
									getNode: this.getNode.bind(this),
								} as IExecuteFunctions;

								const days = input.days || 30;
								// Intentar primero el endpoint de uso de agentes
								try {
									const response = await phantombusterApiRequest.call(
										executeContext,
										'GET',
										'orgs/export-agent-usage',
										{},
										{ days }
									);
									return JSON.stringify(response, null, 2);
								} catch (error) {
									// Si falla, intentar con el endpoint de información del usuario
									const response = await phantombusterApiRequest.call(
										executeContext,
										'GET',
										'user/me',
										{},
										{}
									);
									return JSON.stringify(response, null, 2);
								}
							} catch (error) {
								throw new Error(`Error obteniendo límites: ${error}`);
							}
						},
					}),
				};

			case 'renewCookies':
				return {
					response: new DynamicStructuredTool({
						name: 'phantombuster_renew_cookies',
						description: 'Renueva las cookies de LinkedIn para un agente',
						schema: z.object({
							agentId: z.string().describe('ID del agente'),
						}),
						func: async (input) => {
							try {
								const executeContext = {
									getCredentials: this.getCredentials.bind(this),
									helpers: this.helpers,
									getNode: this.getNode.bind(this),
								} as IExecuteFunctions;

								const response = await phantombusterApiRequest.call(
									executeContext,
									'POST',
									`agents/${input.agentId}/renew-cookies`,
									{}
								);
								return JSON.stringify(response, null, 2);
							} catch (error) {
								throw new Error(`Error renovando cookies: ${error}`);
							}
						},
					}),
				};

			case 'verifyCookies':
				return {
					response: new DynamicStructuredTool({
						name: 'phantombuster_verify_cookies',
						description: 'Verifica el estado de las cookies de LinkedIn',
						schema: z.object({
							agentId: z.string().describe('ID del agente'),
						}),
						func: async (input) => {
							try {
								const executeContext = {
									getCredentials: this.getCredentials.bind(this),
									helpers: this.helpers,
									getNode: this.getNode.bind(this),
								} as IExecuteFunctions;

								const response = await phantombusterApiRequest.call(
									executeContext,
									'GET',
									`agents/${input.agentId}/verify-cookies`
								);
								return JSON.stringify(response, null, 2);
							} catch (error) {
								throw new Error(`Error verificando cookies: ${error}`);
							}
						},
					}),
				};

			case 'deleteAgent':
				return {
					response: new DynamicStructuredTool({
						name: 'phantombuster_delete_agent',
						description: 'Elimina un agente de Phantombuster',
						schema: z.object({
							agentId: z.string().describe('ID del agente a eliminar'),
						}),
						func: async (input) => {
							try {
								const executeContext = {
									getCredentials: this.getCredentials.bind(this),
									helpers: this.helpers,
									getNode: this.getNode.bind(this),
								} as IExecuteFunctions;

								const response = await phantombusterApiRequest.call(
									executeContext,
									'DELETE',
									`agents/${input.agentId}`
								);
								return JSON.stringify(response, null, 2);
							} catch (error) {
								throw new Error(`Error eliminando agente: ${error}`);
							}
						},
					}),
				};

			case 'deleteContainer':
				return {
					response: new DynamicStructuredTool({
						name: 'phantombuster_delete_container',
						description: 'Elimina un container de Phantombuster',
						schema: z.object({
							containerId: z.string().describe('ID del container a eliminar'),
						}),
						func: async (input) => {
							try {
								const executeContext = {
									getCredentials: this.getCredentials.bind(this),
									helpers: this.helpers,
									getNode: this.getNode.bind(this),
								} as IExecuteFunctions;

								const response = await phantombusterApiRequest.call(
									executeContext,
									'DELETE',
									`containers/${input.containerId}`
								);
								return JSON.stringify(response, null, 2);
							} catch (error) {
								throw new Error(`Error eliminando container: ${error}`);
							}
						},
					}),
				};

			case 'deleteLeadList':
				return {
					response: new DynamicStructuredTool({
						name: 'phantombuster_delete_lead_list',
						description: 'Elimina una lista de leads',
						schema: z.object({
							leadListId: z.string().describe('ID de la lista de leads a eliminar'),
						}),
						func: async (input) => {
							try {
								const executeContext = {
									getCredentials: this.getCredentials.bind(this),
									helpers: this.helpers,
									getNode: this.getNode.bind(this),
								} as IExecuteFunctions;

								const response = await phantombusterApiRequest.call(
									executeContext,
									'DELETE',
									`lead-lists/${input.leadListId}`
								);
								return JSON.stringify(response, null, 2);
							} catch (error) {
								throw new Error(`Error eliminando lista de leads: ${error}`);
							}
						},
					}),
				};

			case 'deleteLead':
				return {
					response: new DynamicStructuredTool({
						name: 'phantombuster_delete_lead',
						description: 'Elimina un lead específico',
						schema: z.object({
							leadListId: z.string().describe('ID de la lista de leads'),
							leadId: z.string().describe('ID del lead a eliminar'),
						}),
						func: async (input) => {
							try {
								const executeContext = {
									getCredentials: this.getCredentials.bind(this),
									helpers: this.helpers,
									getNode: this.getNode.bind(this),
								} as IExecuteFunctions;

								const response = await phantombusterApiRequest.call(
									executeContext,
									'DELETE',
									`lead-lists/${input.leadListId}/leads/${input.leadId}`
								);
								return JSON.stringify(response, null, 2);
							} catch (error) {
								throw new Error(`Error eliminando lead: ${error}`);
							}
						},
					}),
				};

			case 'saveManyLeads':
				return {
					response: new DynamicStructuredTool({
						name: 'phantombuster_save_many_leads',
						description: 'Guarda múltiples leads de una vez',
						schema: z.object({
							leadListId: z.string().describe('ID de la lista de leads'),
							leads: z.array(z.object({
								email: z.string().optional(),
								firstName: z.string().optional(),
								lastName: z.string().optional(),
								company: z.string().optional(),
								position: z.string().optional(),
								phone: z.string().optional(),
								linkedInUrl: z.string().optional(),
								profileUrl: z.string().optional(),
								message: z.string().optional(),
								metadata: z.record(z.string(), z.any()).optional(),
							})).describe('Array de leads a guardar'),
						}),
						func: async (input) => {
							try {
								const executeContext = {
									getCredentials: this.getCredentials.bind(this),
									helpers: this.helpers,
									getNode: this.getNode.bind(this),
								} as IExecuteFunctions;

								const response = await phantombusterApiRequest.call(
									executeContext,
									'POST',
									`lead-lists/save-many-leads`,
									{
										id: input.leadListId,
										leads: input.leads,
									}
								);
								return JSON.stringify(response, null, 2);
							} catch (error) {
								throw new Error(`Error guardando múltiples leads: ${error}`);
							}
						},
					}),
				};

			case 'searchLeadsAdvanced':
				return {
					response: new DynamicStructuredTool({
						name: 'phantombuster_search_leads_advanced',
						description: 'Búsqueda avanzada de leads con filtros',
						schema: z.object({
							leadListId: z.string().describe('ID de la lista de leads'),
							query: z.string().describe('Término de búsqueda'),
							filters: z.object({
								email: z.string().optional(),
								company: z.string().optional(),
								position: z.string().optional(),
								dateAdded: z.string().optional(),
							}).optional().describe('Filtros adicionales'),
							limit: z.number().optional().describe('Número máximo de resultados'),
							offset: z.number().optional().describe('Desplazamiento para paginación'),
						}),
						func: async (input) => {
							try {
								const executeContext = {
									getCredentials: this.getCredentials.bind(this),
									helpers: this.helpers,
									getNode: this.getNode.bind(this),
								} as IExecuteFunctions;

								const qs: IDataObject = {
									query: input.query,
									...(input.filters && { filters: input.filters }),
									...(input.limit && { limit: input.limit }),
									...(input.offset && { offset: input.offset }),
								};
								const response = await phantombusterApiRequest.call(
									executeContext,
									'GET',
									`lead-lists/search-leads-advanced?id=${input.leadListId}`,
									{},
									qs
								);
								return JSON.stringify(response, null, 2);
							} catch (error) {
								throw new Error(`Error en búsqueda avanzada: ${error}`);
							}
						},
					}),
				};

			case 'listAgents':
				return {
					response: new DynamicStructuredTool({
						name: 'phantombuster_list_agents',
						description: 'Lista todos los agentes disponibles en la cuenta',
						schema: z.object({}),
						func: async () => {
							try {
								const executeContext = {
									getCredentials: this.getCredentials.bind(this),
									helpers: this.helpers,
									getNode: this.getNode.bind(this),
								} as IExecuteFunctions;

								const response = await phantombusterApiRequest.call(
									executeContext,
									'GET',
									'agents/fetch-all'
								);
								return JSON.stringify(response, null, 2);
							} catch (error) {
								throw new Error(`Error listando agentes: ${error}`);
							}
						},
					}),
				};

			default:
				const node = this.getNode ? this.getNode() : null;
		throw new NodeOperationError(node as any, `Tool "${tool}" no soportado`);
		}
	}
}
