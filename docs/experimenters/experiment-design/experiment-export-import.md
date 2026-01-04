---
title: Experiment Export & Import
sidebar_position: 8
---

# Experiment Export & Import

The Export/Import feature enables researchers to share experiment configurations, create backups, and replicate studies across different HyperStudy installations. This functionality supports collaboration, reproducibility, and efficient experiment management.

## Overview

Export/Import is useful for:

- **Collaboration**: Sharing experiment designs with collaborators
- **Backup**: Creating secure copies of experiment configurations
- **Replication**: Reproducing studies in different environments
- **Version Control**: Managing different versions of experiments
- **Template Creation**: Building reusable experiment templates

## Export Functionality

### What Gets Exported

When you export an experiment, the system includes:

**Core Configuration:**
- Experiment metadata (title, description, settings)
- State definitions and transitions
- Component configurations
- Variable definitions
- Role assignments

**Media References:**
- Media file metadata and references
- Upload configurations
- Asset organization structure

**Advanced Settings:**
- Global component configurations
- Synchronization parameters
- Recruitment settings
- Permission configurations

### Export Process

1. **Access Export Function**
   - Navigate to the Experiment Manager
   - Select the experiment you want to export
   - Click the "Export" button in the experiment actions

2. **Choose Export Options**
   - Select what to include in the export
   - Choose export format (JSON recommended)
   - Add export description or notes

3. **Generate Export File**
   - System creates comprehensive export package
   - Downloads as .json file with timestamp
   - File contains all experiment configuration data

### Export File Format

```json
{
  "exportInfo": {
    "exportedBy": "researcher@university.edu",
    "exportDate": "2024-01-15T14:30:25.123Z",
    "hyperstudyVersion": "2.1.0",
    "exportVersion": "1.0"
  },
  "experiment": {
    "metadata": {
      "title": "Social Interaction Study",
      "description": "Multi-participant video viewing with ratings",
      "createdBy": "researcher@university.edu",
      "lastModified": "2024-01-14T10:15:30.456Z"
    },
    "states": [...],
    "components": [...],
    "variables": [...],
    "roles": [...],
    "globalComponents": [...],
    "settings": {...}
  },
  "mediaAssets": [
    {
      "id": "video_123",
      "filename": "stimulus_video.mp4",
      "type": "video",
      "metadata": {...}
    }
  ]
}
```

## Import Functionality

### Import Process

1. **Access Import Function**
   - Go to Experiment Manager
   - Click "Import Experiment" button
   - Choose the export file to import

2. **Upload and Validate**
   - Select .json export file
   - System validates file format and compatibility
   - Shows preview of what will be imported

3. **Configure Import Options**
   - Choose new experiment name
   - Select which components to import
   - Handle conflicts and dependencies

4. **Complete Import**
   - System creates new experiment from export data
   - Handles media asset references
   - Provides import summary and any warnings

### Import Validation

The system checks for:

- **Format Compatibility**: Ensures export format is supported
- **Version Compatibility**: Checks HyperStudy version compatibility
- **Media Dependencies**: Identifies missing media assets
- **Configuration Conflicts**: Detects potential issues with settings

### Handling Missing Media

When importing experiments with media references:

**Option 1: Manual Upload**
- System identifies missing media files
- Provides list of required assets
- Allows manual upload of missing files

**Option 2: Reference Mapping**
- Map missing assets to existing media in your library
- Update references to point to equivalent content
- Skip media-dependent components if needed

**Option 3: Placeholder Mode**
- Import experiment structure without media
- Replace with actual media files later
- Useful for testing experiment logic

## Use Cases

### Collaborative Research

**Sharing Experiment Designs:**
```
1. Lead researcher creates experiment template
2. Exports experiment configuration
3. Shares export file with collaborators
4. Collaborators import and customize for their studies
5. Results can be compared using same experimental structure
```

**Multi-site Studies:**
```
1. Design experiment at primary site
2. Export complete configuration
3. Import at secondary sites
4. Maintain consistency across locations
5. Aggregate data with confidence in methodology
```

### Experiment Development

