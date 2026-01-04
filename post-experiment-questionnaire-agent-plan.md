# Post-Experiment Questionnaire - Agent Orchestration Plan

**Created**: 2025-10-30
**Status**: Planning
**Target Release**: TBD

## Overview

This document outlines the agent-based development workflow for implementing the post-experiment questionnaire feature. It defines roles, responsibilities, communication protocols, and quality gates for a coordinated multi-agent development process.

---

## Agent Roles & Responsibilities

### 🎯 Orchestrator Agent

**Primary Responsibilities**:
- Overall project coordination and timeline management
- Task breakdown and assignment
- Dependency tracking
- Progress monitoring and reporting
- Risk identification and mitigation
- Stakeholder communication
- Integration coordination

**Key Deliverables**:
- Sprint planning documents
- Daily status reports
- Risk assessment updates
- Integration test plans
- Release readiness assessments

**Communication**:
- Daily check-ins with all agents
- Weekly stakeholder updates
- Ad-hoc coordination as needed

---

### 💻 Software Engineer Agent

**Primary Responsibilities**:
- Feature implementation (frontend & backend)
- Component development
- API implementation
- Database schema updates
- Code optimization
- Bug fixes
- Technical documentation (inline comments, README updates)

**Key Deliverables**:
- Working code (passes linting, builds successfully)
- Unit tests for new components
- Integration test setup
- API documentation
- Migration scripts (if needed)
- Component documentation

**Quality Standards**:
- Code follows existing style guide (Svelte 5, ESLint)
- All functions documented with JSDoc
- No compiler warnings
- Performance benchmarks met
- Accessibility standards (WCAG 2.1 AA)

---

### 🧪 Test Engineer Agent

**Primary Responsibilities**:
- Test plan development
- Test case creation
- Test execution (unit, integration, E2E)
- Bug reporting and verification
- Test automation
- Performance testing
- User acceptance testing coordination

**Key Deliverables**:
- Comprehensive test plan
- Test cases for all features
- Automated test suite
- Bug reports with reproduction steps
- Test coverage reports
- Performance test results
- User acceptance test scripts

**Quality Standards**:
- Minimum 80% code coverage
- All critical paths tested
- Edge cases covered
- Performance benchmarks documented
- Regression test suite updated

---

### 👀 Code Reviewer Agent

**Primary Responsibilities**:
- Code review (functionality, style, best practices)
- Architecture review
- Security review
- Performance review
- Documentation review
- Approval/rejection with detailed feedback
- Mentoring and knowledge sharing

**Key Deliverables**:
- Code review comments
- Approval/rejection decisions
- Best practice recommendations
- Security audit reports
- Performance optimization suggestions
- Documentation quality assessments

**Quality Standards**:
- Reviews completed within 24 hours
- Constructive, actionable feedback
- Security vulnerabilities identified
- Performance bottlenecks caught
- Consistency with codebase patterns

---

## Development Workflow

### Phase Structure

Each development phase follows this workflow:

```
1. Orchestrator → Plan & Assign
2. Software Engineer → Implement
3. Software Engineer → Self-Test
4. Code Reviewer → Review
5. Test Engineer → Test
6. Orchestrator → Integrate & Verify
```

### Iteration Cycle

**Daily Cycle**:
```
09:00 - Orchestrator: Daily standup (async)
09:30 - All agents: Work on assigned tasks
12:00 - Orchestrator: Mid-day check-in
15:00 - Code Reviewer: Review session
17:00 - Orchestrator: End-of-day status update
```

**Weekly Cycle**:
```
Monday: Sprint planning, task assignment
Wednesday: Mid-sprint review, adjust priorities
Friday: Sprint review, demo, retrospective
```

---

## Implementation Phases with Agent Assignments

## Sprint 1: Backend Foundation (Week 1)

### Days 1-2: Data Model & Schema

**Orchestrator**:
- [ ] Review implementation plan
- [ ] Create detailed task breakdown
- [ ] Set up tracking board
- [ ] Coordinate with stakeholders on schema design

