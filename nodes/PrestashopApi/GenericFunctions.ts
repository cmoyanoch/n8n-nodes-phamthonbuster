import type {
	IExecuteFunctions,
	IDataObject,
	IHttpRequestMethods,
	IRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

export async function prestashopApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body: any = {},
	qs: IDataObject = {},
	uri?: string,
	headers: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('prestashopCredentialsApi');

	if (credentials === undefined) {
		throw new NodeApiError(this.getNode(), { message: 'No credentials got returned!' });
	}

	const { apiUrl, apiKey } = credentials as { apiUrl: string; apiKey: string };

	// Clean up API URL
	const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

	// Add API key to query parameters
	qs.ws_key = apiKey;
	qs.output_format = 'JSON';

	const options: IRequestOptions = {
		headers: {
			'Content-Type': 'application/xml',
			...headers,
		},
		method,
		qs,
		uri: uri || `${baseUrl}/api/${resource}`,
		json: false, // PrestaShop API primarily works with XML, we parse JSON responses manually
	};

	if (Object.keys(body).length !== 0) {
		options.body = body;
	}

	try {
		const response = await this.helpers.request(options);

		// Try to parse JSON response
		if (response && typeof response === 'string') {
			try {
				return JSON.parse(response);
			} catch (parseError: any) {
				// If it's not JSON, return the raw response
				return { data: response };
			}
		}

		return response;
	} catch (err: unknown) {
		const error = err as any;
		let errorMessage = error.message || 'Unknown error occurred';

		// Handle common PrestaShop API errors
		if (error.response?.body) {
			try {
				const errorBody = typeof error.response.body === 'string'
					? JSON.parse(error.response.body)
					: error.response.body;

				if (errorBody.errors) {
					errorMessage = Array.isArray(errorBody.errors)
						? errorBody.errors.map((err: any) => err.message || err).join(', ')
						: errorBody.errors.message || errorBody.errors;
				}
			} catch (parseError: any) {
				// If we can't parse the error body, use the original message
				errorMessage = error.response.body || error.message;
			}
		}

		throw new NodeApiError(this.getNode(), error as JsonObject, { message: errorMessage });
	}
}

export async function prestashopApiRequestAllItems(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: any = {},
	query: IDataObject = {},
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];

	let responseData;
	query.limit = '0,100'; // Start with first 100 items

	do {
		responseData = await prestashopApiRequest.call(this, method, endpoint, body, query);

		// Handle the response structure from PrestaShop API
		if (responseData && typeof responseData === 'object') {
			// Check if the response has the expected structure
			const resourceName = endpoint.split('/')[0]; // e.g., 'products' from 'products' or 'products/1'

			if (responseData[resourceName]) {
				const items = Array.isArray(responseData[resourceName])
					? responseData[resourceName]
					: [responseData[resourceName]];
				returnData.push(...items);
			} else if (Array.isArray(responseData)) {
				returnData.push(...responseData);
			} else {
				returnData.push(responseData);
			}
		}

		// Check if we need to fetch more items
		const itemsReturned = responseData && responseData[endpoint.split('/')[0]] && Array.isArray(responseData[endpoint.split('/')[0]])
			? responseData[endpoint.split('/')[0]].length
			: (responseData && responseData[endpoint.split('/')[0]] ? 1 : 0);

		if (itemsReturned < 100) {
			break; // No more items to fetch
		}

		// Update the limit for the next request
		const currentOffset = parseInt((query.limit as string).split(',')[0], 10);
		query.limit = `${currentOffset + 100},100`;

	} while (true);

	return returnData;
}