**Version Management:**
```
1. Export experiment at key development milestones
2. Test modifications in separate imported copies
3. Keep working versions separate from production
4. Roll back to previous versions if needed
```

**Template Creation:**
```
1. Create generalized experiment structure
2. Export as template
3. Import template for new studies
4. Customize components and content for specific research questions
```

### Backup and Recovery

**Regular Backups:**
```
1. Export experiments periodically
2. Store export files securely
3. Maintain version history
4. Enable recovery from data loss
```

**System Migration:**
```
1. Export all experiments from old system
2. Set up new HyperStudy installation
3. Import experiment configurations
4. Restore full experimental capability
```

## Best Practices

### Export Management

1. **Regular Exports**: Create exports at key development milestones
2. **Descriptive Naming**: Use clear, versioned filenames
3. **Documentation**: Include notes about changes and versions
4. **Storage**: Keep exports in organized, backed-up storage

### Import Planning

1. **Test Imports**: Import into test environment first
2. **Media Preparation**: Gather required media files before importing
3. **Validation**: Check imported experiments thoroughly
4. **Customization**: Plan necessary modifications for your context

### Collaboration Workflows

1. **Shared Standards**: Agree on naming conventions and structures
2. **Clear Communication**: Document changes when sharing exports
3. **Version Tracking**: Maintain clear version histories
4. **Access Control**: Manage who can export/import experiments

## Advanced Features

### Selective Export

Choose specific components to export:

- **Core Structure Only**: States, transitions, basic configuration
- **Including Media**: Add media asset metadata and references
- **Full Configuration**: Everything including advanced settings
- **Custom Selection**: Pick specific components and features

### Batch Operations

- **Multiple Exports**: Export several experiments at once
- **Batch Import**: Import multiple experiments from archive
- **Template Library**: Maintain collection of reusable templates
- **Automated Backups**: Schedule regular exports for backup

### Integration Options

- **API Access**: Programmatic export/import for automated workflows
- **Git Integration**: Version control experiment configurations
- **Cloud Storage**: Direct integration with cloud storage services
- **Database Export**: Include participant data in exports (with permissions)

## Troubleshooting

### Common Export Issues

**Export Fails to Generate**
- Check experiment has all required components
- Verify user permissions for export
- Ensure adequate storage space
- Try exporting smaller sections if full export fails

**Large Export Files**
- Consider excluding media metadata
- Use selective export options
- Compress export files if needed
- Split complex experiments into parts

### Common Import Issues

**Import Validation Errors**
- Check export file format and version
- Verify file isn't corrupted
- Ensure compatibility with current HyperStudy version
- Try importing components individually

**Missing Dependencies**
- Identify required media files from error messages
- Upload missing assets to media library
- Update media references to existing files
- Consider placeholder imports for testing

**Configuration Conflicts**
- Review conflicting settings in import preview
- Modify experiment settings before import
- Use different experiment names to avoid conflicts
- Import into test environment first

### Version Compatibility

**Older Exports:**
- Check compatibility warnings
- Update export format if needed
- Test functionality after import
- Consider manual configuration updates

**Newer Exports:**
- Update HyperStudy to latest version
- Check release notes for breaking changes
- Contact support for version-specific issues
- Use export version information to troubleshoot

## Security Considerations

### Data Protection

- **Sensitive Information**: Remove sensitive data before sharing exports
- **Access Control**: Limit export permissions to authorized users
- **Encryption**: Consider encrypting export files for sensitive research
- **Audit Trail**: Maintain logs of export/import activities

### Sharing Guidelines

- **Institutional Review**: Check IRB requirements for sharing experiment designs
- **Intellectual Property**: Respect ownership and attribution requirements
- **Collaboration Agreements**: Follow established sharing protocols
- **Data Governance**: Comply with institutional data policies

## Related Documentation

- [Experiment States](./experiment-states.md)
- [Components Overview](./components/index.md)
- [Media Management](../media-management.md)
- [Collaboration](../collaboration.md)
- [Data Management](../data-management.md)
- [Data Management Interface](../data-management-interface.md)