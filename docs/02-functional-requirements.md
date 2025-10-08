# Functional Requirements

Detailed specification of features for the bilingual, mobile-first public site and the AI-powered back office. This document drives acceptance criteria and implementation scope for the THETUNISTIME platform.

Stack baseline
- Frontend Next.js App Router
- Backend Django
- Database PostgreSQL
- AI Google Gemini 2.5 Pro

---

## FR-0 Foundational Requirements

- Bilingual experience
  - Full AR Arabic RTL and FR French LTR support
  - Language switcher persistent across sessions
  - Locale aware routing and URL slugs
- Mobile first
  - Primary target devices are mid-range smartphones on 3G and 4G
  - Progressive enhancement and reduced payloads by default
- Accessibility
  - WCAG AA baseline with RTL specifics
- Observability
  - Basic analytics, error tracking, and performance metrics collection

---

## FR-1 Public Site

### FR-1.1 Global Navigation and Layout

- Header
  - Logo with link to homepage in current locale
  - Language switcher AR FR
  - Primary nav links: Politics, Economy, Sports, Culture, Regions, More
  - Search button input toggled on mobile
- Footer
  - About, Contact, Editorial Policy, Privacy Policy links
  - Social links: Facebook, Instagram, WhatsApp sharing
- Layout
  - RTL mirrored components and typography in AR
  - LTR standard layout in FR
  - Sticky header on mobile optional based on performance budget

### FR-1.2 Homepage

- Featured articles
  - Carousel or grid hero with AR and FR titles and excerpts
  - Configurable featured flag and weight
- Latest news feed
  - Reverse chronological list with pagination or infinite scroll
  - Lazy loaded images with responsive sizes
- Regional news section أخبار الجهات
  - Grid of governorates with counts and latest headlines per governorate
  - Quick navigation to regional pages
- Category sections
  - Politics, Economy, Sports, Culture curated lists
  - See all links to category pages
- Language switch persistence
  - Switcher preserves current path and maps to alternate hreflang path when available

### FR-1.3 Article Page

- Content display
  - Title, subtitle, author, publish date, reading time
  - Body formatted for Arabic and Latin scripts
  - Images with captions and credits
- Social sharing
  - WhatsApp, Facebook, Instagram, Copy Link
- Related articles
  - Based on category, tags, and region
- Comments
  - Basic moderated comments with name and text
  - Anti-spam measures (honeypot, rate limiting)
- SEO fields
  - SEO title, meta description, canonical URL
  - JSON-LD Article schema
- Hreflang
  - If counterpart exists in other language, link via hreflang and cross reference

### FR-1.4 Category Pages

- Listing by category
  - Paginated summaries with image, title, excerpt, publish date
- Filters
  - Date ranges, tags (optional), region (optional)
- SEO
  - Category description and canonical tags
- Breadcrumbs
  - Home → Category → Page n

### FR-1.5 Regional Pages

- Governorate page
  - Header with Arabic and French names and metadata
  - Article listing filtered to region
  - Map (optional lightweight static) or badge
- Filters and sorting
  - Latest, Most read (optional), Editor’s picks

### FR-1.6 Search

- Search input
  - Full text search across titles and excerpts per locale
- Results page
  - Paginated matching articles with highlight
- Performance
  - Debounced client input; server side index based search

### FR-1.7 Media Handling

- Responsive images
  - srcset sizes and modern formats (WebP/AVIF)
- Captions and credits
  - Per locale captions and alt text
- Lazy loading
  - Below the fold images defer

### FR-1.8 Performance Features

- Caching
  - CDN caching for static assets and SSR pages
- Budget based loading
  - Defer non-critical scripts and components
- PWA (optional)
  - Basic offline shell and add to home banner if feasible

---

## FR-2 Back Office CMS

### FR-2.1 Bilingual Interface

- Locale toggle AR FR in UI
- Right-to-left layout for Arabic
- All labels and messages localized

### FR-2.2 User Management and Roles

- Roles
  - Administrator, Editor, Journalist
- Permissions
  - Administrator
    - Manage users and roles
    - Global settings
    - Publish authority
    - Delete content
  - Editor
    - Review and approve drafts
    - Edit content
    - Schedule publishing
    - Moderate comments
  - Journalist
    - Create and edit own drafts
    - Initiate AI research and generation
    - Submit for review

### FR-2.3 Content Management

- Articles
  - CRUD with bilingual fields
  - Region tagging per governorate
  - Category selection
  - SEO fields and slug rules
  - Versioning with diffs and rollback
  - Scheduling publish date and embargo
- Categories
  - CRUD with parent category and weight
- Regions
  - CRUD with Arabic/French names and slugs
- Media Library
  - Upload images and videos
  - Alt text and captions per locale
  - License and credits
  - Focal point optional

### FR-2.4 Editorial Workflow

- States
  - Draft → In Review → Approved → Published → Archived
