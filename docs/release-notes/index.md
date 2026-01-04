---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

### [v0.4.36] - 2025-12-02

2025-12-02


- Frontend cleanup: remove console statements, fix CSS and accessibility (0b6c8b29)
- Add CodeMirror 6 code editor for Code Execution component (8c382678)
- Add comprehensive test coverage for backend and frontend services (ce05878e)
- Remove 6 unused frontend files, update test coverage plan (824c8e8b)

[View all v0.4.x releases →](./v0.4)

---

### [v0.4.34] - 2025-12-01

2025-12-01


- Remove doc file in favor of GitHub issues #132, #133, #134 (0cfec36a)
- Add documentation for Firebase emulator test issues to fix (6fc10c3b)
- Skip componentProcessor pagination test due to undefined componentType (9be1f2fe)
- Skip emulator tests with Timestamp vs Date and undefined field issues (038d8c2c)
- Skip failing emulator tests due to incomplete mocking (52dd1ac1)
- Fix emulator tests: skip non-existent routes and fix data format issues (ff6644e4)
- Fix remaining emulator test issues (2c70cdf8)
- Fix remaining emulator tests (94ec1286)
- Fix emulator tests (6862d6a8)
- Add storage rules reference to firebase.json (86c5907b)
- Exclude integration tests from coverage run (e3572a35)
- Drop Node 18.x from frontend test matrix (2ec2745e)

### [v0.4.33] - 2025-12-01

2025-12-01

### [v0.4.30] - 2025-11-28

2025-11-28


- Fix experiment socket authentication (01b94912)

### [v0.4.28] - 2025-11-27

2025-11-27


- Update stimulus mappings documentation with new features (914be041)
- Add copy buttons to stimulus mapping code examples (5b124e5f)
- Fix dynamic URL input not triggering auto-save (61194cc7)
- Add debug logging for stimulus mapping save flow (f2d99259)
- Fix 404 error when loading dynamic URL in component config (b86e0554)
- Merge Stimulus Mappings into Variables tab and add inline editing (4fe8a093)
- Fix Firestore undefined value error in session cleanup (114e97d6)
- Fix 404 errors when removing unknown experiments from tracking table (a4514f28)
- Optimize Firebase usage and fix stale sync metrics leak (1136c3c6)
- Fix 404 errors when removing unknown experiments from tracking table (b98d0656)
- Fix stimulus mapping image selection and improve experiment tracking cleanup (234308a2)


## Release Archive

For older releases, please see:
- [v0.3.x releases](./v0.3)
- [v0.2.x and older](./archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.

## Feedback

If you encounter any issues or have suggestions for improvement, please:
- Report bugs via our [issue tracker](https://github.com/yourusername/hyperstudy/issues)
- Contact support at support@hyperstudy.io
- Join our community discussions
