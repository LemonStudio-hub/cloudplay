# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   |  Active support  |
| < 1.0   |  No longer supported |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in CloudPlay, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to **security@cloudplay.lat**.

You should receive a response within 48 hours. If for some reason you do not, please follow up to ensure we received your original message.

### What to Include

Please include the following information in your report:

1. **Type of vulnerability** (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
2. **Full paths of source file(s)** related to the manifestation of the vulnerability
3. **The location of the affected source code** (tag/branch/commit or direct URL)
4. **Any special configuration** required to reproduce the issue
5. **Step-by-step instructions** to reproduce the issue
6. **Proof-of-concept or exploit code** (if possible)
7. **Impact** of the issue, including how an attacker might exploit it

### What to Expect

After you submit a report, we will:

1. **Acknowledge** your report within 48 hours
2. **Confirm** the vulnerability and determine its impact
3. **Notify** you when the vulnerability has been fixed
4. **Release** a security patch as soon as possible
5. **Credit** you in the security advisory (unless you prefer to remain anonymous)

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine the affected versions
2. Audit code to find any potential similar problems
3. Prepare fixes for all supported versions
4. Release new versions as soon as possible

## Security Best Practices

### For Users

1. **Keep Updated**: Always use the latest version of CloudPlay
2. **Verify Downloads**: Only download from official sources
3. **Report Issues**: Report any suspicious behavior immediately

### For Developers

1. **Code Review**: All code changes require review before merging
2. **Dependencies**: Regularly update dependencies to patch known vulnerabilities
3. **Secrets**: Never commit secrets, API keys, or credentials to the repository
4. **Input Validation**: Always validate and sanitize user input
5. **Authentication**: Use secure authentication mechanisms
6. **Encryption**: Use encryption for sensitive data in transit and at rest

## Security Measures

### Application Security

| Layer | Measure |
|-------|---------|
| **Source Code** | Rust compiled to binary, difficult to reverse engineer |
| **Communication** | All HTTPS (Cloudflare default) |
| **Token Storage** | OS-level secure storage (Keychain) |
| **Input Validation** | Room ID regex: `[a-zA-Z0-9_-]{3,20}` |
| **Rate Limiting** | 10 requests per minute per IP |

### Infrastructure Security

| Component | Security Measure |
|-----------|------------------|
| **Worker** | Minimal permissions API token |
| **KV** | Rate limiting and blacklist |
| **Tunnel** | Encrypted traffic via Cloudflare |
| **DNS** | DNSSEC enabled |

### Token Security

| Risk | Mitigation |
|------|------------|
| **Token Leakage** | 1-hour expiration, bound to specific subdomain |
| **Token Theft** | OS-level secure storage, not written to disk |
| **Brute Force** | Rate limiting + blacklist via KV |

## Known Security Considerations

1. **cloudflared Binary**: The application bundles `cloudflared` which is a third-party binary from Cloudflare. Users should verify the integrity of the binary.

2. **Network Traffic**: All traffic is encrypted via Cloudflare TLS, but the tunnel endpoints are accessible to anyone with the address.

3. **Token Lifetime**: Tokens have a 1-hour lifetime for security. Longer lifetimes would increase the risk window if a token is compromised.

## Security Updates

Security updates will be released as:

- **Patch versions** (e.g., 1.0.1) for critical security fixes
- **Minor versions** (e.g., 1.1.0) for security improvements
- **Security advisories** on GitHub for disclosed vulnerabilities

Subscribe to our [security announcements](https://github.com/cloudplay/cloudplay/security/advisories) to stay informed.

## Contact

- **Security Email**: security@cloudplay.lat
- **PGP Key**: [Download](https://cloudplay.lat/pgp-key.txt)
- **Bug Bounty**: Coming soon

## Acknowledgments

We would like to thank the following individuals for responsibly disclosing security issues:

*No security issues reported yet.*

---

Thank you for helping keep CloudPlay and its users safe! 
