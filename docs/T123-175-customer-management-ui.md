# T123-175: customer page headings

Comparison with develop: the customer list rendered a generic "Quản lý khách
hàng" title plus an eyebrow banner, while the detail page used only the customer
name as its main title. The requested list/profile titles were not explicit.

- List heading is now **Danh sách khách hàng**.
- Detail heading is **Hồ sơ khách hàng: <name>**, or **Hồ sơ khách hàng** while
  loading/when a name is absent. Customer names remain React text, not HTML.
- Remove the eyebrow banners. Use a compact, dark, wrapping page heading scoped
  to the customer screen and connect each section to its h1 via aria-labelledby.
- Search, filters, pagination, contact editing and booking history are unchanged.
  No customer data, API rules or database schema is changed.

## Validation

- Frontend production build and targeted CustomerManagement.jsx ESLint passed.
- The UC13 Edge script passed all 12 existing behavior scenarios and 6 additional
  heading/layout cases (list/detail at 375, 768 and 1440px). It checks visible dark
  headings, one h1 per page, removed banners and no page-level horizontal overflow.
- `UC13_BASE_URL=http://127.0.0.1:5188`
  `UC13_EVIDENCE_DIR=docs/T123-175-evidence`
  `node tests/uc13_browser_check.mjs` after starting Vite on 5188.
- Tests intercept API requests and use synthetic customers; writes happen only
  to in-memory fixtures. No live customer/account was edited.

Evidence: [results](T123-175-evidence/browser-checks.json),
[desktop list](T123-175-evidence/list-1440.png),
[desktop profile](T123-175-evidence/profile-1440.png),
[mobile list](T123-175-evidence/list-375.png),
[mobile profile](T123-175-evidence/profile-375.png).

Staging retest should verify both titles, named profiles, mobile wrapping and
search/edit/cancel/history behavior using an ADMIN account on the deployed build.
