import type { IExecuteFunctions } from 'n8n-workflow';
import { verifyTOTP } from '../services/totp.service';
import type { VerifyTokenResult, TOTPOptions } from '../types';

export async function executeVerify(
	this: IExecuteFunctions,
	index: number,
): Promise<VerifyTokenResult> {
	const secret = this.getNodeParameter('secret', index) as string;
	const token = this.getNodeParameter('token', index) as string;
	const tolerance = this.getNodeParameter('tolerance', index, 1) as number;
	const additionalOptions = this.getNodeParameter('additionalOptions', index, {}) as TOTPOptions;

	const algorithm = additionalOptions.algorithm || 'sha1';
	const digits = additionalOptions.digits || 6;
	const period = additionalOptions.period || 30;

	const isValid = verifyTOTP(token, secret, tolerance, algorithm, digits, period);

	return {
		valid: isValid,
		token,
		secret,
		algorithm,
		digits,
		period,
		tolerance,
	};
}
