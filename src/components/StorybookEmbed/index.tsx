import React from 'react';
import styles from './styles.module.css';

interface StorybookEmbedProps {
  /** Story ID in format "category-component--story-name" */
  story: string;
  /** Height of the iframe */
  height?: string;
  /** Show Storybook controls panel (uses full UI) */
  showControls?: boolean;
  /** Title for accessibility */
  title?: string;
}

/**
 * Embeds a Storybook story in the documentation.
 *
 * Usage:
 * ```jsx
 * <StorybookEmbed story="experiment-showtext--default" />
 * <StorybookEmbed story="experiment-vasrating--default" showControls height="600px" />
 * ```
 */
export default function StorybookEmbed({
  story,
  height = '400px',
  showControls = false,
  title,
}: StorybookEmbedProps): JSX.Element {
  const baseUrl = 'https://storybook.hyperstudy.io';

  // Use full UI path for controls, iframe.html for just the story
  const src = showControls
    ? `${baseUrl}/?path=/story/${story}&full=1&shortcuts=false&singleStory=true`
    : `${baseUrl}/iframe.html?id=${story}&viewMode=story`;

  return (
    <div className={styles.container}>
      <iframe
        src={src}
        style={{ height }}
        className={styles.iframe}
        title={title || `Storybook: ${story}`}
        loading="lazy"
        allow="clipboard-write"
      />
      <a
        href={`${baseUrl}/?path=/story/${story}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        Open in Storybook →
      </a>
    </div>
  );
}
