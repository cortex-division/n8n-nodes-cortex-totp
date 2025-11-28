import type { IExecuteFunctions } from 'n8n-workflow';
import { executeVerify } from '../verify.operation';
import * as totpService from '../../services/totp.service';

// Mock the TOTP service
jest.mock('../../services/totp.service');

describe('Verify Operation', () => {
	let mockExecuteFunctions: Partial<IExecuteFunctions>;
	const mockedVerifyTOTP = totpService.verifyTOTP as jest.MockedFunction<typeof totpService.verifyTOTP>;

	beforeEach(() => {
		jest.clearAllMocks();
		
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
		};
	});

	it('should verify a valid token', async () => {
		mockedVerifyTOTP.mockReturnValue(true);

		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce('JBSWY3DPEHPK3PXP') // secret
			.mockReturnValueOnce('123456') // token
			.mockReturnValueOnce(1) // tolerance
			.mockReturnValueOnce({}); // additionalOptions

		const result = await executeVerify.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result).toEqual({
			valid: true,
			token: '123456',
			secret: 'JBSWY3DPEHPK3PXP',
			algorithm: 'sha1',
			digits: 6,
			period: 30,
			tolerance: 1,
		});

		expect(mockedVerifyTOTP).toHaveBeenCalledWith(
			'123456',
			'JBSWY3DPEHPK3PXP',
			1,
			'sha1',
			6,
			30
		);
	});

	it('should verify an invalid token', async () => {
		mockedVerifyTOTP.mockReturnValue(false);

		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce('JBSWY3DPEHPK3PXP')
			.mockReturnValueOnce('000000')
			.mockReturnValueOnce(1)
			.mockReturnValueOnce({});

		const result = await executeVerify.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.valid).toBe(false);
		expect(result.token).toBe('000000');
	});

	it('should verify with custom tolerance', async () => {
		mockedVerifyTOTP.mockReturnValue(true);

		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce('JBSWY3DPEHPK3PXP')
			.mockReturnValueOnce('123456')
			.mockReturnValueOnce(3)
			.mockReturnValueOnce({});

		const result = await executeVerify.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.tolerance).toBe(3);
		expect(mockedVerifyTOTP).toHaveBeenCalledWith(
			'123456',
			'JBSWY3DPEHPK3PXP',
			3,
			'sha1',
			6,
			30
		);
	});

	it('should verify with custom algorithm', async () => {
		mockedVerifyTOTP.mockReturnValue(true);

		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce('JBSWY3DPEHPK3PXP')
			.mockReturnValueOnce('123456')
			.mockReturnValueOnce(1)
			.mockReturnValueOnce({ algorithm: 'sha256' });

		const result = await executeVerify.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.algorithm).toBe('sha256');
		expect(mockedVerifyTOTP).toHaveBeenCalledWith(
			'123456',
			'JBSWY3DPEHPK3PXP',
			1,
			'sha256',
			6,
			30
		);
	});

	it('should verify with custom digits', async () => {
		mockedVerifyTOTP.mockReturnValue(true);

		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce('JBSWY3DPEHPK3PXP')
			.mockReturnValueOnce('12345678')
			.mockReturnValueOnce(1)
			.mockReturnValueOnce({ digits: 8 });

		const result = await executeVerify.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.digits).toBe(8);
		expect(mockedVerifyTOTP).toHaveBeenCalledWith(
			'12345678',
			'JBSWY3DPEHPK3PXP',
			1,
			'sha1',
			8,
			30
		);
	});

	it('should verify with custom period', async () => {
		mockedVerifyTOTP.mockReturnValue(true);

		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce('JBSWY3DPEHPK3PXP')
			.mockReturnValueOnce('123456')
			.mockReturnValueOnce(1)
			.mockReturnValueOnce({ period: 60 });

		const result = await executeVerify.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.period).toBe(60);
		expect(mockedVerifyTOTP).toHaveBeenCalledWith(
			'123456',
			'JBSWY3DPEHPK3PXP',
			1,
			'sha1',
			6,
			60
		);
	});

	it('should verify with all custom options', async () => {
		mockedVerifyTOTP.mockReturnValue(true);

		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce('JBSWY3DPEHPK3PXP')
			.mockReturnValueOnce('12345678')
			.mockReturnValueOnce(2)
			.mockReturnValueOnce({
				algorithm: 'sha512',
				digits: 8,
				period: 45,
			});

		const result = await executeVerify.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result).toEqual({
			valid: true,
			token: '12345678',
			secret: 'JBSWY3DPEHPK3PXP',
			algorithm: 'sha512',
			digits: 8,
			period: 45,
			tolerance: 2,
		});

		expect(mockedVerifyTOTP).toHaveBeenCalledWith(
			'12345678',
			'JBSWY3DPEHPK3PXP',
			2,
			'sha512',
			8,
			45
		);
	});

	it('should handle different item indices', async () => {
		mockedVerifyTOTP.mockReturnValue(true);

		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValue('test')
			.mockReturnValue({});

		await executeVerify.call(
			mockExecuteFunctions as IExecuteFunctions,
			3
		);

		expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith('secret', 3);
		expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith('token', 3);
		expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith('tolerance', 3, 1);
	});
});
