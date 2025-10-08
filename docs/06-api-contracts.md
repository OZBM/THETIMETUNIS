# API Contracts

Contracts for Next.js ↔ Django REST integration, including authentication, pagination, caching, rate limits, and resource schemas for articles, categories, regions, media, comments, workflow transitions, users/roles, and AI research/generation.

Cross references
- Project Overview [docs/01-project-overview.md](docs/01-project-overview.md)
- Functional Requirements [docs/02-functional-requirements.md](docs/02-functional-requirements.md)
- NFR [docs/03-non-functional-requirements.md](docs/03-non-functional-requirements.md)
- System Architecture [docs/04-system-architecture.md](docs/04-system-architecture.md)
- Data Model and ERD [docs/05-data-model-erd.md](docs/05-data-model-erd.md)

---

## 1. Conventions

Base URL
- Public API base
  - /api/v1
- Back office API base
  - /admin/api/v1

Versioning
- Prefix all endpoints with /v1
- Backward compatible changes prefer additive fields

Authentication
- Back office endpoints require Bearer token (JWT or session token exchanged for a short lived JWT)
  - Header
    - Authorization: Bearer <token>

Locale
- locale query param for bilingual endpoints, values ar or fr
- Server rejects unsupported locales via 400

Pagination
- Query params
  - limit default 20, max 100
  - offset default 0
- Response envelope includes next and prev links when applicable

Caching
- ETag and Last-Modified on GET endpoints
- Cache-Control for public read endpoints as per NFR

Common Error Format
- Status code
- JSON body
  - code machine readable string
  - message human readable text
  - details optional structured validation errors

Example error body
```json
{
  "code": "validation_error",
  "message": "One or more fields are invalid.",
  "details": {
    "title": ["This field is required."]
  }
}
```

Rate Limits
- Headers on authenticated endpoints
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset

Idempotency
- POST endpoints that trigger jobs accept Idempotency-Key header to deduplicate retries

---

## 2. Articles

### 2.1 List Articles

GET /api/v1/articles

Query params
- locale required ar or fr
- category optional slug
- region optional slug
- tag optional slug
- q optional search term
- status optional for back office only
- limit, offset pagination

