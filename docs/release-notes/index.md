---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

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

## v0.6.48

Released: 2026-04-01

## What's Changed

## Changes since last production release

- fix: add participantServiceV4 mock to ExperimentRunner tests (4b24c35f)

---


[View all v0.6 releases →](/release-notes/v0.6)

## Previous Versions

- [v0.5 releases](/release-notes/v0.5)
- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
