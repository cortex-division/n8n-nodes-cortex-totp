import type { IExecuteFunctions } from 'n8n-workflow';
import { executeGenerateBackupCodes } from '../generateBackupCodes.operation';
import * as totpService from '../../services/totp.service';

// Mock the TOTP service
jest.mock('../../services/totp.service');

describe('GenerateBackupCodes Operation', () => {
	let mockExecuteFunctions: Partial<IExecuteFunctions>;
	const mockedGenerateBackupCodes = totpService.generateBackupCodes as jest.MockedFunction<typeof totpService.generateBackupCodes>;

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
	});

	it('should generate backup codes with default parameters', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce(10) // backupCodeCount
			.mockReturnValueOnce(8) // backupCodeLength
			.mockReturnValueOnce('alphanumeric'); // backupCodeFormat

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
		});

		expect(mockedGenerateBackupCodes).toHaveBeenCalledWith(10, 8, 'alphanumeric');
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
			.mockReturnValueOnce('alphanumeric'); // backupCodeFormat

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
			.mockReturnValueOnce('alphanumeric'); // backupCodeFormat

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
			.mockReturnValueOnce('numeric'); // backupCodeFormat

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
			.mockReturnValueOnce('alphabetic'); // backupCodeFormat

		const result = await executeGenerateBackupCodes.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.format).toBe('alphabetic');
		expect(mockedGenerateBackupCodes).toHaveBeenCalledWith(2, 8, 'alphabetic');
	});

	it('should handle different item indices', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValue(10)
			.mockReturnValueOnce(10)
			.mockReturnValueOnce(8)
			.mockReturnValueOnce('alphanumeric');

		await executeGenerateBackupCodes.call(
			mockExecuteFunctions as IExecuteFunctions,
			5
		);

		expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith('backupCodeCount', 5, 10);
		expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith('backupCodeLength', 5, 8);
		expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith('backupCodeFormat', 5, 'alphanumeric');
	});
});
