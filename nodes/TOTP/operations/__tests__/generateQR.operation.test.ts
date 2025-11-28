import type { IExecuteFunctions } from 'n8n-workflow';
import { executeGenerateQR } from '../generateQR.operation';
import * as qrcodeService from '../../services/qrcode.service';

// Mock the QRCode service
jest.mock('../../services/qrcode.service');

describe('GenerateQR Operation', () => {
	let mockExecuteFunctions: Partial<IExecuteFunctions>;
	const mockedBuildTOTPUri = qrcodeService.buildTOTPUri as jest.MockedFunction<typeof qrcodeService.buildTOTPUri>;
	const mockedGenerateQRCode = qrcodeService.generateQRCode as jest.MockedFunction<typeof qrcodeService.generateQRCode>;

	beforeEach(() => {
		jest.clearAllMocks();
		
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
		};
		
		mockedBuildTOTPUri.mockReturnValue('otpauth://totp/user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=MyApp');
		mockedGenerateQRCode.mockResolvedValue('data:image/png;base64,mockbase64data');
	});

	it('should generate QR code with default options', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce('JBSWY3DPEHPK3PXP') // secret
			.mockReturnValueOnce('user@example.com') // label
			.mockReturnValueOnce('MyApp') // issuer
			.mockReturnValueOnce({}); // qrOptions

		const result = await executeGenerateQR.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result).toEqual({
			qrCode: 'data:image/png;base64,mockbase64data',
			uri: 'otpauth://totp/user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=MyApp',
			secret: 'JBSWY3DPEHPK3PXP',
			label: 'user@example.com',
			issuer: 'MyApp',
			format: 'dataURL',
			algorithm: 'sha1',
			digits: 6,
			period: 30,
		});

		expect(mockedBuildTOTPUri).toHaveBeenCalledWith(
			'JBSWY3DPEHPK3PXP',
			'user@example.com',
			'MyApp',
			{
				algorithm: 'sha1',
				digits: 6,
				period: 30,
			}
		);

		expect(mockedGenerateQRCode).toHaveBeenCalledWith(
			'otpauth://totp/user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=MyApp',
			{}
		);
	});

	it('should generate QR code with SVG format', async () => {
		mockedGenerateQRCode.mockResolvedValue('<svg>mock svg</svg>');

		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce('JBSWY3DPEHPK3PXP')
			.mockReturnValueOnce('user@example.com')
			.mockReturnValueOnce('MyApp')
			.mockReturnValueOnce({ format: 'svg' });

		const result = await executeGenerateQR.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.format).toBe('svg');
		expect(result.qrCode).toBe('<svg>mock svg</svg>');
	});

	it('should generate QR code with custom algorithm', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce('JBSWY3DPEHPK3PXP')
			.mockReturnValueOnce('user@example.com')
			.mockReturnValueOnce('MyApp')
			.mockReturnValueOnce({ algorithm: 'sha256' });

		const result = await executeGenerateQR.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.algorithm).toBe('sha256');
		expect(mockedBuildTOTPUri).toHaveBeenCalledWith(
			'JBSWY3DPEHPK3PXP',
			'user@example.com',
			'MyApp',
			{
				algorithm: 'sha256',
				digits: 6,
				period: 30,
			}
		);
	});

	it('should generate QR code with custom digits', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce('JBSWY3DPEHPK3PXP')
			.mockReturnValueOnce('user@example.com')
			.mockReturnValueOnce('MyApp')
			.mockReturnValueOnce({ digits: 8 });

		const result = await executeGenerateQR.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.digits).toBe(8);
		expect(mockedBuildTOTPUri).toHaveBeenCalledWith(
			'JBSWY3DPEHPK3PXP',
			'user@example.com',
			'MyApp',
			{
				algorithm: 'sha1',
				digits: 8,
				period: 30,
			}
		);
	});

	it('should generate QR code with custom period', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce('JBSWY3DPEHPK3PXP')
			.mockReturnValueOnce('user@example.com')
			.mockReturnValueOnce('MyApp')
			.mockReturnValueOnce({ period: 60 });

		const result = await executeGenerateQR.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result.period).toBe(60);
		expect(mockedBuildTOTPUri).toHaveBeenCalledWith(
			'JBSWY3DPEHPK3PXP',
			'user@example.com',
			'MyApp',
			{
				algorithm: 'sha1',
				digits: 6,
				period: 60,
			}
		);
	});

	it('should generate QR code with all custom options', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce('JBSWY3DPEHPK3PXP')
			.mockReturnValueOnce('user@example.com')
			.mockReturnValueOnce('MyApp')
			.mockReturnValueOnce({
				format: 'svg',
				algorithm: 'sha512',
				digits: 8,
				period: 45,
				width: 500,
				errorCorrectionLevel: 'H',
			});

		mockedGenerateQRCode.mockResolvedValue('<svg>custom svg</svg>');

		const result = await executeGenerateQR.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(result).toEqual({
			qrCode: '<svg>custom svg</svg>',
			uri: 'otpauth://totp/user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=MyApp',
			secret: 'JBSWY3DPEHPK3PXP',
			label: 'user@example.com',
			issuer: 'MyApp',
			format: 'svg',
			algorithm: 'sha512',
			digits: 8,
			period: 45,
		});

		expect(mockedBuildTOTPUri).toHaveBeenCalledWith(
			'JBSWY3DPEHPK3PXP',
			'user@example.com',
			'MyApp',
			{
				algorithm: 'sha512',
				digits: 8,
				period: 45,
			}
		);

		expect(mockedGenerateQRCode).toHaveBeenCalledWith(
			'otpauth://totp/user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=MyApp',
			{
				format: 'svg',
				algorithm: 'sha512',
				digits: 8,
				period: 45,
				width: 500,
				errorCorrectionLevel: 'H',
			}
		);
	});

	it('should handle different item indices', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValue('test')
			.mockReturnValue({});

		await executeGenerateQR.call(
			mockExecuteFunctions as IExecuteFunctions,
			4
		);

		expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith('secret', 4);
		expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith('label', 4);
		expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith('issuer', 4);
	});

	it('should handle special characters in label and issuer', async () => {
		(mockExecuteFunctions.getNodeParameter as jest.Mock)
			.mockReturnValueOnce('JBSWY3DPEHPK3PXP')
			.mockReturnValueOnce('user+test@example.com')
			.mockReturnValueOnce('My App & Co')
			.mockReturnValueOnce({});

		await executeGenerateQR.call(
			mockExecuteFunctions as IExecuteFunctions,
			0
		);

		expect(mockedBuildTOTPUri).toHaveBeenCalledWith(
			'JBSWY3DPEHPK3PXP',
			'user+test@example.com',
			'My App & Co',
			expect.any(Object)
		);
	});
});
