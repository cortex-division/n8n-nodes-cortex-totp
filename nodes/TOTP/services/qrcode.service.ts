import * as QRCode from 'qrcode';
import type { QRCodeOptions } from '../types';

/**
 * Builds a TOTP URI for QR code generation
 */
export function buildTOTPUri(
	secret: string,
	label: string,
	issuer: string,
	options: QRCodeOptions = {},
): string {
	const encodedLabel = encodeURIComponent(label);
	const encodedIssuer = encodeURIComponent(issuer);
	const algorithm = options.algorithm || 'sha1';
	const digits = options.digits || 6;
	const period = options.period || 30;

	let uri = `otpauth://totp/${encodedLabel}?secret=${secret}&issuer=${encodedIssuer}`;

	// Add non-default parameters to URI
	if (algorithm !== 'sha1') {
		uri += `&algorithm=${algorithm.toUpperCase()}`;
	}
	if (digits !== 6) {
		uri += `&digits=${digits}`;
	}
	if (period !== 30) {
		uri += `&period=${period}`;
	}

	return uri;
}

/**
 * Generates a QR code from a TOTP URI
 */
export async function generateQRCode(
	uri: string,
	options: QRCodeOptions = {},
): Promise<string> {
	const format = options.format || 'dataURL';
	const errorCorrectionLevel = options.errorCorrectionLevel || 'M';
	const width = options.width || 300;

	if (format === 'svg') {
		return await QRCode.toString(uri, {
			type: 'svg',
			errorCorrectionLevel: errorCorrectionLevel as QRCode.QRCodeErrorCorrectionLevel,
			width,
		});
	} else {
		return await QRCode.toDataURL(uri, {
			errorCorrectionLevel: errorCorrectionLevel as QRCode.QRCodeErrorCorrectionLevel,
			width,
		});
	}
}
