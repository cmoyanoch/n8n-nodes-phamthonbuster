import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class PhantombusterCredentialsApi implements ICredentialType {
	name = 'phantombusterCredentialsApi';
	displayName = 'Phantombuster Credentials API';
	documentationUrl = 'https://api.phantombuster.com/docs/';
	icon: Icon = 'file:phantombuster.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'La clave API de Phantombuster (X-Phantombuster-Key)',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Phantombuster-Key': '={{ $credentials.apiKey }}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			method: 'GET',
			url: 'https://api.phantombuster.com/api/v2/user/me',
			headers: {
				'X-Phantombuster-Key-1': '={{$credentials.apiKey}}',
			},
		},
	};
}
