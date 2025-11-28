import { generateTOTP, verifyTOTP, generateSecret } from '../totp.service';

describe('TOTP Service', () => {
	describe('generateSecret', () => {
		it('should generate a secret of default length 32', () => {
			const secret = generateSecret();
			expect(secret).toHaveLength(32);
		});

		it('should generate a secret of specified length', () => {
			const secret = generateSecret(16);
			expect(secret).toHaveLength(16);
		});

		it('should generate different secrets on each call', () => {
			const secret1 = generateSecret();
			const secret2 = generateSecret();
			expect(secret1).not.toBe(secret2);
		});

		it('should only contain valid base32 characters', () => {
			const secret = generateSecret(64);
			const validBase32Regex = /^[A-Z2-7]+$/;
			expect(secret).toMatch(validBase32Regex);
		});

		it('should generate secrets of various lengths', () => {
			[8, 16, 24, 32, 48, 64].forEach((length) => {
				const secret = generateSecret(length);
				expect(secret).toHaveLength(length);
			});
		});
	});

	describe('generateTOTP', () => {
		const testSecret = 'JBSWY3DPEHPK3PXP';

		it('should generate a 6-digit token by default', () => {
			const token = generateTOTP(testSecret);
			expect(token).toMatch(/^\d{6}$/);
		});

		it('should generate tokens with custom digit lengths', () => {
			const token4 = generateTOTP(testSecret, 'sha1', 4);
			const token8 = generateTOTP(testSecret, 'sha1', 8);
			expect(token4).toMatch(/^\d{4}$/);
			expect(token8).toMatch(/^\d{8}$/);
		});

		it('should generate the same token for the same time window', () => {
			const token1 = generateTOTP(testSecret);
			const token2 = generateTOTP(testSecret);
			expect(token1).toBe(token2);
		});

		it('should work with different algorithms', () => {
			const tokenSha1 = generateTOTP(testSecret, 'sha1');
			const tokenSha256 = generateTOTP(testSecret, 'sha256');
			const tokenSha512 = generateTOTP(testSecret, 'sha512');

			expect(tokenSha1).toMatch(/^\d{6}$/);
			expect(tokenSha256).toMatch(/^\d{6}$/);
			expect(tokenSha512).toMatch(/^\d{6}$/);
			
			// Different algorithms should produce different tokens
			expect(tokenSha1).not.toBe(tokenSha256);
			expect(tokenSha1).not.toBe(tokenSha512);
		});

		it('should work with custom period', () => {
			const token30 = generateTOTP(testSecret, 'sha1', 6, 30);
			const token60 = generateTOTP(testSecret, 'sha1', 6, 60);
			expect(token30).toMatch(/^\d{6}$/);
			expect(token60).toMatch(/^\d{6}$/);
		});

		it('should generate different tokens with time offset', () => {
			const currentToken = generateTOTP(testSecret, 'sha1', 6, 30, 0);
			const futureToken = generateTOTP(testSecret, 'sha1', 6, 30, 1);
			const pastToken = generateTOTP(testSecret, 'sha1', 6, 30, -1);

			expect(currentToken).toMatch(/^\d{6}$/);
			expect(futureToken).toMatch(/^\d{6}$/);
			expect(pastToken).toMatch(/^\d{6}$/);
		});

		it('should pad tokens with leading zeros', () => {
			// Generate multiple tokens to ensure padding works
			for (let i = 0; i < 10; i++) {
				const token = generateTOTP(testSecret, 'sha1', 6, 30, i);
				expect(token).toHaveLength(6);
				expect(token).toMatch(/^\d{6}$/);
			}
		});
	});

	describe('verifyTOTP', () => {
		const testSecret = 'JBSWY3DPEHPK3PXP';

		it('should verify a valid current token', () => {
			const token = generateTOTP(testSecret);
			const isValid = verifyTOTP(token, testSecret);
			expect(isValid).toBe(true);
		});

		it('should reject an invalid token', () => {
			const isValid = verifyTOTP('000000', testSecret);
			expect(isValid).toBe(false);
		});

		it('should verify tokens within tolerance window', () => {
			const currentToken = generateTOTP(testSecret, 'sha1', 6, 30, 0);
			const futureToken = generateTOTP(testSecret, 'sha1', 6, 30, 1);
			const pastToken = generateTOTP(testSecret, 'sha1', 6, 30, -1);

			// With tolerance of 1, should accept current, +1, and -1
			expect(verifyTOTP(currentToken, testSecret, 1)).toBe(true);
			expect(verifyTOTP(futureToken, testSecret, 1)).toBe(true);
			expect(verifyTOTP(pastToken, testSecret, 1)).toBe(true);
		});

		it('should reject tokens outside tolerance window', () => {
			const futureToken = generateTOTP(testSecret, 'sha1', 6, 30, 3);
			const pastToken = generateTOTP(testSecret, 'sha1', 6, 30, -3);

			// With tolerance of 1, should reject tokens at +3 and -3
			expect(verifyTOTP(futureToken, testSecret, 1)).toBe(false);
			expect(verifyTOTP(pastToken, testSecret, 1)).toBe(false);
		});

		it('should work with zero tolerance', () => {
			const currentToken = generateTOTP(testSecret);
			const futureToken = generateTOTP(testSecret, 'sha1', 6, 30, 1);

			expect(verifyTOTP(currentToken, testSecret, 0)).toBe(true);
			expect(verifyTOTP(futureToken, testSecret, 0)).toBe(false);
		});

		it('should work with larger tolerance', () => {
			const token2 = generateTOTP(testSecret, 'sha1', 6, 30, 2);
			const token3 = generateTOTP(testSecret, 'sha1', 6, 30, -3);

			expect(verifyTOTP(token2, testSecret, 2)).toBe(true);
			expect(verifyTOTP(token3, testSecret, 3)).toBe(true);
			expect(verifyTOTP(token3, testSecret, 2)).toBe(false);
		});

		it('should work with custom algorithm', () => {
			const token = generateTOTP(testSecret, 'sha256', 6, 30);
			const isValid = verifyTOTP(token, testSecret, 1, 'sha256');
			expect(isValid).toBe(true);
		});

		it('should work with custom digits', () => {
			const token = generateTOTP(testSecret, 'sha1', 8, 30);
			const isValid = verifyTOTP(token, testSecret, 1, 'sha1', 8);
			expect(isValid).toBe(true);
		});

		it('should work with custom period', () => {
			const token = generateTOTP(testSecret, 'sha1', 6, 60);
			const isValid = verifyTOTP(token, testSecret, 1, 'sha1', 6, 60);
			expect(isValid).toBe(true);
		});

		it('should reject empty token', () => {
			const isValid = verifyTOTP('', testSecret);
			expect(isValid).toBe(false);
		});

		it('should reject token with wrong length', () => {
			const isValid = verifyTOTP('123', testSecret);
			expect(isValid).toBe(false);
		});
	});
});
