---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

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

## v0.5.10

Released: 2026-01-20

## What's Changed

## Changes since last production release

- Fix ExperimentsTable search to use substring matching (3d5b5190)
- Fix V3 API participant data access to use roomId from query params (3fe66a86)
- Fix dataAccessControl to support both inline and Firestore org checks (b6f7ef10)
- Update DataDownloader documentation to reflect V3 API migration (7903ba01)
- Add BridgeTriggerSetup component and Storybook documentation (7d16bfc9)
- Clean up dead code and migrate to V3 APIs (1b52d7ad)
- Use TabGroup component for trigger mode selection (4b651061)
- Fix V3 API permission issues for organization administrators (22ad0671)

---


[View all v0.5 releases →](/release-notes/v0.5)

## Previous Versions

- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
