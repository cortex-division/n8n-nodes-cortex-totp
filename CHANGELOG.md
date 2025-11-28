# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-11-29

### Added
- Initial release of n8n-nodes-cortex-totp
- **Generate Token** operation: Create TOTP tokens from a secret key
- **Verify Token** operation: Validate TOTP tokens against a secret
- **Generate Secret** operation: Create random Base32-encoded secrets
- **Generate QR Code** operation: Generate QR codes for authenticator app setup
- Support for multiple hashing algorithms (SHA1, SHA256, SHA512)
- Configurable token digits (default 6)
- Configurable time period (default 30 seconds)
- Tolerance window for token verification to handle clock drift
- QR code generation in multiple formats (Data URL and SVG)
- Comprehensive error handling and validation
- Full TypeScript implementation following n8n best practices

### Security
- Base32 secret key encoding/decoding
- HMAC-based token generation following RFC 6238
- Secure random secret generation
- Proper error handling for invalid inputs
