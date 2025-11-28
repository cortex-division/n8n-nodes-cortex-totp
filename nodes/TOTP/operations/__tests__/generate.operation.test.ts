import type { IExecuteFunctions } from 'n8n-workflow';
import { executeGenerate } from '../generate.operation';
import * as totpService from '../../services/totp.service';

// Mock the TOTP service
jest.mock('../../services/totp.service');

describe('Generate Operation', () => {
	let mockExecuteFunctions: Partial<IExecuteFunctions>;
	const mockedGenerateTOTP = totpService.generateTOTP as jest.MockedFunction<typeof totpService.generateTOTP>;

	beforeEach(() => {
		jest.clearAllMocks();
		
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
		};
		
		mockedGenerateTOTP.mockReturnValue('123456');
	});

	it('should generate a token with default options', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce('JBSWY3DPEHPK3PXP') // secret
			.mockReturnValueOnce({}); // additionalOptions

		const result = await executeGenerate.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result).toEqual({
			token: '123456',
			secret: 'JBSWY3DPEHPK3PXP',
			algorithm: 'sha1',
			digits: 6,
			period: 30,
			expiresIn: 30,
		});

		expect(mockedGenerateTOTP).toHaveBeenCalledWith(
			'JBSWY3DPEHPK3PXP',
			'sha1',
			6,
			30
		);
	});

	it('should generate a token with custom algorithm', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce('JBSWY3DPEHPK3PXP')
			.mockReturnValueOnce({ algorithm: 'sha256' });

		const result = await executeGenerate.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.algorithm).toBe('sha256');
		expect(mockedGenerateTOTP).toHaveBeenCalledWith(
			'JBSWY3DPEHPK3PXP',
			'sha256',
			6,
			30
		);
	});

	it('should generate a token with custom digits', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce('JBSWY3DPEHPK3PXP')
			.mockReturnValueOnce({ digits: 8 });

		const result = await executeGenerate.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.digits).toBe(8);
		expect(mockedGenerateTOTP).toHaveBeenCalledWith(
			'JBSWY3DPEHPK3PXP',
			'sha1',
			8,
			30
		);
	});

	it('should generate a token with custom period', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce('JBSWY3DPEHPK3PXP')
			.mockReturnValueOnce({ period: 60 });

		const result = await executeGenerate.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.period).toBe(60);
		expect(result.expiresIn).toBe(60);
		expect(mockedGenerateTOTP).toHaveBeenCalledWith(
			'JBSWY3DPEHPK3PXP',
			'sha1',
			6,
			60
		);
	});

	it('should generate a token with all custom options', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce('JBSWY3DPEHPK3PXP')
			.mockReturnValueOnce({
				algorithm: 'sha512',
				digits: 8,
				period: 45,
			});

		const result = await executeGenerate.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result).toEqual({
			token: '123456',
			secret: 'JBSWY3DPEHPK3PXP',
			algorithm: 'sha512',
			digits: 8,
			period: 45,
			expiresIn: 45,
		});

		expect(mockedGenerateTOTP).toHaveBeenCalledWith(
			'JBSWY3DPEHPK3PXP',
			'sha512',
			8,
			45
		);
	});

	it('should handle different item indices', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValue('TESTSECRET')
			.mockReturnValue({});

		await executeGenerate.call(
			mockExecuteFunctions as IExecuteFunctions,
			5
		);

		expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith('secret', 5);
		expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith('additionalOptions', 5, {});
	});
});
