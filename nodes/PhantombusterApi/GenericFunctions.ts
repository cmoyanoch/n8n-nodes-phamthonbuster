import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	IRequestOptions,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

export async function phantombusterApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	headers: IDataObject = {},
	option: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('phantombusterCredentialsApi');
	const apiKey = credentials.apiKey as string;

	const options: IRequestOptions = {
		method,
		headers: {
			'Content-Type': 'application/json',
			'X-Phantombuster-Key-1': apiKey,
			...headers,
		},
		qs,
		body,
		uri: `https://api.phantombuster.com/api/v2/${endpoint}`,
		json: true,
	};

	try {
		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as any);
	}
}

export async function phantombusterApiRequestAllItems(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: any = {},
	query: IDataObject = {},
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];

	let responseData;
	query.offset = 0;
	query.limit = 100; // Start with first 100 items

	do {
		responseData = await phantombusterApiRequest.call(this, method, endpoint, body, query);

		// Handle the response structure from Phantombuster API
		if (responseData && typeof responseData === 'object') {
			// Check if the response has the expected structure
			if (responseData.data && Array.isArray(responseData.data)) {
				returnData.push(...responseData.data);
			} else if (responseData.results && Array.isArray(responseData.results)) {
				returnData.push(...responseData.results);
			} else if (Array.isArray(responseData)) {
				returnData.push(...responseData);
			} else {
				returnData.push(responseData);
			}
		}

		// Check if we need to fetch more items
		const itemsReturned = responseData && responseData.data && Array.isArray(responseData.data)
			? responseData.data.length
			: (responseData && responseData.results && Array.isArray(responseData.results)
				? responseData.results.length
				: (Array.isArray(responseData) ? responseData.length : 0));

		if (itemsReturned < 100) {
			break; // No more items to fetch
		}

		// Update the offset for the next request
		query.offset = (query.offset as number) + 100;

	} while (true);

	return returnData;
}

export function buildSearchParams(searchParams: IDataObject): IDataObject {
	const params: IDataObject = {};

	if (searchParams.query) {
		params.query = searchParams.query;
	}

	if (searchParams.location) {
		params.location = searchParams.location;
	}

	if (searchParams.industry) {
		params.industry = searchParams.industry;
	}

	if (searchParams.company) {
		params.company = searchParams.company;
	}

	if (searchParams.title) {
		params.title = searchParams.title;
	}

	if (searchParams.school) {
		params.school = searchParams.school;
	}

	if (searchParams.language) {
		params.language = searchParams.language;
	}

	if (searchParams.connectionDegree) {
		params.connectionDegree = searchParams.connectionDegree;
	}

	if (searchParams.sortBy) {
		params.sortBy = searchParams.sortBy;
	}

	if (searchParams.sortOrder) {
		params.sortOrder = searchParams.sortOrder;
	}

	return params;
}

export function buildProfileVisitParams(profileParams: IDataObject): IDataObject {
	const params: IDataObject = {};

	if (profileParams.profileUrl) {
		params.profileUrl = profileParams.profileUrl;
	}

	if (profileParams.profileId) {
		params.profileId = profileParams.profileId;
	}

	if (profileParams.message) {
		params.message = profileParams.message;
	}

	if (profileParams.subject) {
		params.subject = profileParams.subject;
	}

	if (profileParams.connectionNote) {
		params.connectionNote = profileParams.connectionNote;
	}

	if (profileParams.delay) {
		params.delay = profileParams.delay;
	}

	return params;
}

export function buildCookieParams(cookieParams: IDataObject): IDataObject {
	const params: IDataObject = {};

	if (cookieParams.cookieId) {
		params.cookieId = cookieParams.cookieId;
	}

	if (cookieParams.cookieValue) {
		params.cookieValue = cookieParams.cookieValue;
	}

	if (cookieParams.platform) {
		params.platform = cookieParams.platform;
	}

	if (cookieParams.status) {
		params.status = cookieParams.status;
	}

	if (cookieParams.notes) {
		params.notes = cookieParams.notes;
	}

	return params;
}

export function buildAgentParams(agentParams: IDataObject): IDataObject {
	const params: IDataObject = {};

	if (agentParams.agentId) {
		params.agentId = agentParams.agentId;
	}

	if (agentParams.status) {
		params.status = agentParams.status;
	}

	if (agentParams.config) {
		params.config = agentParams.config;
	}

	return params;
}

export function validateJSON(json: string | undefined): any {
	if (!json) {
		return {};
	}

	try {
		return JSON.parse(json);
	} catch (error) {
		throw new Error('Invalid JSON format');
	}
}
