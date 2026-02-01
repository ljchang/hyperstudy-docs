const {themes} = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'HyperStudy Documentation',
  tagline: 'Comprehensive documentation for the HyperStudy app',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.hyperstudy.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config
  organizationName: 'ljchang',
  projectName: 'hyperstudy',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  trailingSlash: false,

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/', // Make docs the default landing page
          editUrl: 'https://github.com/ljchang/hyperstudy/tree/main/docs',
        },
        blog: false, // Disable the blog feature
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/hyperstudy_logo.png',
      navbar: {
        title: 'HyperStudy',
        logo: {
          alt: 'HyperStudy Logo',
          src: 'img/hyperstudy_logo.png',
          href: 'https://hyperstudy.io',
          target: '_self',
        },
        items: [
          {
            type: 'doc',
            docId: 'experimenters/getting-started',
            position: 'left',
            label: 'Experimenter Guide',
          },
          {
            type: 'doc',
            docId: 'participants/getting-started',
            position: 'left',
            label: 'Participant Guide',
          },
          {
            type: 'doc',
            docId: 'administrators/user-management',
            position: 'left',
            label: 'Admin Guide',
          },
          {
            type: 'doc',
            docId: 'developers/architecture/overview',
            position: 'left',
            label: 'Developer Guide',
          },
          {
            type: 'doc',
            docId: 'devices/index',
            position: 'left',
            label: 'Devices',
          },
          {
            type: 'doc',
            docId: 'release-notes/index',
            position: 'left',
            label: 'Release Notes',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Experimenter Guide',
                to: '/experimenters/getting-started',
              },
              {
                label: 'Participant Guide',
                to: '/participants/getting-started',
              },
              {
                label: 'Admin Guide',
                to: '/administrators/user-management',
              },
              {
                label: 'Developer Guide',
                to: '/developers/architecture/overview',
              },
              {
                label: 'Devices',
                to: '/devices/',
              },
              {
                label: 'Release Notes',
                to: '/release-notes/',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub Issues',
                href: 'https://github.com/ljchang/hyperstudy/issues',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'COSANLAB',
                href: 'https://cosanlab.com',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/ljchang/hyperstudy',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} COSANLAB. Built with Docusaurus.`,
      },
      prism: {
        theme: themes.dracula,
        darkTheme: themes.dracula,
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
    }),
};

module.exports = config;