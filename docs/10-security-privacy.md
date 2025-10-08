# Security & Privacy

This document establishes the security posture, privacy principles, and concrete controls for the THETUNISTIME platform. It aligns with OWASP ASVS, OWASP Top 10, and privacy-by-design principles.

## 1. Security Standards

*   **OWASP ASVS and Top 10:** The platform will align with the security controls and best practices outlined in the OWASP Application Security Verification Standard (ASVS) and the OWASP Top 10.
*   **HTTPS-Only:** All communication will be over HTTPS. HSTS (HTTP Strict Transport Security) will be enabled with a preload directive after initial validation.
*   **Secure Headers:** Secure headers will be implemented via Next.js middleware and Django's `SecurityMiddleware`:
    *   `X-Content-Type-Options: nosniff`
    *   `X-Frame-Options: DENY`
    *   `Referrer-Policy: strict-origin-when-cross-origin`
    *   `Permissions-Policy`: A strict policy will be enforced, disabling unnecessary features like camera, microphone, and geolocation by default.

## 2. Authentication & Authorization

*   **Back Office:**
    *   Authentication will be handled by Django, with a preference for OIDC/OAuth2 SSO (e.g., Google, Microsoft) for centralized MFA and user lifecycle management. A fallback to secure username/password with MFA will be available.
    *   Role-Based Access Control (RBAC) will be implemented for the following roles: Administrator, Editor, and Journalist.
*   **Readers:** Readers will be anonymous. User accounts for commenting are out of scope for the initial phase.

## 3. Input Validation and Sanitization

*   **Server-Side Validation:** All user input will be validated on the server-side.
*   **HTML Sanitization:** All rich text and comment content will be sanitized to prevent XSS attacks.
*   **Cross-Site Scripting (XSS):** A strict Content Security Policy (CSP) will be implemented to prevent XSS.
*   **Cross-Site Request Forgery (CSRF):** Django's built-in CSRF protection will be used for all forms.

## 4. API Security

*   **Versioning:** All API endpoints will be versioned (e.g., `/api/v1/...`).
*   **ETags and Caching:** `ETag` and `Cache-Control` headers will be used to control caching behavior.
*   **Signed URLs:** Signed URLs will be used for restricted access to media assets.

## 5. Secrets Management

*   **Storage:** All secrets (e.g., API keys, database credentials) will be stored in a secure vault or as environment variables on the server. No secrets will be stored in the source code or exposed on the client-side.
*   **Rotation:** A key rotation policy will be implemented.

## 6. Audit and Logging

*   **Immutable Logs:** Immutable audit logs will be maintained for all workflow transitions, content publications, and deletions.
*   **Admin Actions:** The IP address and user agent will be captured for all administrative actions.

## 7. Dependency Management

*   **Automated Scanning:** Automated Software Composition Analysis (SCA) will be used to scan for vulnerabilities in dependencies.
*   **Dependency Updates:** A process for regular and timely dependency updates will be established.
