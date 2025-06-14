import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class PrestashopCredentialsApi implements ICredentialType {
	name = 'prestashopCredentialsApi';
	displayName = 'Prestashop Credentials API';
	documentationUrl = 'https://devdocs.prestashop-project.org/1.7/webservice/';
	icon: Icon = 'file:prestashopa.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'API URL',
			name: 'apiUrl',
			type: 'string',
			default: '',
			placeholder: 'http://host.docker.internal/cldescorcha/api/',
			description: 'La URL base de la API de tu tienda PrestaShop',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'La clave API generada en tu tienda PrestaShop',
		},
	];

	// This credential is currently not used by any node directly
	// but the HTTP Request node can use it to make requests.
	// The credential is also testable due to the `test` property below
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{ $credentials.apiKey }}',
				password: '',
			},
		},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{ $credentials.apiUrl }}',
			url: 'products', // Puedes dejarlo vacío o poner un endpoint de prueba
		},
	};
}
