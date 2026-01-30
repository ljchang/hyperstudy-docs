---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

## v0.5.15

Released: 2026-01-30

## What's Changed

## Changes since last production release

- Fix video duration for HLS videos in sparse rating component (4e2b0de8)
- Fix experiment save allowing states without transition types (b3801a75)

---

## v0.5.14

Released: 2026-01-30

## What's Changed

## Changes since last production release

- Fix LiveKit webhook lookup for individual participant recordings (a8189fb1)
- Fix sparse rating pause times for videos with startTime > 0 (c1585da3)
- Fix TTL trigger bridge protocol mismatch (085499f7)
- Fix sparse rating duration, negative onset clamping, and recording events (c65542e7)
- Fix event timing for reused rooms by resetting firstStateStartedAt (fbb0694e)
- Fix sparse rating sampling for short videos with stratified distribution (e5853aa9)
- Fix event timing accuracy and data management UX improvements (3697473b)
- Fix experimentStore test mock missing logger.debug method (c8fdb156)
- Fix event timing accuracy for neuroscience research (f83b1f4e)
- Fix LiveKit egress webhook roomName extraction using snake_case fields (09859693)
- Consolidate LiveKit routes and fix duplicate webhook events (98bb90e9)
- Fix device setup requesting permissions before enumerating devices (c97c5cd4)
- Fix LiveKit device setup showing empty dropdowns (088f148a)
- Fix LiveKit webhook routing for HTTPS requests in dev (05f72c3d)
- Fix LiveKit webhook delivery in dev environment (3b347b88)
- Remove TLS section from webhook IngressRoute to match production pattern (7890d5cf)
- Fix LiveKit webhook delivery in dev by adding Host-agnostic IngressRoute (14798d8a)
- Fix recording events and timing issues (99405c03)
- Fix egress webhooks being silently ignored due to room name extraction (158f8261)
- Fix Prolific API key fallback for non-owner organization members (2a782609)
- Fix recording event onset timing, participant ID extraction, and missing organizationId (978fdb20)
- Fix emulator tests for getExperimentStartTime → getContentStartTime rename (e4dd5e26)
- Fix sparse ratings, recording events, onset timing, and experiments table (0c0f048b)
- Remove experimentStartedAt, use firstStateStartedAt everywhere (b95fbf3f)
- Fix sparse rating reconnection bugs: video position and rating re-triggers (6afe5a7a)
- Fix webhook event data loss and add recording lifecycle events (6418a0f9)
- Fix recording event logging and disable composite recording (3a3e8bc7)
- Fix invited members seeing 'Account Pending Approval' screen (7b22a469)
- Fix data processor fallbacks, participant ID normalization, and completion codes (2ac0ce5b)
- Add video.recording.started event and recording offset tracking (47205c6f)

---

## v0.5.13

Released: 2026-01-26

## What's Changed

## Changes since last production release

- Fix platform admin queries and update org delete tests (f69abcd8)
- Remove test for personal org delete restriction (f7e299a6)
- Fix organization delete issues and allow personal org deletion (136f53e6)
- Add delete button to organization table rows (2515efd7)
- Fix authService tests missing user.reload() mock (f77bbb4b)
- Add organization rename and delete for Platform Admin (329b3e61)
- Fix non-invited users being auto-approved as experimenters (2c8c2a25)
- Fix navigation buttons missing detail wrapper in auth routes (4ba02ce7)
- Match Platform Admin logout button styling to Experimenter dashboard (fda9c9ac)
- Fix email verification status not updating for invited users (cd18a2d2)
- Add comprehensive debug logging to invitation auto-approval flow (60da9c3d)
- Add debug logging for invitation registration flow (d44ab056)
- Fix race condition preventing auto-approval of invited experimenters (8acd5ec0)
- Remove hourglass icon from pending approval screen (d8bce053)
- Add invite user button to platform admin users section (68993db0)
- Add migration to set all experiments to organization visibility (08553a8a)
- Add visibility indexes and consolidate Firestore index files (c42a5319)
- Fix grantPermission to return existing permission instead of throwing (9e87fa21)
- Fix org member visibility for organization-scoped experiments (d73d4493)
- Update platform admin user invite modal for org-based invitations (e5901780)
- Add org key visibility for members and key preference toggle (62c81758)
- Fix emulator test status code expectations for V3 permission endpoints (3323d5e3)
- Unify permission system across all resources (images/videos/folders) (7ebc4d31)
- Add organization sharing toggle to API Key Manager (71c8fb08)
- Fix emailRoutes emulator test for updated invite-user endpoint (6f90e195)
- Fix Prolific test mocks: update API key format and error message assertion (09d4477e)
- Fix orgInvitationRoutes test: add missing requireExperimenterOrAdmin mock (dd583448)
- Consolidate invitation system and add experiment participant invitations (bd9ee0d9)
- Move Clear All button to top of notifications panel (110f8974)
- Fix experimenter registration flow for pending approval (a0895e74)
- Fix organization invitation links for multi-tenant system (fa91ffae)
- Fix Prolific workspace loading error and add organization API key sharing (58a107f1)

---


[View all v0.5 releases →](/release-notes/v0.5)

## Previous Versions

- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
