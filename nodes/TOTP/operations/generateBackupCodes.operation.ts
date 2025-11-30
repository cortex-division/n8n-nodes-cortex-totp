import type { IExecuteFunctions } from 'n8n-workflow';
import { generateBackupCodes } from '../services/totp.service';
import type { GenerateBackupCodesResult } from '../types';

export async function executeGenerateBackupCodes(
	this: IExecuteFunctions,
	index: number,
): Promise<GenerateBackupCodesResult> {
	const count = this.getNodeParameter('backupCodeCount', index, 10) as number;
	const length = this.getNodeParameter('backupCodeLength', index, 8) as number;
	const format = this.getNodeParameter('backupCodeFormat', index, 'alphanumeric') as string;

	const codes = generateBackupCodes(count, length, format);

	return {
		codes,
		count: codes.length,
		length,
		format,
	};
}
