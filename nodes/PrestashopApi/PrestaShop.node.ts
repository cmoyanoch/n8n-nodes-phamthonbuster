import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

import {
	productFields,
	productOperations,
	customerFields,
	customerOperations,
	orderFields,
	orderOperations,
	catalogFields,
	catalogOperations,
	featureFields,
	featureOperations,
	featureValueFields,
	featureValueOperations,
} from './descriptions/index';

import {
	prestashopApiRequest,
	prestashopApiRequestAllItems,
	buildProductXML,
	buildCustomerXML,
	buildOrderHistoryXML,
	buildFeatureXML,
	buildFeatureValueXML,
} from './GenericFunctions';

export class PrestaShop implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PrestaShop',
		name: 'prestashop',
		icon: 'file:prestashopa.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Realiza operaciones avanzadas en la API de PrestaShop 1.7 con gestión completa de e-commerce',
		defaults: {
			name: 'PrestaShop',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'prestashopCredentialsApi',
				required: true,
			},
		],
		properties: [
			// ========== SELECCIÓN DE RECURSO PRINCIPAL ==========
			{
				displayName: 'Recurso',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: '🏪 Productos', value: 'product' },
					{ name: '🛒 Carrito y Pedidos', value: 'order' },
					{ name: '👥 Clientes', value: 'customer' },
					{ name: '📂 Catálogo', value: 'catalog' },
					{ name: '📦 Logística', value: 'shipping' },
					{ name: '💰 Precios y Promociones', value: 'pricing' },
					{ name: '🏬 Configuración de Tienda', value: 'shop' },
					{ name: '📊 Almacén', value: 'warehouse' },
					{ name: '🎨 Personalización', value: 'customization' },
					{ name: '🎨 Características', value: 'feature' },
					{ name: '🎨 Valores de Características', value: 'featureValue' }
				],
				default: 'product',
				description: 'Selecciona la categoría de recursos de PrestaShop',
			},

			// Operations
			...productOperations,
			...customerOperations,
			...orderOperations,
			...catalogOperations,
			...featureOperations,
			...featureValueOperations,

			// Fields
			...productFields,
			...customerFields,
			...orderFields,
			...catalogFields,
			...featureFields,
			...featureValueFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// ========== OPERACIONES DE PRODUCTOS ==========
				if (resource === 'product') {
					const productId = this.getNodeParameter('productId', i, '') as string;

					if (operation === 'get') {
						if (!productId) {
							throw new NodeOperationError(this.getNode(), 'Product ID es requerido para obtener un producto');
						}
						responseData = await prestashopApiRequest.call(this, 'GET', `products/${productId}`);
					}

					else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;

						let endpoint = 'products';
						const qs: IDataObject = {};

						// Apply filters
						if (filters.active !== undefined) {
							qs['filter[active]'] = filters.active;
						}
						if (filters.name) {
							qs['filter[name]'] = `[${filters.name}]%`;
						}
						if (filters.reference) {
							qs['filter[reference]'] = `[${filters.reference}]%`;
						}

						if (returnAll) {
							responseData = await prestashopApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i, 50) as number;
							qs.limit = `0,${limit}`;
							responseData = await prestashopApiRequest.call(this, 'GET', endpoint, {}, qs);
						}
					}

					else if (operation === 'create') {
						const productData = this.getNodeParameter('productData', i, {}) as IDataObject;
						const body = buildProductXML(productData);
						responseData = await prestashopApiRequest.call(this, 'POST', 'products', body);
					}

					else if (operation === 'update') {
						if (!productId) {
							throw new NodeOperationError(this.getNode(), 'Product ID es requerido para actualizar un producto');
						}
						const productData = this.getNodeParameter('productData', i, {}) as IDataObject;
						const body = buildProductXML(productData, productId);
						responseData = await prestashopApiRequest.call(this, 'PUT', `products/${productId}`, body);
					}

					else if (operation === 'delete') {
						if (!productId) {
							throw new NodeOperationError(this.getNode(), 'Product ID es requerido para eliminar un producto');
						}
						responseData = await prestashopApiRequest.call(this, 'DELETE', `products/${productId}`);
					}

					else {
						throw new NodeOperationError(this.getNode(), `La operación "${operation}" no está soportada para productos`);
					}
				}

				// ========== OPERACIONES DE CLIENTES ==========
				else if (resource === 'customer') {
					const customerId = this.getNodeParameter('customerId', i, '') as string;

					if (operation === 'get') {
						if (!customerId) {
							throw new NodeOperationError(this.getNode(), 'Customer ID es requerido para obtener un cliente');
						}
						responseData = await prestashopApiRequest.call(this, 'GET', `customers/${customerId}`);
					}

					else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;

						let endpoint = 'customers';
						const qs: IDataObject = {};

						// Apply filters
						if (filters.active !== undefined) {
							qs['filter[active]'] = filters.active;
						}
						if (filters.email) {
							qs['filter[email]'] = `[${filters.email}]%`;
						}

						if (returnAll) {
							responseData = await prestashopApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i, 50) as number;
							qs.limit = `0,${limit}`;
							responseData = await prestashopApiRequest.call(this, 'GET', endpoint, {}, qs);
						}
					}

					else if (operation === 'create') {
						const customerData = this.getNodeParameter('customerData', i, {}) as IDataObject;
						const body = buildCustomerXML(customerData);
						responseData = await prestashopApiRequest.call(this, 'POST', 'customers', body);
					}

					else if (operation === 'update') {
						if (!customerId) {
							throw new NodeOperationError(this.getNode(), 'Customer ID es requerido para actualizar un cliente');
						}
						const customerData = this.getNodeParameter('customerData', i, {}) as IDataObject;
						const body = buildCustomerXML(customerData, customerId);
						responseData = await prestashopApiRequest.call(this, 'PUT', `customers/${customerId}`, body);
					}

					else if (operation === 'delete') {
						if (!customerId) {
							throw new NodeOperationError(this.getNode(), 'Customer ID es requerido para eliminar un cliente');
						}
						responseData = await prestashopApiRequest.call(this, 'DELETE', `customers/${customerId}`);
					}

					else {
						throw new NodeOperationError(this.getNode(), `La operación "${operation}" no está soportada para clientes`);
					}
				}

				// ========== OPERACIONES DE PEDIDOS ==========
				else if (resource === 'order') {
					const orderId = this.getNodeParameter('orderId', i, '') as string;

					if (operation === 'get') {
						if (!orderId) {
							throw new NodeOperationError(this.getNode(), 'Order ID es requerido para obtener un pedido');
						}
						responseData = await prestashopApiRequest.call(this, 'GET', `orders/${orderId}`);
					}

					else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;

						let endpoint = 'orders';
						const qs: IDataObject = {};

						// Apply filters
						if (filters.customer_id) {
							qs['filter[id_customer]'] = filters.customer_id;
						}
						if (filters.current_state) {
							qs['filter[current_state]'] = filters.current_state;
						}

						if (returnAll) {
							responseData = await prestashopApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i, 50) as number;
							qs.limit = `0,${limit}`;
							responseData = await prestashopApiRequest.call(this, 'GET', endpoint, {}, qs);
						}
					}

					else if (operation === 'updateStatus') {
						if (!orderId) {
							throw new NodeOperationError(this.getNode(), 'Order ID es requerido para actualizar el estado');
						}
						const newState = this.getNodeParameter('newState', i, '') as string;
						const sendEmail = this.getNodeParameter('sendEmailNotification', i, true) as boolean;

						const body = buildOrderHistoryXML(orderId, newState);
						const qs: IDataObject = {};
						if (sendEmail) {
							qs.sendemail = '1';
						}

						responseData = await prestashopApiRequest.call(this, 'POST', 'order_histories', body, qs);
					}

					else {
						throw new NodeOperationError(this.getNode(), `La operación "${operation}" no está soportada para pedidos`);
					}
				}

				// ========== OPERACIONES DE CATÁLOGO ==========
				else if (resource === 'catalog') {
					if (operation === 'getCategories') {
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;

						let endpoint = 'categories';
						const qs: IDataObject = {};

						if (returnAll) {
							responseData = await prestashopApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i, 50) as number;
							qs.limit = `0,${limit}`;
							responseData = await prestashopApiRequest.call(this, 'GET', endpoint, {}, qs);
						}
					}

					else if (operation === 'getManufacturers') {
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;

						let endpoint = 'manufacturers';
						const qs: IDataObject = {};

						if (returnAll) {
							responseData = await prestashopApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i, 50) as number;
							qs.limit = `0,${limit}`;
							responseData = await prestashopApiRequest.call(this, 'GET', endpoint, {}, qs);
						}
					}

					else if (operation === 'getSuppliers') {
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;

						let endpoint = 'suppliers';
						const qs: IDataObject = {};

						if (returnAll) {
							responseData = await prestashopApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i, 50) as number;
							qs.limit = `0,${limit}`;
							responseData = await prestashopApiRequest.call(this, 'GET', endpoint, {}, qs);
						}
					}

					else {
						throw new NodeOperationError(this.getNode(), `La operación "${operation}" no está soportada para catálogo`);
					}
				}

				// ========== OPERACIONES DE CARACTERÍSTICAS ==========
				else if (resource === 'feature') {
					const featureId = this.getNodeParameter('featureId', i, '') as string;

					if (operation === 'get') {
						if (!featureId) {
							throw new NodeOperationError(this.getNode(), 'Feature ID es requerido para obtener una característica');
						}
						responseData = await prestashopApiRequest.call(this, 'GET', `product_features/${featureId}`);
					}

					else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						let endpoint = 'product_features';
						const qs: IDataObject = {};

						if (returnAll) {
							responseData = await prestashopApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i, 50) as number;
							qs.limit = `0,${limit}`;
							responseData = await prestashopApiRequest.call(this, 'GET', endpoint, {}, qs);
						}
					}

					else if (operation === 'create') {
						const featureData = this.getNodeParameter('featureData', i, {}) as IDataObject;
						const body = buildFeatureXML(featureData);
						responseData = await prestashopApiRequest.call(this, 'POST', 'product_features', body);
					}

					else if (operation === 'update') {
						if (!featureId) {
							throw new NodeOperationError(this.getNode(), 'Feature ID es requerido para actualizar una característica');
						}
						const featureData = this.getNodeParameter('featureData', i, {}) as IDataObject;
						const body = buildFeatureXML(featureData, featureId);
						responseData = await prestashopApiRequest.call(this, 'PUT', `product_features/${featureId}`, body);
					}

					else if (operation === 'delete') {
						if (!featureId) {
							throw new NodeOperationError(this.getNode(), 'Feature ID es requerido para eliminar una característica');
						}
						responseData = await prestashopApiRequest.call(this, 'DELETE', `product_features/${featureId}`);
					}

					else {
						throw new NodeOperationError(this.getNode(), `La operación "${operation}" no está soportada para características`);
					}
				}

				// ========== OPERACIONES DE VALORES DE CARACTERÍSTICAS ==========
				else if (resource === 'featureValue') {
					const featureValueId = this.getNodeParameter('featureValueId', i, '') as string;

					if (operation === 'get') {
						if (!featureValueId) {
							throw new NodeOperationError(this.getNode(), 'Feature Value ID es requerido para obtener un valor de característica');
						}
						responseData = await prestashopApiRequest.call(this, 'GET', `product_feature_values/${featureValueId}`);
					}

					else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						let endpoint = 'product_feature_values';
						const qs: IDataObject = {};

						if (returnAll) {
							responseData = await prestashopApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
						} else {
							const limit = this.getNodeParameter('limit', i, 50) as number;
							qs.limit = `0,${limit}`;
							responseData = await prestashopApiRequest.call(this, 'GET', endpoint, {}, qs);
						}
					}

					else if (operation === 'create') {
						const featureValueData = this.getNodeParameter('featureValueData', i, {}) as IDataObject;
						const body = buildFeatureValueXML(featureValueData);
						responseData = await prestashopApiRequest.call(this, 'POST', 'product_feature_values', body);
					}

					else if (operation === 'update') {
						if (!featureValueId) {
							throw new NodeOperationError(this.getNode(), 'Feature Value ID es requerido para actualizar un valor de característica');
						}
						const featureValueData = this.getNodeParameter('featureValueData', i, {}) as IDataObject;
						const body = buildFeatureValueXML(featureValueData, featureValueId);
						responseData = await prestashopApiRequest.call(this, 'PUT', `product_feature_values/${featureValueId}`, body);
					}

					else if (operation === 'delete') {
						if (!featureValueId) {
							throw new NodeOperationError(this.getNode(), 'Feature Value ID es requerido para eliminar un valor de característica');
						}
						responseData = await prestashopApiRequest.call(this, 'DELETE', `product_feature_values/${featureValueId}`);
					}

					else {
						throw new NodeOperationError(this.getNode(), `La operación "${operation}" no está soportada para valores de características`);
					}
				}

				// ========== OTROS RECURSOS ==========
				else {
					throw new NodeOperationError(this.getNode(), `El recurso "${resource}" no está soportado`);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);

			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

// Export por defecto para compatibilidad con n8n
export default PrestaShop;
