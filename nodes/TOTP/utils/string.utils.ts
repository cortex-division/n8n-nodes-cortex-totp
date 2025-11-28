/**
 * Pads a string to the left with a specified character
 */
export function leftPad(str: string, len: number, ch: string): string {
	len = len - str.length + 1;
	return len > 0 ? Array(len).join(ch) + str : str;
}
