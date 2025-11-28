# TOTP Node Examples

## Example 1: Complete 2FA Setup Flow

This workflow demonstrates a complete 2FA setup process:

1. **Generate Secret** - Create a new secret for a user
2. **Store Secret** - Save it to your database (encrypted)
3. **Generate QR Code** - Create QR code for user to scan
4. **Send to User** - Email or display the QR code

```
┌─────────────────┐     ┌──────────────┐     ┌───────────────┐
│ Generate Secret │────▶│ Set Variable │────▶│ Generate QR   │
└─────────────────┘     └──────────────┘     └───────────────┘
                                                      │
                        ┌──────────────┐              │
                        │ HTTP Request │◀─────────────┘
                        │ Send Email   │
                        └──────────────┘
```

## Example 2: Login Verification

Verify a user's TOTP token during login:

1. **Webhook** - Receive login request with token
2. **Database** - Fetch user's secret
3. **Verify Token** - Check if token is valid
4. **Conditional** - Branch based on validity

```
┌─────────┐     ┌──────────┐     ┌──────────────┐     ┌────────────┐
│ Webhook │────▶│ Database │────▶│ Verify Token │────▶│ IF (valid) │
└─────────┘     └──────────┘     └──────────────┘     └────────────┘
                                                              │
                                  ┌───────────────────────────┼───────────┐
                                  │                           │           │
                         ┌────────▼────────┐         ┌────────▼────────┐ │
                         │ Allow Login     │         │ Reject Login    │ │
                         │ Generate Session│         │ Return Error    │ │
                         └─────────────────┘         └─────────────────┘ │
```

## Example 3: Automated Testing

Generate tokens for API testing:

```javascript
// Set Node - Define test secret
{
  "secret": "JBSWY3DPEHPK3PXP"
}

// TOTP Node - Generate Token
Operation: Generate Token
Secret: {{ $json.secret }}

// HTTP Request Node - Test API
Method: POST
URL: https://api.example.com/verify
Body: {
  "token": "{{ $('TOTP').item.json.token }}"
}
```

## Example 4: Bulk Token Generation

Generate tokens for multiple users:

```
┌─────────────┐     ┌─────────────────┐     ┌────────────────┐
│ Database    │────▶│ Split In Batches│────▶│ Generate Token │
│ Get Users   │     │                 │     │ For Each User  │
└─────────────┘     └─────────────────┘     └────────────────┘
                                                      │
                                             ┌────────▼────────┐
                                             │ Send SMS/Email  │
                                             │ With Token      │
                                             └─────────────────┘
```

## Test Secret for Development

For testing purposes, you can use this secret:
```
Secret: NB2W45DFOIZA
```

This will generate tokens compatible with Google Authenticator and other TOTP apps.

## Configuration Examples

### High Security Configuration
```json
{
  "algorithm": "sha512",
  "digits": 8,
  "period": 30,
  "tolerance": 0
}
```

### Standard Configuration (Recommended)
```json
{
  "algorithm": "sha1",
  "digits": 6,
  "period": 30,
  "tolerance": 1
}
```

### Relaxed Configuration (for testing)
```json
{
  "algorithm": "sha1",
  "digits": 6,
  "period": 60,
  "tolerance": 2
}
```

## QR Code Usage

### Display in Web Application
The Data URL format can be directly used in HTML:
```html
<img src="{{ $json.qrCode }}" alt="Scan with authenticator app" />
```

### Send via Email
Include the QR code as an embedded image:
```json
{
  "to": "user@example.com",
  "subject": "Set up 2FA",
  "html": "<img src='{{ $json.qrCode }}' />"
}
```

### Save as File
Use the Convert to File node to save the QR code:
```
TOTP (Generate QR) → Convert to File → Write Binary File
```

## Security Best Practices

1. **Never expose secrets in logs or error messages**
2. **Store secrets encrypted in your database**
3. **Use HTTPS for all secret transmission**
4. **Implement rate limiting on verification endpoints**
5. **Provide backup recovery codes**
6. **Keep tolerance low (1-2) for security**
7. **Use environment variables for test secrets**

## Troubleshooting

### Token Not Matching
- Verify the secret is correct
- Check that time is synchronized on both systems
- Increase tolerance to 2 temporarily
- Ensure algorithm matches (default: SHA1)

### QR Code Not Scanning
- Increase QR code width (try 400px)
- Use higher error correction level (H)
- Ensure proper contrast on display
- Try SVG format instead of Data URL

### Invalid Base32 Secret
- Ensure secret only contains A-Z and 2-7
- No spaces or special characters
- Use Generate Secret operation for valid keys
