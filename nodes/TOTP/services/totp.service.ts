import { createHmac, randomBytes } from 'crypto';
import { base32ToHex, leftPad } from '../utils';

/**
 * Generates a TOTP token
 */
export function generateTOTP(
	secret: string,
	algorithm: string = 'sha1',
	digits: number = 6,
	period: number = 30,
	timeOffset: number = 0,
): string {
	const timeCounter = Math.floor(Date.now() / 1000 / period) + timeOffset;
	const hexCounter = leftPad(timeCounter.toString(16), 16, '0');

	const decodedSecret = Buffer.from(base32ToHex(secret), 'hex');
	const hmac = createHmac(algorithm, decodedSecret)
		.update(Buffer.from(hexCounter, 'hex'))
		.digest();

	const offset = hmac[hmac.length - 1] & 0xf;
	const binaryCode =
		((hmac[offset] & 0x7f) << 24) |
		((hmac[offset + 1] & 0xff) << 16) |
		((hmac[offset + 2] & 0xff) << 8) |
		(hmac[offset + 3] & 0xff);

	const otp = binaryCode % Math.pow(10, digits);

	return leftPad(otp.toString(), digits, '0');
}

/**
 * Generates a random Base32 secret
 */
export function generateSecret(length: number = 32): string {
	const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
	const bytes = randomBytes(length);
	let secret = '';

	for (let i = 0; i < bytes.length; i++) {
		secret += base32chars[bytes[i] % 32];
	}

	return secret;
}

/**
 * Verifies a TOTP token
 */
export function verifyTOTP(
	userToken: string,
	secret: string,
	tolerance: number = 1,
	algorithm: string = 'sha1',
	digits: number = 6,
	period: number = 30,
): boolean {
	const currentToken = generateTOTP(secret, algorithm, digits, period);

	if (userToken === currentToken) return true;

	for (let i = 1; i <= tolerance; i++) {
		if (
			userToken === generateTOTP(secret, algorithm, digits, period, i) ||
			userToken === generateTOTP(secret, algorithm, digits, period, -i)
		) {
			return true;
		}
	}

	return false;
}
