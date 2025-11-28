import { leftPad } from '../string.utils';

describe('String Utils', () => {
	describe('leftPad', () => {
		it('should pad a string to the left with zeros', () => {
			expect(leftPad('5', 3, '0')).toBe('005');
			expect(leftPad('42', 4, '0')).toBe('0042');
		});

		it('should not pad if string is already long enough', () => {
			expect(leftPad('12345', 3, '0')).toBe('12345');
			expect(leftPad('test', 4, '0')).toBe('test');
		});

		it('should pad with custom characters', () => {
			expect(leftPad('test', 6, 'x')).toBe('xxtest');
			expect(leftPad('a', 5, ' ')).toBe('    a');
		});

		it('should handle empty strings', () => {
			expect(leftPad('', 5, '0')).toBe('00000');
		});

		it('should handle single character padding', () => {
			expect(leftPad('1', 10, '0')).toBe('0000000001');
		});
	});
});
