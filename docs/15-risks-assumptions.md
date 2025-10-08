# Risks, Assumptions, and Mitigations

This document catalogs the major risks, assumptions, and mitigation strategies for the THETUNISTIME platform.

## 1. Objectives

*   Identify and track high-impact risks throughout the project lifecycle.
*   Establish early warning indicators and mitigation playbooks.
*   Make assumptions explicit and revalidate them regularly.

## 2. Key Assumptions

*   The target audience is primarily mobile users on Fast 3G / Slow 4G networks in Tunisia.
*   Bilingual parity is a key requirement for critical content.
*   The AI assistant is a tool to assist journalists, not to replace them.
*   The chosen technology stack (Next.js, Django, PostgreSQL, Redis) can meet the project's requirements.

## 3. Risk Matrix (Summary)

A summary of the key risk categories:

*   **Technical Risks:** AI data quality, prompt injection, SSRF, schema evolution, cache stampedes, performance.
*   **Operational Risks:** Bilingual parity delays, editorial overruns, usability gaps, inadequate training.
*   **Security & Privacy Risks:** Secrets leakage, misconfigured CSP, upload malware, RBAC gaps, audit trail gaps.
*   **Compliance & Legal Risks:** Copyright issues, improper citation, personal data handling, vendor DPAs.
*   **Vendor & Supply Chain Risks:** LLM API rate limits, cost spikes, SLA breaches, dependency vulnerabilities.
*   **Financial & Timeline Risks:** Underestimated effort, scope creep, infrastructure cost overruns.

## 4. Technical Risks

*   **AI Data Quality & Hallucinations:**
    *   **Risk:** Generated drafts include inaccuracies or unsourced claims.
    *   **Mitigation:** Mandatory sources panel, synthesis checks, editor gate, automated similarity checks.
*   **Prompt Injection & Unsafe Outputs:**
    *   **Risk:** Malicious source text influences generation to leak data or perform unsafe actions.
    *   **Mitigation:** Strict input/output schemas, sanitizers, sandboxed fetching, allowlist domains.
*   **SSRF via Deep Search:**
    *   **Risk:** Workers fetch internal/metadata URLs.
    *   **Mitigation:** Outbound allowlist, block RFC1918 ranges, DNS pinning.

## 5. Operational Risks

*   **Bilingual Parity Delays:**
    *   **Risk:** Arabic/French content parity is not met for critical coverage.
    *   **Mitigation:** Translation task auto-creation, SLA tracking, escalation.
*   **Editorial Overruns & Workflow Friction:**
    *   **Risk:** Delayed reviews/publishing, unclear states.
    *   **Mitigation:** Clear lifecycle states, dashboards, notifications, capacity planning.

## 6. Security & Privacy Risks

*   **Secrets Leakage:**
    *   **Risk:** Secrets in code or logs.
    *   **Mitigation:** Secret manager, scanning, masked logs, rotation policy.
*   **CSP Misconfiguration:**
    *   **Risk:** XSS through relaxed policies.
    *   **Mitigation:** Nonces, strict allowlists, periodic audits.

## 7. Compliance & Legal Risks

*   **Copyright & Source Attribution:**
    *   **Risk:** Republishing without rights, inadequate attribution.
    *   **Mitigation:** Clear attribution policy, canonical handling, legal review.
*   **Vendor Data Protection Agreements:**
    *   **Risk:** Inadequate DPAs with AI providers.
    *   **Mitigation:** Contracts ensuring no training on prompts/responses, encryption, data control.

## 8. Vendor & Supply Chain Risks

*   **LLM API Rate Limits & Cost Spikes:**
    *   **Risk:** Throughput constraints, unexpected bills.
    *   **Mitigation:** Quotas, queues, backoff, budgets, request aggregation, caching.
*   **Dependency Vulnerabilities:**
    *   **Risk:** Exploitable libraries.
    *   **Mitigation:** SCA scans, lockfiles, automated updates, blocking critical vulnerabilities.

## 9. Financial & Timeline Risks

*   **Effort Underestimation & Scope Creep:**
    *   **Risk:** Deadlines missed, quality dips.
    *   **Mitigation:** Agile sprints, clear Definition of Done, change control process.
