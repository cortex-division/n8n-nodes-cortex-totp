import type { IExecuteFunctions } from 'n8n-workflow';
import { generateTOTP } from '../services/totp.service';
import type { GenerateTokenResult, TOTPOptions } from '../types';

export async function executeGenerate(
	this: IExecuteFunctions,
	index: number,
): Promise<GenerateTokenResult> {
	const secret = this.getNodeParameter('secret', index) as string;
	const additionalOptions = this.getNodeParameter('additionalOptions', index, {}) as TOTPOptions;

	const algorithm = additionalOptions.algorithm || 'sha1';
	const digits = additionalOptions.digits || 6;
	const period = additionalOptions.period || 30;

	const token = generateTOTP(secret, algorithm, digits, period);

	return {
		token,
		secret,
		algorithm,
		digits,
		period,
		expiresIn: period,
	};
}
