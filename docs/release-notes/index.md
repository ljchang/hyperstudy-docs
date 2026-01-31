---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

## v0.5.16

Released: 2026-01-31

## What's Changed

## Changes since last production release

- Standardize media visibility field and integrate resourcePermissions (053aba5c)

---

## v0.5.15

Released: 2026-01-30

## What's Changed

## Changes since last production release

- Fix video duration for HLS videos in sparse rating component (4e2b0de8)
- Fix experiment save allowing states without transition types (b3801a75)

---

## v0.5.14

Released: 2026-01-30

## What's Changed

## Changes since last production release

- Fix LiveKit webhook lookup for individual participant recordings (a8189fb1)
- Fix sparse rating pause times for videos with startTime > 0 (c1585da3)
- Fix TTL trigger bridge protocol mismatch (085499f7)
- Fix sparse rating duration, negative onset clamping, and recording events (c65542e7)
- Fix event timing for reused rooms by resetting firstStateStartedAt (fbb0694e)
- Fix sparse rating sampling for short videos with stratified distribution (e5853aa9)
- Fix event timing accuracy and data management UX improvements (3697473b)
- Fix experimentStore test mock missing logger.debug method (c8fdb156)
- Fix event timing accuracy for neuroscience research (f83b1f4e)
- Fix LiveKit egress webhook roomName extraction using snake_case fields (09859693)
- Consolidate LiveKit routes and fix duplicate webhook events (98bb90e9)
- Fix device setup requesting permissions before enumerating devices (c97c5cd4)
- Fix LiveKit device setup showing empty dropdowns (088f148a)
- Fix LiveKit webhook routing for HTTPS requests in dev (05f72c3d)
- Fix LiveKit webhook delivery in dev environment (3b347b88)
- Remove TLS section from webhook IngressRoute to match production pattern (7890d5cf)
- Fix LiveKit webhook delivery in dev by adding Host-agnostic IngressRoute (14798d8a)
- Fix recording events and timing issues (99405c03)
- Fix egress webhooks being silently ignored due to room name extraction (158f8261)
- Fix Prolific API key fallback for non-owner organization members (2a782609)
- Fix recording event onset timing, participant ID extraction, and missing organizationId (978fdb20)
- Fix emulator tests for getExperimentStartTime → getContentStartTime rename (e4dd5e26)
- Fix sparse ratings, recording events, onset timing, and experiments table (0c0f048b)
- Remove experimentStartedAt, use firstStateStartedAt everywhere (b95fbf3f)
- Fix sparse rating reconnection bugs: video position and rating re-triggers (6afe5a7a)
- Fix webhook event data loss and add recording lifecycle events (6418a0f9)
- Fix recording event logging and disable composite recording (3a3e8bc7)
- Fix invited members seeing 'Account Pending Approval' screen (7b22a469)
- Fix data processor fallbacks, participant ID normalization, and completion codes (2ac0ce5b)
- Add video.recording.started event and recording offset tracking (47205c6f)

---


[View all v0.5 releases →](/release-notes/v0.5)

## Previous Versions

- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
