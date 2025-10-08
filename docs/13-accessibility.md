# Accessibility Guidelines

This document defines the accessibility standards and implementation guidance for the THETUNISTIME platform, targeting WCAG 2.2 AA compliance.

## 1. Scope and Targets

*   **Standard:** WCAG 2.2 AA
*   **Assistive Technologies:** Screen readers (NVDA, JAWS, VoiceOver), magnifiers, keyboard-only, switch devices.
*   **Browsers:** Recent versions of Chrome, Safari, Firefox, and Edge.

## 2. Global Principles

*   **Semantics and Structure:** Use semantic HTML5 elements (`<main>`, `<nav>`, `<aside>`, etc.) and a logical heading structure.
*   **Language and Direction:** Set the `lang` and `dir` attributes on the `<html>` element for each page.
*   **Skip Links:** Provide a "skip to main content" link.
*   **Focus Management:** Ensure a visible focus indicator and a logical tab order.
*   **Color and Contrast:** Meet WCAG 2.2 AA contrast ratios for text and non-text elements.
*   **Motion:** Respect the `prefers-reduced-motion` media query.

## 3. RTL-Specific Guidance

*   **Mirroring:** Mirror layouts, navigation, and icons for RTL languages.
*   **Typography:** Use Arabic fonts with clear diacritics and legible sizes.
*   **Mixed Content:** Ensure proper handling of bidirectional text.

## 4. Keyboard Interaction Patterns

*   **General:** All interactive elements must be keyboard-accessible.
*   **Menus, Tabs, Dialogs, Accordions, Carousels:** Implement standard keyboard interaction patterns for these components.

## 5. Forms and Validation

*   **Labels and Help Text:** All form inputs will have programmatic labels.
*   **Error Handling:** Errors will be announced via `aria-live` regions.
*   **Required Fields:** Required fields will be marked visually and programmatically.

## 6. Media, Images, and Documents

*   **Images:** Provide descriptive alt text for informative images and empty alt text for decorative images.
*   **Video/Audio:** Provide captions for video and transcripts for audio.

## 7. Dynamic Content and Live Regions

*   **Loading States:** Use skeleton UI with `aria-busy` to indicate loading content.
*   **Notifications:** Use `role="status"` or `role="alert"` for notifications.

## 8. Rich Text Editor (Back Office) Accessibility

*   **Toolbar:** The editor's toolbar will be keyboard-accessible and have labeled controls.
*   **Direction and Alignment:** The editor will support per-paragraph direction and alignment.

## 9. Tables and Data Visualization

*   **Tables:** Use `<th>` with `scope` or `headers`/`id` for data tables.
*   **Charts:** Provide data tables or textual summaries for charts.

## 10. Content Guidelines for Editors

*   **Headings:** Use a logical heading structure.
*   **Link Text:** Use descriptive link text.
*   **Images:** Provide descriptive alt text.

## 11. Testing and QA

*   **Automated Testing:** Use tools like Axe and pa11y in the CI/CD pipeline.
*   **Manual Testing:** Conduct manual screen reader testing for critical user flows.

## 12. Governance and Metrics

*   **Ownership:** An accessibility owner will be designated.
*   **KPIs:** Accessibility metrics will be tracked.
