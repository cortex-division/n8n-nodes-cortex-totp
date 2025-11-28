import { base32ToHex } from '../base32.utils';
import { ApplicationError } from 'n8n-workflow';

describe('Base32 Utils', () => {
	describe('base32ToHex', () => {
		it('should convert valid base32 to hex', () => {
			// Test known conversions
			expect(base32ToHex('JBSWY3DPEHPK3PXP')).toBe('48656c6c6f21deadbeef');
			expect(base32ToHex('MFRGG')).toBe('616263');
		});

		it('should handle uppercase input', () => {
			const result = base32ToHex('ABCDEFGH');
			expect(result).toBeTruthy();
			expect(typeof result).toBe('string');
		});

		it('should handle lowercase input by converting to uppercase', () => {
			const upper = base32ToHex('MFRGG');
			const lower = base32ToHex('mfrgg');
			expect(lower).toBe(upper);
		});

		it('should throw error for invalid base32 characters', () => {
			expect(() => base32ToHex('INVALID!')).toThrow(ApplicationError);
			expect(() => base32ToHex('ABC===')).toThrow(ApplicationError);
			expect(() => base32ToHex('TEST123@')).toThrow(ApplicationError);
		});

		it('should handle base32 strings of different lengths', () => {
			expect(base32ToHex('A')).toBeTruthy();
			expect(base32ToHex('AB')).toBeTruthy();
			expect(base32ToHex('ABCDEFGHIJKLMNOP')).toBeTruthy();
		});

		it('should produce consistent results', () => {
			const input = 'JBSWY3DPEHPK3PXP';
			const result1 = base32ToHex(input);
			const result2 = base32ToHex(input);
			expect(result1).toBe(result2);
		});
	});
});