Response 200
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "string",
      "subtitle": "string",
      "slug": "string",
      "locale": "ar",
      "rtl": true,
      "excerpt": "string",
      "heroImage": {
        "url": "https://cdn.example/images/hero.avif",
        "alt": "string"
      },
      "category": {
        "id": "uuid",
        "slug": "politics",
        "name": "سياسة"
      },
      "regions": [
        { "id": "uuid", "slug": "tunis", "name_ar": "تونس", "name_fr": "Tunis" }
      ],
      "tags": ["budget", "economy"],
      "publish_date": "2025-10-01T09:30:00Z",
      "reading_time_min": 6
    }
  ],
  "total": 254,
  "limit": 20,
  "offset": 0,
  "next": "/api/v1/articles?locale=ar&limit=20&offset=20",
  "prev": null
}
```

Caching
- Cache-Control: public, max-age=60
- ETag present

### 2.2 Get Article by Slug

GET /api/v1/articles/:slug

Query params
- locale required ar or fr

Response 200
```json
{
  "id": "uuid",
  "title": "string",
  "subtitle": "string",
  "slug": "string",
  "locale": "fr",
  "rtl": false,
  "author": { "id": "uuid", "name": "string" },
  "editor": { "id": "uuid", "name": "string" },
  "body": "<p>rich html or structured blocks</p>",
  "heroImage": { "url": "string", "alt": "string", "credit": "string" },
  "category": { "id": "uuid", "slug": "economy", "name": "Économie" },
  "regions": [{ "id": "uuid", "slug": "tozeur", "name_fr": "Tozeur", "name_ar": "توزر" }],
  "tags": ["solar", "projects"],
  "seo": {
    "seo_title": "string",
    "meta_description": "string",
    "canonical_url": "https://example.com/fr/economie/slug"
  },
  "hreflang_peer": { "slug": "slug-ar", "locale": "ar" },
  "publish_date": "2025-10-01T09:30:00Z",
  "reading_time_min": 5,
  "sources": [
    { "url": "https://ministry.tn/report", "title": "Official report", "notes": "Budget section" }
  ]
}
```

### 2.3 Create Article (Back Office)

POST /admin/api/v1/articles

Auth
- Bearer token, role Journalist, Editor, Admin

Body
```json
{
  "title": "string",
  "subtitle": "string",
  "locale": "ar",
  "slug": "string",
  "body": "<p>...</p>",
  "category_id": "uuid",
  "region_ids": ["uuid", "uuid"],
  "tag_slugs": ["budget", "economy"],
  "hero_media_id": "uuid",
  "seo": {
    "seo_title": "string",
    "meta_description": "string",
    "canonical_url": "string"
  },
  "publish_date": "2025-10-02T08:00:00Z"
}
```

Response 201
```json
{ "id": "uuid" }
```

Validation errors
- 400 with details

### 2.4 Update Article

PATCH /admin/api/v1/articles/:id

Body
- Any mutable field; slug changes restricted by policy

Response 200
```json
{ "updated": true }
```

### 2.5 Publish Article

POST /admin/api/v1/articles/:id/publish

Auth
- Editor or Administrator

Body
```json
{
  "publish_date": "2025-10-02T08:00:00Z"
}
```

Response 200
```json
{ "status": "published", "publish_date": "2025-10-02T08:00:00Z" }
```

---

## 3. Categories

### 3.1 List Categories

GET /api/v1/categories

Query params
- locale optional, returns names per requested locale when provided

Response 200
```json
{
  "items": [
    { "id": "uuid", "slug": "politics", "name_fr": "Politique", "name_ar": "سياسة" }
  ],
  "total": 6
}
```

### 3.2 Create Category (Back Office)

POST /admin/api/v1/categories

Body
```json
{
  "name_fr": "Économie",
  "name_ar": "اقتصاد",
  "slug": "economy",
  "parent_id": null,
  "color": "blue",
  "weight": 10
}
```

Response 201
```json
{ "id": "uuid" }
```

---

## 4. Regions

### 4.1 List Regions

GET /api/v1/regions

Query
- type optional governorate municipality

Response 200
```json
{
  "items": [
    { "id": "uuid", "slug": "tunis", "name_fr": "Tunis", "name_ar": "تونس", "region_type": "governorate" }
  ],
  "total": 24
}
```

### 4.2 Create Region (Back Office)

POST /admin/api/v1/regions

Body
```json
{
  "name_fr": "Tozeur",
  "name_ar": "توزر",
  "slug": "tozeur",
  "governorate_code": "TZR",
  "region_type": "governorate",
  "color": "amber"
}
```

Response 201
```json
{ "id": "uuid" }
```

---

## 5. Media

### 5.1 Upload Media

POST /admin/api/v1/media

Content type
- multipart/form-data
  - file required
  - type image video audio
  - alt_text_fr optional
  - alt_text_ar optional
  - caption_fr optional
  - caption_ar optional
  - credit optional
  - license optional defaults internal

Response 201
```json
{
  "id": "uuid",
  "url": "https://cdn.example/media/uuid.avif"
}
```

### 5.2 List Media

GET /admin/api/v1/media

Query
- type optional
- q optional search by asset_name

Response 200
```json
{ "items": [ { "id": "uuid", "asset_name": "Hero", "type": "image", "url": "https://cdn/media.avif" } ] }
```

---

## 6. Comments

### 6.1 Create Comment

POST /api/v1/articles/:slug/comments

Query
- locale ar or fr

Body
```json
{ "name": "string", "text": "string" }
```

Response 201
```json
{ "id": "uuid", "status": "pending" }
```

Anti spam
- Honeypot hidden field ignored on server
- Rate limit headers

### 6.2 Moderate Comments (Back Office)

POST /admin/api/v1/comments/:id/moderate

Body
```json
{ "action": "approve" }
```

Actions
- approve reject delete

Response 200
```json
{ "status": "approved" }
```

---

## 7. Workflow Transitions

### 7.1 Transition Article State

POST /admin/api/v1/articles/:id/workflow

Body
```json
{
  "to_status": "in_review",
  "reason": "Ready for editor review"
}
```

Response 200
```json
{
  "article_id": "uuid",
  "from_status": "draft",
  "to_status": "in_review",
  "actor_id": "uuid",
  "created_at": "2025-10-01T10:00:00Z"
}
```

---

## 8. Users and Roles

### 8.1 List Users

GET /admin/api/v1/users

Query
- role optional filter

Response 200
```json
{
  "items": [
    { "id": "uuid", "name": "string", "email": "string", "role": "journalist", "locale_preference": "fr" }
  ],
  "total": 18
}
```

### 8.2 Create User

POST /admin/api/v1/users

Body
```json
{
  "name": "string",
  "email": "user@example.com",
  "role": "editor",
  "locale_preference": "ar"
}
```

Response 201
```json
{ "id": "uuid" }
```

---

## 9. AI Research and Generation

### 9.1 Submit Research Request

POST /admin/api/v1/ai/research

Headers
- Idempotency-Key recommended

Body
```json
{
  "query": "impact of new solar energy projects in Tozeur",
  "language": "fr",
  "scope": ["news", "official", "academic"]
}
```

Response 202
```json
{ "job_id": "uuid", "status": "queued" }
```

### 9.2 Get Research Status

GET /admin/api/v1/ai/research/:job_id

Response 200
```json
{
  "job_id": "uuid",
  "status": "completed",
  "summary": "string rich text",
  "sources": [
    { "url": "https://...", "title": "string", "notes": "string", "confidence": 0.82, "recency_days": 12 }
  ],
  "artifact_id": "uuid"
}
```

### 9.3 Generate Article Draft

POST /admin/api/v1/ai/generate

Body
```json
{
  "artifact_id": "uuid",
  "style": "analytical",
  "language": "ar"
}
```

Response 200
```json
{
  "headline": "string",
  "intro": "string",
  "body_sections": [
    { "heading": "string", "paragraphs": ["...", "..."] }
  ],
  "conclusion": "string",
  "sources": [
    { "url": "https://...", "title": "string" }
  ],
  "draft_id": "uuid"
}
```

Constraints
- Draft cannot be published without editor edits and review flags cleared

---

## 10. Authentication

### 10.1 Login

POST /admin/api/v1/auth/login

Body
```json
{ "email": "user@example.com", "password": "string" }
```

Response 200
```json
{ "access_token": "jwt", "refresh_token": "jwt", "expires_in": 3600 }
```

### 10.2 Refresh

POST /admin/api/v1/auth/refresh

Body
```json
{ "refresh_token": "jwt" }
```

Response 200
```json
{ "access_token": "jwt", "expires_in": 3600 }
```

### 10.3 Logout

POST /admin/api/v1/auth/logout

Body
```json
{ "refresh_token": "jwt" }
```

Response 200
```json
{ "revoked": true }
```

Security
- Rate limit login attempts
- MFA optional for administrators and editors

---

## 11. SEO and Sitemaps

### 11.1 Locale Sitemaps

GET /api/v1/sitemaps/ar.xml

GET /api/v1/sitemaps/fr.xml

Response 200
- XML sitemap with published articles per locale

### 11.2 Hreflang Pairs

GET /api/v1/articles/:slug/hreflang

Query
- locale required

Response 200
```json
{
  "current": { "locale": "ar", "slug": "slug-ar" },
  "peer": { "locale": "fr", "slug": "slug-fr" }
}
```

---

## 12. Headers and Caching

ETag
- GET endpoints return ETag; clients may send If-None-Match to receive 304

Last-Modified
- GET endpoints return Last-Modified; clients may send If-Modified-Since to receive 304

Cache-Control
- Public pages
  - public, max-age=60
- Admin endpoints
  - no-store

---

## 13. Validation Rules (selected)

Article
- title required length 1–160
- slug unique per locale, lower case hyphenated
- locale required ar or fr
- seo.meta_description length ≤ 160
- publish_date required when status published

Comment
- name required
- text required length ≤ 1000
- rate limited per IP

AI
- query required
- language one of ar fr en
- scope includes at least one value

---

## 14. Response Codes Summary

- 200 OK
- 201 Created
- 202 Accepted
- 204 No Content
- 304 Not Modified
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict
- 412 Precondition Failed (ETag mismatch)
- 429 Too Many Requests
- 500 Internal Server Error
- 503 Service Unavailable

---

## 15. Webhooks (Optional Future)

Event types
- article.published
- article.updated
- comment.moderated

Payload example
```json
{
  "event": "article.published",
  "article_id": "uuid",
  "slug": "string",
  "locale": "fr",
  "publish_date": "2025-10-02T08:00:00Z"
}
```

---

## 16. OpenAPI Coverage

An OpenAPI 3 document can be generated from DRF serializers and viewsets. Scope covers
- Articles
- Categories
- Regions
- Media
- Comments
- Workflow
- Users
- Auth
- AI

Location proposal
- Backend repository api/openapi.yaml
- Linked from documentation [docs/06-api-contracts.md](docs/06-api-contracts.md)

---

## 17. Acceptance Criteria

- Endpoints support bilingual locale param and return correct fields
- Pagination and caching headers implemented on list endpoints
- Admin endpoints require auth and enforce role based permissions
- AI endpoints queue jobs and return traceable artifacts with sources
- Error format consistent across endpoints with code message details
- Rate limits and idempotency keys enforced where specified

---

## 18. Next Steps

- Implement DRF viewsets and serializers according to schemas
- Add ETag and Last-Modified middleware
- Configure rate limiting
- Generate OpenAPI 3 document and publish