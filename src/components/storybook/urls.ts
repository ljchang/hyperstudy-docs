export const STORYBOOK_BASE = 'https://storybook.hyperstudy.io';

export function buildIframeUrl(story: string, argsParam?: string): string {
  const args = argsParam ? `&args=${encodeURIComponent(argsParam)}` : '';
  return `${STORYBOOK_BASE}/iframe.html?id=${encodeURIComponent(story)}&viewMode=story${args}`;
}

export function buildFullUiUrl(story: string, panel: 'right' | 'bottom' = 'bottom'): string {
  return `${STORYBOOK_BASE}/?path=/story/${encodeURIComponent(story)}&full=1&shortcuts=false&singleStory=true&panel=${panel}`;
}

export function buildOpenInStorybookUrl(story: string): string {
  return `${STORYBOOK_BASE}/?path=/story/${encodeURIComponent(story)}`;
}
