---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

## v0.6.36

Released: 2026-03-13

## What's Changed

## Changes since last production release

- Fix ghost states from duplicate state IDs in experiment designer (662a8220)
- Fix Escape key in API key modals by using window-level handler (cbe9a0f9)

---

## v0.6.35

Released: 2026-03-12

## What's Changed

## Changes since last production release

- Add Escape key support to close custom modals (b523d503)
- Add write/admin scopes to API key generation (afabdf9d)
- Fix backend Docker build missing shared/ directory and roles format in test (faa35f70)
- Fix emulator tests for component type validation (9f7d2037)
- Fix  alias resolution in Docker build and CI tests (d886858b)
- Add per-component JSON Schema validation (Phase 4) (a152ef73)
- Add V3 experiment CRUD routes with API key authentication (f80f2331)
- Fix experiment import rejecting valid component types and add schema-driven validation (ac1cc714)
- Fix submit button visibility on MultipleChoice, Ranking, and RapidRate components (6d33e80a)
- Clean up HLS video playback technical debt (f8d49c0b)
- Fix CollaboratorCursors infinite effect loop and toFixed type errors (032355f1)
- Add multi-layer video error recovery to prevent experiment freeze (34ce4784)
- Fix EventProcessor state lookup mismatch causing confused component names (6fea3b34)

---

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


[View all v0.6 releases →](/release-notes/v0.6)

## Previous Versions

- [v0.5 releases](/release-notes/v0.5)
- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
