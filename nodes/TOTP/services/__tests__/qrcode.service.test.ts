import { buildTOTPUri, generateQRCode } from '../qrcode.service';

describe('QRCode Service', () => {
	describe('buildTOTPUri', () => {
		const secret = 'JBSWY3DPEHPK3PXP';
		const label = 'user@example.com';
		const issuer = 'MyApp';

		it('should build a valid TOTP URI with default parameters', () => {
			const uri = buildTOTPUri(secret, label, issuer);
			
			expect(uri).toContain('otpauth://totp/');
			expect(uri).toContain(`secret=${secret}`);
			expect(uri).toContain('issuer=MyApp');
			expect(uri).toContain('user%40example.com');
		});

		it('should encode label and issuer properly', () => {
			const specialLabel = 'user+test@example.com';
			const specialIssuer = 'My App & Co';
			const uri = buildTOTPUri(secret, specialLabel, specialIssuer);
			
			expect(uri).toContain('user%2Btest%40example.com');
			expect(uri).toContain('issuer=My%20App%20%26%20Co');
		});

		it('should include algorithm when not sha1', () => {
			const uri = buildTOTPUri(secret, label, issuer, { algorithm: 'sha256' });
			expect(uri).toContain('algorithm=SHA256');
		});

		it('should not include algorithm for sha1 (default)', () => {
			const uri = buildTOTPUri(secret, label, issuer, { algorithm: 'sha1' });
			expect(uri).not.toContain('algorithm=');
		});

		it('should include digits when not 6', () => {
			const uri = buildTOTPUri(secret, label, issuer, { digits: 8 });
			expect(uri).toContain('digits=8');
		});

		it('should not include digits for 6 (default)', () => {
			const uri = buildTOTPUri(secret, label, issuer, { digits: 6 });
			expect(uri).not.toContain('digits=');
		});

		it('should include period when not 30', () => {
			const uri = buildTOTPUri(secret, label, issuer, { period: 60 });
			expect(uri).toContain('period=60');
		});

		it('should not include period for 30 (default)', () => {
			const uri = buildTOTPUri(secret, label, issuer, { period: 30 });
			expect(uri).not.toContain('period=');
		});

		it('should handle all custom options together', () => {
			const uri = buildTOTPUri(secret, label, issuer, {
				algorithm: 'sha512',
				digits: 8,
				period: 60,
			});
			
			expect(uri).toContain('algorithm=SHA512');
			expect(uri).toContain('digits=8');
			expect(uri).toContain('period=60');
		});

		it('should maintain correct URI format', () => {
			const uri = buildTOTPUri(secret, label, issuer);
			const uriRegex = /^otpauth:\/\/totp\/.+\?secret=.+&issuer=.+$/;
			expect(uri).toMatch(uriRegex);
		});
	});

	describe('generateQRCode', () => {
		const testUri = 'otpauth://totp/user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=MyApp';

		it('should generate a QR code as data URL by default', async () => {
			const qrCode = await generateQRCode(testUri);
			expect(qrCode).toMatch(/^data:image\/png;base64,/);
		});

		it('should generate a QR code as SVG when format is svg', async () => {
			const qrCode = await generateQRCode(testUri, { format: 'svg' });
			expect(qrCode).toContain('<svg');
			expect(qrCode).toContain('</svg>');
		});

		it('should respect custom width', async () => {
			const qrCode = await generateQRCode(testUri, { width: 500 });
			expect(qrCode).toBeTruthy();
			expect(typeof qrCode).toBe('string');
		});

		it('should respect error correction level', async () => {
			const qrCodeL = await generateQRCode(testUri, { errorCorrectionLevel: 'L' });
			const qrCodeH = await generateQRCode(testUri, { errorCorrectionLevel: 'H' });
			
			expect(qrCodeL).toBeTruthy();
			expect(qrCodeH).toBeTruthy();
			// Different error correction levels should produce different results
			expect(qrCodeL).not.toBe(qrCodeH);
		});

		it('should handle all error correction levels', async () => {
			const levels: Array<'L' | 'M' | 'Q' | 'H'> = ['L', 'M', 'Q', 'H'];
			
			for (const level of levels) {
				const qrCode = await generateQRCode(testUri, { errorCorrectionLevel: level });
				expect(qrCode).toBeTruthy();
			}
		});

		it('should generate consistent output for same inputs', async () => {
			const qrCode1 = await generateQRCode(testUri);
			const qrCode2 = await generateQRCode(testUri);
			expect(qrCode1).toBe(qrCode2);
		});

		it('should generate different outputs for different URIs', async () => {
			const uri1 = 'otpauth://totp/user1@example.com?secret=SECRET1&issuer=App1';
			const uri2 = 'otpauth://totp/user2@example.com?secret=SECRET2&issuer=App2';
			
			const qrCode1 = await generateQRCode(uri1);
			const qrCode2 = await generateQRCode(uri2);
			
			expect(qrCode1).not.toBe(qrCode2);
		});

		it('should handle complex URIs with all parameters', async () => {
			const complexUri = 'otpauth://totp/user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=MyApp&algorithm=SHA256&digits=8&period=60';
			const qrCode = await generateQRCode(complexUri);
			expect(qrCode).toBeTruthy();
		});

		it('should generate valid SVG with custom options', async () => {
			const qrCode = await generateQRCode(testUri, {
				format: 'svg',
				width: 400,
				errorCorrectionLevel: 'H',
			});
			
			expect(qrCode).toContain('<svg');
			expect(qrCode).toContain('</svg>');
		});
	});
});
