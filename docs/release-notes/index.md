---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

## v0.6.10

Released: 2026-02-19

## What's Changed

## Changes since last production release

- Fix emulator tests: create deployments without org for non-owner rejection tests (83c06342)
- Fix deployment emulator test error messages for unified permissions (5ce63813)
- Fix tests for read-only mode permission refactor (f751a141)
- Add read-only mode for Data Manager, Media Manager, and Deployments (a815ad50)
- Fix error toast for view-only users opening ExperimentDesigner (ca6f9b47)
- Register LikertScaleComponent in ExperimentRunner (2825d256)
- Fix instructions tracker visibility and effect_update_depth_exceeded error (bf8bb73e)
- Emit tracker update on lobby session creation (consent visibility fix) (f4c1dd59)
- Fix session completion race condition (SESSION_COMPLETED 401 error) (c3e84231)
- Fix fix-hls-status script to check both s3Key and docId HLS paths (c3e7f5ef)
- Fix HLS 403 by deriving manifest filename from input stem (47edb26e)
- Fix HLS silent failure by adding safety timeout and progressive fallback (28df995f)
- Replace Firestore onSnapshot with REST + Socket.IO in DeploymentTracking (feb08a2b)
- Fix square top corners on expanded active deployment cards (78efb209)
- Fix cloudFrontService test mock missing logger.info and logger.warn (83ca8363)
- Replace REST+WebSocket tracking with Firestore onSnapshot for live session table (80f48031)
- Fix false reconnection overlay after waiting room matching (9346c512)
- Fix false reconnection overlay and CloudFront PEM key handling (0bd748fc)
- Fix HLS 403 from duplicate CloudFront signing params and move tracker notifications server-side (f056845c)
- Add deployment tracker: pre-experiment visibility, session interventions, and messaging (63438474)
- Fix remaining emulator test failures across 8 test files (430e478f)
- Fix emulator tests: rename sessionId to roomId in test helpers (c8c1e253)
- Fix mediaPreloader progress tracking test (5b94afa9)
- Fix Firefox hang during multi-person experiment with HLS on S3 (692c5842)
- Fix 25 failing CI tests across 6 frontend test files (496c8323)
- Remove participations collection and migrate history to participantSessions (7210772d)
- Upgrade Storybook v8 to v10 to resolve @sveltejs/vite-plugin-svelte v6 peer dependency conflict (5e972c6d)
- Eliminate dual-writes, deprecate participations, and optimize downstream reads (da0e4ad9)
- Leverage V4 sessions for deployment tracking, permission caching, and Prolific gateway (3e067c7e)
- Clean up stale sessionId references missed in roomId consolidation (6d1ca24e)
- Consolidate participant sessions and rename sessionId to roomId on events (682bee31)
- Update dependencies across all workspaces (6ac59886)
- Fix Prolific deployment issues and add HLS-aware video URL generation (40fc2916)
- Add tests for gaze calibration and sharing, fix effect_orphan in gazeShareService (4792ee0f)
- Add gaze calibration, require-calibration config, and multi-participant gaze overlay (1a00c34b)
- Fix gaze overlay not rendering by handling varied bridge data formats (b5e1ccad)

---

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


[View all v0.6 releases →](/release-notes/v0.6)

## Previous Versions

- [v0.5 releases](/release-notes/v0.5)
- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
