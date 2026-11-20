# T123-195: Vercel deep-link 404

Develop has no Vercel SPA routing configuration. The ticket's concrete failure is
an HTTP 404 when directly opening or refreshing `/login`; the scope here is that
deep-link routing failure, not a load/performance benchmark.

`frontend/vercel.json` rewrites non-API paths to `/index.html`. This serves the
React entry without changing the browser URL, so login redirects, queries and
nested React Router paths remain intact. Existing built files have filesystem
precedence; `/api` and `/api/...` are excluded from the HTML fallback. No API
proxy, auth change, custom cache policy or backend endpoint is introduced.

The configuration follows Vercel's [Vite SPA guide](https://vercel.com/docs/frameworks/frontend/vite)
and [rewrite configuration reference](https://vercel.com/docs/project-configuration/vercel-json).

## Deployment placement

The current workflow syncs `source/frontend/` to `Thfnh/Deploy`'s `frontend/`, so
the configuration travels with the app rather than an unsynced repository-root
file. The Vercel project's Root Directory must be `frontend`; the build output is
Vite's `dist`. Keep the existing production VITE_API_URL pointing at the backend.
Do not enable cleanUrls with an index.html rewrite destination.

This branch does not change Vercel account/project settings or publish a deploy.
The external fork's Vercel configuration/settings could not be confirmed through
the available GitHub file reads. After merge/sync, verify the project root and
redeploy before accepting the live fix.

## Validation

- Frontend production build passed.
- `node tests/vercel_spa_routes_check.mjs`: 17 checks passed against a local HTTP
  simulation using the actual built files and configured regex. Covers direct
  login/register/OTP/deep links and query strings, unchanged HTML entry bytes,
  actual JS/CSS/image bytes and content types, API exclusion and workflow sync.
- This is a local routing simulation, **not** proof of Vercel cloud execution.
- The check runs after the frontend build in CI to prevent configuration drift.
- [Recorded local results](T123-195-evidence/checks.json).

## Retest after deploy

Open `/login` in a new browser tab and refresh (F5), then repeat for `/register`,
`/forgot-password` and a nested route. Expect the app instead of Vercel's 404.
Verify JS/CSS/images load, a `redirect` query stays in the URL, and login still
contacts the real configured backend. Protected routes still require auth.
Do not mark the performance suite passed solely from these routing checks.
