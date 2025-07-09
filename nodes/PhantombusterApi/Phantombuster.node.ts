import { IExecuteFunctions } from 'n8n-workflow';
import {
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  INodeProperties,
  NodeConnectionType,
} from 'n8n-workflow';

export class Phantombuster implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Phantombuster',
    name: 'phantombuster',
    icon: 'file:phantombuster.svg',
    group: ['transform'],
    version: 1,
    description: 'Automatiza agentes y scraping con Phantombuster',
    defaults: { name: 'Phantombuster' },
    inputs: ['main'] as NodeConnectionType[],
    outputs: ['main'] as NodeConnectionType[],
    credentials: [{ name: 'phantombusterCredentialsApi', required: true }],
    properties: [
      {
        displayName: 'Acción',
        name: 'tool',
        type: 'options',
        options: [
          { name: 'Ejecutar Agente', value: 'runAgent' },
          { name: 'Descargar Resultados', value: 'downloadContainer' },
          { name: 'Obtener Leads JSON', value: 'getLeadsJson' },
          { name: 'Listar Ejecuciones', value: 'listAgentExecutions' },
          { name: 'Guardar Leads', value: 'saveLeads' },
          { name: 'Buscar Leads', value: 'searchLeads' },
          { name: 'Listar Listas', value: 'listLeadLists' },
          { name: 'Información de Usuario', value: 'getUserInfo' },
          { name: 'Límites de Cuenta', value: 'getLimits' },
          { name: 'Estado de Cookies', value: 'checkSessionCookies' },
          { name: 'Renovar Cookie', value: 'renewSessionCookie' },
          { name: 'Listar Todos los Agentes', value: 'fetchAllAgents' },
          { name: 'Detener Agente', value: 'stopAgent' },
          { name: 'Eliminar Agente', value: 'deleteAgent' },
          { name: 'Listar Todos los Containers', value: 'fetchAllContainers' },
          { name: 'Obtener Objeto de Resultado', value: 'fetchResultObject' },
          { name: 'Guardar Lista de Leads', value: 'saveList' },
          { name: 'Eliminar Lista de Leads', value: 'deleteList' },
          { name: 'Eliminar Muchos Leads', value: 'deleteLeadsMany' },
          { name: 'Buscar Leads Avanzado', value: 'searchLeadsObjects' },
          { name: 'Guardar Muchos Leads', value: 'saveLeadsMany' },
          { name: 'Listar Listas de Leads', value: 'fetchAllLists' },
        ],
        default: 'runAgent',
        description: 'Selecciona la acción que deseas ejecutar',
      },
      {
        displayName: 'ID del Agente',
        name: 'agentId',
        type: 'string',
        default: '',
        displayOptions: { show: { tool: ['runAgent', 'getLeadsJson', 'listAgentExecutions', 'stopAgent', 'deleteAgent'] } },
      },
      {
        displayName: 'ID del Container',
        name: 'containerId',
        type: 'string',
        default: '',
        displayOptions: { show: { tool: ['downloadContainer', 'fetchResultObject'] } },
      },
      {
        displayName: 'ID de la Lista',
        name: 'listId',
        type: 'string',
        default: '',
        displayOptions: { show: { tool: ['saveLeads', 'searchLeads', 'deleteList'] } },
      },
      {
        displayName: 'Leads (JSON)',
        name: 'leads',
        type: 'json',
        default: '',
        displayOptions: { show: { tool: ['saveLeads', 'saveLeadsMany', 'deleteLeadsMany'] } },
      },
      {
        displayName: 'Nombre de la Lista',
        name: 'name',
        type: 'string',
        default: '',
        displayOptions: { show: { tool: ['saveList'] } },
      },
      {
        displayName: 'Criterios de Búsqueda (JSON)',
        name: 'criteria',
        type: 'json',
        default: '',
        displayOptions: { show: { tool: ['searchLeadsObjects'] } },
      },
      {
        displayName: 'Nueva Cookie',
        name: 'cookie',
        type: 'string',
        default: '',
        displayOptions: { show: { tool: ['renewSessionCookie'] } },
        description: 'Valor de la nueva session cookie',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const tool = this.getNodeParameter('tool', 0) as string;
    const credentials = await this.getCredentials('phantombusterCredentialsApi');

    for (let i = 0; i < items.length; i++) {
      try {
        if (tool === 'runAgent') {
          const agentId = this.getNodeParameter('agentId', i) as string;
          const response = await this.helpers.request({
            method: 'POST',
            url: `https://api.phantombuster.com/api/v2/agents/launch`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            body: { id: agentId },
            json: true,
          });
          returnData.push({ json: response });
        } else if (tool === 'downloadContainer') {
          const containerId = this.getNodeParameter('containerId', i) as string;
          const response = await this.helpers.request({
            method: 'GET',
            url: `https://api.phantombuster.com/api/v2/containers/fetch-output?id=${containerId}`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            encoding: null,
          });
          returnData.push({
            binary: {
              data: await this.helpers.prepareBinaryData(response, 'resultados.csv', 'text/csv'),
            },
            json: {},
          });
        } else if (tool === 'getLeadsJson') {
          const agentId = this.getNodeParameter('agentId', i) as string;
          const response = await this.helpers.request({
            method: 'GET',
            url: `https://api.phantombuster.com/api/v2/agents/fetch-output?id=${agentId}`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            json: true,
          });
          returnData.push({ json: response.data || response.resultObject || response });
        } else if (tool === 'listAgentExecutions') {
          const agentId = this.getNodeParameter('agentId', i) as string;
          const response = await this.helpers.request({
            method: 'GET',
            url: `https://api.phantombuster.com/api/v2/agents/fetch-executions?id=${agentId}`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            json: true,
          });
          returnData.push({ json: response });
        } else if (tool === 'saveLeads') {
          const listId = this.getNodeParameter('listId', i) as string;
          const leads = this.getNodeParameter('leads', i) as object;
          const response = await this.helpers.request({
            method: 'POST',
            url: `https://api.phantombuster.com/api/v2/org-storage/leads/save-many`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            body: { leads, listId },
            json: true,
          });
          returnData.push({ json: response });
        } else if (tool === 'searchLeads') {
          const listId = this.getNodeParameter('listId', i) as string;
          const response = await this.helpers.request({
            method: 'POST',
            url: `https://api.phantombuster.com/api/v2/org-storage/leads-objects/search`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            body: { listId },
            json: true,
          });
          returnData.push({ json: response });
        } else if (tool === 'listLeadLists') {
          const response = await this.helpers.request({
            method: 'GET',
            url: `https://api.phantombuster.com/api/v2/org-storage/lists/fetch-all`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            json: true,
          });
          returnData.push({ json: response });
        } else if (tool === 'getUserInfo') {
          const response = await this.helpers.request({
            method: 'GET',
            url: `https://api.phantombuster.com/api/v2/user/me`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            json: true,
          });
          returnData.push({ json: response });
        } else if (tool === 'getLimits') {
          const response = await this.helpers.request({
            method: 'GET',
            url: `https://api.phantombuster.com/api/v2/orgs/export-agent-usage`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            json: true,
          });
          returnData.push({ json: response });
        } else if (tool === 'checkSessionCookies') {
          const response = await this.helpers.request({
            method: 'GET',
            url: `https://api.phantombuster.com/api/v2/user/me`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            json: true,
          });
          returnData.push({ json: response.cookies || response });
        } else if (tool === 'renewSessionCookie') {
          const cookie = this.getNodeParameter('cookie', i) as string;
          const response = await this.helpers.request({
            method: 'POST',
            url: `https://api.phantombuster.com/api/v2/identities/save-with-token`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            body: { token: cookie, platform: 'linkedin' },
            json: true,
          });
          returnData.push({ json: response });
        } else if (tool === 'fetchAllAgents') {
          const response = await this.helpers.request({
            method: 'GET',
            url: `https://api.phantombuster.com/api/v2/agents/fetch-all`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            json: true,
          });
          returnData.push({ json: response });
        } else if (tool === 'stopAgent') {
          const agentId = this.getNodeParameter('agentId', i) as string;
          const response = await this.helpers.request({
            method: 'POST',
            url: `https://api.phantombuster.com/api/v2/agents/stop`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            body: { id: agentId },
            json: true,
          });
          returnData.push({ json: response });
        } else if (tool === 'deleteAgent') {
          const agentId = this.getNodeParameter('agentId', i) as string;
          const response = await this.helpers.request({
            method: 'POST',
            url: `https://api.phantombuster.com/api/v2/agents/delete`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            body: { id: agentId },
            json: true,
          });
          returnData.push({ json: response });
        } else if (tool === 'fetchAllContainers') {
          const response = await this.helpers.request({
            method: 'GET',
            url: `https://api.phantombuster.com/api/v2/containers/fetch-all`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            json: true,
          });
          returnData.push({ json: response });
        } else if (tool === 'fetchResultObject') {
          const containerId = this.getNodeParameter('containerId', i) as string;
          const response = await this.helpers.request({
            method: 'GET',
            url: `https://api.phantombuster.com/api/v2/containers/fetch-result-object?id=${containerId}`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            json: true,
          });
          returnData.push({ json: response });
        } else if (tool === 'saveList') {
          const name = this.getNodeParameter('name', i) as string;
          const response = await this.helpers.request({
            method: 'POST',
            url: `https://api.phantombuster.com/api/v2/org-storage/lists/save`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            body: { name },
            json: true,
          });
          returnData.push({ json: response });
        } else if (tool === 'deleteList') {
          const listId = this.getNodeParameter('listId', i) as string;
          const response = await this.helpers.request({
            method: 'POST',
            url: `https://api.phantombuster.com/api/v2/org-storage/lists/delete`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            body: { id: listId },
            json: true,
          });
          returnData.push({ json: response });
        } else if (tool === 'deleteLeadsMany') {
          const leads = this.getNodeParameter('leads', i) as string[];
          const response = await this.helpers.request({
            method: 'POST',
            url: `https://api.phantombuster.com/api/v2/org-storage/leads/delete-many`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            body: { ids: leads },
            json: true,
          });
          returnData.push({ json: response });
        } else if (tool === 'searchLeadsObjects') {
          const criteria = this.getNodeParameter('criteria', i) as object;
          const response = await this.helpers.request({
            method: 'POST',
            url: `https://api.phantombuster.com/api/v2/org-storage/leads-objects/search`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            body: criteria,
            json: true,
          });
          returnData.push({ json: response });
        } else if (tool === 'saveLeadsMany') {
          const leads = this.getNodeParameter('leads', i) as object;
          const response = await this.helpers.request({
            method: 'POST',
            url: `https://api.phantombuster.com/api/v2/org-storage/leads/save-many`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            body: { leads },
            json: true,
          });
          returnData.push({ json: response });
        } else if (tool === 'fetchAllLists') {
          const response = await this.helpers.request({
            method: 'GET',
            url: `https://api.phantombuster.com/api/v2/org-storage/lists/fetch-all`,
            headers: { 'X-Phantombuster-Key-1': credentials.apiKey },
            json: true,
          });
          returnData.push({ json: response });
        }
      } catch (error) {
        let errorMsg = 'Unknown error';
        if (typeof error === 'object' && error !== null && 'message' in error) errorMsg = (error as any).message;
        else if (typeof error === 'string') errorMsg = error;
        returnData.push({ json: { error: errorMsg } });
      }
    }
    return [returnData];
  }
}
