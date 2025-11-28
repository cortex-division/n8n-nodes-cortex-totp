import type { IExecuteFunctions } from 'n8n-workflow';
import { generateSecret } from '../services/totp.service';
import type { GenerateSecretResult } from '../types';

export async function executeGenerateSecret(
	this: IExecuteFunctions,
	index: number,
): Promise<GenerateSecretResult> {
	const secretLength = this.getNodeParameter('secretLength', index, 32) as number;

	const secret = generateSecret(secretLength);

	return {
		secret,
		length: secret.length,
	};
}
