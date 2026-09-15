# VATL-My-apps

Application build up in VATL

## Features

- **My Web App Hub** — A dashboard to manage web applications
- **Supabase Backend** — Real-time data sync with Supabase
- **Drag & Drop** — Reorder and categorize applications
- **Active/Archive Toggle** — Soft delete with `active` column support
- **Confirmation Modal** — Confirm archive/reactivate actions
- **Filter** — Show active-only applications
- **Bilingual UI** — Thai/English interface

## Architecture

- **Frontend**: Vanilla HTML/CSS/JS with Bootstrap 5 + SortableJS
- **Backend**: Supabase (PostgreSQL + Row Level Security)
- **Build**: `build.js` generates `public/index.html` with resolved env vars

## Quick Start

1. Install dependencies: `npm install`
2. Build: `npm run build` (or `node build.js` with env vars set)
3. Serve `public/index.html` on a local server

### Environment Variables

```env
NEXT_PUBLIC_Myapps_SUPABASE_URL=https://wgzxexklnndethybiipm.supabase.co
NEXT_PUBLIC_Myapps_SUPABASE_PUBLISHABLE_KEY=sb_pub...5VG7
```

### Supabase Setup

Run `rls_policies.sql` in the Supabase SQL Editor to:
1. Enable RLS on `web_apps` table
2. Add `active` boolean column (default: true)
3. Create policies for anonymous read/update on active column
4. Grant service_role full access

## Features Detail

### Active Column (Soft Delete)
- Each app has an `active` boolean field (default: `true`)
- Archiving sets `active = false` (card is grayed out, hidden from default view)
- Reactivate via confirmation modal or toggle switch on each card
- Filter checkbox to show only active apps

### Confirmation Modal
- Replaces native `confirm()` dialog
- Shows app name and action type (Archive vs Reactivate)
- Confirm/Cancel buttons

### Card Display
- **Active cards**: Normal styling, full opacity
- **Archived cards**: Grayed out, line-through title, reduced opacity
- Each card has toggle switch for active/inactive

## Build

```bash
# Build with env vars
NEXT_PUBLIC_Myapps_SUPABASE_URL=<url> NEXT_PUBLIC_Myapps_SUPABASE_PUBLISHABLE_KEY=<key> node build.js
```

## Files

- `index.html` — Main application UI
- `rls_policies.sql` — Supabase database policies and migrations
- `build.js` — Build script for generating `public/index.html`
- `check-page.js` — Validation script
- `public/index.html` — Built output (generated)

## Deployment

1. Commit and push to GitHub
2. Update Supabase: run `rls_policies.sql`
3. Deploy `public/` to hosting (Vercel, Netlify, etc.)
