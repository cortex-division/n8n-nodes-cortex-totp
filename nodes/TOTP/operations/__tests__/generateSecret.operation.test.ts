import type { IExecuteFunctions } from 'n8n-workflow';
import { executeGenerateSecret } from '../generateSecret.operation';
import * as totpService from '../../services/totp.service';

// Mock the TOTP service
jest.mock('../../services/totp.service');

describe('GenerateSecret Operation', () => {
	let mockExecuteFunctions: Partial<IExecuteFunctions>;
	const mockedGenerateSecret = totpService.generateSecret as jest.MockedFunction<typeof totpService.generateSecret>;

	beforeEach(() => {
		jest.clearAllMocks();
		
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
		};
		
		mockedGenerateSecret.mockReturnValue('ABCDEFGHIJKLMNOPQRSTUVWXYZ234567');
	});

	it('should generate a secret with default length', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce(32); // secretLength

		const result = await executeGenerateSecret.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result).toEqual({
			secret: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
			length: 32,
		});

		expect(mockedGenerateSecret).toHaveBeenCalledWith(32);
	});

	it('should generate a secret with custom length', async () => {
		mockedGenerateSecret.mockReturnValue('ABCDEFGHIJKLMNOP');

		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce(16);

		const result = await executeGenerateSecret.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result).toEqual({
			secret: 'ABCDEFGHIJKLMNOP',
			length: 16,
		});

		expect(mockedGenerateSecret).toHaveBeenCalledWith(16);
	});

	it('should handle different secret lengths', async () => {
		const lengths = [8, 16, 24, 32, 48, 64];

		for (const length of lengths) {
			mockedGenerateSecret.mockReturnValue('A'.repeat(length));

			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce(length);

			const result = await executeGenerateSecret.call(
				mockExecuteFunctions as IExecuteFunctions,
				0
			);

			expect(result.length).toBe(length);
			expect(mockedGenerateSecret).toHaveBeenCalledWith(length);
		}
	});

	it('should handle different item indices', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValue(32);

		await executeGenerateSecret.call(
			mockExecuteFunctions as IExecuteFunctions,
			7
		);

		expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith('secretLength', 7, 32);
	});

	it('should return the correct length of the generated secret', async () => {
		const testSecret = 'TESTABCD1234567890TESTABCD123456';
		mockedGenerateSecret.mockReturnValue(testSecret);

		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValue(32);

		const result = await executeGenerateSecret.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.length).toBe(testSecret.length);
		expect(result.secret).toBe(testSecret);
	});
});
