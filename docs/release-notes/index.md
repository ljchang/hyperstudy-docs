---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

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

## v0.5.5

Released: 2026-01-17

## What's Changed

## Changes since last production release

- Fix LocalStack CI flakiness: use docker run instead of service container (1a919e94)
- Add real-time collaboration for experiment designer (Phase 1) (81f25cb1)
- Remove HTTP auto-save fallback from ExperimentDesigner (7f64e0c2)
- Fix memory leak: cleanup debounce timeout on unmount (ec5534cc)
- Fix double-save: use setLocalField for WebSocket mode (6cb9ffd3)
- Fix questionnaire not persisting - autoSave.experiment is getter-only (91c49c41)
- Fix questionnaire debounce race condition losing new questions (ddd1ece6)
- Fix PostExperimentQuestionnaire input not working with WebSocket mode (8fa6782f)
- Fix platform admin permissions for experiments, media, and data access (78d9f4a5)
- Fix PostExperimentQuestionnaire input not working with WebSocket mode (93621598)
- Add V4 Participant API with session-based authentication (9a5ed15c)
- Exclude LocalStack tests from main test suite (ca123ec7)
- Update package-lock.json with LocalStack testing dependencies (e22abded)
- Add LocalStack AWS testing infrastructure and MediaConvert Lambda unit tests (6e003651)
- Use absolute paths for release notes links in Docusaurus (052a66aa)
- Fix relative links in release notes index - remove ./ prefix (51a412d5)
- Fix version sorting and awk pattern for release notes index (51ac630f)
- Add auto-regeneration of release notes index.md (79387977)

---


[View all v0.5 releases →](/release-notes/v0.5)

## Previous Versions

- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
