import type { IExecuteFunctions } from 'n8n-workflow';
import { buildTOTPUri, generateQRCode } from '../services/qrcode.service';
import type { GenerateQRResult, QRCodeOptions } from '../types';

export async function executeGenerateQR(
	this: IExecuteFunctions,
	index: number,
): Promise<GenerateQRResult> {
	const secret = this.getNodeParameter('secret', index) as string;
	const label = this.getNodeParameter('label', index) as string;
	const issuer = this.getNodeParameter('issuer', index) as string;
	const qrOptions = this.getNodeParameter('qrOptions', index, {}) as QRCodeOptions;

	const format = qrOptions.format || 'dataURL';
	const algorithm = qrOptions.algorithm || 'sha1';
	const digits = qrOptions.digits || 6;
	const period = qrOptions.period || 30;

	// Build TOTP URI
	const uri = buildTOTPUri(secret, label, issuer, {
		algorithm,
		digits,
		period,
	});

	// Generate QR code
	const qrCode = await generateQRCode(uri, qrOptions);

	return {
		qrCode,
		uri,
		secret,
		label,
		issuer,
		format,
		algorithm,
		digits,
		period,
	};
}
