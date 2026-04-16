import React from 'react';
import { buildFullUiUrl, buildIframeUrl, buildOpenInStorybookUrl } from '../storybook/urls';
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

export default function StorybookEmbed({
  story,
  height = '400px',
  showControls = false,
  title,
}: StorybookEmbedProps): JSX.Element {
  const src = showControls ? buildFullUiUrl(story, 'right') : buildIframeUrl(story);

  return (
    <div className={styles.container}>
      <iframe
        src={src}
        style={{ height }}
        className={styles.iframe}
        title={title || `Storybook: ${story}`}
        loading="lazy"
        allow="microphone; camera; autoplay; clipboard-write"
      />
      <a
        href={buildOpenInStorybookUrl(story)}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        Open in Storybook →
      </a>
    </div>
  );
}
