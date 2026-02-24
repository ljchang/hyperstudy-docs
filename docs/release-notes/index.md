---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

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

## v0.6.18

Released: 2026-02-23

## What's Changed

## Changes since last production release

- Fix data leak on account switch and cross-org visibility for org admins (037a93fa)
- Fix folder PUT handler ignoring permission field, breaking cascade (84d5e17c)
- Fix Kernel Flow not receiving experiment lifecycle events (70be8b90)
- Add composite index for cross-org public resource permission queries (552cd2ef)
- Fix Access column field mismatch and add cross-org debug logging (53a16a8a)
- Fix cross-org visibility for public images, folders, and videos (a8a8eb00)
- Fix image folder visibility field name mismatch and add cross-org query resilience (05bba06a)
- Enable public access toggle for image and video folder permissions (c7f33652)
- Fix public media not visible to non-organization members (dd271065)
- Fix email template formatting and enforce consistent branding (bfc10c56)
- Fix video playback CORS error for cross-member experiment deployments (1c7dea2b)
- Add batch dismiss endpoint to fix slow Clear All notifications (c3823b57)
- Fix new experimenters seeing all historical release note announcements (4eddd7d3)
- Fix cross-org media access for shared/public experiments (eb50669d)
- Fix public experiments not visible to members of other organizations (3f943c41)
- Add PROLIFIC_GATEWAY_SECRET to deployment pipeline (c4967650)

---

## v0.6.17

Released: 2026-02-22

## What's Changed

## Changes since last production release

- Add missing stateManager lock mocks to waiting room emulator tests (54937808)
- Fix waiting room re-matching loop in multi-pod deployments (1081908a)

---


[View all v0.6 releases →](/release-notes/v0.6)

## Previous Versions

- [v0.5 releases](/release-notes/v0.5)
- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
