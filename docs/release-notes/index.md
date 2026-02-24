---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

## v0.6.21

Released: 2026-02-24

## What's Changed

## Changes since last production release

- Fix flush race condition, options override, and recording filenames (9f469e77)

---

## v0.6.20

Released: 2026-02-24

## What's Changed

## Changes since last production release

- Fix multi-page questionnaire responses from page 2+ not being recorded (5fefdd96)
- Include recording media files in Download All zip (fb46c9e3)
- Fix missing questionnaire responses for text input questions (049b3c9c)
- Add missing data types to Download All: participants, questionnaire, comprehension (fbf326fa)
- Switch Download All Data from lossy CSV to raw JSON (c9beb257)
- Fix questionnaire badge count and move jszip to runtime dependencies (813254bb)
- Fix V3 processors crashing on missing Firestore indexes and Prolific completion codes (06b44de2)

---

## v0.6.19

Released: 2026-02-24

## What's Changed

## Changes since last production release

- Add EyeLink 1000 Plus frontend integration (6def85ae)
- Fix Prolific completion codes returning ABANDON instead of SUCCESS (977acdd1)
- Fix Prolific sending ABANDON codes instead of correct completion codes (ca8605f3)
- Fix questionnaire preview not syncing to selected page tab (b266ec06)
- Fix EventProcessor not reading componentType from V4 event.data (a469d6b4)
- Fix questionnaire events not recording due to session status rejection (7abb984c)
- Redesign PostExperimentQuestionnaire editor UI (f16b801b)
- Fix Prolific "Unknown Code" on researcher dashboard (31ba184a)
- Add ENCRYPTION_KEY to deployment pipeline (43e57d01)

---


[View all v0.6 releases →](/release-notes/v0.6)

## Previous Versions

- [v0.5 releases](/release-notes/v0.5)
- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
