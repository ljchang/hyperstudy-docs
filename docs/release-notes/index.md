---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

## v0.6.4

Released: 2026-02-10

## What's Changed

## Changes since last production release

- Fix HLS video streaming on Safari with CloudFront signed URLs (00cf8035)
- Enforce consent → instructions → waiting room sequence (c56252e4)
- Prevent SSL outages during deployments by skipping unnecessary Traefik restarts (68507e35)
- Fix experiment permission 500 error and owner Unknown display (ba48deb9)

---

## v0.6.3

Released: 2026-02-10

## What's Changed

## Changes since last production release

- Fix ShowImageComponent test missing isSignedUrl mock (1903889b)
- Skip crossorigin for signed GCS URLs to avoid CORS failures (9b5c41b8)
- Remove global button element selectors from app.css and forms.css (cfea1a9e)
- Fix signed URL corruption in image proxy for stimulus mappings (e8754b1c)
- Fix image drag-to-folder validation and folder button icon visibility (a97f422b)
- Fix InstructionsDisplay test missing mocks for imageService and videoService (080429b4)
- Fix Instructions test selector for block-based content editor (973ff172)
- Fix Redis client-closed error on shutdown and sync room join timeout (c7c9c66f)
- Fix ColorPickerButton props_invalid_value and each-block reconciliation crash (1dfc07f5)
- Harden AudioRecordingComponent against resource leaks, race conditions, and silent failures (90199256)
- Add media (image/video) support to instruction pages (9c1450f4)
- Fix svelte-check accessibility and CSS warnings across 5 components (17cd502e)
- Fix waiting room timeout and countdown bugs (b0d1f968)
- Add key-category stimulus mapping type with folder-based sampling (e1f1cbf2)
- Fix reactive loop in VariableManagerPanel causing 429 rate limit errors (2c058562)
- Fix pre-experiment comprehension data not appearing in data management (e72ad142)
- Fix deployment participant completion counts always showing 0/N (554712a8)
- Add pre-experiment pipeline tracking for deployment dashboard (5beb2130)
- Store video duration at selection time for sparse rating editor (40f9eec6)
- Fix instructionsPages not persisted on experiment creation (ebbd41a7)

---

## v0.6.2

Released: 2026-02-09

## What's Changed

## Changes since last production release

- Fix Redis reconnection failures and remove conflicting IngressRoute (39328e25)

---


[View all v0.6 releases →](/release-notes/v0.6)

## Previous Versions

- [v0.5 releases](/release-notes/v0.5)
- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
