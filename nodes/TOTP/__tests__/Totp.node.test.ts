import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { TOTP } from '../Totp.node';
import * as operations from '../operations';

// Mock the operations
jest.mock('../operations');

describe('TOTP Node', () => {
	let totpNode: TOTP;
	let mockExecuteFunctions: Partial<IExecuteFunctions>;

	const mockedExecuteGenerate = operations.executeGenerate as jest.MockedFunction<typeof operations.executeGenerate>;
	const mockedExecuteVerify = operations.executeVerify as jest.MockedFunction<typeof operations.executeVerify>;
	const mockedExecuteGenerateSecret = operations.executeGenerateSecret as jest.MockedFunction<typeof operations.executeGenerateSecret>;
	const mockedExecuteGenerateQR = operations.executeGenerateQR as jest.MockedFunction<typeof operations.executeGenerateQR>;

	beforeEach(() => {
		jest.clearAllMocks();
		totpNode = new TOTP();
		
		mockExecuteFunctions = {
			getInputData: jest.fn(),
			getNodeParameter: jest.fn(),
			continueOnFail: jest.fn().mockReturnValue(false),
			getNode: jest.fn().mockReturnValue({ name: 'TOTP' }),
		};
	});

	describe('Node Description', () => {
		it('should have correct node properties', () => {
			expect(totpNode.description.displayName).toBe('TOTP');
			expect(totpNode.description.name).toBe('totp');
			expect(totpNode.description.group).toContain('transform');
			expect(totpNode.description.version).toBe(1);
		});

		it('should have correct inputs and outputs', () => {
			expect(totpNode.description.inputs).toContain(NodeConnectionTypes.Main);
			expect(totpNode.description.outputs).toContain(NodeConnectionTypes.Main);
		});

		it('should be usable as a tool', () => {
			expect(totpNode.description.usableAsTool).toBe(true);
		});
	});

	describe('Execute - Generate Operation', () => {
		it('should execute generate operation successfully', async () => {
			const mockResult = {
				token: '123456',
				secret: 'JBSWY3DPEHPK3PXP',
				algorithm: 'sha1',
				digits: 6,
				period: 30,
				expiresIn: 30,
			};

			(mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue([{}]);
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockReturnValue('generate');
			mockedExecuteGenerate.mockResolvedValue(mockResult);

			const result = await totpNode.execute.call(
				mockExecuteFunctions as IExecuteFunctions
			);

			expect(result).toEqual([
				[
					{
						json: mockResult,
						pairedItem: { item: 0 },
					},
				],
			]);

			expect(mockedExecuteGenerate).toHaveBeenCalledWith(0);
		});
	});

	describe('Execute - Verify Operation', () => {
		it('should execute verify operation successfully', async () => {
			const mockResult = {
				valid: true,
				token: '123456',
				secret: 'JBSWY3DPEHPK3PXP',
				algorithm: 'sha1',
				digits: 6,
				period: 30,
				tolerance: 1,
			};

			(mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue([{}]);
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockReturnValue('verify');
			mockedExecuteVerify.mockResolvedValue(mockResult);

			const result = await totpNode.execute.call(
				mockExecuteFunctions as IExecuteFunctions
			);

			expect(result).toEqual([
				[
					{
						json: mockResult,
						pairedItem: { item: 0 },
					},
				],
			]);

			expect(mockedExecuteVerify).toHaveBeenCalledWith(0);
		});
	});

	describe('Execute - GenerateSecret Operation', () => {
		it('should execute generateSecret operation successfully', async () => {
			const mockResult = {
				secret: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
				length: 32,
			};

			(mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue([{}]);
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockReturnValue('generateSecret');
			mockedExecuteGenerateSecret.mockResolvedValue(mockResult);

			const result = await totpNode.execute.call(
				mockExecuteFunctions as IExecuteFunctions
			);

			expect(result).toEqual([
				[
					{
						json: mockResult,
						pairedItem: { item: 0 },
					},
				],
			]);

			expect(mockedExecuteGenerateSecret).toHaveBeenCalledWith(0);
		});
	});

	describe('Execute - GenerateQR Operation', () => {
		it('should execute generateQR operation successfully', async () => {
			const mockResult = {
				qrCode: 'data:image/png;base64,mockdata',
				uri: 'otpauth://totp/user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=MyApp',
				secret: 'JBSWY3DPEHPK3PXP',
				label: 'user@example.com',
				issuer: 'MyApp',
				format: 'dataURL',
				algorithm: 'sha1',
				digits: 6,
				period: 30,
			};

			(mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue([{}]);
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockReturnValue('generateQR');
			mockedExecuteGenerateQR.mockResolvedValue(mockResult);

			const result = await totpNode.execute.call(
				mockExecuteFunctions as IExecuteFunctions
			);

			expect(result).toEqual([
				[
					{
						json: mockResult,
						pairedItem: { item: 0 },
					},
				],
			]);

			expect(mockedExecuteGenerateQR).toHaveBeenCalledWith(0);
		});
	});

	describe('Execute - Multiple Items', () => {
		it('should process multiple items', async () => {
			const mockResult1 = { token: '123456' };
			const mockResult2 = { token: '789012' };

			(mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue([
				{ json: {} },
				{ json: {} },
			]);
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockReturnValue('generate');
			mockedExecuteGenerate
				.mockResolvedValueOnce(mockResult1 as any)
				.mockResolvedValueOnce(mockResult2 as any);

			const result = await totpNode.execute.call(
				mockExecuteFunctions as IExecuteFunctions
			);

			expect(result[0]).toHaveLength(2);
			expect(result[0][0].json).toEqual(mockResult1);
			expect(result[0][1].json).toEqual(mockResult2);
			expect(mockedExecuteGenerate).toHaveBeenCalledTimes(2);
		});
	});

	describe('Execute - Error Handling', () => {
		it('should throw NodeOperationError on error', async () => {
			(mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue([{}]);
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockReturnValue('generate');
			mockedExecuteGenerate.mockRejectedValue(new Error('Test error'));

			await expect(
				totpNode.execute.call(mockExecuteFunctions as IExecuteFunctions)
			).rejects.toThrow(NodeOperationError);
		});

		it('should continue on fail when continueOnFail is true', async () => {
			(mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue([{}]);
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockReturnValue('generate');
			(mockExecuteFunctions.continueOnFail as jest.Mock).mockReturnValue(true);
			mockedExecuteGenerate.mockRejectedValue(new Error('Test error'));

			const result = await totpNode.execute.call(
				mockExecuteFunctions as IExecuteFunctions
			);

			expect(result[0]).toHaveLength(1);
			expect(result[0][0].json).toEqual({ error: 'Test error' });
		});

		it('should throw error for unknown operation', async () => {
			(mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue([{}]);
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockReturnValue('unknownOperation');

			await expect(
				totpNode.execute.call(mockExecuteFunctions as IExecuteFunctions)
			).rejects.toThrow(NodeOperationError);
		});
	});

	describe('Execute - Paired Items', () => {
		it('should maintain paired items correctly', async () => {
			const items: INodeExecutionData[] = [
				{ json: {} },
				{ json: {} },
				{ json: {} },
			];
			(mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue(items);
			(mockExecuteFunctions.getNodeParameter as jest.Mock).mockReturnValue('generate');
			
			mockedExecuteGenerate
				.mockResolvedValueOnce({ token: '123456' } as any)
				.mockResolvedValueOnce({ token: '789012' } as any)
				.mockResolvedValueOnce({ token: '345678' } as any);

			const result = await totpNode.execute.call(
				mockExecuteFunctions as IExecuteFunctions
			);

			expect(result[0][0].pairedItem).toEqual({ item: 0 });
			expect(result[0][1].pairedItem).toEqual({ item: 1 });
			expect(result[0][2].pairedItem).toEqual({ item: 2 });
		});
	});

	describe('Execute - Operation Switching', () => {
		it('should call correct operation based on parameter', async () => {
			const items: INodeExecutionData[] = [
				{ json: {} },
				{ json: {} },
				{ json: {} },
				{ json: {} },
			];
			(mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue(items);

			const operations = ['generate', 'verify', 'generateSecret', 'generateQR'];
			operations.forEach((op, index) => {
				(mockExecuteFunctions.getNodeParameter as jest.Mock).mockReturnValueOnce(op);
			});

			mockedExecuteGenerate.mockResolvedValue({ token: '123456' } as any);
			mockedExecuteVerify.mockResolvedValue({ valid: true } as any);
			mockedExecuteGenerateSecret.mockResolvedValue({ secret: 'SECRET' } as any);
			mockedExecuteGenerateQR.mockResolvedValue({ qrCode: 'QR' } as any);

			await totpNode.execute.call(mockExecuteFunctions as IExecuteFunctions);

			expect(mockedExecuteGenerate).toHaveBeenCalledWith(0);
			expect(mockedExecuteVerify).toHaveBeenCalledWith(1);
			expect(mockedExecuteGenerateSecret).toHaveBeenCalledWith(2);
			expect(mockedExecuteGenerateQR).toHaveBeenCalledWith(3);
		});
	});
});
