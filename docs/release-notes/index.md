---
sidebar_position: 5
---

# Release Notes

Stay up to date with the latest features, improvements, and bug fixes in HyperStudy.

## Latest Releases

## v0.6.64

Released: 2026-04-27

## What's Changed

## Changes since last production release

- test(deployment-metadata-editor): mock loadAllOrgExperiments to track CI (71edd2f9)
- fix(v4-discovery): per-list pagination metadata so public/prolific truncation is observable (8e35130b)
- fix(participation-store): drain V4 discovery + history cursors (bb5e0e5c)
- fix(data-service-v3): drain all participant pages by default (ea55c2a3)
- fix(experiment-store): add loadAllOrgExperiments / loadAllSharedExperiments and use them everywhere (48362dfe)
- fix(experiments-table): paginate through all org+shared experiments instead of dropping the tail (f3728475)
- fix(experiment-v2): silent no-op for component-complete on non-SYNCHRONIZED + filter high-freq logs (fd7a3431)
- fix(experiment-v2): flush data + setCompleted + countdown on completion (dffdbd14)
- test(experiment-v2): replace removed .v2-state debug hook with data-boot-state (c4027985)
- fix(experiment-v2): video URL substitution + header parity + completion UI (927d7c16)
- fix(experiment-v2): use server-authoritative participantId for engine actions (97314928)
- fix(experiment-v2): attach WS message listener before auth await (f4de280c)
- chore(experiment-v2): add diagnostic logging to WS message path (862c6282)
- fix(experiment-v2): serialize WS message handling per socket (00680cbe)
- fix(redis): iterate scanIterator batches and restore UPPERCASE options (6cb6c82c)
- fix(ingress): add Traefik route for /ws/experiment/v2 WebSocket (858a8d5c)
- fix(experiment-v2): WS URL ladder, auth token threading, Sentry observability (41b41521)

---

## v0.6.63

Released: 2026-04-24

## What's Changed

## Changes since last production release

