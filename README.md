# n8n-nodes-cortex-totp

This is an n8n community node that provides comprehensive TOTP (Time-based One-Time Password) functionality for your workflows. It enables you to generate, verify, and manage TOTP tokens for two-factor authentication (2FA) implementations.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Manual Installation

1. Navigate to your n8n installation directory
2. Install the package:
   ```bash
   cd ~/.n8n/custom  # or your custom nodes directory
   npm install n8n-nodes-cortex-totp
   ```
3. Restart n8n

## Operations

This node supports the following operations:

### 1. Generate Token
Generate a time-based one-time password (TOTP) token from a secret key.

**Parameters:**
- **Secret** (required): Base32 encoded secret key
- **Algorithm** (optional): Hashing algorithm (SHA1, SHA256, SHA512) - default: SHA1
- **Digits** (optional): Number of digits in the token (typically 6 or 8) - default: 6
- **Period** (optional): Time step in seconds - default: 30

**Output:**
```json
{
  "token": "123456",
  "secret": "NB2W45DFOIZA",
  "algorithm": "sha1",
  "digits": 6,
  "period": 30,
  "expiresIn": 30
}
```

### 2. Verify Token
Verify a TOTP token against a secret key.

**Parameters:**
- **Secret** (required): Base32 encoded secret key
- **Token** (required): The TOTP token to verify
- **Tolerance** (optional): Number of time steps to check before and after current time - default: 1
- **Algorithm** (optional): Hashing algorithm (SHA1, SHA256, SHA512) - default: SHA1
- **Digits** (optional): Number of digits in the token - default: 6
- **Period** (optional): Time step in seconds - default: 30

**Output:**
```json
{
  "valid": true,
  "token": "123456",
  "secret": "NB2W45DFOIZA",
  "algorithm": "sha1",
  "digits": 6,
  "period": 30,
  "tolerance": 1
}
```

### 3. Generate Secret
Generate a new random Base32-encoded secret key for TOTP.

**Parameters:**
- **Secret Length** (optional): Length of the secret to generate - default: 32

**Output:**
```json
{
  "secret": "NB2W45DFOIZANBCDEFGHIJKLMNOP",
  "length": 29
}
```

### 4. Generate QR Code
Generate a QR code for easy TOTP setup in authenticator apps like Google Authenticator, Authy, or Microsoft Authenticator.

**Parameters:**
- **Secret** (required): Base32 encoded secret key
- **Label** (required): Account identifier (typically email or username)
- **Issuer** (required): Service name (your application name)
- **Format** (optional): QR code format (Data URL or SVG) - default: Data URL
- **Error Correction Level** (optional): QR code error correction (Low, Medium, Quartile, High) - default: Medium
- **Width** (optional): QR code width in pixels - default: 300
- **Algorithm** (optional): Hashing algorithm - default: SHA1
- **Digits** (optional): Number of digits - default: 6
- **Period** (optional): Time step in seconds - default: 30

**Output:**
```json
{
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSU...",
  "uri": "otpauth://totp/user@example.com?secret=NB2W45DFOIZA&issuer=MyApp",
  "secret": "NB2W45DFOIZA",
  "label": "user@example.com",
  "issuer": "MyApp",
  "format": "dataURL",
  "algorithm": "sha1",
  "digits": 6,
  "period": 30
}
```

## Credentials

This node does not require any credentials as it operates on cryptographic algorithms locally.

## Compatibility

- Minimum n8n version: 1.0.0
- Tested with n8n version: 1.68.0+

## Usage

### Example 1: User Registration with 2FA Setup

```
1. Generate Secret node → outputs new secret
2. Generate QR Code node → create QR for user to scan
3. HTTP Request node → send QR code to user via email/web
4. Store secret in database for user
```

### Example 2: Login Verification

```
1. HTTP Request node → receive user's TOTP token
2. Database node → retrieve user's secret
3. Verify Token node → validate the token
4. IF node → check if valid
   - True: Allow login
   - False: Reject login
```

### Example 3: Generate Token for Testing

```
1. Set node → provide test secret
2. Generate Token node → create current TOTP
3. Use token for API testing or automation
```

## Security Considerations

1. **Secret Storage**: Always store TOTP secrets encrypted in your database
2. **Secret Transmission**: Use HTTPS when transmitting secrets or QR codes
3. **Token Validation**: Implement rate limiting on token verification to prevent brute force attacks
4. **Tolerance Setting**: Keep tolerance at 1 or 2 to balance security and usability
5. **Recovery Codes**: Implement backup recovery codes for users who lose access to their authenticator

## How TOTP Works

TOTP generates a time-based one-time password using:
- A shared secret key (Base32 encoded)
- Current Unix timestamp divided by time period (default 30 seconds)
- HMAC-SHA algorithm to create a hash
- Dynamic truncation to produce a numeric code

The algorithm is standardized in [RFC 6238](https://tools.ietf.org/html/rfc6238).

## Development

### Building the Node

```bash
npm install
npm run build
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Testing Locally

```bash
# Link the package
npm run build
npm link

# In your n8n installation
cd ~/.n8n/custom
npm link n8n-nodes-cortex-totp

# Start n8n
n8n start
```

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [RFC 6238 - TOTP Specification](https://tools.ietf.org/html/rfc6238)
* [TOTP Implementation Guide](https://www.kishorenewton.com/posts/implementing_totp_in_nodejs_for_enhanced_security/)

## License

[MIT](LICENSE.md)

## Version History

### 0.1.0
- Initial release
- Generate TOTP tokens
- Verify TOTP tokens
- Generate random secrets
- Generate QR codes for authenticator apps
- Support for SHA1, SHA256, and SHA512 algorithms
- Configurable digits and time periods
