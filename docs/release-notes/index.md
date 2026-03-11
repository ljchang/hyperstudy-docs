---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

## v0.6.34

Released: 2026-03-11

## What's Changed

## Changes since last production release

- Fix recordWhenHidden videochat recording unreliability (b67c1e1e)
- Remove dead Firebase upload path and clean up webhook handler (0bb6bd4b)
- Fix role-specific configs storing full copies instead of deltas (de72d7c3)
- Fix CountdownTimer not ticking and add countdown support to LikertScale (4ad7b8e1)
- Fix duplicate component.response events in questionnaire and instructions contexts (731f5f9b)
- Fix recording offset race condition and missing recording events (0bb21476)
- Fix room participant count using subcollection data instead of drifted denormalized counter (e5b83cac)
- Fix completion code recording for non-Prolific participants (12622c26)

---

## v0.6.33

Released: 2026-03-10

## What's Changed

## Changes since last production release

- Fix DeploymentsTable tests failing due to stale cache between test runs (7c34bcee)
- Fix owner name resolution and consolidate user display name logic (79f4677d)
- Cache deployments data in singleton store to eliminate loading spinner on breadcrumb navigation (cf601521)
- Fix recordings cache staleness and add speaker detection diagnostics (52e5a5f8)
- Fix role-specific behavior ignored due to stale experiment-level configMode (dc66a365)
- Fix missing authorization header in external user search (6d257f9e)
- Fix broken audio level meter during device setup (99268790)
- Add completionOutcome tracking to experiment sessions (c5d033c0)
- Fix normalizeRecordingStatus to separate STARTING from ACTIVE (654f89de)
- Fix recording event timestamps round 2: duration, offset, and duplicate events (71fa01d4)
- Fix recording events to use authoritative LiveKit capture timestamps (237aca18)
- Fix silence event emit to match original LiveKit behavior (ca193be5)
- Patch LiveKit silence detection to use shared AudioContext (9b671897)
- Fix dev deployment timeouts from resource exhaustion (6f8c451d)
- Fix LiveKit audio track ended loop from duplicate getUserMedia stream (f32ad8fd)
- Fix pre-buffer duplicate URL loss, upgrade livekit-client, improve freeze diagnostics (4d73255e)
- Fix HLS worker race condition and LiveKit AudioContext UI freeze (82b72e79)
- Fix measureLatency tests using wrong socket object (3148a495)
- Guard LogRocket initialization to production only (b39584be)
- Fix sparse rating UI freeze from redundant persistence and resume contention (4ce987a7)
- Fix measureLatency() using wrong socket and event name (18c8f228)
- Fix HLS.js main-thread transmuxing freezes and pre-buffer video display (10e55c44)
- Add missing mock methods for claimPreBufferedHls and attachHlsEventHandlers in ShowVideoComponent test (d483fa3a)
- Fix HLS.js worker blocked by missing CSP worker-src directive, filter HLS from LogRocket (d4bd2741)
- Add HLS pre-buffering and fix stimulusMappings preload gap (690405ee)
- Replace || with ?? for numeric input bindings to stop masking valid 0 values (4f579e26)
- Fix dataServiceV4 test: avoid microtask yield when no in-flight promises (442241cd)
- Fix nested path updates failing in designer WebSocket, add metadata save diagnostics (69333778)
- Fix main thread freeze, V4 event flush race condition, and HLS startup thrashing (28de9c4f)
- Fix spurious batch events on rating clicks, add HLS freeze diagnostics, re-enable Sentry/LogRocket (93b98258)
- Switch dev SSL cert from DNS-01 to HTTP-01 challenge to fix expired cert (bd30fb08)
- Defer Sentry init during experiments to fix periodic main thread freezes (fac62d8f)
- Fix video autoplay during sparse rating pauses, defer LogRocket during experiments (5668afb5)
- Add deeper instrumentation to diagnose UI freeze trigger points (364e2fd5)
- Add main thread freeze monitor, fix logger perf, restore RapidRate transition (d7ea7493)
- Fix ActiveSpeakersChanged test to account for single-participant guard (801fd225)
- Fix SparseRating modal lag caused by VideoChat reactive overhead (b94c0ac6)
- Fix participant reconnection not working after disconnect (5bf051fb)
- Fix WaitingRoom test: fire joined-waiting-room event before asserting timer (0fbe5569)
- Fix questionnaire components missing data and inconsistent submit UX (5f16f9f5)
- Fix Prolific completion code mappings and add server-side write for offline participants (3a319b83)
- Show remaining time countdown in waiting room instead of elapsed time (95fca820)
- Fix VideoChat black video on uncollapse/unhide and reduce UI lag (b5c72688)
- Fix video recording timestamps and eliminate duplicate completion events (38e34a2e)
- Surface participant disconnections in deployment tracking table (28666eaa)
- Reduce experiment runner UI lag: eliminate redundant reactive updates (525b4d5a)
- Fix systematic UI lag from LiveKit participant state update cascades (71edc4d9)
- Fix sparse rating UI lag from redundant reactive cascades (48e6fc14)
- Fix VideoChat collapse: black video on uncollapse and blocked header clicks (87c77258)
- Replace sparse rating client polling with server-driven pause timers (36f3b0ba)
- Fix ExperimentRunner test mock missing dataServiceV4.flush (7e25f1b1)
- Fix sparse rating missing pauses on second video and countdown UI lag (b00d6cc9)
- Fix VideoChat black video on uncollapse, add recordWhenHidden config (b6529357)
- Fix sparse rating timeout tests to account for 2s server buffer (00a87ac5)
- Fix LiveKit video black after VideoChat uncollapse (a7e4ee8d)
- Fix experiment designer loading failures (4 Sentry bugs) (1376a79b)
- Fix sparse rating modal freeze and data loss, add pause diagnostics (86590a16)
- Fix sparse rating reliability: restore blocking init and eliminate reactive cascades (fb654dd5)
- Fix video sync effect not re-running on collapse/uncollapse (b35e7ba0)
- Eliminate sparse rating schedule pre-fetch in favor of server-driven pause events (97a79631)
- Fix sparse rating modal race condition and reliability bugs (048a6fba)
- Fix LiveKit video not showing after collapse/uncollapse (ac6bb17b)
- Revert v0.6.32 commits to restore v0.6.31 stability (9dcbefac)

---

## v0.6.32

Released: 2026-03-05

## What's Changed

## Changes since last production release

- Fix non-Prolific participants showing COMPLETED_NO_CODE completion status (c1a07c4e)
- Merge branch 'worktree-rosy-sleeping-pascal' into dev (640e7a62)
- Merge branch 'worktree-peppy-forging-umbrella' into dev (9f696358)
- Fix Prolific participant stuck state and completion code bugs (1b268280)
- Fix questionnaire data recording reliability for non-text components (bc471004)
- Fix recording events missing from CSV export and recording duration overshoot (6f407701)

---


[View all v0.6 releases →](/release-notes/v0.6)

## Previous Versions

- [v0.5 releases](/release-notes/v0.5)
- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
