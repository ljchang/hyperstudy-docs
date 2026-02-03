---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

## v0.5.19

Released: 2026-02-03

## What's Changed

## Changes since last production release

- Fix gear button visibility - use all:unset to clear global styles (d690bc28)
- Fix recruitment settings UI - search, gear visibility, and border (0dff4e83)
- Fix Prolific gateway auth error - reorder route registration (a0ce00a2)
- Fix gear icon visibility and allow unselecting all recruitment methods (f572dc9f)
- Fix MediaConvert HLS transcoding - IAM role and duration extraction (68d3490d)
- Fix recruitment card layout - move gear icon inside header (f63d5ede)
- Redesign recruitment configuration UI with focus mode and unified search (995cf414)
- Add multi-select recruitment methods and fix public experiments query (f839ca2b)
- Add missing index for V4 participant assignments query (076e17b1)
- Add debouncing to text inputs in experiment designer config editors (20af7f70)
- Fix EligibleRooms test to include loadExperiments mock (58effa21)
- Fix participants unable to see public experiments (13a65c24)
- Remove redundant video.recording.requested event (d0e8a611)
- Fix video duration not being captured in MediaConvert transcoding pipeline (3db6fb7d)
- Fix audio recordings not appearing in Data Management (91033c53)
- Fix spurious "Unknown error" in TTL Trigger Setup modal (295ea31c)
- Fix trigger and scanner pulse events not being recorded (daad999e)
- Fix org admin visibility for images/videos and modal blur issue (32aad81b)

---

## v0.5.18

Released: 2026-02-02

## What's Changed

## Changes since last production release

- Fix failing Prolific gateway tests (9fe1466b)

---

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


[View all v0.5 releases →](/release-notes/v0.5)

## Previous Versions

- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
