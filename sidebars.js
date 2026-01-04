/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  docs: [
    {
      type: 'doc',
      id: 'index',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Experimenter Guide',
      collapsed: false,
      items: [
        'experimenters/getting-started',
        {
          type: 'category',
          label: 'Experiment Design',
          items: [
            'experimenters/experiment-design/overview',
            {
              type: 'category',
              label: 'Participant Experience',
              items: [
                'experimenters/experiment-design/participant-flow',
                'experimenters/experiment-design/consent-forms',
                'experimenters/experiment-design/experiment-instructions',
                'experimenters/experiment-design/waiting-room',
                'experimenters/experiment-design/experiment-setup',
                'experimenters/experiment-design/experiment-completion',
              ],
            },
            'experimenters/experiment-design/experiment-states',
            'experimenters/experiment-design/post-experiment-questionnaires',
            'experimenters/experiment-design/variables',
            'experimenters/experiment-design/stimulus-mappings',
            'experimenters/experiment-design/roles',
            'experimenters/experiment-design/global-states',
            'experimenters/experiment-design/kernel-integration',
            {
              type: 'category',
              label: 'Components',
              items: [
                'experimenters/experiment-design/components/index',
                'experimenters/experiment-design/components/text',
                'experimenters/experiment-design/components/image',
                'experimenters/experiment-design/components/video',
                'experimenters/experiment-design/components/multiple-choice',
                'experimenters/experiment-design/components/vas-rating',
                'experimenters/experiment-design/components/videochat',
                'experimenters/experiment-design/components/continuous-rating',
                'experimenters/experiment-design/components/sparse-rating',
                'experimenters/experiment-design/components/audio-recording',
                'experimenters/experiment-design/components/scanner-pulse-recorder',
                'experimenters/experiment-design/components/trigger',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Recruitment',
          items: [
            'experimenters/recruitment/settings',
            'experimenters/recruitment/participant-assignment',
            'experimenters/recruitment/prolific-integration',
          ],
        },
        'experimenters/media-management',
        'experimenters/collaboration',
        'experimenters/data-management',
        'experimenters/data-management-interface',
        'experimenters/experiment-tracking',
        {
          type: 'category',
          label: 'API Access',
          link: {
            type: 'doc',
            id: 'experimenters/api-access/api-overview',
          },
          items: [
            'experimenters/api-access/api-keys',
            'experimenters/api-access/data-types',
            'experimenters/api-access/python-guide',
            'experimenters/api-access/javascript-guide',
            'experimenters/api-access/r-guide',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Participant Guide',
      collapsed: false,
      items: [
        'participants/getting-started',
        'participants/joining-experiments',
        'participants/device-testing',
      ],
    },
    {
      type: 'category',
      label: 'Administrator Guide',
      collapsed: false,
      items: [
        'administrators/getting-started',
        'administrators/user-management',
        'administrators/email-configuration',
        'administrators/monitoring',
      ],
    },
    {
      type: 'category',
      label: 'Developer Guide',
      collapsed: false,
      items: [
        'developers/quick-start-dev',
        'developers/development-environment',
        {
          type: 'category',
          label: 'Architecture',
          items: [
            'developers/architecture/overview',
            'developers/architecture/horizontal-scaling',
            'developers/video-synchronization',
          ],
        },
        'developers/deployment',
        'developers/deployment-kubernetes',
        'developers/monitoring',
        'developers/release-management',
        {
          type: 'category',
          label: 'Data API',
          items: [
            'developers/data-api/data-collection-v2',
          ],
        },
        {
          type: 'category',
          label: 'Technical Reference',
          items: [
            'developers/comprehension-checks',
            'developers/disconnect-timeout',
            'developers/sparse-rating-timeout',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Release Notes',
      collapsed: false,
      items: [
        'release-notes/index',
        'release-notes/v0.4',
        'release-notes/v0.3',
        'release-notes/archived',
      ],
    },
  ],
};