---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

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

## v0.5.7

Released: 2026-01-18

## What's Changed

## Changes since last production release

- Fix deployment workflow and pod router configuration (fc8daf84)
- Fix pod router to support dynamic HPA scaling (fixes multi-participant sync) (a4a724b7)

---

## v0.5.6

Released: 2026-01-18

## What's Changed

## Changes since last production release

- Fix data permissions showing raw IDs instead of group names (10e0ff2c)
- Skip deprecated experimenterRoutes endpoint tests (f4200988)
- Fix: move logger import inside try-catch in experimenterRoutes (50abd39c)
- Fix logger reference error in getExperimenterExperiments deprecation warning (ae8591ff)
- Fix ExperimentsTable tests to use loadOrgExperiments mock (0ed38490)
- Migrate frontend to V3 experiment API for faster loading (3d96d508)

---


[View all v0.5 releases →](/release-notes/v0.5)

## Previous Versions

- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
