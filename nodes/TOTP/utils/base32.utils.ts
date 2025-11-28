import { ApplicationError } from 'n8n-workflow';
import { leftPad } from './string.utils';

/**
 * Converts a Base32 string to hexadecimal
 */
export function base32ToHex(base32: string): string {
	const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
	let bits = '';
	let hex = '';

	for (let i = 0; i < base32.length; i++) {
		const val = base32chars.indexOf(base32.charAt(i).toUpperCase());
		if (val === -1) throw new ApplicationError('Invalid base32 character in secret');
		bits += leftPad(val.toString(2), 5, '0');
	}

	for (let i = 0; i + 4 <= bits.length; i += 4) {
		const chunk = bits.substring(i, i + 4);
		hex += parseInt(chunk, 2).toString(16);
	}

	return hex;
}
