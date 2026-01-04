#!/bin/bash

# Create placeholder images for documentation
# Creates 1x1 transparent PNG files for all missing images

# Create directories if they don't exist
mkdir -p static/img/administrators
mkdir -p static/img/participants
mkdir -p static/img/experimenters/components
mkdir -p static/img/experimenters/experiment-design/components
mkdir -p static/img/experimenters/recruitment
mkdir -p static/img/developers/architecture

# Create 1x1 transparent PNG file
echo -n -e '\x89\x50\x4E\x47\x0D\x0A\x1A\x0A\x00\x00\x00\x0D\x49\x48\x44\x52\x00\x00\x01\x00\x00\x00\x01\x00\x08\x06\x00\x00\x00\x5C\x72\xA8\x66\x00\x00\x00\x0A\x49\x44\x41\x54\x78\x9C\x63\x00\x01\x00\x00\x05\x00\x01\x0D\x0A\x2D\xB4\x00\x00\x00\x00\x49\x45\x4E\x44\xAE\x42\x60\x82' > placeholder.png

# Administrator images
cp placeholder.png static/img/administrators/user-roles.png
cp placeholder.png static/img/administrators/user-management.png
cp placeholder.png static/img/administrators/user-management-overview.png
cp placeholder.png static/img/administrators/experimenter-approval.png
cp placeholder.png static/img/administrators/experimenter-groups.png
cp placeholder.png static/img/administrators/admin-dashboard.png

# Participant images
cp placeholder.png static/img/participants/registration.png
cp placeholder.png static/img/participants/dashboard.png
cp placeholder.png static/img/participants/device-test.png
cp placeholder.png static/img/participants/waiting-room.png
cp placeholder.png static/img/participants/email-invitation.png
cp placeholder.png static/img/participants/available-experiments.png
cp placeholder.png static/img/participants/experiment-entry.png

# Experimenter images
cp placeholder.png static/img/experimenters/registration.png
cp placeholder.png static/img/experimenters/new-experiment.png
cp placeholder.png static/img/experimenters/dashboard.png
cp placeholder.png static/img/experimenters/media-library.png
cp placeholder.png static/img/experimenters/media-selector.png
cp placeholder.png static/img/experimenters/collaboration-groups.png
cp placeholder.png static/img/experimenters/group-membership.png
cp placeholder.png static/img/experimenters/image-upload.png
cp placeholder.png static/img/experimenters/media-permissions.png
cp placeholder.png static/img/experimenters/create-group.png
cp placeholder.png static/img/experimenters/experiment-sharing.png
cp placeholder.png static/img/experimenters/components/video.png
cp placeholder.png static/img/experimenters/components/video-config.png

# Experiment design images
cp placeholder.png static/img/experimenters/experiment-design/designer-interface.png
cp placeholder.png static/img/experimenters/experiment-design/global-components-matrix.png
cp placeholder.png static/img/experimenters/experiment-design/global-components-config.png
cp placeholder.png static/img/experimenters/experiment-design/roles-panel.png
cp placeholder.png static/img/experimenters/experiment-design/create-role.png
cp placeholder.png static/img/experimenters/experiment-design/component-visibility.png
cp placeholder.png static/img/experimenters/experiment-design/role-assignment.png
cp placeholder.png static/img/experimenters/experiment-design/state-structure.png
cp placeholder.png static/img/experimenters/experiment-design/add-state.png
cp placeholder.png static/img/experimenters/experiment-design/linear-flow.png
cp placeholder.png static/img/experimenters/experiment-design/conditional-transition.png
cp placeholder.png static/img/experimenters/experiment-design/variables-panel.png
cp placeholder.png static/img/experimenters/experiment-design/create-variable.png
cp placeholder.png static/img/experimenters/experiment-design/variable-in-component.png
cp placeholder.png static/img/experimenters/experiment-design/variable-inspector.png
cp placeholder.png static/img/experimenters/experiment-design/components-panel.png
cp placeholder.png static/img/experimenters/experiment-design/add-component.png

# Component images
cp placeholder.png static/img/experimenters/experiment-design/components/continuous-rating.png
cp placeholder.png static/img/experimenters/experiment-design/components/continuous-rating-config.png
cp placeholder.png static/img/experimenters/experiment-design/components/image.png
cp placeholder.png static/img/experimenters/experiment-design/components/image-config.png
cp placeholder.png static/img/experimenters/experiment-design/components/multiple-choice.png
cp placeholder.png static/img/experimenters/experiment-design/components/multiple-choice-config.png
cp placeholder.png static/img/experimenters/experiment-design/components/text.png
cp placeholder.png static/img/experimenters/experiment-design/components/text-config.png
cp placeholder.png static/img/experimenters/experiment-design/components/vas-rating.png
cp placeholder.png static/img/experimenters/experiment-design/components/vas-rating-config.png
cp placeholder.png static/img/experimenters/experiment-design/components/video.png
cp placeholder.png static/img/experimenters/experiment-design/components/video-config.png
cp placeholder.png static/img/experimenters/experiment-design/components/videochat.png
cp placeholder.png static/img/experimenters/experiment-design/components/videochat-config.png

# Recruitment images
cp placeholder.png static/img/experimenters/recruitment/assignment-interface.png
cp placeholder.png static/img/experimenters/recruitment/manual-assignment.png
cp placeholder.png static/img/experimenters/recruitment/assignment-rules.png
cp placeholder.png static/img/experimenters/recruitment/group-settings.png
cp placeholder.png static/img/experimenters/recruitment/settings-interface.png
cp placeholder.png static/img/experimenters/recruitment/settings-panel.png
cp placeholder.png static/img/experimenters/recruitment/scheduling.png
cp placeholder.png static/img/experimenters/recruitment/screening.png
cp placeholder.png static/img/experimenters/recruitment/session-assignment.png
cp placeholder.png static/img/experimenters/recruitment/email-templates.png
cp placeholder.png static/img/experimenters/recruitment/assignment-notification.png
cp placeholder.png static/img/experimenters/recruitment/group-config.png

# Developer images
cp placeholder.png static/img/developers/architecture/overview.png
cp placeholder.png static/img/developers/architecture-overview.png

# Logo and misc images
cp placeholder.png static/img/logo.svg
cp placeholder.png static/img/favicon.ico
cp placeholder.png static/img/cosanlab_logo.png

# Clean up
rm placeholder.png

echo "Created placeholder images for documentation"