# Project Plan and Roadmap

This document defines the phases, milestones, sprints, and roles and responsibilities for the THETUNISTIME platform.

## 1. Goals and Scope

*   Deliver a mobile-first, SEO-optimized, bilingual news website (Arabic RTL, French LTR).
*   Provide a robust back office with AI-assisted research and draft generation.
*   Ensure security, accessibility, and observability across all environments.

## 2. High-Level Timeline (Indicative)

*   **Phase 0 (Inception & Architecture):** 2 weeks
*   **Phase 1 (Platform Foundation):** 6 weeks
*   **Phase 2 (AI Assistant & Back Office Enhancements):** 6 weeks
*   **Phase 3 (Public Site Features, Performance & SEO):** 6 weeks
*   **Phase 4 (Hardening & Launch):** 2 weeks
*   **Total:** ~22 weeks

## 3. Phased Roadmap with Milestones and Deliverables

### Phase 0: Inception & Architecture (2 weeks)

*   **Milestones:** Finalize architecture, approve tech stack, establish repositories and CI/CD pipeline.
*   **Deliverables:** Architecture document, IaC baseline, CI pipeline bootstrap.

### Phase 1: Platform Foundation (6 weeks)

*   **Milestones:** Data model and migrations, RBAC, authentication, content CRUD, media pipeline.
*   **Deliverables:** Django API, Next.js skeleton, PostgreSQL schema, Redis caching.

### Phase 2: AI Assistant & Back Office Enhancements (6 weeks)

*   **Milestones:** AI deep search pipeline, draft generation, editorial workflow.
*   **Deliverables:** AI worker service, back office AI panel, workflow state machine.

### Phase 3: Public Site Features, Performance & SEO (6 weeks)

*   **Milestones:** Homepage, category, regional, and article pages; SEO and performance hardening.
*   **Deliverables:** Feature-complete public site, hreflang pairs, canonical URLs, JSON-LD, sitemaps.

### Phase 4: Hardening & Launch (2 weeks)

*   **Milestones:** Security audit, pen test remediation, load/performance tests.
*   **Deliverables:** Security baseline verified, DR plans, release playbooks.

## 4. Sprint Plan (2-week Sprints)

*   **Sprint Cadence:** 2-week sprints with demos at the end of each sprint.
*   **Definition of Ready (DoR):** User stories must have acceptance criteria, design references, and data model impacts defined.
*   **Definition of Done (DoD):** Code must be reviewed, tested, and documented. Performance and security checks must pass.

## 5. RACI (Roles and Responsibilities)

*   **Sponsor:** Accountable for budget and scope approvals.
*   **Product Manager:** Accountable for the roadmap and priorities.
*   **Solution Architect:** Responsible for the architecture and non-functional requirements.
*   **Frontend Lead:** Responsible for the Next.js application, Core Web Vitals, accessibility, and SEO implementation.
*   **Backend Lead:** Responsible for the Django API, data model, and migrations.
*   **Platform/DevOps Lead:** Responsible for CI/CD, IaC, and observability.
*   **SEO Lead:** Responsible for hreflang, structured data, and sitemaps.
*   **Editorial Leads (Arabic, French):** Responsible for the editorial workflow, content parity, and style guides.
*   **Security Lead:** Accountable for the security baseline and penetration testing remediation.
*   **QA Lead:** Responsible for the test strategy, automation, and manual testing.
