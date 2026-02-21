---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

## v0.6.14

Released: 2026-02-21

## What's Changed

## Changes since last production release

- Fix emulator test race condition in endExperiment questionnaire tests (fd3f2e7b)
- Expand test coverage across backend and frontend (c94ccb1d)
- Refactor Prolific gateway to V4 deployment-scoped route and fix V4 data quality (b96e39f3)
- Fix required questions in instruction pages being bypassed (f48a99f2)
- Fix submit button not centered in RapidRateComponent (d2cd14e0)
- Fix deployment owners getting 403 on experiment tracking session operations (3cfc2ab8)

---

## v0.6.13

Released: 2026-02-20

## What's Changed

## Changes since last production release

- Fix video volume resetting to saved value instead of 100% each session (9693ad20)
- Fix audio recording duration showing 0s in Data Management (b97e8b18)
- Fix pre-experiment events missing from Data Management by using V4 session tokens (cd4cb95d)
- Fix experiment permissions system and deployment invite access (8cbf62e6)
- Fix Prolific workspace selection gaps and improve API key error handling (305f8ed9)

---

## v0.6.12

Released: 2026-02-20

## What's Changed

## Changes since last production release

- Prolific system review: fix V4 gateway, domain consistency, status guards, bonus V4 support, dead code cleanup (4d9a7286)
- Fix Prolific real-time tracking by forwarding deploymentId through gateway redirects (84a791f1)
- Fix Prolific study pause/resume/stop 502 errors for AWAITING_REVIEW status (fbe33a38)

---


[View all v0.6 releases →](/release-notes/v0.6)

## Previous Versions

- [v0.5 releases](/release-notes/v0.5)
- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
