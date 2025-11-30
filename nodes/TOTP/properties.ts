import type { INodeProperties } from 'n8n-workflow';

export const nodeProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Generate Backup Codes',
				value: 'generateBackupCodes',
				description: 'Generate backup codes for account recovery',
				action: '🔐 Generate backup codes',
			},
			{
				name: 'Generate QR Code',
				value: 'generateQR',
				description: 'Generate a QR code for TOTP setup',
				action: '📱 Generate a QR code',
			},
			{
				name: 'Generate Secret',
				value: 'generateSecret',
				description: 'Generate a new random TOTP secret',
				action: '🎲 Generate a new secret',
			},
			{
				name: 'Generate Token',
				value: 'generate',
				description: 'Generate a TOTP token from a secret',
				action: '🔑 Generate a TOTP token',
			},
			{
				name: 'Verify Token',
				value: 'verify',
				description: 'Verify a TOTP token against a secret',
				action: '✅ Verify a TOTP token',
			},
		],
		default: 'generate',
	},

	// Generate Token operation parameters
	{
		displayName: 'Secret',
		name: 'secret',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				operation: ['generate', 'verify', 'generateQR'],
			},
		},
		default: '',
		description: 'The Base32 encoded secret key',
	},

	// Verify Token operation parameters
	{
		displayName: 'Token',
		name: 'token',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				operation: ['verify'],
			},
		},
		default: '',
		description: 'The TOTP token to verify',
	},

	// Generate QR Code operation parameters
	{
		displayName: 'Label',
		name: 'label',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['generateQR'],
			},
		},
		default: '',
		placeholder: 'user@example.com',
		description: 'The label for the TOTP account (typically email or username)',
	},
	{
		displayName: 'Issuer',
		name: 'issuer',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['generateQR'],
			},
		},
		default: '',
		placeholder: 'MyApp',
		description: 'The issuer name (typically your application name)',
	},

	// Advanced options for all operations
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				operation: ['generate', 'verify'],
			},
		},
		options: [
			{
				displayName: 'Algorithm',
				name: 'algorithm',
				type: 'options',
				options: [
					{
						name: 'SHA1',
						value: 'sha1',
					},
					{
						name: 'SHA256',
						value: 'sha256',
					},
					{
						name: 'SHA512',
						value: 'sha512',
					},
				],
				default: 'sha1',
				description: 'The hashing algorithm to use',
			},
			{
				displayName: 'Digits',
				name: 'digits',
				type: 'number',
				default: 6,
				description: 'The number of digits in the TOTP token',
			},
			{
				displayName: 'Period',
				name: 'period',
				type: 'number',
				default: 30,
				description: 'The time step in seconds',
			},
		],
	},
	{
		displayName: 'Tolerance',
		name: 'tolerance',
		type: 'number',
		default: 1,
		displayOptions: {
			show: {
				operation: ['verify'],
			},
		},
		description: 'Number of time steps to check before and after the current time',
	},

	// Generate Secret operation parameters
	{
		displayName: 'Secret Length',
		name: 'secretLength',
		type: 'number',
		default: 32,
		displayOptions: {
			show: {
				operation: ['generateSecret'],
			},
		},
		description: 'The length of the secret to generate',
	},

	// Generate Backup Codes operation parameters
	{
		displayName: 'Number of Codes',
		name: 'backupCodeCount',
		type: 'number',
		default: 10,
		displayOptions: {
			show: {
				operation: ['generateBackupCodes'],
			},
		},
		description: 'The number of backup codes to generate',
	},
	{
		displayName: 'Code Length',
		name: 'backupCodeLength',
		type: 'number',
		default: 8,
		displayOptions: {
			show: {
				operation: ['generateBackupCodes'],
			},
		},
		description: 'The length of each backup code',
	},
	{
		displayName: 'Code Format',
		name: 'backupCodeFormat',
		type: 'options',
		options: [
			{
				name: 'Alphanumeric',
				value: 'alphanumeric',
				description: 'Letters and numbers (A-Z, 0-9)',
			},
			{
				name: 'Numeric',
				value: 'numeric',
				description: 'Numbers only (0-9)',
			},
			{
				name: 'Alphabetic',
				value: 'alphabetic',
				description: 'Letters only (A-Z)',
			},
		],
		default: 'alphanumeric',
		displayOptions: {
			show: {
				operation: ['generateBackupCodes'],
			},
		},
		description: 'The format of the backup codes',
	},
	{
		displayName: 'Hash Algorithm',
		name: 'backupCodeHashAlgorithm',
		type: 'options',
		options: [
			{
				name: 'None',
				value: 'none',
				description: 'Do not hash the backup codes',
			},
			{
				name: 'SHA256',
				value: 'sha256',
				description: 'Hash codes using SHA-256',
			},
			{
				name: 'SHA512',
				value: 'sha512',
				description: 'Hash codes using SHA-512',
			},
		],
		default: 'none',
		displayOptions: {
			show: {
				operation: ['generateBackupCodes'],
			},
		},
		description: 'Algorithm to use for hashing backup codes (hashes are included alongside plain codes)',
	},

	// QR Code options
	{
		displayName: 'QR Code Options',
		name: 'qrOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				operation: ['generateQR'],
			},
		},
		options: [
			{
				displayName: 'Algorithm',
				name: 'algorithm',
				type: 'options',
				options: [
					{
						name: 'SHA1',
						value: 'sha1',
					},
					{
						name: 'SHA256',
						value: 'sha256',
					},
					{
						name: 'SHA512',
						value: 'sha512',
					},
				],
				default: 'sha1',
				description: 'The hashing algorithm to use',
			},
			{
				displayName: 'Digits',
				name: 'digits',
				type: 'number',
				default: 6,
				description: 'The number of digits in the TOTP token',
			},
			{
				displayName: 'Error Correction Level',
				name: 'errorCorrectionLevel',
				type: 'options',
				options: [
					{
						name: 'Low',
						value: 'L',
					},
					{
						name: 'Medium',
						value: 'M',
					},
					{
						name: 'Quartile',
						value: 'Q',
					},
					{
						name: 'High',
						value: 'H',
					},
				],
				default: 'M',
				description: 'The error correction level of the QR code',
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{
						name: 'Data URL',
						value: 'dataURL',
						description: 'Base64 encoded PNG image',
					},
					{
						name: 'SVG',
						value: 'svg',
						description: 'SVG XML string',
					},
				],
				default: 'dataURL',
				description: 'The format of the QR code output',
			},
			{
				displayName: 'Period',
				name: 'period',
				type: 'number',
				default: 30,
				description: 'The time step in seconds',
			},
			{
				displayName: 'Width',
				name: 'width',
				type: 'number',
				default: 300,
				description: 'The width of the QR code in pixels',
			},
		],
	},
];
