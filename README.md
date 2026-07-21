# ProDAP Frontend (Next.js)

Landing page built with Next.js 16 (App Router), Tailwind CSS v4, and
self-hosted variable fonts (Fraunces + IBM Plex Sans + IBM Plex Mono —
no external font requests at build or runtime).

## Local development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Design system

Tokens live in `src/app/globals.css`:

- `--paper` / `--ink` — background and primary text
- `--seal` / `--seal-dark` / `--seal-tint` — the "verification stamp" green,
  used for the accent, dark bands, and the rotating stamp badge in the hero
- `--flag` / `--flag-tint` — reserved for cost-outlier / risk-flag UI later
- `--line` — hairline dividers and the ledger "perforation" divider

Fonts are in `src/fonts/` and loaded via `next/font/local` in
`src/app/layout.tsx` — nothing is fetched from Google at build time, so this
builds identically offline, in CI, or on Vercel.

## Deploying (free)

1. Push this to a GitHub repo.
2. Go to https://vercel.com -> Add New Project -> import the repo.
3. Vercel auto-detects Next.js, no config needed. Deploy.
4. You'll get a free `*.vercel.app` URL immediately.

## Connecting to the Django API (prodap.onrender.com)

Add an environment variable in Vercel:

```
NEXT_PUBLIC_API_URL=https://prodap.onrender.com/export
```

Then fetch from it in a Server Component, e.g.:

```tsx
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data.json`, {
  next: { revalidate: 60 },
});
const data = await res.json();
```

Remember: Render's free tier sleeps after inactivity, so the first request
after idle time may take 20-50 seconds to respond.
