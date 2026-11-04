# APOC Survival — Campaign Tracker (GitHub Pages copy) — publish routine

Standalone static copy of the APOC Survival campaign tracker page, built for
GitHub Pages hosting so the page can use the shared Supabase backend in
public (Muse's public artifact links refuse pages that use external
storage). Source folder: `~/workspace/apoc-campaign-tracker/`.
**Nothing in this folder has been pushed anywhere yet.**

Intended hosting pattern (same as the Live Tracker and Blendcrafter):
GitHub Pages, Deploy from a branch, main, / (root), with the contents of
this folder at the repo root. No repo was created by this build — when one
is connected, keep this routine.

## Every publish

1. Make the change in this folder.
2. **Run `python3 bump_version.py`** — updates `version.json`'s stamp
   (America/Phoenix, `YYYY-MM-DD-HHMM`). This is the always-newest
   guarantee for home-screen icons: `launch.html` fetches `version.json`
   with `cache:'no-store'` and redirects to `./?v=<stamp>`. A publish
   without a bump can serve phones a stale cached copy.
3. Check the hosting repo's latest commits first (list_commits) so a
   parallel change is never overwritten.
4. Push every changed file to main. GitHub push-files is UTF-8 text only —
   binary files (the `.webp` artwork, scene images, and PNG icons) go via
   GitHub web upload in the browser.
5. Verify from the live site: the changed files serve, `version.json`
   shows the new stamp, and hand Shaun the fresh versioned link
   (`<pages-url>?v=<stamp>`).

## Shared backend the page expects (Supabase)

Project: **apoc-survival-tracker** — `https://gjvebpbxggmumtslidej.supabase.co`
(same project as the Live Tracker; publishable key is in `index.html`,
public by design).

| Page feature | Supabase object | State |
|---|---|---|
| Tracker entries (read/write, auto-refresh ~60s + realtime) | table `public.entries` | Exists — created by `~/workspace/live-tracker-prep/schema.sql`, seeded with the 180 Bastion entries |
| Campaign status (weather subtype, scene, date, food, water, supplies) | table `public.site_settings`, row `key = 'campaign_status'`, status stored as JSON in `value` | May not exist yet — created by `~/workspace/live-tracker-prep/artwork-storage-and-settings.sql` |
| Cody's Artwork shared uploads | Storage bucket `cody-artwork` (public) | May not exist yet — created by the same `artwork-storage-and-settings.sql` |

If the settings table or the bucket is missing, the page degrades
gracefully: campaign status stays on the visitor's device with a plain
note, and the artwork panel shows the built-in 60 with a "shared uploads
are being set up" note. To finish the setup, paste
`~/workspace/live-tracker-prep/artwork-storage-and-settings.sql` into the
project's SQL Editor and Run it once. **Do not invent replacement SQL** —
that file is the prepared setup.

**Hard rule, by design:** DM secrets are never sent to the shared backend.
`public.entries` has no secret column; the page builds shared rows from an
explicit field list with no secret in it. DM-only records (and their
secrets) live only in the creating browser's localStorage.

## Cody's Artwork — hard exclusion

The built-in gallery is exactly 60 pictures (`assets/cody/`, Cody's
numbered order). Pictures **#4001, #4033, #4036, and #4055 must never be
added** — not to the gallery, not as files, not under any other name.
They were refused by a content check and stay out everywhere. Shaun's
original files outside this folder are untouched and are not part of any
publish.

## Local check before publishing

```sh
cd ~/workspace/apoc-campaign-tracker
python3 -m http.server 8000
# open http://localhost:8000/ and http://localhost:8000/launch.html
```

Phone check at ~390px wide: hero → "The table reconvenes" → APOC System
Hub → Campaign Status → tracker → bottom notice, in that order; the seven
hub buttons on one row (labels may wrap inside their button); tap a hub
button once to open its pop-up, again to follow it; no sideways scrolling.
