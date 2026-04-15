---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

## v0.6.57

Released: 2026-04-15

## What's Changed

## Changes since last production release

- fix: guard videoElement and participant null-derefs surfaced in Sentry (348c9f26)
- fix: close speaker-test AudioContext so Continue doesn't hang after audio check (631f93a6)
- fix: don't swallow space bar in questionnaires containing a rapid-rate question (517fdc38)

---

## v0.6.56

Released: 2026-04-14

## What's Changed

## Changes since last production release

- revert two-phase rejoin drain + remove pause banner (7616ecdd)
- refactor: collapse redundant guards in handleResumeReady (569c1a55)
- fix: symmetric resume handshake + drop reconnect overlay backdrop (1c2710e5)
- fix: pause host video on rejoin into an active pause window (d7ae3864)
- fix: preserve pre-disconnect playback state across rejoin window (4b092985)
- fix: server-authoritative host, fast reconnect, and camera recovery (2eafd68d)
- fix: unified rejoin contract with per-participant disconnect timers (a1d27375)

---

## v0.6.55

Released: 2026-04-10

## What's Changed

## Changes since last production release

- fix: remove org branding from experiment runner, left-align in waiting room (fbabace0)

---


[View all v0.6 releases →](/release-notes/v0.6)

## Previous Versions

- [v0.5 releases](/release-notes/v0.5)
- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
