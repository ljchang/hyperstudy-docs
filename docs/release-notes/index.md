---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

## v0.6.9

Released: 2026-02-18

## What's Changed

## Changes since last production release

- Fix Kernel and TTL device status check ignoring Bridge "Connected" response (65dc227b)
- Fix Neon Bridge integration: race condition, recording order, and gaze setup (6a5cedcf)
- Fix question buttons clipped when preview panel is open in Instructions tab (ed0cee4d)

---

## v0.6.8

Released: 2026-02-17

## What's Changed

## Changes since last production release

- Fix sessionRecorder mock missing addParticipantToRoom and createOrUpdateRoom (0770d0d4)
- Hide completed rooms in deployment tracker and allow reactivation (1c7cff8c)
- Fix participants not appearing in data management panel (ef2dfca5)
- Fix 3 failing emulator tests after recent refactors (b1bdb5e4)
- Upgrade API keys route to use resourcePermissions for auth checks (ee9b7573)
- Fix deployment participant counter never incrementing (647d4169)
- Remove legacy permission fallbacks and clean up stale data paths (b838b161)
- Fix comprehension data leaking across rooms via lobbySessionId stamping (33ded8c3)
- Fix tab overflow in data management panel by adding flex-wrap (fc8b0094)
- Fix experiment tracker showing wrong completion info for finished sessions (530129a4)

---

## v0.6.7

Released: 2026-02-16

## What's Changed

## Changes since last production release

- Fix Pupil Neon connection bugs and simplify setup UI (b967601f)
- Streamline Neon REST connection: Bridge resolves hostname internally (54366fa1)
- Wire up Frenz EEG event/marker sending via bridge LSL (43611739)
- Fix gaze overlay not working due to LSL data not reaching frontend (ac222bdd)
- Remove auto-select fallback for global component tabs (5226f7c3)
- Fix GlobalComponentConfigurator showing wrong config schema for selected component (e86d9252)
- Hide GazeOverlay from global components UI when Pupil Neon is disabled (851d4691)
- Fix global component config saving to wrong component on tab switch (713c54bf)
- Move Neon recording option into DeviceCard component (a68b9eb1)
- Fix Pupil Neon bridge protocol mismatches and add recording config (d582f344)
- Set emailVerified on approval and surface re-enable failures (9f57e33b)
- Fix device event ordering and async cleanup in experiment lifecycle (9887e9b0)
- Fix registration failure for orphaned Firebase Auth users (72889afd)
- Register GazeOverlay as a global component with configurable trail (206e48a4)
- Deploy dev TLSStore in shared deployment workflow (4dcb08bf)
- Block unapproved experimenters at registration and API level, remove dead auth code (2750aac9)
- Add Pupil Labs Neon eye tracker integration (b07307d7)
- Fix post-experiment questionnaire selection highlighting, data shape, and back navigation (b68660e2)
- Harden auth system: fix race conditions, remove dead code, add tests (d0d2b59d)

---


[View all v0.6 releases →](/release-notes/v0.6)

## Previous Versions

- [v0.5 releases](/release-notes/v0.5)
- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
