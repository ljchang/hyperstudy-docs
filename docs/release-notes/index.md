---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

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

## v0.6.6

Released: 2026-02-13

## What's Changed

## Changes since last production release

- Fix Comprehension tab accuracy for data-only questions and unscored event recording (c4cf8f43)
- Parallelize Firestore batch queries and add server-side deploymentId filter for data management (39147883)
- Fix Kernel Flow2 event delivery by serializing value field to string (a4d59329)
- Add Type column to data management Deployments table (4fef22e9)
- Fix experimenter account request flow showing Access Denied instead of Pending Approval (4ba1c6b0)
- Fix answer leaking between questions in InstructionsQuestionBlock (a4dcc501)
- Make Monitor button a toggle with highlighted active state (bf70a063)

---

## v0.6.5

Released: 2026-02-12

## What's Changed

## Changes since last production release

- Add opt-in monitoring for active deployment cards (cdc8921e)
- Fix effect_update_depth_exceeded and WaitingComponent console errors (f87509e1)
- Fix effect_update_depth_exceeded and parseTemplate warning spam (e8c4ca60)
- Fix lookup() to handle key-category stimulus mappings (7c698de9)
- Fix deployment API 500: handle Firestore Timestamps in sort (92e67b66)
- Fix bridgeService tests for structured Kernel event values (41d209fb)
- Fix Kernel Flow2 event forwarding: sync connection state and improve event data (bb75fdba)
- Fix deployment API 500 error and platform admin access (2539aee9)
- Fix Instructions page tab scrollbar artifact and Grant Access button sizing (5074f88c)
- Add key-category batch draw support for MultipleChoice image source (368f1ab1)
- Improve Instructions editor: drag-and-drop blocks, remove purple theme, fix Add Page button (41819245)
- Add inline question blocks, preview toggle, and changeable question types (a9bc0985)
- Fix empty folder picker and add help text for stimulus mappings (d7e97a8c)
- Fix emulator tests for org-level deployment permissions (bff22846)
- Fix Instructions test assertions after tab bar redesign (0abbe830)
- Integrate deployments into unified permission system (aad3006a)
- Fix cross-page question corruption and improve instructions designer layout (5d79241b)
- Fix low audio volume: add loudness normalization, raise bitrates and default volume (eef1a245)
- Add dynamic image selection for MultipleChoice component (3c2ecabc)
- Fix HLS video buffering: prefetch segments at startup, fix sync engine PID windup (b8e037c8)
- Add question preview to instructions designer preview panel (e67a2db4)
- Fix Kernel Flow fNIRS events silently dropped due to missing id field (96a78daf)

---


[View all v0.6 releases →](/release-notes/v0.6)

## Previous Versions

- [v0.5 releases](/release-notes/v0.5)
- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
