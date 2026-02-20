---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

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

## v0.6.11

Released: 2026-02-19

## What's Changed

## Changes since last production release

- Remove unreliable active sessions count from collapsed deployment cards (880afd9c)
- Fix participant messaging: use socketMap instead of socket.roomId (53a4a8b7)
- Restyle participant messaging button as Help pill above Feedback button (4213f55d)
- Disconnect LiveKit on experiment completion and add redirect countdown timer (5fb7d8b9)
- Add cancel/remove actions for private recruitment invitations and assignments (82107d67)
- Fix effect_update_depth_exceeded in InstructionsQuestionBlock (4d52de6e)
- Fix HLS video loading: switch MediaConvert to SINGLE_DIRECTORY (f589bfa6)
- Fix duplicate experiment IDs causing Svelte each_key_duplicate crash (75a3fd49)

---


[View all v0.6 releases →](/release-notes/v0.6)

## Previous Versions

- [v0.5 releases](/release-notes/v0.5)
- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
