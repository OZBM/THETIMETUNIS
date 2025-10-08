# i18n and RTL Strategy

This document defines the internationalization (i18n) and right-to-left (RTL) standards for the THETUNISTIME platform.

## 1. Locale Routing and Detection

*   **Supported Locales:** `ar` (Arabic) and `fr` (French).
*   **URL Strategy:**
    *   Arabic: `/ar/...`
    *   French: `/fr/...`
*   **Default Landing:** The root path (`/`) will either display a language chooser or auto-redirect based on the user's saved preference. It will not rely on IP-based geolocation.
*   **Persistence:** The chosen locale will be stored in a cookie.

## 2. Directionality and Layout Mirroring

*   **HTML Direction:** The `dir` attribute will be set to `rtl` for Arabic pages and `ltr` for French pages.
*   **Visual Mirroring:** All layout elements, including navigation, sidebars, and icons, will be mirrored for RTL layouts.
*   **CSS Logical Properties:** CSS logical properties (e.g., `margin-inline-start`, `padding-inline-end`) will be used to avoid duplicating styles for LTR and RTL.

## 3. Typography, Fonts, and Numerals

*   **Fonts:** High-quality Arabic and Latin typefaces will be used. Variable fonts with subsets for each script are preferred.
*   **Numerals:** The editorial policy will determine the use of Arabic-Indic numerals in the Arabic UI.
*   **Line Length and Spacing:** Line length and spacing will be optimized for readability in both languages.

## 4. Content Model and Slugs

*   **Article Fields:** All content fields (e.g., `title`, `slug`, `summary`, `body`) will be localized for each language.
*   **Slugs:** Arabic pages will use Unicode Arabic slugs, and French pages will use Latin slugs.

## 5. Editorial Workflow and Translation Lifecycle

*   **States per Locale:** The editorial workflow will support separate states for each locale (e.g., `Draft`, `In Translation`, `In Review`).
*   **Bilingual Parity:** For key content, a service-level agreement (SLA) will be established for translation time.

## 6. SEO and Discoverability

*   **Hreflang:** `hreflang` tags will be used to link to the corresponding page in the other language.
*   **Canonicalization:** Canonical URLs will always point to the same-locale preferred URL.
*   **Structured Data:** JSON-LD will include the `inLanguage` property for each locale.
*   **Sitemaps:** Separate sitemaps will be maintained for each locale.

## 7. Accessibility in RTL Contexts

*   **Screen Readers:** The correct reading order and language switching will be verified.
*   **Focus Order:** The focus order will match the visual order in RTL layouts.
*   **Contrast and Type Size:** WCAG 2.2 AA contrast and type size requirements will be met.

## 8. Testing and QA

*   **Visual and Functional Tests:** The platform will be tested in both LTR and RTL modes.
*   **Bidi Edge Cases:** Mixed-language content will be tested to ensure proper rendering.
*   **SEO Checks:** `hreflang`, structured data, and sitemaps will be validated for both locales.
