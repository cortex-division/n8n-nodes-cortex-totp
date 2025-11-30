export interface TOTPOptions {
	algorithm?: string;
	digits?: number;
	period?: number;
}

export interface QRCodeOptions extends TOTPOptions {
	format?: 'dataURL' | 'svg';
	errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
	width?: number;
}

export interface GenerateTokenResult {
	token: string;
	secret: string;
	algorithm: string;
	digits: number;
	period: number;
	expiresIn: number;
}

export interface VerifyTokenResult {
	valid: boolean;
	token: string;
	secret: string;
	algorithm: string;
	digits: number;
	period: number;
	tolerance: number;
}

export interface GenerateSecretResult {
	secret: string;
	length: number;
}

export interface GenerateQRResult {
	qrCode: string;
	uri: string;
	secret: string;
	label: string;
	issuer: string;
	format: string;
	algorithm: string;
	digits: number;
	period: number;
}

export interface GenerateBackupCodesResult {
	codes: string[];
	hashes?: string[];
	count: number;
	length: number;
	format: string;
	hashAlgorithm: string;
}