**Software Engineer**:
- [ ] Implement Firebase schema for postExperimentQuestionnaire
- [ ] Create validation functions for questionnaire config
- [ ] Add TypeScript interfaces (if applicable)
- [ ] Write unit tests for validation
- [ ] Update database migration scripts

**Test Engineer**:
- [ ] Review schema design
- [ ] Create test cases for data validation
- [ ] Set up test database
- [ ] Prepare test data fixtures

**Code Reviewer**:
- [ ] Review schema design for scalability
- [ ] Check data types and constraints
- [ ] Verify validation logic
- [ ] Approve schema before implementation

### Days 3-4: Data Collection Service

**Software Engineer**:
- [ ] Extend dataCollectionService for questionnaire events
- [ ] Implement event recording for questionnaire.response
- [ ] Implement event recording for questionnaire.completed
- [ ] Add error handling and retry logic
- [ ] Write unit tests

**Test Engineer**:
- [ ] Create test cases for event recording
- [ ] Test error scenarios (network failures, invalid data)
- [ ] Verify data persistence
- [ ] Test batch processing

**Code Reviewer**:
- [ ] Review error handling
- [ ] Check for race conditions
- [ ] Verify data consistency
- [ ] Approve implementation

### Day 5: API Routes

**Software Engineer**:
- [ ] Extend existing data API for questionnaire endpoints
- [ ] Add GET /questionnaire-responses/experiment/:id
- [ ] Add GET /questionnaire-responses/participant/:id
- [ ] Add permission checks
- [ ] Add query parameter filtering
- [ ] Write API tests

**Test Engineer**:
- [ ] Test API endpoints
- [ ] Verify permission checks
- [ ] Test query parameters
- [ ] Test error responses
- [ ] Performance test (load testing)

**Code Reviewer**:
- [ ] Review API security
- [ ] Check authentication/authorization
- [ ] Verify input validation
- [ ] Approve API implementation

**Orchestrator**:
- [ ] Sprint 1 review
- [ ] Demo to stakeholders
- [ ] Retrospective
- [ ] Plan Sprint 2

---

## Sprint 2: Participant Experience (Week 2)

### Days 1-2: Questionnaire Display Component

**Software Engineer**:
- [ ] Create PostExperimentQuestionnaireDisplay.svelte
- [ ] Implement page navigation logic
- [ ] Add markdown content rendering
- [ ] Implement progress indicators
- [ ] Add validation logic
- [ ] Style component (match existing design)
- [ ] Write component tests

**Test Engineer**:
- [ ] Test page navigation
- [ ] Test validation (required fields)
- [ ] Test markdown rendering
- [ ] Test responsive design
- [ ] Test accessibility (keyboard, screen reader)

**Code Reviewer**:
- [ ] Review component structure
- [ ] Check Svelte 5 runes usage
- [ ] Verify accessibility
- [ ] Check performance
- [ ] Approve component

### Days 3-4: Question Display Component

**Software Engineer**:
- [ ] Create QuestionnaireQuestionDisplay.svelte
- [ ] Integrate existing input components
- [ ] Add answer change handlers
- [ ] Implement time tracking
- [ ] Add auto-save functionality
- [ ] Handle all question types
- [ ] Write component tests

**Test Engineer**:
- [ ] Test all question types rendering
- [ ] Test answer capture
- [ ] Test auto-save
- [ ] Test time tracking
- [ ] Test offline behavior

**Code Reviewer**:
- [ ] Review component integration
- [ ] Check data flow
- [ ] Verify auto-save logic
- [ ] Approve component

### Day 5: ExperimentRunner Integration

**Software Engineer**:
- [ ] Modify ExperimentRunner completion flow
- [ ] Add questionnaire phase logic
- [ ] Integrate PostExperimentQuestionnaireDisplay
- [ ] Handle questionnaire completion
- [ ] Ensure Prolific flow unaffected
- [ ] Update tests

