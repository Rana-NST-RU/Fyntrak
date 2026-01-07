# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

1. **Do not** open a public GitHub issue
2. **Email** security concerns to: [your-email@example.com]
3. **Include** the following information:
   - Type of issue (e.g. buffer overflow, SQL injection, etc.)
   - Full paths of source file(s) related to the manifestation of the issue
   - The location of the affected source code (tag/branch/commit or direct URL)
   - Any special configuration required to reproduce the issue
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the issue, including how an attacker might exploit it

## Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use strong database passwords
- Rotate API keys regularly

### Database Security
- Use parameterized queries (Prisma handles this)
- Implement proper access controls
- Regular database backups

### API Security
- Input validation on all endpoints
- Rate limiting for API calls
- CORS configuration
- Authentication and authorization

### Frontend Security
- Sanitize user inputs
- Secure API communication
- No sensitive data in client-side code

## Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity (1-30 days)

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported releases
4. Release patches as soon as possible

Thank you for helping keep Fyntrak secure!