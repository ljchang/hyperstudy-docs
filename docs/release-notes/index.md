---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

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

## v0.5.12

Released: 2026-01-22

## What's Changed

## Changes since last production release

- Fix ProlificFilters: guard against undefined filterValues during render (14540683)
- Fix emulator tests for permission system changes (35833df4)
- Fix remaining test using removed POST /participants/assignments route (27f61740)
- Fix Prolific integration issues (8d5306d1)
- Fix emulator tests for removed routes and permission changes (e7f0e5f3)
- Fix missing logAuditEvent export causing dev deployment crash (7b0a6e9f)
- Fix Prolific tests to use new service layer mocks (f7d644bd)
- Prolific integration security fixes and refactor (db54354a)
- Fix org admin permission check for experiment access (5e6da217)
- Fix frontend tests for removed deprecated functions (3a6cdcf6)
- Codebase cleanup: remove dead code and legacy permission system (fa747211)
- Add experiment permissions diagnostic and repair scripts (98341db4)
- Fix signed URL flow for video preloading to prevent CORS errors (1eb7d3a6)
- Complete Phase 4 membership migration: remove legacy arrays, single source of truth (e7398e01)
- Add tests for new platform admin user management features (13a571ca)
- Add user management actions to Platform Admin users table (93124b8c)

---

## v0.5.11

Released: 2026-01-21

## What's Changed

## Changes since last production release

- Fix PlatformAdminDashboard test to expect 14 nav tabs (729ff624)
- Add Account Requests tab to Platform Admin and remove legacy admin dashboard (131268e4)
- Update settings UI to use green primary color and hide radio button dots (14598b03)
- Add migration script to fix experiments with deleted: undefined (9a562e8a)
- Fix permissions for platform admins and experiment participants (28415e49)

---


[View all v0.5 releases →](/release-notes/v0.5)

## Previous Versions

- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
