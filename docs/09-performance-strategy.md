# Performance Strategy

This document defines the performance targets, budgets, and strategies for the THETUNISTIME platform. The primary goal is to deliver a fast, responsive user experience on mobile devices under realistic network conditions in Tunisia.

## 1. Performance Objectives and Targets

Our performance strategy is centered around Google's Core Web Vitals (CWV), measured at the 75th percentile of users (p75) on mobile devices.

### Core Web Vitals (Mobile, p75)

*   **Largest Contentful Paint (LCP):** ≤ 2.5 seconds
    *   Applies to the homepage, category pages, and article pages.
*   **Interaction to Next Paint (INP):** ≤ 200 milliseconds
    *   Applies to all interactive UI elements.
*   **Cumulative Layout Shift (CLS):** ≤ 0.1
    *   Applies to all pages.

### Other Key Performance Indicators (KPIs)

*   **Time to Interactive (TTI):** ≤ 4 seconds on article pages for mid-range Android devices.
*   **Total Blocking Time (TBT):** ≤ 200 milliseconds for Server-Side Rendered (SSR) pages.
*   **Time to First Byte (TTFB):** ≤ 200 milliseconds on cached pages.
*   **First Contentful Paint (FCP):** ≤ 1.8 seconds.

### Network and Device Assumptions

*   **Network:** Optimized for "Fast 3G" and "Slow 4G" network conditions.
*   **Device:** Baseline device class is a mid-range Android phone with 2-4 GB of RAM.

## 2. Rendering Strategy

We will employ a hybrid rendering strategy using Next.js to optimize for both performance and fresh content.

*   **Incremental Static Regeneration (ISR):** Used for the homepage, category pages, and regional pages. These pages will have short revalidation windows (e.g., 60-300 seconds) to ensure content remains up-to-date.
*   **Server-Side Rendering (SSR):** Used for article pages on their first publish to ensure immediate availability. These pages will then switch to ISR after a period of stability. SSR will also be used for dynamic pages that require authentication or fresh data.
*   **Streaming SSR:** We will use streaming SSR for critical templates to reduce TTFB and improve perceived performance.
*   **Code Splitting:** We will use route-level code splitting and dynamic imports for non-critical components and widgets to reduce the initial JavaScript payload.

## 3. Caching Architecture

A multi-tiered caching strategy will be implemented to minimize latency.

*   **Edge/CDN Cache:** Caching of static assets (images, fonts, CSS, JS) and public pages (for ISR).
*   **HTTP Caching:** Use of `ETag` and `Last-Modified` headers for API read endpoints.
*   **Application Cache (Redis):** Caching of frequently accessed API responses (e.g., category lists, regions) and AI artifact summaries.
*   **Image CDN:** On-the-fly image resizing and format negotiation (AVIF/WebP).

## 4. Asset Budgets and Constraints

Strict asset budgets will be enforced to maintain a lean footprint.

*   **JavaScript:**
    *   Homepage: ≤ 180KB (compressed)
    *   Article Page: ≤ 140KB (compressed)
*   **CSS:** ≤ 60KB (compressed), with critical CSS (≤ 20KB) inlined.
*   **Images:** ≤ 120KB (compressed, cumulative) for above-the-fold content.
*   **Fonts:** Preload at most one variable font family with limited axes. System fonts are preferred.

## 5. Performance Testing

A combination of automated and manual testing will be used to ensure performance targets are met.

*   **Lighthouse CI:** Integrated into the CI/CD pipeline to run performance checks on every pull request.
*   **Synthetic Testing:** Daily tests on "Fast 3G" profiles for key user journeys.
*   **Real User Monitoring (RUM):** To track Core Web Vitals in production and identify real-world performance bottlenecks.
