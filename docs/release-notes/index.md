---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

## v0.5.17

Released: 2026-02-02

## What's Changed

## Changes since last production release

- Fix state reordering within groups not persisting (058d4bd7)
- Fix Prolific "Invalid access token" error by switching to v2 gateway (82377e18)
- Fix Prolific org shared key not loading workspaces (ae8ee241)
- Fix TTL device status not auto-detecting on Bridge connect (b3c76fcc)
- Simplify bridgeService for single-message Bridge protocol (753779d3)
- Fix 404 error by using correct /api/experiments/v3 endpoint (7504da24)
- Use uppercase device types for consistent Bridge response format (db96117a)
- Fix Bridge response handling to buffer data before ack (80879494)
- Update bridgeService to handle Bridge v0.8.8+ status response format (3c396eae)
- Fix TTL and Kernel device connection detection in bridgeService (3717b156)
- Fix needsDeviceSetup undefined error in handleBackendSetupComplete (cb70b7e3)
- Integrate unified DeviceSetupManager into ExperimentRunner (5f59d6ec)
- Simplify device integration with flat data structure and DeviceCard UI (e96aaf6f)
- Remove Kernel forwarding tests from dataServiceV2 (moved to deviceStore) (47420fdb)
- Add unified device management system for experiment hardware integration (5da81d52)

---

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


[View all v0.5 releases →](/release-notes/v0.5)

## Previous Versions

- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
