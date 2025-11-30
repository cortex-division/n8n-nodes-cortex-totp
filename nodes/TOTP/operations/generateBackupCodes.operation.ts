import type { IExecuteFunctions } from 'n8n-workflow';
import { generateBackupCodes, hashBackupCodes } from '../services/totp.service';
import type { GenerateBackupCodesResult } from '../types';

export async function executeGenerateBackupCodes(
	this: IExecuteFunctions,
	index: number,
): Promise<GenerateBackupCodesResult> {
	const count = this.getNodeParameter('backupCodeCount', index, 10) as number;
	const length = this.getNodeParameter('backupCodeLength', index, 8) as number;
	const format = this.getNodeParameter('backupCodeFormat', index, 'alphanumeric') as string;
	const hashAlgorithm = this.getNodeParameter('backupCodeHashAlgorithm', index, 'none') as string;

	const codes = generateBackupCodes(count, length, format);
	const hashes = hashBackupCodes(codes, hashAlgorithm);

	const result: GenerateBackupCodesResult = {
		codes,
		count: codes.length,
		length,
		format,
		hashAlgorithm,
	};

	if (hashes.length > 0) {
		result.hashes = hashes;
	}

	return result;
}
