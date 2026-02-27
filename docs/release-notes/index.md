---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

## v0.6.25

Released: 2026-02-27

## What's Changed

## Changes since last production release

- Update invitation service test to expect deploymentId field (6c163892)
- Hide Send Invite button when participant already exists on platform (d212b088)
- Fix email invitation flow for private experiment participants (87e2e4ae)
- Fix participant 403 on experiments accessed via public deployment links (0d14765f)

---

## v0.6.24

Released: 2026-02-26

## What's Changed

## Changes since last production release

- Restore lcov reporter removed during coverage config changes (8805ad9f)
- Raise frontend test coverage from 45% to 71% with 5,700+ new tests (d306d3a4)
- Fix experiment designer WebSocket disconnect/reconnect bugs (8594eae7)
- Fix un-centered submit buttons in AudioRecordingComponent (fb49a363)

---

## v0.6.23

Released: 2026-02-25

## What's Changed

## Changes since last production release

- Fix backend Docker build failure caused by UID/GID 1000 conflict (0a66245f)
- Remove exposed credentials from tracking, harden Traefik, and clean up dead code (63076008)
- Fix memory leaks, harden security, and optimize monitoring infrastructure (79ad2ddc)
- Fix deploymentId data visibility bug, OOM-kill cascade, and data loss on crash (dfd926bc)
- Make gaze consumption layer device-agnostic with activeGazeService router (5cc8e4e0)
- Integrate metrics pipeline and restructure Usage & Billing dashboard (49b72c34)
- Fix Prometheus crash: replace wildcard rule_files glob with explicit paths (6a9242f4)
- Add Prometheus scrape annotations to backend StatefulSet (93f1f5ed)

---


[View all v0.6 releases →](/release-notes/v0.6)

## Previous Versions

- [v0.5 releases](/release-notes/v0.5)
- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
