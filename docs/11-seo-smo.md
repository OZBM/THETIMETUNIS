# SEO and SMO Strategy

This document defines the technical Search Engine Optimization (SEO) and Social Media Optimization (SMO) strategy for the THETUNISTIME platform.

## 1. International SEO

*   **Hreflang:** `hreflang` tags will be used to indicate the language and regional targeting of each page. Each page in one language will have a corresponding `link` tag pointing to its counterpart in the other language.
*   **Canonical URLs:** Each page will have a self-referencing canonical URL to prevent duplicate content issues. Cross-locale canonicals will be avoided.
*   **Locale-Aware Slugs:** Slugs will be localized. Arabic pages will use Unicode Arabic slugs, and French pages will use Latin slugs.

## 2. Structured Data (JSON-LD)

JSON-LD will be used to provide structured data to search engines.

*   **Article:** `NewsArticle` schema will be used for all articles, including properties like `headline`, `description`, `image`, `author`, `publisher`, `datePublished`, and `dateModified`.
*   **Breadcrumb:** `BreadcrumbList` schema will be used for category and article hierarchies.
*   **Organization:** `Organization` schema will be used to provide information about the organization.

## 3. Sitemaps

*   **Sitemap Index:** A sitemap index file will be located at `/sitemap.xml`, referencing the individual sitemaps for each language.
*   **Locale-Specific Sitemaps:** Separate sitemaps will be maintained for each language (e.g., `/sitemap-ar.xml`, `/sitemap-fr.xml`).
*   **News Sitemap:** A Google News sitemap will be generated to ensure timely indexing of new articles.

## 4. Pagination SEO

*   **`rel="next"`/`rel="prev"`:** These attributes will be used on paginated pages to indicate the relationship between them.
*   **Canonical:** The canonical URL for paginated pages will point to the specific page (e.g., `?page=2`).

## 5. Performance SEO

*   **Core Web Vitals:** Meeting the Core Web Vitals targets is a key part of our SEO strategy.
*   **Prefetch/Prerender:** These techniques will be used judiciously, based on profiling data, to improve perceived performance.

## 6. Open Graph and Social Cards

Open Graph and Twitter Card meta tags will be implemented to ensure rich sharing previews on social media platforms.

*   **Open Graph:** `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`, and `og:locale:alternate` will be used.
*   **Twitter Cards:** `summary_large_image` will be used.