- Transitions
  - Journalist moves Draft → In Review
  - Editor moves In Review → Approved/Changes Requested
  - Administrator moves Approved → Published
- Notifications
  - Email or in-app notifications for state changes
- Audit trail
  - Record who moved which state and when

### FR-2.5 Comments Moderation

- Queue
  - Pending comments require approval or spam flagging
- Actions
  - Approve, Reject, Delete
- Policies
  - Rate limit and profanity filter

### FR-2.6 SEO and Publishing Controls

- Slug editor and validation
- Canonical URL and hreflang linking
- Sitemaps generation on publish
- Structured data fields mapping

---

## FR-3 AI Assistant Module

### FR-3.1 Research Interface

- Input fields
  - Query text
  - Language selection AR FR EN
  - Scope selection: News, Official reports, Press releases, Academic (optional)
- Action
  - Run Deep Search
- Output
  - Research summary
  - Source list with URLs, titles, and brief notes

### FR-3.2 Deep Web Search

- Behavior
  - Aggregate sources beyond standard search engine results
  - Respect robots and ethical scraping
- Deduplication
  - Normalize and deduplicate URLs
- Filtering
  - Prioritize authoritative sources
- Caching
  - Store source metadata and summaries for reuse

### FR-3.3 Draft Generation

- Action
  - Generate Article from research artifacts
- Output structure
  - Suggested headline
  - Intro paragraph summarizing key points
  - Body paragraphs grouped by subtopics
  - Concluding paragraph
- Constraints
  - No plagiarism; synthesis only
  - Tone and style adjustable via presets (Neutral, Analytical, Explainer)
- Localization
  - Generate in Arabic or French as selected
  - Proper RTL formatting for Arabic

### FR-3.4 Citation and Verification

- Sources panel
  - List of URLs used with summaries
  - Indicators of confidence or recency
- Traceability
  - Store source artifacts linked to the article record
- Reviewer notes
  - Editors can mark claims for verification and add comments

### FR-3.5 Rich Text Editor Integration

- Auto populate draft
- Editing capabilities
  - Headings, lists, quotes, images, embeds
- SEO metadata
  - Title, meta description, slug helper
- Versioning
  - Track edits and diffs for AI generated drafts

### FR-3.6 Governance and Limits

- Rate limits
  - Per user and per workspace quotas to control API costs
- Abuse prevention
  - Disallow publishing of AI-only content without human edits
- Prompt templates
  - Admin configurable templates for different beats and styles

---

## FR-4 API and Integration

### FR-4.1 Next.js ↔ Django

- Authentication
  - JWT or session based auth for back office
- Endpoints
  - Articles CRUD, list, detail, search
  - Categories CRUD, list
  - Regions CRUD, list
  - Media upload and list
  - Workflow transitions
  - AI research and generation requests
- Pagination and sorting
  - Limit, offset, sort by supported
- Caching and ETags
  - ETag headers and cache control where appropriate

### FR-4.2 AI Provider

- Gemini integration
  - Research pipeline orchestrates deep search + summarization prompts
  - Generation prompt produces structured draft with source embedding
- Error handling
  - Clear user feedback on failures and retries

---

## FR-5 Performance and Reliability

- Core Web Vitals targets
  - LCP under 2.5s on Fast 3G
  - CLS under 0.1
  - TTI under 4s article page
- Image optimization
  - Responsive sizes and modern formats
- Resilience
  - Graceful degradation on low bandwidth
  - Retries and fallbacks for AI operations

---

## FR-6 Security and Privacy

- RBAC enforcement for back office operations
- Secure session management
- CSRF protection on forms
- Input validation and sanitation
- Secrets management
  - AI keys and Notion token not exposed client side
- Audit logging of sensitive actions

---

## FR-7 Internationalization and RTL

- Locale routing and middleware
- Bidirectional UI components
- Content translation workflow
- Hreflang and canonical management
- Typography and numerals handling for Arabic

---

## FR-8 Accessibility

- Keyboard navigable interface
- Screen reader labels and roles
- Contrast compliant palettes
- Focus management in modals and editors
- RTL specific accessibility fixes

---

## FR-9 Analytics and Observability

- Page view and engagement analytics
- Error tracking and logging
- Performance metrics collection
- Editorial workflow metrics (throughput, lead times)

---

## Acceptance Criteria Highlights

- Language switcher maintains context and updates hreflang correctly
- Article pages render correctly in AR RTL and FR LTR with social sharing
- AI Assistant produces structured drafts with citations; editors can verify sources
- Workflow transitions enforce permissions and audit logging
- Performance budgets met on mid-range mobile devices

---

## Cross References

- See Project Overview for scope and goals
- See System Architecture for service topology
- See Data Model and ERD for entities and relations
- See API Contracts for endpoints and payloads
- See Performance Strategy for budgets and tactics
- See SEO Strategy for hreflang and structured data
- See Accessibility Guidelines for WCAG AA baseline
