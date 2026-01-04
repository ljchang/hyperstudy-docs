# HyperStudy Documentation

This directory contains the Docusaurus-based documentation for the HyperStudy platform.

## Getting Started

To work with the documentation locally:

1. Install dependencies:
   ```bash
   cd docs
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Build the documentation:
   ```bash
   npm run build
   ```

4. Serve the built documentation:
   ```bash
   npm run serve
   ```

## Documentation Structure

- `/docs` - All documentation content organized by user type:
  - `/experimenters` - Documentation for researchers
  - `/participants` - Documentation for experiment participants
  - `/administrators` - Documentation for system administrators
  - `/developers` - Documentation for developers

- `/static/img` - Images used in the documentation
  - `/experimenters` - Screenshots for experimenter guide
  - `/participants` - Screenshots for participant guide
  - `/administrators` - Screenshots for admin guide
  - `/developers` - Diagrams and screenshots for developer guide

## Adding Content

1. For new documentation pages, add Markdown files to the appropriate directory in `/docs`
2. For screenshots, add images to the appropriate directory in `/static/img`
3. Update `sidebars.js` if you need to add new sections to the navigation

## Missing Images

If the build fails due to missing image files, you can use the included script to create placeholder images:

```bash
./create_image_placeholders.sh
```

This script creates empty 1x1 transparent PNG files for all referenced images that are missing from the documentation. This allows you to build and preview the documentation structure without needing all the actual screenshots and images.

When you're ready to replace the placeholders with actual images, simply add the real image files to the corresponding locations in the `static/img/` directory.

## Broken Link Warnings

You may see warnings about broken markdown links when building the docs. These are non-fatal warnings that indicate links to documentation pages that haven't been created yet. As you create more documentation files, these warnings will disappear.

## Documentation Conventions

- Use clear, concise language
- Include screenshots for UI elements
- Start each document with a brief overview
- Use consistent heading levels
- Add code samples for developer documentation

## Deployment

This documentation is configured to deploy to GitHub Pages via GitHub Actions. When changes are pushed to the main branch in the `docs/` directory, the documentation will be automatically built and deployed.

For setup instructions and troubleshooting, see [GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md).

You can also deploy manually:

```bash
GIT_USER=<Your GitHub username> npm run deploy
```

Alternatively, the site can be built and deployed to any static hosting provider:

```bash
npm run build
# Copy contents of build directory to hosting provider
```