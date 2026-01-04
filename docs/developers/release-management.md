---
sidebar_position: 6
---

# Release Management

This document describes the automated release management process for promoting changes from development to production.

## Overview

HyperStudy uses an automated workflow to manage releases and promotions from the `development` branch to the `production` branch. This system ensures consistent versioning, maintains comprehensive changelogs, and automates the deployment process.

## Branch Strategy

- **`development`**: Active development branch where new features and fixes are merged
- **`production`**: Stable production branch that triggers automatic deployments
- **`main`**: Default branch (currently mirrors production for compatibility)

## Automated Promotion Workflow

### Manual Promotion

Trigger a promotion on-demand with version control:

```bash
# Promote with patch version bump (1.0.0 → 1.0.1)
gh workflow run promote-to-production.yml -f release_type=patch

# Promote with minor version bump (1.0.0 → 1.1.0)
gh workflow run promote-to-production.yml -f release_type=minor

# Promote with major version bump (1.0.0 → 2.0.0)
gh workflow run promote-to-production.yml -f release_type=major

# Use a custom version
gh workflow run promote-to-production.yml -f custom_version=2.5.0
```

### Scheduled Promotion

The system automatically runs a promotion workflow every Monday at 9 AM UTC. This:
1. Checks for changes between development and production
2. Creates a promotion PR if changes exist
3. Auto-merges if all CI checks pass
4. Creates a release and triggers deployment

### Promotion Process

1. **Change Detection**: Checks for commits between production and development
2. **Changelog Generation**: Creates categorized changelog from commit messages
3. **PR Creation**: Opens a pull request with:
   - Summary of all changes
   - Updated CHANGELOG.md file
   - Version information
   - Pre-merge checklist
4. **CI Validation**: Waits for all CI checks to pass
5. **Merge**:
   - **Manual trigger**: Waits for manual approval and merge
   - **Scheduled trigger**: Auto-merges if checks pass
6. **Release Creation**: Creates GitHub release with version tag
7. **Deployment**: Triggers automatic deployment to production

## Changelog Management

### Automatic Changelog Generation

The system generates changelogs by analyzing commit messages and categorizing them:

- **BREAKING CHANGES**: Breaking changes
- **Features**: New features (`feat:` commits)
- **Bug Fixes**: Bug fixes (`fix:` commits)
- **Performance**: Performance improvements (`perf:` commits)
- **Documentation**: Documentation updates (`docs:` commits)
- **Tests**: Test additions/updates (`test:` commits)
- **Maintenance**: Build/CI changes (`chore:`, `ci:`, `build:` commits)

### Manual Changelog Generation

Generate a changelog locally for review:

```bash
# Generate changelog between branches
node scripts/generate-changelog.js origin/production origin/development

# Save changelog to file
node scripts/generate-changelog.js origin/production origin/development --save
```

## Commit Message Convention

Use conventional commit format for better changelog generation:

- `feat:` - New feature
- `fix:` - Bug fix
- `perf:` - Performance improvement
- `docs:` - Documentation change
- `test:` - Test addition or update
- `refactor:` - Code refactoring
- `chore:` - Maintenance task
- `ci:` - CI/CD changes
- `build:` - Build system changes

Examples:
```
feat: add user authentication system
fix: resolve memory leak in video player
perf: optimize database queries for faster loading
docs: update API documentation
```

## Version Management

### Semantic Versioning

The project follows semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

### Version Tags

- All releases are tagged with version numbers (e.g., `v1.2.3`)
- Tags are created on the production branch
- Each tag triggers a GitHub release

## Pull Request Template

When creating PRs, use the provided template which includes:

1. **Description**: Brief summary of changes
2. **Type of Change**: Category selection
3. **Related Issues**: Link to relevant issues
4. **Testing**: Verification steps taken
5. **Checklist**: Pre-merge validations
6. **Changelog Entry**: User-facing change description

The changelog entry should follow the format:
```
type: description
```

## Release Notes

Release notes are automatically generated and include:

- Categorized list of changes
- Pull request references
- Contributor list
- Dependency updates
- Installation instructions
- Full changelog link

## Best Practices

1. **Commit Messages**: Use conventional commit format consistently
2. **PR Descriptions**: Fill out the PR template completely
3. **Testing**: Ensure all tests pass before merging to development
4. **Review**: Review promotion PRs before merging (for manual triggers)
5. **Monitoring**: Check deployment status after promotion

## Troubleshooting

### Failed CI Checks

If CI checks fail during promotion:
1. The workflow will stop and require manual intervention
2. Fix the issues in the development branch
3. Re-run the promotion workflow

### Merge Conflicts

If conflicts occur:
1. Resolve conflicts in the development branch
2. Ensure development is up-to-date with production
3. Re-trigger the promotion workflow

### Manual Intervention Required

For manual promotions:
1. Review the created PR
2. Ensure all checks pass
3. Manually merge when ready
4. The workflow will automatically continue after merge

## Workflow Files

- **`.github/workflows/promote-to-production.yml`**: Main promotion workflow
- **`.github/workflows/create-release-notes.yml`**: Release notes generation
- **`scripts/generate-changelog.js`**: Changelog generation script
- **`.github/pull_request_template.md`**: PR template for better commit messages