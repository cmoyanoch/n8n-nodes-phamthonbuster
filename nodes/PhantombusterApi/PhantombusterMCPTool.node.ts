import type {
	INodeType,
	INodeTypeDescription,
	ISupplyDataFunctions,
	SupplyData,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

export class PhantombusterMCPTool implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Phantombuster MCP Tool',
		name: 'phantombusterMCPTool',
		icon: 'file:phantombuster.svg',
		group: ['ai_tools'],
		version: 1,
		subtitle: 'Call Phantombuster Workflow Tool',
		description: 'Herramienta MCP para llamar workflows de Phantombuster desde AI Agents',
		defaults: {
			name: 'Phantombuster MCP Tool',
		},
		inputs: [] as NodeConnectionType[],
		outputs: [NodeConnectionType.AiTool] as NodeConnectionType[],
		properties: [
			{
				displayName: 'Workflow ID',
				name: 'workflowId',
				type: 'string',
				default: '',
				description: 'ID del workflow de Phantombuster a ejecutar',
				required: true,
			},
			{
				displayName: 'Tool Name',
				name: 'toolName',
				type: 'string',
				default: 'phantombuster_automation',
				description: 'Nombre de la herramienta para el AI Agent',
			},
			{
				displayName: 'Tool Description',
				name: 'toolDescription',
				type: 'string',
				default: 'Automatiza operaciones de Phantombuster incluyendo agentes de LinkedIn, gestión de leads, y más',
				description: 'Descripción de la herramienta para el AI Agent',
			},
		],
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
		const workflowId = this.getNodeParameter('workflowId', itemIndex) as string;
		const toolName = this.getNodeParameter('toolName', itemIndex) as string;
		const toolDescription = this.getNodeParameter('toolDescription', itemIndex) as string;

		if (!workflowId) {
			const node = this.getNode ? this.getNode() : null;
			throw new NodeOperationError(node as any, 'Workflow ID es requerido');
		}

		// Crear tool que llama al sub-workflow
		const tool = new DynamicStructuredTool({
			name: toolName,
			description: toolDescription,
			schema: z.object({
				action: z.string().describe('Acción a realizar (runAgent, getLeads, saveLeads, etc.)'),
				agentId: z.string().optional().describe('ID del agente (requerido para acciones de agentes)'),
				containerId: z.string().optional().describe('ID del container (requerido para descargas)'),
				leadListId: z.string().optional().describe('ID de la lista de leads (requerido para operaciones de leads)'),
				leads: z.array(z.record(z.string(), z.any())).optional().describe('Array de leads para guardar'),
				query: z.string().optional().describe('Término de búsqueda para leads'),
				limit: z.number().optional().describe('Número máximo de resultados'),
				launchApp: z.string().optional().describe('Aplicación a lanzar para agentes'),
				format: z.enum(['json', 'csv']).optional().describe('Formato de descarga'),
				// Parámetros adicionales para operaciones específicas
				email: z.string().optional().describe('Email del lead'),
				firstName: z.string().optional().describe('Nombre del lead'),
				lastName: z.string().optional().describe('Apellido del lead'),
				company: z.string().optional().describe('Empresa del lead'),
				position: z.string().optional().describe('Posición del lead'),
				phone: z.string().optional().describe('Teléfono del lead'),
				linkedInUrl: z.string().optional().describe('URL de LinkedIn del lead'),
				profileUrl: z.string().optional().describe('URL del perfil del lead'),
				message: z.string().optional().describe('Mensaje personalizado'),
				metadata: z.record(z.string(), z.any()).optional().describe('Metadatos adicionales'),
			}),
			func: async (input) => {
				try {
					// Preparar datos para el workflow
					const workflowData = {
						action: input.action,
						...(input.agentId && { agentId: input.agentId }),
						...(input.containerId && { containerId: input.containerId }),
						...(input.leadListId && { leadListId: input.leadListId }),
						...(input.leads && { leads: input.leads }),
						...(input.query && { query: input.query }),
						...(input.limit && { limit: input.limit }),
						...(input.launchApp && { launchApp: input.launchApp }),
						...(input.format && { format: input.format }),
						...(input.email && { email: input.email }),
						...(input.firstName && { firstName: input.firstName }),
						...(input.lastName && { lastName: input.lastName }),
						...(input.company && { company: input.company }),
						...(input.position && { position: input.position }),
						...(input.phone && { phone: input.phone }),
						...(input.linkedInUrl && { linkedInUrl: input.linkedInUrl }),
						...(input.profileUrl && { profileUrl: input.profileUrl }),
						...(input.message && { message: input.message }),
						...(input.metadata && { metadata: input.metadata }),
					};

					// Por ahora, retornar un mensaje indicando que el workflow debe ser configurado manualmente
					return JSON.stringify({
						success: true,
						action: input.action,
						message: `Workflow ${workflowId} debe ser configurado manualmente para procesar: ${JSON.stringify(workflowData)}`,
						timestamp: new Date().toISOString(),
					}, null, 2);
				} catch (error) {
					throw new Error(`Error ejecutando workflow de Phantombuster: ${error}`);
				}
			},
		});

		return { response: tool };
	}
}
