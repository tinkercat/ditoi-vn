# DÍ TỚI — Architecture & Deployment Documentation

> **Status:** Pre-implementation review — v3 incorporating ACL feedback. Please verify before proceeding to code.

---

## Table of Contents

1. [Tech Stack Overview](#1-tech-stack-overview)
2. [Netlify Free Tier — What's Included](#2-netlify-free-tier--whats-included)
3. [Supabase Free Tier — What's Included](#3-supabase-free-tier--whats-included)
4. [CDN Coverage](#4-cdn-coverage)
5. [Architecture Overview](#5-architecture-overview)
6. [Project Folder Structure](#6-project-folder-structure)
7. [Frontend — React + Vite](#7-frontend--react--vite)
8. [Backend — Netlify Functions](#8-backend--netlify-functions)
9. [Database Schema — Supabase](#9-database-schema--supabase)
10. [File & Media Storage](#10-file--media-storage)
11. [Authentication & Access Control — Admin Portal](#11-authentication--access-control--admin-portal)
12. [AI Feature — Gemini Proxy](#12-ai-feature--gemini-proxy)
13. [Environment Variables](#13-environment-variables)
14. [Deployment Guide](#14-deployment-guide)
15. [Custom Domain Setup](#15-custom-domain-setup)
16. [Limitations & Caveats](#16-limitations--caveats)

---

## 1. Tech Stack Overview

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 + Vite | Lightweight, fast builds, free to host as static site |
| Routing | React Router v6 | Single app, two UIs (`/` customer, `/admin` portal) |
| Styling | Plain CSS (ported from mockup) | No extra deps, exact control over the existing animations |
| Backend API | Netlify Functions (serverless) | Bundled with Netlify hosting, no separate server needed |
| Database | Supabase (PostgreSQL) | Free tier, simple API, built-in auth + file storage |
| File Storage | Supabase Storage | For uploaded background images, logos, brand fonts |
| Authentication | Supabase Auth | Email/password login for admin, JWT-based |
| AI Proxy | Netlify Function → Google Gemini API | Keeps the API key server-side, not exposed to browser |

---

## 2. Netlify Free Tier — What's Included

| Feature | Free Tier Limit | Impact |
|---|---|---|
| Bandwidth | 100 GB / month | Plenty for a restaurant Link-in-Bio page |
| Build minutes | 300 min / month | More than enough for infrequent deploys |
| Serverless Functions | 125,000 requests / month | Covers admin saves, AI calls, config fetches |
| Function runtime | 100 hours / month | No issue at this traffic level |
| Sites | Unlimited | |
| Custom domain + HTTPS | Free (auto SSL via Let's Encrypt) | |
| Concurrent builds | 1 | Fine for a solo project |
| Form submissions | 100 / month | Not used here |
| Team members | 1 | Solo use only |

**No credit card required for the free tier.**

---

## 3. Supabase Free Tier — What's Included

| Feature | Free Tier Limit | Impact |
|---|---|---|
| Database storage | 500 MB | More than enough for config key-value data |
| File storage | 1 GB | Enough for logo, background image, font files |
| Auth users | 50,000 MAU | Only 1 admin user needed |
| API requests | Unlimited reads | Customer page reads config on load |
| Bandwidth | 5 GB / month | Fine for this use |
| Projects | 2 active | One is enough |
| **Project pausing** | **Pauses after 1 week of inactivity** | **See Caveats section** |

**Important:** Supabase free projects auto-pause after 7 days without activity. You can prevent this by either upgrading to Pro ($25/month) or by setting up a simple cron ping (free via cron-job.org). This is documented in the Caveats section.

---

## 4. CDN Coverage

**No separate CDN service is needed.** Two CDNs are already included in the free stack:

| What | CDN Provider | Notes |
|---|---|---|
| React app (HTML, JS, CSS) | Netlify Edge Network | Globally distributed, automatic. All static files are served from the edge node closest to the visitor. |
| Uploaded media files (logo, background image, fonts) | Supabase Storage CDN (backed by Cloudflare) | Public bucket files are cached at the CDN layer. The URL you save in the DB is already a CDN URL. |

You do not need Cloudflare, AWS CloudFront, or any other CDN. Both Netlify and Supabase handle this transparently.

---

## 5. Architecture Overview

```
Browser (Customer)
     │
     │  GET / (React SPA, static)
     ▼
┌─────────────────────────────────────┐
│     NETLIFY EDGE CDN (global)       │
│  Serves static React build files    │
│  (index.html, JS, CSS, assets)      │
└──────────────┬──────────────────────┘
               │  Calls /api/* (Netlify Functions)
               ▼
┌─────────────────────────────────────┐
│        NETLIFY FUNCTIONS            │
│  (Serverless Node.js on AWS Lambda) │
│                                     │
│  GET  /api/config     → fetch data  │
│  POST /api/config     → save data   │
│  POST /api/upload-url → signed URL  │
│  POST /api/ai         → Gemini call │
└──────────────┬──────────────────────┘
               │  Reads / Writes
               ▼
┌─────────────────────────────────────┐
│            SUPABASE                 │
│  PostgreSQL DB  │  File Storage     │
│  (site_config)  │  (media bucket)   │
│                 │                   │
│  Supabase Auth (admin login)        │
└─────────────────────────────────────┘
               │  API key
               ▼
┌─────────────────────────────────────┐
│       GOOGLE GEMINI API             │
│  (called from Function, not browser)│
└─────────────────────────────────────┘

Browser (Admin)
     │
     │  GET /admin (same React SPA)
     ▼
     Same Netlify CDN → /admin route
     (protected by Supabase login check in React)
```

---

## 6. Project Folder Structure

```
ditoi/
├── netlify/
│   └── functions/
│       ├── get-config.js        # Public: fetch all site content
│       ├── update-config.js     # Admin-only: update site content
│       ├── get-upload-url.js    # Admin-only: signed URL for file uploads
│       └── gemini-ai.js         # Public: proxy to Gemini API
│
├── src/
│   ├── main.jsx                 # React entry point (React Router setup)
│   ├── supabaseClient.js        # Shared Supabase client config
│   │
│   ├── customer/
│   │   ├── CustomerPage.jsx     # Main customer-facing page
│   │   └── components/
│   │       ├── HeroSection.jsx
│   │       ├── LinksSection.jsx
│   │       ├── PromoBadges.jsx
│   │       └── AiSection.jsx
│   │
│   └── admin/
│       ├── AdminApp.jsx         # Admin portal wrapper (auth guard)
│       ├── LoginPage.jsx        # Supabase email/password login form
│       └── components/
│           ├── LinksEditor.jsx
│           ├── PromoEditor.jsx
│           ├── MediaUploader.jsx
│           └── SaveButton.jsx
│
├── public/
│   └── favicon.ico
│
├── index.html                   # Vite entry HTML
├── vite.config.js
├── netlify.toml                 # Netlify build + redirect config
├── package.json
└── .env.local                   # Local dev secrets (not committed)
```

---

## 7. Frontend — React + Vite

### Two UIs, One App

React Router handles both views in a single build:

- `/` → **Customer Page** — public, no login required, reads config from `/api/config`
- `/admin` → **Admin Portal** — login-gated, all writes go through `/api/*` functions

### Customer Page Sections (ported from mockup)

| Section | Content Source |
|---|---|
| Hero background | `background_image_url` from DB (or uploaded image in Supabase Storage) |
| Logo with glow | `logo_url` from DB |
| Slogan text | `slogan` from DB |
| Promo badges | `promo_badge_1`, `promo_badge_2` from DB |
| Google Maps button | `maps_link` from DB |
| Menu button | `menu_link` from DB |
| Click-to-call button | `hotline` from DB |
| AI section | Calls `/api/ai` serverless function |

### Admin Portal

- Login page with email/password (Supabase Auth)
- After login: form fields pre-filled with current live data
- File upload widgets for background image, logo, brand font
- Single "Save & Publish" button — writes to Supabase → customer page updates live

### Key Packages

```json
{
  "react": "^18",
  "react-dom": "^18",
  "react-router-dom": "^6",
  "@supabase/supabase-js": "^2",
  "vite": "^5"
}
```

No UI component library is added — styles are ported directly from the mockup CSS to keep it lightweight and preserve the exact look.

---

## 8. Backend — Netlify Functions

Netlify Functions are Node.js files placed in `netlify/functions/`. They are deployed automatically as serverless endpoints at `/.netlify/functions/<name>`, and we configure a redirect so they are accessible at `/api/<name>` instead.

### Endpoint split — public vs. admin

This is the core of the ACL model. Config data is served from **two separate endpoints** with different auth requirements. The admin portal exclusively uses the protected endpoints. Even if a React route guard is bypassed, admin components call `/api/admin/config` which requires a verified session — so without a real login, every request returns 401 and the components have nothing to render.

| Endpoint | Auth | Used by |
|---|---|---|
| `GET /api/public/config` | None | Customer page |
| `GET /api/admin/config` | Required | Admin portal (pre-fill forms) |
| `POST /api/admin/config` | Required | Admin portal (save changes) |
| `POST /api/admin/upload-url` | Required | Admin media uploaders |
| `POST /api/ai` | None | Customer page AI section |

---

### `GET /api/public/config`

- **Auth required:** No
- **What it does:** Returns only the fields the customer page needs (links, hotline, slogan, promo badges, image URLs)
- **Used by:** Customer page on load

### `GET /api/admin/config`

- **Auth required:** Yes — session verified server-side before returning anything
- **What it does:** Returns all config fields to pre-fill the admin editor form
- **Used by:** Admin portal immediately after login
- **If token is invalid or missing:** Returns 401. The admin form stays empty. Nothing is rendered.

### `POST /api/admin/config`

- **Auth required:** Yes
- **What it does:** Verifies the session, then upserts updated key-value pairs in `site_config`
- **Used by:** Admin portal "Save & Publish" button

### `POST /api/admin/upload-url`

- **Auth required:** Yes
- **What it does:** Verifies the session, then generates a Supabase Storage signed upload URL for direct browser-to-storage upload
- **Used by:** Admin media uploaders

### `POST /api/ai`

- **Auth required:** No (Gemini key is kept server-side, prompt input is low-risk)
- **What it does:** Receives `mode` (`recommend` or `slogan`), calls Gemini API, returns generated text
- **Used by:** Customer page AI section

---

## 9. Database Schema — Supabase

A single table using a key-value pattern keeps things simple and easy to extend.

```sql
-- Run this in the Supabase SQL Editor

create table if not exists site_config (
  key   text primary key,
  value text,
  updated_at timestamptz default now()
);

-- Seed with default values
insert into site_config (key, value) values
  ('maps_link',           'https://maps.google.com'),
  ('menu_link',           'https://example.com/menu'),
  ('hotline',             '+84000000000'),
  ('slogan',              'Nhậu Xả Láng, Về Nhà Êm'),
  ('promo_badge_1',       '10% OFF khi Follow Facebook'),
  ('promo_badge_2',       'Free Nước khi Review Google'),
  ('background_image_url',''),
  ('logo_url',            ''),
  ('brand_font_url',      '')
on conflict (key) do nothing;

-- Row Level Security (RLS)
alter table site_config enable row level security;

-- Policy: anyone can read
create policy "Public read"
  on site_config for select
  using (true);

-- Policy: only authenticated (admin) can write
create policy "Admin write"
  on site_config for all
  using (auth.role() = 'authenticated');
```

**Note:** Direct writes from the browser to Supabase are not used. All writes go through the Netlify Function (`POST /api/config`) which validates the JWT server-side before writing. The RLS policy above is a safety net.

---

## 10. File & Media Storage

Supabase Storage is used for uploaded media files (background image, logo, brand font).

### Bucket setup (run once in Supabase dashboard)

1. Create a bucket named `media`
2. Set it to **Public** (files are served via a public URL, same as Supabase CDN)
3. No extra policy config needed since uploads go through a signed URL from the Netlify Function

### Upload flow

1. Admin selects a file in the Admin portal
2. Admin portal calls `POST /api/upload-url` (with JWT)
3. Netlify Function verifies JWT, generates a Supabase signed upload URL, returns it
4. Browser uploads the file directly to that URL (bypasses the function size limit)
5. Netlify Function (or the browser) then saves the resulting public file URL to `site_config`

### Public URL format

```
https://<your-project-ref>.supabase.co/storage/v1/object/public/media/<filename>
```

---

## 11. Authentication & Access Control — Admin Portal

### Short answer to your question

You do **not** need a custom JWT auth flow. Supabase Auth handles the entire token lifecycle natively — issuance, refresh, and revocation. The verification in Netlify Functions is a single built-in SDK call. No extra libraries, no custom token signing, no additional services, no extra cost.

---

### The fix from v2 — admin reads are also protected

The previous design had a real gap: `GET /api/config` was public, so the admin form could fetch and render real data even without a legitimate session. The fix is an endpoint split (see Section 8). **All admin operations — reads and writes — go through auth-protected endpoints.** The admin portal never touches the public endpoint.

```
Unauthorized user bypasses React guard
            │
            ▼
  Admin components mount, call:
  GET /api/admin/config
  Authorization: Bearer <no token or tampered token>
            │
            ▼
  Netlify Function: supabase.auth.getUser(token)
            │
      ┌─────┴──────┐
   Invalid       Valid
      │             │
    401 ◄           └─► return config data
  admin form              │
  renders empty     form pre-fills
```

Without a real Supabase session, admin components receive a 401 on every call — reads and writes alike — and have nothing to render.

---

### Why `supabase.auth.getUser()` instead of `jwt.verify()`

The previous version used `jwt.verify(token, SUPABASE_JWT_SECRET)` — an offline cryptographic signature check. `supabase.auth.getUser(token)` is strictly better:

| | `jwt.verify(secret)` | `supabase.auth.getUser(token)` |
|---|---|---|
| Checks signature | Yes | Yes |
| Checks expiry | Yes | Yes |
| Checks if session was revoked | **No** | **Yes** |
| Needs extra env variable | `SUPABASE_JWT_SECRET` | No — uses `SUPABASE_SERVICE_KEY` already present |
| Needs extra npm package | `jsonwebtoken` | No — Supabase client already installed |

The revocation point is the key difference: if you ever need to invalidate the admin session (suspected compromise, lost device), you delete the session from the Supabase dashboard and `getUser()` fails immediately on the next request. With `jwt.verify()`, the token would still pass for up to another hour.

---

### ACL pattern — applied to every admin Netlify Function

```js
const { createClient } = require('@supabase/supabase-js');

// Admin client — service key only, runs server-side, never in browser
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {
  // Step 1 — extract token from request header
  const token = event.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ error: 'No token provided' }) };
  }

  // Step 2 — verify against Supabase: checks signature, expiry, AND live session state
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid or expired session' }) };
  }

  // Step 3 — only reaches here with a fully verified, active session
  // ... proceed with DB read or write
};
```

This 3-step block is the entry point of every admin function. None of them proceed past step 2 without a valid session.

---

### Full login flow

1. Admin visits `/admin` — React renders the login form (static HTML, no API calls yet)
2. Admin submits email/password → `supabase.auth.signInWithPassword()` (client-side Supabase SDK)
3. Supabase validates credentials server-side, returns an **access token** (1-hour TTL) and a **refresh token**; both stored in localStorage by the SDK
4. Admin components call `GET /api/admin/config` with `Authorization: Bearer <access-token>`
5. Netlify Function runs `supabase.auth.getUser(token)` — verified server-side against live session state
6. On success: config data returned, admin form pre-fills
7. Supabase SDK silently refreshes the access token before it expires using the refresh token
8. On sign-out: `supabase.auth.signOut()` clears localStorage **and** invalidates the session in Supabase — token is dead immediately

---

### Threat model summary

| Scenario | Result |
|---|---|
| Modifies localStorage to fake a session | All admin API calls return 401. Nothing renders. |
| Tampers with a real JWT payload | Signature check fails. 401. |
| Replays an expired token | `getUser()` rejects it. 401. |
| Uses a valid token after sign-out or session revocation | `getUser()` rejects it immediately. 401. |
| Has physical access to an active device | Real access until session is revoked from Supabase dashboard. |
| Calls public `/api/public/config` | Gets customer-facing data only — same as what's visible on the customer page. |

---

### Setup steps (done once in Supabase dashboard)

1. Go to **Authentication → Users → Add user**
2. Create one admin user with a strong email/password
3. Keep **"Enable email confirmations"** off — no SMTP setup needed
4. No extra JWT secret or separate variable required — `SUPABASE_SERVICE_KEY` covers everything

---

## 12. AI Feature — Gemini Proxy

The Google Gemini API key must **never** be in the browser-side code. The `gemini-ai` Netlify Function acts as a secure proxy.

### Flow

```
Customer clicks AI button
       │
       ▼
POST /api/ai  { mode: "recommend" | "slogan" }
       │
       ▼
Netlify Function (server-side)
  - Reads GEMINI_API_KEY from environment variable
  - Builds prompt based on mode
  - Calls Gemini API
  - Returns generated text
       │
       ▼
Customer page displays result
```

### Prompts

- **`recommend` mode:** "You are a helpful assistant for a Vietnamese restaurant. Based on the menu at [menu_link], suggest 3 dishes for a customer who wants [X]." *(menu link is fetched from site_config)*
- **`slogan` mode:** "Generate a short, funny, punchy Vietnamese drinking slogan for a rowdy restaurant night out."

---

## 13. Environment Variables

### Netlify (set in Netlify dashboard → Site configuration → Environment variables)

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL (e.g. `https://xxxx.supabase.co`) |
| `SUPABASE_SERVICE_KEY` | Supabase **service role** key — used server-side to verify sessions via `auth.getUser()` and to perform DB writes |
| `GEMINI_API_KEY` | Your Google Gemini API key |

`SUPABASE_JWT_SECRET` is **not** needed. Session verification is done via `supabase.auth.getUser()` using the service key, which is already required for DB operations.

### Local development (`.env.local` — not committed to git)

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
GEMINI_API_KEY=your-gemini-api-key-here
```

**Two different Supabase keys:**
- `VITE_SUPABASE_ANON_KEY` — public key, safe in browser, used by React for auth sign-in
- `SUPABASE_SERVICE_KEY` — secret key, only in Netlify Functions, never in browser

---

## 14. Deployment Guide

### Prerequisites

- [ ] Node.js 18+ installed locally
- [ ] Netlify account (free) — [netlify.com](https://netlify.com)
- [ ] Supabase account (free) — [supabase.com](https://supabase.com)
- [ ] Google AI Studio account for Gemini API key — [aistudio.google.com](https://aistudio.google.com)
- [ ] Git installed and a GitHub/GitLab repo (Netlify deploys from git)

---

### Step 1 — Set up Supabase

1. Create a new Supabase project at [app.supabase.com](https://app.supabase.com)
2. Go to **SQL Editor** and run the schema SQL from [Section 8](#8-database-schema--supabase)
3. Go to **Storage** → create a bucket named `media`, set to **Public**
4. Go to **Authentication → Users** → add one admin user (email + password)
5. Go to **Settings → API** and copy:
   - **Project URL**
   - **anon / public** key
   - **service_role** key (treat as a password, never share)

---

### Step 2 — Set up Google Gemini API

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Create an API key
3. Copy it — you'll add it to Netlify environment variables

---

### Step 3 — Initialize the project locally

```bash
# Clone or create the repo
git clone https://github.com/your-username/ditoi.git
cd ditoi

# Install dependencies
npm install

# Create .env.local and fill in your keys (see Section 12)
cp .env.local.example .env.local

# Run local dev server (frontend + functions together)
npx netlify dev
```

`netlify dev` runs the Vite dev server and Netlify Functions locally simultaneously. Functions are available at `http://localhost:8888/.netlify/functions/*`.

---

### Step 4 — Deploy to Netlify

**Option A — Netlify CLI (recommended)**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link to a Netlify site (or create new)
netlify init

# Deploy (production)
netlify deploy --prod
```

**Option B — Git-based deploy (auto-deploy on push)**

1. Push the project to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import from Git**
3. Select your GitHub repo
4. Set build settings:
   - **Base directory:** (leave empty)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**

Every future `git push` to the `main` branch will trigger an automatic redeploy.

---

### Step 5 — Add environment variables in Netlify

1. Go to your site in Netlify dashboard
2. **Site configuration → Environment variables**
3. Add the three server-side variables from [Section 12](#12-environment-variables):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `GEMINI_API_KEY`
4. Trigger a redeploy after saving (Netlify → **Deploys → Trigger deploy**)

---

### `netlify.toml` configuration

This file lives in the project root and tells Netlify how to build and route:

```toml
[build]
  command   = "npm run build"
  publish   = "dist"
  functions = "netlify/functions"

# Redirect /api/* to Netlify Functions
[[redirects]]
  from   = "/api/*"
  to     = "/.netlify/functions/:splat"
  status = 200

# SPA fallback — send all routes to index.html (React Router handles them)
[[redirects]]
  from   = "/*"
  to     = "/index.html"
  status = 200
```

---

## 15. Custom Domain Setup

Your domain is registered at a separate registrar (not Netlify). You keep it there — no transfer needed. You just add DNS records at your registrar that point to Netlify. This is the standard approach.

### Step 1 — Tell Netlify about your domain

1. Go to your site in the Netlify dashboard
2. **Site configuration → Domain management → Add a domain**
3. Enter your domain (e.g. `ditoi.vn`)
4. Netlify will confirm it and show you what DNS records to create

### Step 2 — Add DNS records at your registrar

Log into your domain registrar's DNS management panel and add these records:

| Type | Name / Host | Value | TTL |
|---|---|---|---|
| `A` | `@` (or blank, means root domain) | `75.2.60.5` | 3600 |
| `CNAME` | `www` | `<your-netlify-site-name>.netlify.app` | 3600 |

**Notes:**
- The `A` record points the bare domain (`ditoi.vn`) to Netlify's load balancer IP
- The `CNAME` handles `www.ditoi.vn` → your Netlify site
- Different registrars use different labels for the root — it may be `@`, blank, or your domain name itself. They all mean the same thing.
- DNS propagation takes anywhere from a few minutes to 24 hours depending on your registrar and TTL settings

### Step 3 — SSL certificate

Netlify automatically provisions a free Let's Encrypt SSL certificate once it detects your DNS is pointing at it. No action needed. HTTPS is enabled automatically.

### Verify it worked

After propagation, visit your domain — it should load your Netlify site over HTTPS. You can also check **Netlify dashboard → Domain management** which shows a green checkmark when DNS is verified and SSL is active.

---

## 16. Limitations & Caveats

### Supabase project auto-pause

Free tier Supabase projects pause after **7 days with no database activity**.

**Pause = cold sleep. Your data is NOT deleted.** The project is simply put into a hibernation state where it stops accepting database connections. All your tables, rows, and storage files are fully preserved. When you unpause (manually from the Supabase dashboard, or automatically when a request comes in that wakes it), everything is exactly as you left it. There is zero data loss.

The problem is that while paused, the customer page cannot fetch config from the DB and will show errors to visitors.

**Fix options:**
- **Free option:** Use [cron-job.org](https://cron-job.org) (free) to ping your Supabase REST API every 3 days
- **Paid option:** Upgrade to Supabase Pro ($25/month) — no pausing

**Recommended cron ping URL:**
```
https://<your-project-ref>.supabase.co/rest/v1/site_config?select=key&limit=1
```
Add header: `apikey: <your-anon-key>`

---

### Netlify Function cold starts

Serverless functions may have a ~200–500ms cold start if they haven't been called recently. This is only noticeable on the AI feature (which already has Gemini API latency). Config fetching on page load is fast because it's called on every customer visit.

---

### File upload size limit

Netlify Functions have a **6 MB request body limit**. Because uploads go directly from the browser to Supabase Storage (via signed URL), this limit does not apply to file uploads. Only the JSON payloads for config updates go through the function.

---

### Gemini API rate limits (free tier)

Google Gemini API free tier: **15 requests per minute, 1,500 requests per day**. Sufficient for a restaurant page.

---

### Branch deploys

Netlify automatically creates preview URLs for pull requests (e.g. `deploy-preview-1--your-site.netlify.app`). These previews share the same environment variables and hit the same Supabase database. Keep this in mind if testing admin changes on a preview URL.

---

### Customer page data loading

The customer page loads as a static shell first, then fetches site config (links, slogan, promo text, image URLs) from `/api/config` in the background. This is a single fast API call — in practice it completes before the user has finished looking at the hero image. There is no meaningful UX impact.

SEO (search engine indexing) is not a concern for this app. The page is a Link-in-Bio accessed via QR code or direct link share, not discovered via Google search. Customers are sent directly to the URL — they don't find it by searching.

---

## Summary

| What | How |
|---|---|
| Customer page hosted | Netlify Edge CDN (free, global) |
| Admin portal hosted | Same Netlify site at `/admin` |
| Static asset CDN | Netlify (built-in, automatic) |
| Media file CDN (images, logo, fonts) | Supabase Storage CDN via Cloudflare (built-in) |
| Dynamic data | Supabase PostgreSQL (free) |
| File uploads | Supabase Storage (free, 1 GB) |
| Admin login | Supabase Auth, email/password |
| Admin ACL | `supabase.auth.getUser()` server-side on ALL admin endpoints (reads + writes) |
| Token revocation | Instant — invalidating a Supabase session blocks all further requests immediately |
| API backend | Netlify Functions (Node.js serverless, free 125k req/month) |
| AI feature | Netlify Function proxying Google Gemini (key kept server-side) |
| HTTPS + SSL | Netlify auto-provisioned (free) |
| Custom domain | CNAME/A record at your existing registrar → Netlify |
| Cost | **$0/month** as long as traffic stays within free tier limits |
