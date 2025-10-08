# Project Issues & Task Backlog

This document breaks down the THETUNISTIME project into smaller, actionable tasks based on the functional requirements. It serves as a backlog for the project's development.

---

## FR-0: Foundational Requirements

### Backend
- [ ] **Task B-FR0.1:** Set up Django project with initial configuration.
- [ ] **Task B-FR0.2:** Implement database schema based on the data model.
- [ ] **Task B-FR0.3:** Configure PostgreSQL database connection.
- [ ] **Task B-FR0.4:** Set up basic error tracking and logging.
- [ ] **Task B-FR0.5:** Create initial data migrations.

### Frontend
- [ ] **Task F-FR0.1:** Set up Next.js project with initial configuration.
- [ ] **Task F-FR0.2:** Implement bilingual (AR/FR) routing and locale detection.
- [ ] **Task F-FR0.3:** Create a persistent language switcher component.
- [ ] **Task F-FR0.4:** Set up basic analytics and performance monitoring.
- [ ] **Task F-FR0.5:** Establish a mobile-first responsive design foundation.
- [ ] **Task F-FR0.6:** Ensure all base components are WCAG AA compliant.

---

## FR-1: Public Site

### Backend (API Endpoints)
- [ ] **Task B-FR1.1:** Create API endpoint to get global navigation data.
- [ ] **Task B-FR1.2:** Create API endpoint for the homepage (featured articles, latest news, etc.).
- [ ] **Task B-FR1.3:** Create API endpoint for the article page.
- [ ] **Task B-FR1.4:** Create API endpoint for category pages with pagination.
- [ ] **Task B-FR1.5:** Create API endpoint for regional pages with filtering.
- [ ] **Task B-FR1.6:** Implement a search API endpoint.
- [ ] **Task B-FR1.7:** Create API endpoints for social sharing metadata.
- [ ] **Task B-FR1.8:** Create API endpoint for moderated comments.

### Frontend
- [ ] **Task F-FR1.1:** Implement the global header and footer.
- [ ] **Task F-FR1.2:** Build the homepage layout and components.
- [ ] **Task F-FR1.3:** Build the article page layout and components.
- [ ] **Task F-FR1.4:** Build the category page layout and components.
- [ ] **Task F-FR1.5:** Build the regional page layout and components.
- [ ] **Task F-FR1.6:** Implement the search functionality and results page.
- [ ] **Task F-FR1.7:** Implement social sharing buttons.
- [ ] **Task F-FR1.8:** Implement the comment submission form and display.
- [ ] **Task F-FR1.9:** Ensure all images are responsive and lazy-loaded.
- [ ] **Task F-FR1.10:** Implement basic PWA features (optional).

---

## FR-2: Back Office CMS

### Backend
- [ ] **Task B-FR2.1:** Implement user authentication and authorization (JWT or session-based).
- [ ] **Task B-FR2.2:** Implement `Role` and custom `User` models with permissions.
- [ ] **Task B-FR2.3:** Implement `Category` and `Region` models with CRUD APIs.
- [ ] **Task B-FR2.4:** Implement `Article` model with CRUD APIs and versioning.
- [ ] **Task B-FR2.5:** Implement `MediaAsset` model with upload and management APIs.
- [ ] **Task B-FR2.6:** Implement the editorial workflow state machine.
- [ ] **Task B-FR2.7:** Implement audit trail for all content changes.
- [ ] **Task B-FR2.8:** Implement comment moderation API endpoints.
- [ ] **Task B-FR2.9:** Implement SEO and publishing control APIs.
- [ ] **Task B-FR2.10:** Set up the Django Admin interface for all models.

