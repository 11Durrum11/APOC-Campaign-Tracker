#!/usr/bin/env python3
"""Bump the APOC Campaign Tracker's version stamp (America/Phoenix).

Run this as part of EVERY publish, before pushing: the home-screen icon
launches launch.html, which reads version.json with cache disabled and
redirects to ./?v=<stamp> — a fresh stamp is what guarantees phones open
the newest build instead of a stale cached copy. Never push a change to
the hosting repo without bumping the stamp in the same publish.
"""
import json
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

now = datetime.now(ZoneInfo("America/Phoenix"))
stamp = now.strftime("%Y-%m-%d-%H%M")
# The simple human version shown by the badge at the top of the site
# (Shaun, 2026-11-04) — the stamp broken down plainly, e.g. "Nov 4 · 7:25 PM".
display = now.strftime("%b %-d · %-I:%M %p")
path = Path(__file__).with_name("version.json")
path.write_text(json.dumps({"version": stamp, "display": display}) + "\n", encoding="utf-8")
print("version.json ->", stamp, "| display:", display)