**Test Engineer**:
- [ ] Test complete participant flow
- [ ] Test with/without questionnaire enabled
- [ ] Test Prolific integration
- [ ] Test completion screen timing
- [ ] Regression test existing flows

**Code Reviewer**:
- [ ] Review integration logic
- [ ] Check for breaking changes
- [ ] Verify backward compatibility
- [ ] Approve integration

**Orchestrator**:
- [ ] Sprint 2 review
- [ ] Demo participant experience
- [ ] Gather feedback
- [ ] Plan Sprint 3

---

## Sprint 3: Designer Experience (Week 3)

### Days 1-2: Questionnaire Designer Component

**Software Engineer**:
- [ ] Create PostExperimentQuestionnaire.svelte
- [ ] Implement enable/disable toggle
- [ ] Add configuration options UI
- [ ] Create page manager (add/remove/reorder)
- [ ] Add markdown editor
- [ ] Implement validation warnings
- [ ] Write component tests

**Test Engineer**:
- [ ] Test configuration changes
- [ ] Test page management
- [ ] Test drag-and-drop reordering
- [ ] Test validation warnings
- [ ] Test data persistence

**Code Reviewer**:
- [ ] Review UI/UX design
- [ ] Check validation logic
- [ ] Verify state management
- [ ] Approve component

### Day 3: Question Builder Enhancements

**Software Engineer**:
- [ ] Add VAS rating question type
- [ ] Add Likert scale question type
- [ ] Add ranking question type
- [ ] Add audio recording question type
- [ ] Update config panels for new types
- [ ] Write tests for new types

**Test Engineer**:
- [ ] Test new question types in builder
- [ ] Test configuration for each type
- [ ] Test validation for each type
- [ ] Test question preview

**Code Reviewer**:
- [ ] Review new question type implementations
- [ ] Check config validation
- [ ] Approve enhancements

### Days 4-5: Designer Integration & Preview

**Software Engineer**:
- [ ] Add "Post-Experiment" tab to ExperimentDesigner
- [ ] Integrate PostExperimentQuestionnaire component
- [ ] Add preview mode functionality
- [ ] Implement preview modal
- [ ] Update auto-save logic
- [ ] Write integration tests

**Test Engineer**:
- [ ] Test designer tab navigation
- [ ] Test questionnaire configuration flow
- [ ] Test preview mode
- [ ] Test save/load functionality
- [ ] End-to-end designer test

**Code Reviewer**:
- [ ] Review designer integration
- [ ] Check data flow
- [ ] Verify preview mode
- [ ] Approve integration

**Orchestrator**:
- [ ] Sprint 3 review
- [ ] Demo designer experience
- [ ] Gather experimenter feedback
- [ ] Plan Sprint 4

---

## Sprint 4: Data Management & Polish (Week 4)

### Days 1-2: Data Management UI

**Software Engineer**:
- [ ] Add questionnaire section to DataManagementV3
- [ ] Implement data loading
- [ ] Add filtering UI
- [ ] Create data table view
- [ ] Add export functionality
- [ ] Write tests

**Test Engineer**:
- [ ] Test data loading
- [ ] Test filtering
- [ ] Test table display
- [ ] Test CSV export
- [ ] Test with large datasets

**Code Reviewer**:
- [ ] Review data management implementation
- [ ] Check query performance
- [ ] Verify export format
- [ ] Approve implementation

### Day 3: Additional Features

**Software Engineer**:
- [ ] Add character count for text inputs
- [ ] Implement visual progress indicators
- [ ] Add completion confirmation
- [ ] Optimize performance
- [ ] Polish animations and transitions

**Test Engineer**:
- [ ] Test new features
- [ ] Performance benchmarks
- [ ] Visual regression tests
- [ ] User experience testing

**Code Reviewer**:
- [ ] Review polish implementations
- [ ] Check performance improvements
- [ ] Approve features

### Days 4-5: Integration Testing & Bug Fixes

**Test Engineer** (Lead):
- [ ] Execute full integration test suite
- [ ] Perform exploratory testing
- [ ] Load testing (concurrent users)
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Create bug reports

