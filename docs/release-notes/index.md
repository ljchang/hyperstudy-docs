---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

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

## v0.5.9

Released: 2026-01-20

## What's Changed

## Changes since last production release

- Fix TriggerComponent tests to use keydown instead of keypress (b1957826)
- Fix WebSocket not connecting after experiment creation (98b7a053)
- Code review fixes: remove unused code, add button types, use keydown (135cbb06)
- Redesign Trigger component UI with new Receive Then Send mode (b6023e03)
- Fix experiment creation not saving all config fields (681bc63a)
- Fix WebSocket race condition and undefined disconnectTimeout errors (5d37fd74)
- Fix metadata changes failing for new experiments (93f69568)
- Fix experiment creation failing due to missing WebSocket connection (cd0570cb)
- Fix tests to use visibility field after permission field consolidation (17e2288b)
- Fix visibility field mismatch causing participants to not see public experiments (d8d0386c)
- Complete WebSocket migration for experiment designer (0f47cde9)
- Fix storage metrics queries to deduplicate by type (9ceab839)
- Add Usage & Billing dashboard to Grafana configmap (e5aa9b87)
- Add prometheus aggregation rules with proper subquery syntax (10e6f4c0)
- Fix prometheus rules syntax and workflow --repo flag (65ed44ca)
- Fix missing --repo flag in gh run list commands in promote workflow (f9dac5ea)

---


[View all v0.5 releases →](/release-notes/v0.5)

## Previous Versions

- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
