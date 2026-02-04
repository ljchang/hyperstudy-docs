---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

## v0.5.20

Released: 2026-02-04

## What's Changed

## Changes since last production release

- Fix experimentImportService test to use updated requiredParticipants default of 1 (9c86389a)
- Fix VideoAdmin test to use updated visibility field name and default (3b106666)
- Eliminate global CSS and migrate numeric fallbacks to nullish coalescing (f0095604)
- Fix video visibility field name and default for new uploads (39dcfe16)
- Fix video ownership for multipart uploads (0b27fe65)
- Fix remaining || 2 fallbacks for requiredParticipants (88019f82)
- Remove unused CSS selectors from multiple components (6d9adf51)
- Fix waiting room showing wrong participant count for single-participant experiments (279c0f8e)
- Fix org admin permission for participant invitations (99a485dd)

---

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


[View all v0.5 releases →](/release-notes/v0.5)

## Previous Versions

- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
