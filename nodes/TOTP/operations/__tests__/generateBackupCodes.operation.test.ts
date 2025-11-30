import type { IExecuteFunctions } from 'n8n-workflow';
import { executeGenerateBackupCodes } from '../generateBackupCodes.operation';
import * as totpService from '../../services/totp.service';

// Mock the TOTP service
jest.mock('../../services/totp.service');

describe('GenerateBackupCodes Operation', () => {
	let mockExecuteFunctions: Partial<IExecuteFunctions>;
	const mockedGenerateBackupCodes = totpService.generateBackupCodes as jest.MockedFunction<typeof totpService.generateBackupCodes>;
	const mockedHashBackupCodes = totpService.hashBackupCodes as jest.MockedFunction<typeof totpService.hashBackupCodes>;

	beforeEach(() => {
		jest.clearAllMocks();
		
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
		};
		
		mockedGenerateBackupCodes.mockReturnValue([
			'ABCD1234',
			'EFGH5678',
			'IJKL9012',
			'MNOP3456',
			'QRST7890',
			'UVWX1234',
			'YZAB5678',
			'CDEF9012',
			'GHIJ3456',
			'KLMN7890',
		]);

		mockedHashBackupCodes.mockReturnValue([]);
	});

	it('should generate backup codes with default parameters', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce(10) // backupCodeCount
			.mockReturnValueOnce(8) // backupCodeLength
			.mockReturnValueOnce('alphanumeric') // backupCodeFormat
			.mockReturnValueOnce('none'); // backupCodeHashAlgorithm

		const result = await executeGenerateBackupCodes.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result).toEqual({
			codes: [
				'ABCD1234',
				'EFGH5678',
				'IJKL9012',
				'MNOP3456',
				'QRST7890',
				'UVWX1234',
				'YZAB5678',
				'CDEF9012',
				'GHIJ3456',
				'KLMN7890',
			],
			count: 10,
			length: 8,
			format: 'alphanumeric',
			hashAlgorithm: 'none',
		});

		expect(mockedGenerateBackupCodes).toHaveBeenCalledWith(10, 8, 'alphanumeric');
		expect(mockedHashBackupCodes).toHaveBeenCalledWith(expect.any(Array), 'none');
	});

	it('should generate backup codes with custom count', async () => {
		mockedGenerateBackupCodes.mockReturnValue([
			'ABCD1234',
			'EFGH5678',
			'IJKL9012',
			'MNOP3456',
			'QRST7890',
		]);

		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce(5) // backupCodeCount
			.mockReturnValueOnce(8) // backupCodeLength
			.mockReturnValueOnce('alphanumeric') // backupCodeFormat
			.mockReturnValueOnce('none'); // backupCodeHashAlgorithm

		const result = await executeGenerateBackupCodes.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.codes).toHaveLength(5);
		expect(result.count).toBe(5);
		expect(mockedGenerateBackupCodes).toHaveBeenCalledWith(5, 8, 'alphanumeric');
	});

	it('should generate backup codes with custom length', async () => {
		mockedGenerateBackupCodes.mockReturnValue([
			'ABCDEF123456',
			'GHIJKL789012',
		]);

		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce(2) // backupCodeCount
			.mockReturnValueOnce(12) // backupCodeLength
			.mockReturnValueOnce('alphanumeric') // backupCodeFormat
			.mockReturnValueOnce('none'); // backupCodeHashAlgorithm

		const result = await executeGenerateBackupCodes.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.length).toBe(12);
		expect(mockedGenerateBackupCodes).toHaveBeenCalledWith(2, 12, 'alphanumeric');
	});

	it('should generate numeric backup codes', async () => {
		mockedGenerateBackupCodes.mockReturnValue([
			'12345678',
			'87654321',
		]);

		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce(2) // backupCodeCount
			.mockReturnValueOnce(8) // backupCodeLength
			.mockReturnValueOnce('numeric') // backupCodeFormat
			.mockReturnValueOnce('none'); // backupCodeHashAlgorithm

		const result = await executeGenerateBackupCodes.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.format).toBe('numeric');
		expect(mockedGenerateBackupCodes).toHaveBeenCalledWith(2, 8, 'numeric');
	});

	it('should generate alphabetic backup codes', async () => {
		mockedGenerateBackupCodes.mockReturnValue([
			'ABCDEFGH',
			'IJKLMNOP',
		]);

		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce(2) // backupCodeCount
			.mockReturnValueOnce(8) // backupCodeLength
			.mockReturnValueOnce('alphabetic') // backupCodeFormat
			.mockReturnValueOnce('none'); // backupCodeHashAlgorithm

		const result = await executeGenerateBackupCodes.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.format).toBe('alphabetic');
		expect(mockedGenerateBackupCodes).toHaveBeenCalledWith(2, 8, 'alphabetic');
	});

	it('should include hashes when hash algorithm is sha256', async () => {
		mockedGenerateBackupCodes.mockReturnValue([
			'ABCD1234',
			'EFGH5678',
		]);
		mockedHashBackupCodes.mockReturnValue([
			'abc123hash',
			'def456hash',
		]);

		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce(2) // backupCodeCount
			.mockReturnValueOnce(8) // backupCodeLength
			.mockReturnValueOnce('alphanumeric') // backupCodeFormat
			.mockReturnValueOnce('sha256'); // backupCodeHashAlgorithm

		const result = await executeGenerateBackupCodes.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.hashAlgorithm).toBe('sha256');
		expect(result.hashes).toEqual(['abc123hash', 'def456hash']);
		expect(mockedHashBackupCodes).toHaveBeenCalledWith(expect.any(Array), 'sha256');
	});

	it('should include hashes when hash algorithm is sha512', async () => {
		mockedGenerateBackupCodes.mockReturnValue([
			'ABCD1234',
		]);
		mockedHashBackupCodes.mockReturnValue([
			'longhash512',
		]);

		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce(1) // backupCodeCount
			.mockReturnValueOnce(8) // backupCodeLength
			.mockReturnValueOnce('alphanumeric') // backupCodeFormat
			.mockReturnValueOnce('sha512'); // backupCodeHashAlgorithm

		const result = await executeGenerateBackupCodes.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.hashAlgorithm).toBe('sha512');
		expect(result.hashes).toEqual(['longhash512']);
		expect(mockedHashBackupCodes).toHaveBeenCalledWith(expect.any(Array), 'sha512');
	});

	it('should not include hashes when hash algorithm is none', async () => {
		mockedGenerateBackupCodes.mockReturnValue([
			'ABCD1234',
		]);
		mockedHashBackupCodes.mockReturnValue([]);

		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce(1) // backupCodeCount
			.mockReturnValueOnce(8) // backupCodeLength
			.mockReturnValueOnce('alphanumeric') // backupCodeFormat
			.mockReturnValueOnce('none'); // backupCodeHashAlgorithm

		const result = await executeGenerateBackupCodes.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.hashAlgorithm).toBe('none');
		expect(result.hashes).toBeUndefined();
	});

	it('should handle different item indices', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce(10) // backupCodeCount
			.mockReturnValueOnce(8) // backupCodeLength
			.mockReturnValueOnce('alphanumeric') // backupCodeFormat
			.mockReturnValueOnce('none'); // backupCodeHashAlgorithm

		await executeGenerateBackupCodes.call(
			mockExecuteFunctions as IExecuteFunctions,
			5
		);

		expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith('backupCodeCount', 5, 10);
		expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith('backupCodeLength', 5, 8);
		expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith('backupCodeFormat', 5, 'alphanumeric');
		expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith('backupCodeHashAlgorithm', 5, 'none');
	});
});
