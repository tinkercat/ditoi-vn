# DÍ TỚI — Implementation & Deployment Plan

> **Current state:** Two static HTML mockups (`ditoi-client.html`, `ditoi-admin.html`) extracted from the original Cocoa export.
> **Target state:** Live React + Netlify + Supabase application per `architecture.md`.

---

## Table of Contents

1. [Phase Overview](#1-phase-overview)
2. [Phase 0 — Accounts & Keys](#2-phase-0--accounts--keys)
3. [Phase 1 — Project Scaffold](#3-phase-1--project-scaffold)
4. [Phase 2 — Database & Storage Setup](#4-phase-2--database--storage-setup)
5. [Phase 3 — Netlify Functions (Backend)](#5-phase-3--netlify-functions-backend)
6. [Phase 4 — Customer Page (React)](#6-phase-4--customer-page-react)
7. [Phase 5 — Admin Portal (React)](#7-phase-5--admin-portal-react)
8. [Phase 6 — Integration Testing](#8-phase-6--integration-testing)
9. [Phase 7 — Deployment](#9-phase-7--deployment)
10. [Phase 8 — Domain & SSL](#10-phase-8--domain--ssl)
11. [Phase 9 — Post-Launch](#11-phase-9--post-launch)
12. [Task Checklist (flat)](#12-task-checklist-flat)
13. [Decision Log](#13-decision-log)

---

## 1. Phase Overview

| Phase | Name | Depends on | Deliverable |
|---|---|---|---|
| 0 | Accounts & Keys | Nothing | All credentials ready |
| 1 | Project Scaffold | Phase 0 | Local React + Vite + Netlify dev environment running |
| 2 | Database & Storage | Phase 0 | Supabase schema seeded, media bucket ready |
| 3 | Netlify Functions | Phase 2 | All API endpoints live and tested |
| 4 | Customer Page | Phase 3 | Customer page reading live data |
| 5 | Admin Portal | Phase 3 | Admin portal reads and writes live data |
| 6 | Integration Testing | Phases 4 + 5 | End-to-end flow verified |
| 7 | Deployment | Phase 6 | Live on Netlify at `*.netlify.app` |
| 8 | Domain & SSL | Phase 7 | Live on custom domain with HTTPS |
| 9 | Post-Launch | Phase 8 | Keep-alive cron, access revocation doc |

Phases 2 and 3 can be worked on in parallel. Phases 4 and 5 can be worked on in parallel once Phase 3 endpoints exist.

---

## 2. Phase 0 — Accounts & Keys

All accounts are free tier. No credit card required for any of these.

### 0.1 — Supabase

- [ ] Create account at [supabase.com](https://supabase.com)
- [ ] Create a new project (pick a region close to Vietnam — Singapore `ap-southeast-1`)
- [ ] Wait for provisioning (~2 min)
- [ ] From **Settings → API**, copy and save:
  - Project URL (`https://xxxx.supabase.co`)
  - `anon` / public key
  - `service_role` key *(treat as a password — never commit to git)*

### 0.2 — Google Gemini API

- [ ] Go to [aistudio.google.com](https://aistudio.google.com)
- [ ] Sign in with a Google account
- [ ] Click **Get API key → Create API key**
- [ ] Copy and save the key

### 0.3 — Netlify

- [ ] Create account at [netlify.com](https://netlify.com)
- [ ] No configuration yet — you'll link it to the GitHub repo in Phase 7

### 0.4 — GitHub repo

- [ ] Create a new **private** repository named `ditoi` (or similar) at [github.com](https://github.com)
- [ ] Do not initialise with a README — the scaffold in Phase 1 will provide the first commit

---

## 3. Phase 1 — Project Scaffold

### 1.1 — Bootstrap Vite + React

```bash
# From your projects folder
npm create vite@latest ditoi -- --template react
cd ditoi
npm install
```

### 1.2 — Install dependencies

```bash
npm install react-router-dom @supabase/supabase-js
npm install -D netlify-cli
```

### 1.3 — Create project structure

Create the following folders and placeholder files (content filled in Phases 4 & 5):

```
ditoi/
├── netlify/
│   └── functions/          ← empty for now
├── src/
│   ├── customer/
│   │   └── components/
│   └── admin/
│       └── components/
├── public/
├── .env.local              ← created below, not committed
├── .gitignore
├── netlify.toml
└── vite.config.js
```

### 1.4 — Configure `netlify.toml`

Create `netlify.toml` in the project root:

```toml
[build]
  command   = "npm run build"
  publish   = "dist"
  functions = "netlify/functions"

[[redirects]]
  from   = "/api/*"
  to     = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from   = "/*"
  to     = "/index.html"
  status = 200
```

### 1.5 — Create `.env.local`

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
GEMINI_API_KEY=your-gemini-api-key-here
```

### 1.6 — Create `.gitignore`

Ensure `.env.local` and `node_modules` are listed:

```
node_modules/
dist/
.env.local
.env
```

### 1.7 — Create `src/supabaseClient.js`

```js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### 1.8 — Set up React Router in `src/main.jsx`

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerPage from './customer/CustomerPage';
import AdminApp from './admin/AdminApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerPage />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
```

### 1.9 — Port CSS from mockup

Copy the `<style>` block from `resources/ditoi-client.html` into `src/customer/customer.css`.
Copy the admin-specific styles (`.admin-side`, `.admin-title`, `.admin-group`, etc.) into `src/admin/admin.css`.

### 1.10 — Initial commit

```bash
git init
git remote add origin https://github.com/your-username/ditoi.git
git add .
git commit -m "feat: initial scaffold"
git push -u origin main
```

### 1.11 — Verify local dev works

```bash
npx netlify dev
# Visit http://localhost:8888 — React app should load (empty shell is fine at this stage)
```

---

## 4. Phase 2 — Database & Storage Setup

### 2.1 — Run schema SQL in Supabase

Open **Supabase dashboard → SQL Editor** and run:

```sql
create table if not exists site_config (
  key        text primary key,
  value      text,
  updated_at timestamptz default now()
);

insert into site_config (key, value) values
  ('maps_link',            'https://maps.app.goo.gl/UjS1d73B7dVM6FyH9'),
  ('menu_link',            'https://example.com/menu'),
  ('hotline',              '0979838250'),
  ('slogan',               'ĐÃ ''DÍ'' LÀ PHẢI ''TỚI'''),
  ('promo_fb',             'GIẢM 10%'),
  ('promo_tt',             'TẶNG 1 MÓN'),
  ('promo_checkin',        'GIẢM 5%'),
  ('promo_review',         'TẶNG NƯỚC'),
  ('background_image_url', ''),
  ('logo_url',             ''),
  ('brand_font_url',       '')
on conflict (key) do nothing;

alter table site_config enable row level security;

create policy "Public read"
  on site_config for select
  using (true);

create policy "Admin write"
  on site_config for all
  using (auth.role() = 'authenticated');
```

- [ ] SQL ran without errors
- [ ] Rows visible in **Table Editor → site_config**

### 2.2 — Create Supabase Storage bucket

1. Go to **Storage → New bucket**
2. Name: `media`
3. Toggle: **Public bucket** ON
4. Click **Save**
- [ ] Bucket `media` created and set to public

### 2.3 — Create admin user

1. Go to **Authentication → Users → Add user**
2. Enter the admin's email and a strong password
3. Leave **"Send email confirmation"** OFF
- [ ] Admin user created
- [ ] Login tested: go to **Authentication → Users** and confirm `last_sign_in_at` updates after a test sign-in via the Supabase Auth API playground or a temporary test form

---

## 5. Phase 3 — Netlify Functions (Backend)

All files live in `netlify/functions/`. The ACL pattern described in `architecture.md` §11 applies to every admin function.

### 3.1 — Shared auth helper

Create `netlify/functions/_auth.js` (the leading underscore prevents Netlify from treating it as an endpoint):

```js
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function requireAuth(event) {
  const token = event.headers.authorization?.replace('Bearer ', '');
  if (!token) return { user: null, error: 'No token' };
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  return { user: error ? null : user, supabaseAdmin, error };
}

module.exports = { requireAuth, supabaseAdmin };
```

### 3.2 — `GET /api/public/config`

File: `netlify/functions/public-config.js`

- No auth required
- Returns all rows from `site_config` as a key→value object
- Used by the customer page on load

```js
const { supabaseAdmin } = require('./_auth');

exports.handler = async () => {
  const { data, error } = await supabaseAdmin
    .from('site_config')
    .select('key, value');

  if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };

  const config = Object.fromEntries(data.map(({ key, value }) => [key, value]));
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  };
};
```

- [ ] Function created
- [ ] Test: `curl http://localhost:8888/api/public-config` returns JSON config

### 3.3 — `GET /api/admin/config`

File: `netlify/functions/admin-config-get.js`

- Requires valid session
- Returns same shape as public config
- Admin form uses this endpoint to pre-fill on login

- [ ] Function created
- [ ] Test with no token → 401
- [ ] Test with valid token → 200 + config JSON

### 3.4 — `POST /api/admin/config`

File: `netlify/functions/admin-config-post.js`

- Requires valid session
- Body: `{ key: string, value: string }[]` (array of key-value pairs to upsert)
- Upserts rows in `site_config`

- [ ] Function created
- [ ] Test with no token → 401
- [ ] Test with valid token + valid body → 200
- [ ] Verify rows updated in Supabase Table Editor

### 3.5 — `POST /api/admin/upload-url`

File: `netlify/functions/admin-upload-url.js`

- Requires valid session
- Body: `{ filename: string, contentType: string }`
- Creates a signed upload URL to the `media` Supabase Storage bucket
- Returns: `{ signedUrl: string, publicUrl: string }`

- [ ] Function created
- [ ] Test: signed URL returned and upload via `curl --upload-file` places file in Supabase Storage

### 3.6 — `POST /api/ai`

File: `netlify/functions/ai.js`

- No auth required
- Body: `{ mode: "recommend" | "slogan" }`
- Fetches `menu_link` from `site_config`, then calls Gemini API
- Returns: `{ text: string }`
- Uses exponential backoff with 5 retries (see architecture.md §12 for prompt strings)

- [ ] Function created
- [ ] Test `recommend` mode → AI text returned
- [ ] Test `slogan` mode → AI text returned
- [ ] Confirm `GEMINI_API_KEY` never appears in browser network tab

---

## 6. Phase 4 — Customer Page (React)

Port the HTML from `resources/ditoi-client.html` into React components. The structure maps cleanly to components already outlined in the folder scaffold.

### 4.1 — `CustomerPage.jsx`

Fetches config from `/api/public-config` on mount, distributes values as props to child components. Shows a minimal skeleton/no-op state while loading (the page renders static structure immediately; dynamic text fills in on data arrival).

### 4.2 — `HeroSection.jsx`

Props: `backgroundImageUrl`, `logoUrl`, `slogan`
- Renders `<header class="hero">` with the blurred background layer, logo, and slogan badge
- Background image: if `backgroundImageUrl` is set, use it; otherwise fall back to the Unsplash placeholder from the mockup
- Logo: if `logoUrl` is set, render `<img>` with glow animation; otherwise render nothing

### 4.3 — `InfoGrid.jsx`

Props: `mapsLink`, `hotline`
- Renders the three info cards: address, hours, hotline
- Hotline card uses `href="tel:..."` directly (no admin-side function call needed in the client)

### 4.4 — `LinksSection.jsx`

Props: `menuLink`, `promoBadges` (`{ fb, tt, checkin, review }`)
- Renders all four sections: Menu, Book a table, Follow & check-in
- Promo badges (`GIẢM 10%`, etc.) rendered from props

### 4.5 — `AiSection.jsx`

- No props needed
- Calls `POST /api/ai` on button click
- Manages modal open/close state locally
- Shows loading text while waiting

### 4.6 — `VoucherSection.jsx`

- Static content (voucher code `DITOI27`)
- Can be made dynamic later via a `site_config` key if needed

- [ ] Customer page renders correctly from live Supabase data
- [ ] AI buttons work and display modal
- [ ] Click-to-call hotline works on mobile
- [ ] All external links open in a new tab
- [ ] Page is visually identical to `ditoi-client.html` mockup

---

## 7. Phase 5 — Admin Portal (React)

### 5.1 — `AdminApp.jsx` (auth guard wrapper)

- On mount: calls `supabase.auth.getSession()` to check for an existing session
- If no session: renders `<LoginPage />`
- If session exists: renders admin editor components
- Listens to `supabase.auth.onAuthStateChange` for sign-out events

### 5.2 — `LoginPage.jsx`

- Simple form: email input, password input, submit button
- On submit: calls `supabase.auth.signInWithPassword({ email, password })`
- On success: `onAuthStateChange` fires and triggers the switch to the editor
- On error: displays the error message inline
- No routing needed — conditional render in `AdminApp` handles the switch

### 5.3 — `AdminEditor.jsx`

- On mount: fetches config from `GET /api/admin-config-get` with the user's access token
- Displays all form fields pre-filled with live data
- Single "Save & Publish" button calls `POST /api/admin-config-post` with the full current form state
- Sign-out button calls `supabase.auth.signOut()`

### 5.4 — `MediaUploader.jsx`

- Used for background image, logo, and brand font file inputs
- On file select:
  1. Calls `POST /api/admin-upload-url` with filename and MIME type
  2. Uploads the file directly to the signed URL via `fetch` (PUT request)
  3. On upload success: updates the corresponding form field with the public URL
- Progress indicator while uploading

### 5.5 — Token passing utility

Helper in `src/admin/api.js`:

```js
import { supabase } from '../supabaseClient';

export async function adminFetch(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  return fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      ...options.headers,
    },
  });
}
```

- [ ] Admin login works with the Supabase user created in Phase 2.3
- [ ] Form pre-fills with live data from Supabase
- [ ] Saving updates live data (verify in customer page without reload, or check Supabase Table Editor)
- [ ] File uploads succeed and public URLs are stored in `site_config`
- [ ] Customer page reflects uploaded media (logo, background image)
- [ ] Sign-out clears session and returns to login form
- [ ] Accessing `/admin` with no session shows login form, not editor

---

## 8. Phase 6 — Integration Testing

Run through these scenarios before deploying to production.

### Happy path

- [ ] Open `http://localhost:8888` — customer page loads with default data
- [ ] Open `http://localhost:8888/admin` — login form appears
- [ ] Log in with admin credentials — editor appears, form pre-filled
- [ ] Change slogan text → Save — customer page refresh shows new slogan
- [ ] Change hotline → Save — customer page shows new number; click-to-call uses new number
- [ ] Upload a background image — customer hero updates on next page load
- [ ] Upload a logo — logo appears with glow animation on customer page
- [ ] AI recommend button — modal appears with Gemini response
- [ ] AI slogan button — modal appears with Gemini response
- [ ] Sign out — returns to login form

### Auth / security

- [ ] Open browser DevTools → Application → LocalStorage → delete session — on next admin API call, should get 401 and be redirected to login
- [ ] Manually call `GET /api/admin-config-get` with no Authorization header (via curl or Insomnia) → 401
- [ ] Manually call `POST /api/admin-config-post` with a fake token → 401
- [ ] Confirm no API keys visible in browser Network tab on any request

### Edge cases

- [ ] Empty `logo_url` in config → logo element does not render (no broken image)
- [ ] Empty `background_image_url` → hero falls back to Unsplash placeholder
- [ ] AI call with Gemini returning an error → user sees friendly Vietnamese error message
- [ ] Upload a file larger than browser tolerates → graceful error in admin UI

---

## 9. Phase 7 — Deployment

### 7.1 — Push latest code

```bash
git add .
git commit -m "feat: complete implementation"
git push origin main
```

### 7.2 — Connect repo to Netlify

1. Log in to [app.netlify.com](https://app.netlify.com)
2. **Add new site → Import from Git → GitHub**
3. Select the `ditoi` repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy site** (first deploy will fail — environment variables not set yet; that's expected)

### 7.3 — Add environment variables in Netlify

1. Go to **Site configuration → Environment variables → Add a variable**
2. Add each of the following:

| Variable | Value |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Your Supabase `service_role` key |
| `GEMINI_API_KEY` | Your Google Gemini API key |

3. Go to **Deploys → Trigger deploy → Deploy site**

### 7.4 — Verify production deploy

- [ ] `https://<your-site>.netlify.app` loads the customer page
- [ ] `https://<your-site>.netlify.app/admin` loads the login form
- [ ] Log in and save a config change — customer page updates
- [ ] AI buttons work in production (Gemini API key is live)
- [ ] Check Netlify **Functions** tab for any invocation errors

---

## 10. Phase 8 — Domain & SSL

### 8.1 — Tell Netlify about your domain

1. **Site configuration → Domain management → Add a domain**
2. Enter your domain (e.g. `ditoi.vn`)
3. Netlify shows the DNS records you need to add

### 8.2 — Add DNS records at your registrar

| Type | Name | Value |
|---|---|---|
| `A` | `@` (root domain) | `75.2.60.5` |
| `CNAME` | `www` | `<your-site-name>.netlify.app` |

DNS propagation: a few minutes to 24 hours depending on your registrar.

### 8.3 — SSL

Netlify provisions a free Let's Encrypt certificate automatically once DNS resolves. No action needed.

- [ ] Domain resolves to the Netlify site
- [ ] HTTPS is active (padlock in browser)
- [ ] `www.` and bare domain both work

---

## 11. Phase 9 — Post-Launch

### 9.1 — Supabase keep-alive cron

Set up a free cron job at [cron-job.org](https://cron-job.org) to prevent Supabase free tier auto-pause:

- **URL:** `https://<your-project-ref>.supabase.co/rest/v1/site_config?select=key&limit=1`
- **Header:** `apikey: <your-anon-key>`
- **Schedule:** Every 3 days (e.g. `0 10 */3 * *`)

- [ ] Cron job created and verified (check cron-job.org execution log after first run)

### 9.2 — Admin access revocation procedure

Document this for the operator:

> If the admin account is compromised or the device is lost:
> 1. Log in to [app.supabase.com](https://app.supabase.com)
> 2. Go to **Authentication → Users**
> 3. Find the admin user → click **…** → **Delete user** (or revoke sessions)
> 4. All active sessions are invalidated immediately — every admin API call will return 401
> 5. Create a new admin user with a new password

### 9.3 — Verify Netlify branch deploy behaviour

Netlify automatically creates preview URLs for PRs. These share production environment variables and point to the same Supabase database. This is acceptable for a solo project but should be understood:
- Test changes in a preview deploy may modify live data
- If this is a concern, create a separate Supabase project for staging

---

## 12. Task Checklist (flat)

Use this as the working day-to-day checklist.

**Phase 0**
- [ ] Supabase account created, project URL + keys copied
- [ ] Gemini API key created
- [ ] Netlify account created
- [ ] GitHub private repo created

**Phase 1**
- [ ] Vite + React scaffolded
- [ ] Dependencies installed (`react-router-dom`, `@supabase/supabase-js`, `netlify-cli`)
- [ ] Folder structure created
- [ ] `netlify.toml` written
- [ ] `.env.local` filled in
- [ ] CSS ported from mockup HTML files
- [ ] React Router set up in `main.jsx`
- [ ] `supabaseClient.js` created
- [ ] `.gitignore` includes `.env.local`
- [ ] Initial commit pushed

**Phase 2**
- [ ] Schema SQL run in Supabase
- [ ] Default seed data visible in Table Editor
- [ ] `media` bucket created and set to public
- [ ] Admin user created in Supabase Auth

**Phase 3**
- [ ] `_auth.js` helper created
- [ ] `public-config.js` created and tested
- [ ] `admin-config-get.js` created and tested
- [ ] `admin-config-post.js` created and tested
- [ ] `admin-upload-url.js` created and tested
- [ ] `ai.js` created and tested

**Phase 4**
- [ ] `CustomerPage.jsx` fetches and distributes config
- [ ] `HeroSection.jsx` renders with dynamic background, logo, slogan
- [ ] `InfoGrid.jsx` renders with dynamic map link and hotline
- [ ] `LinksSection.jsx` renders with dynamic promo badges
- [ ] `AiSection.jsx` calls AI function and shows modal
- [ ] `VoucherSection.jsx` renders
- [ ] Visual parity with `ditoi-client.html` confirmed

**Phase 5**
- [ ] `AdminApp.jsx` auth guard works
- [ ] `LoginPage.jsx` signs in via Supabase
- [ ] `AdminEditor.jsx` pre-fills from live data
- [ ] `MediaUploader.jsx` uploads files and saves URLs
- [ ] Sign-out works

**Phase 6**
- [ ] Happy path end-to-end confirmed
- [ ] Auth / security tests passed
- [ ] Edge cases handled

**Phase 7**
- [ ] Code pushed to GitHub
- [ ] Netlify connected to repo
- [ ] Environment variables added to Netlify
- [ ] Production deploy successful
- [ ] Production smoke test passed

**Phase 8**
- [ ] DNS A record added
- [ ] DNS CNAME record added
- [ ] Domain resolves to site
- [ ] HTTPS active

**Phase 9**
- [ ] Supabase keep-alive cron running
- [ ] Access revocation procedure noted and accessible

---

## 13. Decision Log

Decisions made before implementation begins. Revisit before starting each phase if requirements change.

| # | Decision | Rationale | Alternative considered |
|---|---|---|---|
| 1 | Use `supabase.auth.getUser()` for session verification in Functions | Checks live session state (revocation-aware); uses service key already required for DB ops | `jwt.verify()` — does not catch revoked sessions |
| 2 | Two API endpoints for config (public vs. admin-read) | Admin form pre-fill is auth-protected; bypassing the React guard still yields 401 on reads | Single endpoint — admin form could load data without a real session |
| 3 | File uploads go browser → Supabase signed URL (not through Function) | Netlify Functions have a 6 MB request body cap; direct signed URL upload is unlimited | Stream through Function — would hit the size cap on any real image |
| 4 | Key-value table schema in Supabase (`site_config`) | Simple, easy to extend; add a new config field by inserting one row | Typed columns schema — requires a migration for every new field |
| 5 | No UI component library | Exact visual parity with mockup; no extra bundle weight; all styles already written in mockup CSS | Tailwind / shadcn — would require restyling from scratch |
| 6 | Netlify Functions over a separate Express server | Zero infrastructure to manage; bundled with Netlify hosting; free tier covers expected traffic | Express on Railway / Render — extra service, extra cost |
| 7 | Single admin user (no role management) | One operator; Supabase Auth handles lifecycle; revocation via dashboard is sufficient | Multiple roles — over-engineered for this use case |
| 8 | Supabase keep-alive via cron-job.org | Free; prevents customer-visible errors from project auto-pause | Upgrade to Supabase Pro ($25/month) — acceptable if traffic grows |
