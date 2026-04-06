---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

## v0.6.51

Released: 2026-04-06

## What's Changed

## Changes since last production release

- fix: replace Storage.prototype spies with localStorage mocks for Node 25+ (08ecccce)
- fix: pause viewer video when host ends playback (5433204e)
- fix: correct events API pagination total count and add auto-pagination to Python client (5d924aec)
- fix: handle video rotation metadata in HLS transcoding (9764fb4d)
- fix: remove pause threshold and debounce that prevented viewer from pausing (b8563f75)
- fix: update sync engine test for removed EMA/onSync callback (c779eea4)
- fix: tune video sync engine for faster convergence and accurate latency (faf9e930)
- fix: prevent checkForSilence from hanging on Firefox (df190aeb)
- fix: don't block Phase 2 on AudioContext.resume() (11445bf9)
- fix: remove Phase 2 safety timers and move sync socket connection earlier (e0b6582a)
- fix: increase disconnect test delay to match 15s grace period (81d73ec6)
- fix: replace setTimeout-based sparse rating scheduling with video time checking (4ed08398)
- fix: update Firestore emulator port from 8080 to 8085 (6a15f7e3)
- Fix disconnect handling gaps and device setup bugs causing participants to get stuck (e1386dcb)

---

## v0.6.50

Released: 2026-04-02

## What's Changed

## Changes since last production release

- fix: revert awaited teardown to synchronous disconnect to fix CI unhandled rejection (5ff8cefe)
- fix: revert createSimpleMockSocket to original form to avoid global test side effects (971113a2)
- fix: reset mock socket connected state in afterEach to prevent stale connection timeout (1d3e15be)
- fix: move hasSignaledReady to module scope so setupSocketListeners can access it (e6e23112)
- fix: resolve socket reconnection race condition causing participants to get stuck on sync screen (95a423fa)

---

## v0.6.49

Released: 2026-04-02

## What's Changed

## Changes since last production release

- fix: move diagnostics and clock sync emit to actual initialization path (a6506a96)

---


[View all v0.6 releases →](/release-notes/v0.6)

## Previous Versions

- [v0.5 releases](/release-notes/v0.5)
- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