**Software Engineer**:
- [ ] Fix critical bugs
- [ ] Fix high-priority bugs
- [ ] Address medium-priority bugs
- [ ] Code cleanup

**Code Reviewer**:
- [ ] Review bug fixes
- [ ] Verify no regressions
- [ ] Final code quality check

**Orchestrator**:
- [ ] Coordinate bug triage
- [ ] Track bug fix progress
- [ ] Prepare release notes
- [ ] Sprint 4 review and demo

---

## Communication Protocols

### Daily Standup (Async)

Each agent posts update in this format:

```
Agent: [Role Name]
Date: [YYYY-MM-DD]

Completed Yesterday:
- [Task 1]
- [Task 2]

Today's Plan:
- [Task 1]
- [Task 2]

Blockers:
- [Blocker 1] (if any)

Needs Review:
- [PR/Issue Link] (if any)
```

### Code Review Process

**Software Engineer** → **Code Reviewer**:
```
1. SE: Create pull request with:
   - Description of changes
   - Test results
   - Screenshots (if UI changes)
   - Checklist of acceptance criteria

2. CR: Review within 24 hours
   - Comment on specific lines
   - Suggest improvements
   - Request changes or approve

3. SE: Address feedback
   - Reply to comments
   - Make requested changes
   - Request re-review

4. CR: Final approval
   - Verify changes
   - Approve PR
```

### Bug Reporting

**Test Engineer** → **Software Engineer**:
```
Bug Report Format:
- Title: [Component] Short description
- Severity: Critical / High / Medium / Low
- Steps to Reproduce:
  1. Step 1
  2. Step 2
  3. ...
- Expected Behavior: [description]
- Actual Behavior: [description]
- Environment: Browser, OS, etc.
- Screenshots/Videos: [if applicable]
- Logs: [relevant error messages]
```

### Status Reports

**Orchestrator** → **Stakeholders** (Weekly):
```
Week: [Week Number]
Sprint: [Sprint Number]

Progress Summary:
- [Phase] - [% Complete]
- Key achievements this week

Completed This Week:
- [Feature 1]
- [Feature 2]

Planned for Next Week:
- [Feature 1]
- [Feature 2]

Risks & Issues:
- [Risk 1] - Mitigation: [plan]
- [Issue 1] - Status: [status]

Timeline Status: On Track / At Risk / Delayed
Next Milestone: [description] - [date]
```

---

## Quality Gates

### Gate 1: Schema Approval (End of Sprint 1, Day 2)

**Criteria**:
- [ ] Schema design reviewed by Code Reviewer
- [ ] Data types validated
- [ ] Scalability considerations addressed
- [ ] Test Engineer confirms testability

**Decision**: Go / No-Go for implementation

---

### Gate 2: Backend API Approval (End of Sprint 1)

**Criteria**:
- [ ] All API endpoints implemented
- [ ] API tests passing (>80% coverage)
- [ ] Security review passed
- [ ] Performance benchmarks met
- [ ] Code Reviewer approved

**Decision**: Go / No-Go for frontend development

---

### Gate 3: Participant Experience Approval (End of Sprint 2)

**Criteria**:
- [ ] All participant components implemented
- [ ] Integration with ExperimentRunner complete
- [ ] All component tests passing
- [ ] Accessibility tests passed
- [ ] Manual UX testing completed
- [ ] Code Reviewer approved

**Decision**: Go / No-Go for designer development

---

### Gate 4: Designer Experience Approval (End of Sprint 3)

**Criteria**:
- [ ] All designer components implemented
- [ ] Preview mode working
- [ ] Integration with ExperimentDesigner complete
- [ ] All tests passing
- [ ] Usability testing with experimenters completed
- [ ] Code Reviewer approved

**Decision**: Go / No-Go for data management & polish

---

### Gate 5: Release Readiness (End of Sprint 4)