### Frontend
- [ ] **Task F-FR2.1:** Create a bilingual (AR/FR) interface for the back office.
- [ ] **Task F-FR2.2:** Implement user login and session management.
- [ ] **Task F-FR2.3:** Build the user management interface (for Admins).
- [ ] **Task F-FR2.4:** Build the content management interface for articles.
- [ ] **Task F-FR2.5:** Build the category and region management interfaces.
- [ ] **Task F-FR2.6:** Build the media library interface.
- [ ] **Task F-FR2.7:** Implement the editorial workflow UI.
- [ ] **Task F-FR2.8:** Build the comment moderation queue.
- [ ] **Task F-FR2.9:** Implement the SEO and publishing controls UI.

---

## FR-3: AI Assistant Module

### Backend
- [ ] **Task B-FR3.1:** Implement the AI research interface API.
- [ ] **Task B-FR3.2:** Develop the deep web search and aggregation service.
- [ ] **Task B-FR3.3:** Implement the draft generation service using Gemini.
- [ ] **Task B-FR3.4:** Implement the citation and source verification system.
- [ ] **Task B-FR3.5:** Integrate the AI-generated content into the rich text editor.
- [ ] **Task B-FR3.6:** Implement rate limiting and governance for AI usage.

### Frontend
- [ ] **Task F-FR3.1:** Build the AI research interface in the back office.
- [ ] **Task F-FR3.2:** Display the research results and sources for verification.
- [ ] **Task F-FR3.3:** Allow users to generate and preview AI-drafted articles.
- [ ] **Task F-FR3.4:** Integrate the AI draft into the article editor.

---

## FR-4: API and Integration

- [ ] **Task I-FR4.1:** Define and document the complete API contract (e.g., using OpenAPI/Swagger).
- [ ] **Task I-FR4.2:** Implement robust error handling and validation for all API endpoints.
- [ ] **Task I-FR4.3:** Set up caching strategies (e.g., using Redis) for performance.
- [ ] **Task I-FR4.4:** Secure all sensitive API endpoints.

---

## FR-5: Performance and Reliability

- [ ] **Task P-FR5.1:** Optimize database queries and add necessary indexes.
- [ ] **Task P-FR5.2:** Implement image optimization and modern format delivery.
- [ ] **Task P-FR5.3:** Set up CDN for static assets and media.
- [ ] **Task P-FR5.4:** Conduct performance testing and profiling.

---

## FR-6: Security and Privacy

- [ ] **Task S-FR6.1:** Implement Role-Based Access Control (RBAC) throughout the backend.
- [ ] **Task S-FR6.2:** Add CSRF protection to all forms.
- [ ] **Task S-FR6.3:** Ensure all user input is properly validated and sanitized.
- [ ] **Task S-FR6.4:** Implement secure secrets management for API keys.
- [ ] **Task S-FR6.5:** Set up comprehensive audit logging for sensitive actions.

---

## FR-7: Internationalization and RTL

- [ ] **Task L-FR7.1:** Implement a robust solution for locale-aware routing and rendering.
- [ ] **Task L-FR7.2:** Create a design system with bidirectional (RTL/LTR) components.
- [ ] **Task L-FR7.3:** Manage content translations and workflows.
- [ ] **Task L-FR7.4:** Ensure correct hreflang and canonical tag implementation.

---

## FR-8: Accessibility

- [ ] **Task A-FR8.1:** Ensure the entire application is keyboard-navigable.
- [ ] **Task A-FR8.2:** Add appropriate ARIA roles and labels to all components.
- [ ] **Task A-FR8.3:** Verify color contrast and focus visibility.
- [ ] **Task A-FR8.4:** Conduct accessibility audits (e.g., using Lighthouse or axe).

---

## FR-9: Analytics and Observability

- [ ] **Task O-FR9.1:** Integrate a web analytics service (e.g., Google Analytics).
- [ ] **Task O-FR9.2:** Set up a centralized logging and error tracking system (e.g., Sentry).
- [ ] **Task O-FR9.3:** Collect and monitor performance metrics (Core Web Vitals).
- [ ] **Task O-FR9.4:** Track key editorial workflow metrics.