export function buildProductXML(productData: IDataObject, productId?: string): string {
	const id = productId ? `<id><![CDATA[${productId}]]></id>` : '<id><![CDATA[]]></id>';

	// Build the name field with language support
	const nameField = productData.name
		? `<name><language id="1"><![CDATA[${productData.name}]]></language></name>`
		: '<name><language id="1"><![CDATA[]]></language></name>';

	// Build the description field with language support
	const descriptionField = productData.description
		? `<description><language id="1"><![CDATA[${productData.description}]]></language></description>`
		: '<description><language id="1"><![CDATA[]]></language></description>';

	// Build the short description field with language support
	const shortDescriptionField = productData.description
		? `<description_short><language id="1"><![CDATA[${String(productData.description).substring(0, 255)}]]></language></description_short>`
		: '<description_short><language id="1"><![CDATA[]]></language></description_short>';

	return `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
	<product>
		${id}
		${nameField}
		${descriptionField}
		${shortDescriptionField}
		<price><![CDATA[${productData.price || 0}]]></price>
		<reference><![CDATA[${productData.reference || ''}]]></reference>
		<active><![CDATA[${productData.active ? 1 : 0}]]></active>
		<quantity><![CDATA[${productData.quantity || 0}]]></quantity>
		<weight><![CDATA[${productData.weight || 0}]]></weight>
		<state><![CDATA[1]]></state>
		<id_category_default><![CDATA[2]]></id_category_default>
		<id_tax_rules_group><![CDATA[1]]></id_tax_rules_group>
		<type><![CDATA[simple]]></type>
		<id_shop_default><![CDATA[1]]></id_shop_default>
		<advanced_stock_management><![CDATA[0]]></advanced_stock_management>
		<date_add><![CDATA[${new Date().toISOString()}]]></date_add>
		<date_upd><![CDATA[${new Date().toISOString()}]]></date_upd>
		<pack_stock_type><![CDATA[3]]></pack_stock_type>
	</product>
</prestashop>`;
}

export function buildCustomerXML(customerData: IDataObject, customerId?: string): string {
	const id = customerId ? `<id><![CDATA[${customerId}]]></id>` : '<id><![CDATA[]]></id>';

	return `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
	<customer>
		${id}
		<email><![CDATA[${customerData.email || ''}]]></email>
		<passwd><![CDATA[${customerData.passwd || ''}]]></passwd>
		<firstname><![CDATA[${customerData.firstname || ''}]]></firstname>
		<lastname><![CDATA[${customerData.lastname || ''}]]></lastname>
		<id_default_group><![CDATA[${customerData.id_default_group || 3}]]></id_default_group>
		<active><![CDATA[${customerData.active ? 1 : 0}]]></active>
		<newsletter><![CDATA[0]]></newsletter>
		<optin><![CDATA[0]]></optin>
		<date_add><![CDATA[${new Date().toISOString()}]]></date_add>
		<date_upd><![CDATA[${new Date().toISOString()}]]></date_upd>
	</customer>
</prestashop>`;
}

export function buildOrderHistoryXML(orderId: string, orderState: string): string {
	return `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
	<order_history>
		<id><![CDATA[]]></id>
		<id_order><![CDATA[${orderId}]]></id_order>
		<id_order_state><![CDATA[${orderState}]]></id_order_state>
		<id_employee><![CDATA[1]]></id_employee>
		<date_add><![CDATA[${new Date().toISOString()}]]></date_add>
	</order_history>
</prestashop>`;
}

export function validateJSON(json: string | undefined): any {
	let result;
	try {
		result = JSON.parse(json || '{}');
	} catch (parseError: any) {
		result = undefined;
	}
	return result;
}

export function buildFeatureXML(featureData: IDataObject, featureId?: string): string {
	const id = featureId ? `<id><![CDATA[${featureId}]]></id>` : '<id><![CDATA[]]></id>';
	const name = featureData.name
		? `<name><language id=\"1\"><![CDATA[${featureData.name}]]></language></name>`
		: '<name><language id=\"1\"><![CDATA[]]></language></name>';

	return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<prestashop xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n\t<product_feature>\n\t\t${id}\n\t\t${name}\n\t</product_feature>\n</prestashop>`;
}

export function buildFeatureValueXML(featureValueData: IDataObject, featureValueId?: string): string {
	const id = featureValueId ? `<id><![CDATA[${featureValueId}]]></id>` : '<id><![CDATA[]]></id>';
	const idFeature = featureValueData.id_feature
		? `<id_feature><![CDATA[${featureValueData.id_feature}]]></id_feature>`
		: '<id_feature><![CDATA[]]></id_feature>';
	const value = featureValueData.value
		? `<value><language id=\"1\"><![CDATA[${featureValueData.value}]]></language></value>`
		: '<value><language id=\"1\"><![CDATA[]]></language></value>';

	return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<prestashop xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n\t<product_feature_value>\n\t\t${id}\n\t\t${idFeature}\n\t\t${value}\n\t</product_feature_value>\n</prestashop>`;
}