**Criteria**:
- [ ] All features implemented and tested
- [ ] No critical or high-priority bugs
- [ ] Integration tests passing
- [ ] Performance benchmarks met
- [ ] Documentation complete
- [ ] Stakeholder demo approved
- [ ] All agents sign off

**Decision**: Ready for Release / Need More Time

---

## Risk Management

### Risk Assessment Matrix

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| Schema changes break existing features | Low | High | Extensive regression testing | Test Engineer |
| Performance issues with large questionnaires | Medium | Medium | Performance testing early, pagination | Software Engineer |
| Integration with Prolific broken | Low | Critical | Test Prolific flow specifically | Test Engineer |
| Audio recording upload failures | Medium | Medium | Reuse proven AudioRecordingComponent | Software Engineer |
| Designer UI confusing | Medium | Medium | User testing, iterate on feedback | Orchestrator |
| Timeline slips | Medium | Medium | Buffer time in schedule, prioritize features | Orchestrator |

### Risk Monitoring

**Orchestrator** reviews risks weekly:
- Update probability/impact
- Review mitigation effectiveness
- Escalate if needed
- Adjust plan as needed

---

## Definition of Done

### Feature-Level DoD

A feature is considered "Done" when:

- [ ] Implementation complete
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] No known critical bugs
- [ ] Accessibility checks passed
- [ ] Performance benchmarks met
- [ ] Deployed to staging environment
- [ ] Demo to stakeholders completed

### Sprint-Level DoD

A sprint is considered "Done" when:

- [ ] All planned features meet feature-level DoD
- [ ] Sprint goal achieved
- [ ] Demo completed
- [ ] Retrospective completed
- [ ] Next sprint planned
- [ ] All code merged to main branch
- [ ] Release notes drafted

---

## Task Breakdown Example

### Example: Implement PostExperimentQuestionnaireDisplay Component

**Orchestrator** breaks down into:

```
Epic: Participant Questionnaire Display
├── Task 1: Create component file and basic structure
│   ├── Subtask 1.1: Set up component props and state
│   ├── Subtask 1.2: Add markdown rendering
│   └── Subtask 1.3: Create basic layout
├── Task 2: Implement page navigation
│   ├── Subtask 2.1: Next/Previous buttons
│   ├── Subtask 2.2: Progress dots
│   └── Subtask 2.3: Navigation validation
├── Task 3: Add validation logic
│   ├── Subtask 3.1: Required field validation
│   ├── Subtask 3.2: Type-specific validation
│   └── Subtask 3.3: Error messaging
├── Task 4: Implement data recording
│   ├── Subtask 4.1: Answer change handlers
│   ├── Subtask 4.2: Auto-save to Firebase
│   └── Subtask 4.3: Completion event
└── Task 5: Testing and polish
    ├── Subtask 5.1: Unit tests
    ├── Subtask 5.2: Accessibility tests
    └── Subtask 5.3: Responsive design
```

**Assignment**:
- Software Engineer: Tasks 1-4
- Test Engineer: Task 5 (in parallel with 4)
- Code Reviewer: Review after each task
- Orchestrator: Coordinate, track progress

---

## Agent Coordination Examples

### Scenario 1: Blocker Identified

```
Software Engineer: "Blocked on API implementation - Firebase permissions
                    not configured for new collection"

Orchestrator: "Escalating to infrastructure team.
               Workaround: Use local Firebase emulator for testing.
               ETA for resolution: EOD today"

Test Engineer: "Will prepare test cases in parallel, can test with
                emulator"

Code Reviewer: "Will review schema design in meantime to unblock next
                steps"
```

### Scenario 2: Bug Found in Review

```
Code Reviewer: "Found potential race condition in auto-save logic.
                See PR comments for details."

Software Engineer: "Acknowledged. Implementing debounce and queue.
                    Will push fix in 2 hours."

Test Engineer: "Adding test case to verify fix and prevent regression"

Orchestrator: "Noted. This is on critical path, prioritizing.
               Holding tomorrow's integration test until fix confirmed."
```

### Scenario 3: Scope Change Request

