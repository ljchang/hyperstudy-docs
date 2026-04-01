---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

## v0.6.45

Released: 2026-04-01

## What's Changed

## Changes since last production release

- fix: prevent WebSocket echo from causing input lag in sparse rating config (845ea4da)
- fix: add missing media timing columns to sparse ratings table and remove dead code (2e7b9f81)

---

## v0.6.44

Released: 2026-04-01

## What's Changed

## Changes since last production release

- Fix HLS transcoding: add missing AWS credentials to backend deployment (738bbe71)
- fix: deploy monthly reset and usage reconciliation CronJobs (cb80c14b)

---

## v0.6.43

Released: 2026-04-01

## What's Changed

## Changes since last production release

- feat: add Client Diagnostics tab to data management viewer (61e214a8)
- fix: prevent Prometheus OOM cascade with Recreate strategy and higher memory limit (4d7ccc47)
- docs: add client diagnostics and clock sync design spec and implementation plan (959e453d)
- fix: XSS escape client diagnostics, extract shared render, add stop guard and throttle (d76de46a)
- feat: add diagnostics update endpoint for window size at experiment start (97b7a7eb)
- feat: apply clock offset correction to client-sourced event onsets (b377b581)
- Replace fragile EventBridge HLS trigger with backend-initiated transcoding (61252ef6)
- feat: enrich participants with diagnostics and add Client Info UI column (277aa002)
- feat: add clock sync socket handlers and ExperimentRunner integration (f3b94284)
- feat: capture and store client diagnostics at session creation (3fbe726f)
- feat: add clock sync service using Cristian's algorithm with EMA smoothing (a166e2ee)
- feat: add client diagnostics collection service with UA parsing (b0bcae16)
- Add media pause/resume onset times to processed sparse ratings (02264972)

---


[View all v0.6 releases →](/release-notes/v0.6)

## Previous Versions

- [v0.5 releases](/release-notes/v0.5)
- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
