import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { nodeProperties } from './properties';
import {
	executeGenerate,
	executeVerify,
	executeGenerateSecret,
	executeGenerateQR,
} from './operations';

export class Totp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TOTP',
		name: 'totp',
		icon: { light: 'file:totp-light.svg', dark: 'file:totp-dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Generate and verify Time-based One-Time Passwords (TOTP)',
		defaults: {
			name: 'TOTP',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		properties: nodeProperties,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				let result;

				switch (operation) {
					case 'generate':
						result = await executeGenerate.call(this, i);
						break;
					case 'verify':
						result = await executeVerify.call(this, i);
						break;
					case 'generateSecret':
						result = await executeGenerateSecret.call(this, i);
						break;
				case 'generateQR':
					result = await executeGenerateQR.call(this, i);
					break;
				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
						itemIndex: i,
					});
				}

				returnData.push({
					json: result as unknown as IDataObject,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