```
Stakeholder: "Can we add matrix questions (multiple sub-questions)?"

Orchestrator: "Analyzing impact:
               - Adds 2-3 days to Sprint 3
               - Affects: QuestionBuilder, QuestionDisplay
               - Option 1: Add to current scope (delay Sprint 4)
               - Option 2: Defer to v2 (maintain timeline)
               Recommend Option 2. Your preference?"

Software Engineer: "Matrix questions would need new component +
                    data model changes. Estimate: 3 days"

Test Engineer: "Would need new test cases. Estimate: 1 day"

Code Reviewer: "Agree with Option 2. Can plan for v2 now to ensure
                schema supports future extension"
```

---

## Retrospective Format

### Sprint Retrospective (Weekly)

Each agent answers:

**What went well?**
- [Positive 1]
- [Positive 2]

**What could be improved?**
- [Improvement 1]
- [Improvement 2]

**Action items for next sprint:**
- [Action 1] - Owner: [Agent] - Due: [Date]
- [Action 2] - Owner: [Agent] - Due: [Date]

**Orchestrator** compiles and tracks action items.

---

## Documentation Responsibilities

### Software Engineer
- Inline code comments (JSDoc)
- Component prop documentation
- API endpoint documentation
- README updates
- Migration guides

### Test Engineer
- Test plan documentation
- Test case documentation
- Bug reports
- Test coverage reports
- QA sign-off documents

### Code Reviewer
- Code review summaries
- Architecture decision records
- Security audit reports
- Best practices documentation

### Orchestrator
- Project plan
- Status reports
- Risk assessments
- Release notes
- Stakeholder communications

---

## Tools & Platforms

### Recommended Tools

**Project Management**:
- GitHub Projects (task tracking)
- GitHub Issues (bug tracking)
- GitHub Discussions (async communication)

**Code Collaboration**:
- GitHub Pull Requests (code review)
- GitHub Actions (CI/CD)
- Git branches (feature development)

**Testing**:
- Jest (unit testing)
- Playwright (E2E testing)
- Lighthouse (performance)
- axe (accessibility)

**Communication**:
- GitHub Discussions (primary)
- Slack/Discord (real-time)
- Email (stakeholder updates)

---

## Success Metrics

### Team Performance Metrics

**Velocity**:
- Story points completed per sprint
- Tasks completed on time
- Feature completion rate

**Quality**:
- Bug escape rate (bugs found after release)
- Code review turnaround time
- Test coverage percentage
- Defect density

**Collaboration**:
- Code review participation
- Communication response time
- Cross-agent collaboration instances

### Feature Success Metrics

**Adoption**:
- % of experiments using questionnaire feature
- Average questionnaire length
- Completion rates

**Quality**:
- Bug reports post-release
- Performance metrics
- User satisfaction scores

**Impact**:
- Data collection increase
- Researcher feedback
- Time saved vs. external survey tools

---

## Appendix

### Agent Onboarding Checklist

**New Agent Joining Project**:

- [ ] Read implementation plan
- [ ] Read agent orchestration plan
- [ ] Review codebase structure
- [ ] Set up development environment
- [ ] Join communication channels
- [ ] Introduce yourself to team
- [ ] Review current sprint plan
- [ ] Pick up first task
- [ ] Ask questions!

### Quick Reference

**Key Documents**:
- Implementation Plan: `docs/post-experiment-questionnaire-implementation-plan.md`
- Codebase README: `README.md`
- Style Guide: `docs/STYLE_GUIDE.md`
- Architecture: `docs/ARCHITECTURE.md`

**Key Contacts**:
- Product Owner: [Name]
- Tech Lead: [Name]
- Orchestrator: [Name]

**Meeting Schedule**:
- Daily Standup: Async, 9am post
- Code Review: Daily, 3pm
- Sprint Review: Friday, 10am
- Retrospective: Friday, 11am

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-10-30 | 1.0 | Initial agent orchestration plan |

---

**End of Agent Orchestration Plan**