- fix(migrate-text-styles): also walk globalComponents (06dd36c6)
- docs(role-config): document the three runtime modes (1a507968)
- fix(waiting-room): wrap long room IDs to prevent overflow (fe0c4a3f)
- fix(migrate-text-styles): match production schema + handle roleConfigs (d37b36a5)
- fix(designer): persist text style changes via explicit onchange (a51c44dd)
- chore(firestore-rules): remove unused isOrgOwner helper (2608e670)
- fix(redis): lowercase scanIterator options in stateManager (44bd81cf)
- chore(firestore): reconcile indexes with live project (78d21871)
- fix(firestore): add participantSessions index for endExperiment query (702a560f)
- fix(kernel): re-issue connectKernel on bridge reconnect (7d24fc9e)
- fix(data-collection): omit undefined metadata fields from Firestore write (924450a0)
- docs(claude-md): clarify dev-push workflow — no PRs into dev (9dbf45e4)
- test(backend): include scripts/**/*.test.js in vitest pattern (f6b3cd1f)
- feat(migrate): Firestore script — legacy fontSize/textColor → textStyle (c5fac661)
- test(textstyle): update MC and Ranking tests for migrated fields (8e38481c)
- refactor(rapidrate): migrate to textStyle roles (497d987a)
- refactor(multiplechoice): migrate to textStyle roles (68480328)
- refactor(ranking): migrate to textStyle roles (12421797)
- refactor(audiorecording): migrate to textStyle roles (ae5a7f8a)
- refactor(showimage): migrate to textStyle roles (2edc6aa8)
- refactor(likertscale): migrate to textStyle roles (c69c4198)
- refactor(continuousrating): migrate to textStyle roles (b92674a2)
- refactor(vasrating): migrate to textStyle roles (71a0c44a)
- refactor(textinput): migrate to textStyle roles (9fdbf84d)
- refactor(code): migrate to textStyle roles (ed16ab6c)
- refactor(sparserating): migrate to textStyle roles (07868d08)
- refactor(showtext): migrate to textStyle roles (78535121)
- feat(textstyle): render textStyle schema type via TextStyleControl (ede3fae6)
- feat(textstyle): TextStyleControl — shared designer control (32837b46)
- feat(textstyle): pure styleString helper (91ab1c7f)
- docs(textstyle): implementation plan (3e38ecfc)
- docs(designer): text-style config design spec (f3759a86)
- Merge pull request #242: fix(v2-ws) stop hijacking Socket.IO upgrades (9399f1cc)
- fix(v2-ws): stop hijacking Socket.IO upgrades with noServer pattern (9604ac7d)
- Merge pull request #241: fix(backend) pin ws to 8.19.0 (2baae3af)
- fix(backend): pin ws to 8.19.0 to work around 8.20.0 frame-encoding regression (5e1a0de2)
- Merge pull request #240: fix(session) stamp lastActivity on terminal completion write (d1e86a81)
- fix(session): stamp lastActivity on terminal completion write (090e0ca4)
- Merge pull request #239 from ljchang/feat/prolific-completion-unification (aa81c758)
- feat(sentry): upload frontend sourcemaps during production builds (2e6e2101)
- fix(prolific): reject non-gateway Prolific session creation at lobby/join (a3cb844e)
- fix(session): completeInstructions preserves status advanced past lobby (a876029b)
- fix(videochat): guard featuredParticipant.identity in bind:this expressions (fca0c8ea)
- fix(waiting-room): pair socket.on/off to prevent listener stacking across remounts (43d34147)
- refactor(sentry): migrate dataCollectionService error paths to captureError (8c3a57fb)
- refactor(prolific): endExperiment delegates per-session writes to completeSession (811a0424)
- test(prolific): emulator integration coverage for completeSession + Prolific (d33ad1f7)
- feat(prolific): V4 completeSession writes Prolific metadata atomically (0d6a1380)
- feat(prolific): ProlificCompletionService pure-function helper (2b69bd55)
- feat(prolific): canonical Outcome enum + V4/legacy translation (f23e8c52)
- feat(sentry): add captureError helper and auto-route Error-instance logs (2ed1160e)
- docs(prolific): collapse Phase 5 and 6 into single PR (no dual-path soak) (3882378d)
- docs(prolific): Option A unification plan for completion codes (4e2bf4d9)
- test(experiment-v2): comparison harness Layer 3 regression goldens for v2 frontend chain (0b5952af)
- docs(designer): update runtime toggle help text to reflect current v2 support (3b4efe2c)
- test(experiment-v2): ExperimentRunnerV2 global components render chain (62bc6be1)
- feat(experiment-v2): ShowVideo sparse-rating time updates + drop legacy get-video-position (bd9e63a4)
- test(experiment-v2): assert v2 E2E stack parity against legacy golden (72431e2c)
- test(experiment-v2): end-to-end integration test with real ExperimentStateServer (03cd5778)
- feat(experiment-v2): TriggerComponent coordination — closes out Category 3 rewrites (4e28c0b3)
- feat(experiment-v2): Phase 1 close-out — components, setup, sparse-rating, recording (07f57649)
- feat(experiment-runner-v2): minimal v2-native runner component + parent-route runtime routing (7c547a85)
- feat(protocol-store-bridge): resolve focusComponent from experimentDefinition (9e18cfbf)
- docs: add Phase 1 plans and specs for experiment engine v2 refactor (20eef9cf)
- feat(protocol-store-bridge): populate existing Svelte stores from ProtocolClient observations (0d29b120)
- feat(experiment-protocol): real session-token authenticator for WebSocket endpoint (cda795ae)
- test(frontend-stack): ProtocolClient + protocolBridge end-to-end against real backend — bridge snapshot tracks state (ac1d2a90)
- feat(protocol-bridge): translate ProtocolClient observations to consolidated state snapshot (ed3e854d)
- test(protocol-client): end-to-end frontend ProtocolClient against real backend WebSocket endpoint (7c99919d)
- feat(protocol-client): browser-side WebSocket client with action sending and observation subscription (3b9c5c17)
- test(experiment-protocol): end-to-end auth hook and runtime gating integration (8f41e922)
- feat(experiment-protocol): reject WebSocket sessions for experiments not flagged runtime=v2 (176fd5d3)
- feat(experiment-protocol): WebSocket upgrade auth hook with fail-closed default and participantId verification (9e064e88)
- test(experiment-protocol): end-to-end multi-role WebSocket integration — 3 concurrent clients through SYNCHRONIZED state to completion (98b929ba)
- test(experiment-protocol): end-to-end WebSocket integration — simple fixture through real ws endpoint (0e3866d8)
- feat(experiment-protocol): plain-WebSocket endpoint at /ws/experiment/v2 wrapping serverRuntime (95cc16a9)
- feat(experiment-protocol): wrapObservation and unwrapAction envelope helpers (73968c35)
- test(experiment-runtime): simple + multi-role parity via serverRuntime with auto timer scheduling (5163e4fa)
- feat(experiment-runtime): auto-schedule timer-fired on engine timer.started observations (injectable scheduler) (eaa5426d)
- feat(experiment-runtime): serverRuntime session manager with handleEvent, subscribe, and snapshot (3832adb9)
- feat(experiment-engine): multi-role fixture parity test — SYNCHRONIZED transitions and per-role emission byte-match legacy golden (b5ecb488)
- feat(experiment-engine): component-complete handler with SYNCHRONIZED transition advance (29d9c625)
- feat(experiment-engine): emit observations per-role on transitions, timers, setup, and completion (0732bb39)
- feat(experiment-engine): engine recorder + simple-fixture parity test against legacy golden (7f3a526d)
- feat(experiment-engine): timer-fired handler with state advance and experiment completion (7b300760)
- feat(experiment-engine): client-ready handler and setup → running phase transition with observations (744cc504)
- feat(experiment-engine): implement snapshot() and participant-joined dispatch handler (69bb6147)
- docs(parity): document golden-recording conventions, timestamp handling, and known gaps (6dac72f9)
- feat(parity): preserve raw absolute timestamps in goldens (sibling Raw fields) (348cc3ef)
- test(parity): add golden stability self-check (8a45dfbc)
- fix(parity): normalize transitionTimestamp in BehaviorRecorder and regenerate goldens (3ca380a9)
- test(parity): capture golden behavior recordings for fixtures against legacy server (ae9dc614)
- feat(parity): add server event → behavior tag translator (attachServerEventRecorder) (b1b29f79)
- feat(parity): add fixture → legacy-server shape translator (264a920d)
- docs(perf): document baseline testing conventions and invariant enforcement (c3520024)
- test(perf): capture pre-refactor scanner-pulse latency baseline (fb338739)
- test(perf): capture pre-refactor recordEvent latency baseline (bb3f90b8)
- test(perf): capture pre-refactor video sync broadcast latency baseline (9c4306f5)
- feat(parity): add assertParityAgainstGolden utility with load/save helpers (22d59405)
- test(parity): add three experiment fixtures (simple, multi-role, variables-and-pool) (cad96709)
- feat(parity): add BehaviorRecorder and compareRecordings utilities (5c8001e4)
- feat(experiment-protocol): mirror v0 schemas to /shared for future client consumption (f4c022ad)
- feat(experiment-protocol): add Ajv-based schema validator for observation and action messages (8d815101)
- feat(experiment-protocol): add v0 observation and action JSON schemas (4c61d583)
- feat(experiment-engine): add NTP-algorithm clock sync pure helpers (computeOffset, computeDelay, filterLowestDelay, smoothEwma) (25236132)
- docs(experiment-engine): document public API contract v0.1.0-draft (a6d41a48)
- feat(experiment-engine): add six store interfaces with null implementations (VariableStore, StimulusPoolStore, SharedDataStore, ConsentStore, DataEventStore, ComponentRegistryStore) (e972f332)
- feat(experiment-engine): scaffold package with Engine class, EVENTS constants, and API version export (99ed1e7a)
- fix: align server disconnect timeout with client socket.io retry budget (79fa7c68)

---

## v0.6.62

Released: 2026-04-17

## What's Changed

## Changes since last production release

- storybook: rename Code/JavaScript story export to match docs ID (e3da0d07)

---


[View all v0.6 releases →](/release-notes/v0.6)

## Previous Versions

- [v0.5 releases](/release-notes/v0.5)
- [v0.4 releases](/release-notes/v0.4)
- [v0.3 releases](/release-notes/v0.3)
- [Archived releases](/release-notes/archived)

## Stay Informed

New release notifications are automatically displayed in the experimenter dashboard when you log in. You can dismiss them at any time, and they'll remain in your dashboard history for future reference.
