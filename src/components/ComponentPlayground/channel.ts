/**
 * Storybook preview iframe communicates via postMessage using the shape:
 *   { key: 'storybook-channel', event: { type, args } }
 *
 * We use it to send `updateStoryArgs` — in-place arg updates with no iframe reload.
 */

const CHANNEL_KEY = 'storybook-channel';

export class StorybookChannel {
  private iframe: HTMLIFrameElement | null = null;

  attach(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
  }

  detach() {
    this.iframe = null;
  }

  updateStoryArgs(storyId: string, updatedArgs: Record<string, unknown>): void {
    const target = this.iframe?.contentWindow;
    if (!target) return;
    target.postMessage(
      { key: CHANNEL_KEY, event: { type: 'updateStoryArgs', args: [{ storyId, updatedArgs }] } },
      '*'
    );
  }
}
