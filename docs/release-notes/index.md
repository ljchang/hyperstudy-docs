---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

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

## v0.5.8

Released: 2026-01-19

## What's Changed

## Changes since last production release

- Fix MediaConvert HLS transcoding - add required segmentsPerSubdirectory (0774a86b)
- Fix: Add organizationId to multipart upload video document (06f55593)
- Fix security and error handling in multipart upload (2eb512aa)
- Add multipart upload support for large video files (>100MB) (2cd11949)
- Increase video upload size limit from 5GB to 10GB (445b824f)
- Add resource permissions migration script (6bf22745)
- Fix emulator tests to use dynamic plan values from plans.js (584d8dee)
- Consolidate monitoring dashboards from 10 to 3 (e6b7149e)
- Add sync-quotas migration script for updating organization quotas (cc83ef55)
- Update usage tracking tests for new Pro plan quotas (431f7fea)
- Fix invite member modal to use correct API endpoint (636b4327)
- Update plan quotas and video upload limits (a641b231)

---


[View all v0.5 releases →](/release-notes/v0.5)

## Previous Versions

- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
