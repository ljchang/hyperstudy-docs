import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StorybookChannel } from './channel';
import { ControlsPanel, type ArgTypes } from './controls';
import { buildIframeUrl, buildOpenInStorybookUrl } from '../storybook/urls';
import styles from './styles.module.css';

export interface Preset {
  name: string;
  args: Record<string, unknown>;
}

interface ComponentPlaygroundProps {
  /** Story ID, e.g. "experiment-showtext--default" */
  story: string;
  /** Argument definitions that drive the control panel */
  argTypes: ArgTypes;
  /** Initial values — if omitted, `argType.defaultValue` is used per key */
  initialArgs?: Record<string, unknown>;
  /** Named configurations the reader can one-click apply */
  presets?: Preset[];
  /** Unique id used to scope URL state when multiple playgrounds share a page */
  cfgKey?: string;
  /** Iframe height */
  height?: string;
  /** Accessible title */
  title?: string;
}

const URL_WRITE_DEBOUNCE_MS = 200;

function encodeArgs(args: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(args)) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'object') continue;
    const v = String(value).replace(/[;,]/g, ch => encodeURIComponent(ch));
    parts.push(`${key}:${v}`);
  }
  return parts.join(';');
}

function resolveInitialValues(argTypes: ArgTypes, initialArgs?: Record<string, unknown>): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const [key, argType] of Object.entries(argTypes)) {
    if (initialArgs && key in initialArgs) {
      values[key] = initialArgs[key];
    } else if ('defaultValue' in argType && argType.defaultValue !== undefined) {
      values[key] = argType.defaultValue;
    }
  }
  return values;
}

function paramName(cfgKey?: string): string {
  return cfgKey ? `cfg-${cfgKey}` : 'cfg';
}

function readUrlState(cfgKey: string | undefined, argTypes: ArgTypes): Record<string, unknown> | null {
  if (typeof window === 'undefined') return null;
  try {
    const encoded = new URLSearchParams(window.location.search).get(paramName(cfgKey));
    if (!encoded) return null;
    const json = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
    const parsed = JSON.parse(json) as Record<string, unknown>;
    // Drop keys not in argTypes so stale URLs can't inject unknown args
    const filtered: Record<string, unknown> = {};
    for (const key of Object.keys(parsed)) {
      if (key in argTypes) filtered[key] = parsed[key];
    }
    return filtered;
  } catch {
    return null;
  }
}

function writeUrlState(cfgKey: string | undefined, values: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    const encoded = btoa(JSON.stringify(values))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    url.searchParams.set(paramName(cfgKey), encoded);
    window.history.replaceState(null, '', url.toString());
  } catch {
    /* non-fatal */
  }
}

export default function ComponentPlayground({
  story,
  argTypes,
  initialArgs,
  presets,
  cfgKey,
  height = '500px',
  title,
}: ComponentPlaygroundProps): JSX.Element {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const fromUrl = readUrlState(cfgKey, argTypes);
    const defaults = resolveInitialValues(argTypes, initialArgs);
    return fromUrl ? { ...defaults, ...fromUrl } : defaults;
  });
  const [copied, setCopied] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const channelRef = useRef<StorybookChannel | null>(null);
  const urlWriteTimerRef = useRef<number | null>(null);
  const copiedTimerRef = useRef<number | null>(null);

  // Initial src encodes args so first paint is correct; subsequent updates flow through the channel
  const initialSrc = useMemo(() => {
    const argsParam = encodeArgs(values);
    return buildIframeUrl(story, argsParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story]);

  useEffect(() => {
    if (!iframeRef.current) return;
    const channel = new StorybookChannel();
    channel.attach(iframeRef.current);
    channelRef.current = channel;
    return () => {
      channel.detach();
      channelRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (urlWriteTimerRef.current !== null) window.clearTimeout(urlWriteTimerRef.current);
      if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current);
    };
  }, []);

  const scheduleUrlWrite = (nextValues: Record<string, unknown>) => {
    if (urlWriteTimerRef.current !== null) window.clearTimeout(urlWriteTimerRef.current);
    urlWriteTimerRef.current = window.setTimeout(() => {
      writeUrlState(cfgKey, nextValues);
      urlWriteTimerRef.current = null;
    }, URL_WRITE_DEBOUNCE_MS);
  };

  /**
   * Apply a partial update to values: filter out unknown keys, skip no-ops,
   * broadcast to the iframe, and schedule a URL write.
   */
  const applyDelta = (delta: Record<string, unknown>) => {
    setValues(prev => {
      const filtered: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(delta)) {
        if (key in argTypes && !Object.is(prev[key], value)) filtered[key] = value;
      }
      if (Object.keys(filtered).length === 0) return prev;
      const nextValues = { ...prev, ...filtered };
      channelRef.current?.updateStoryArgs(story, filtered);
      scheduleUrlWrite(nextValues);
      return nextValues;
    });
  };

  const handleChange = (key: string, next: unknown) => {
    applyDelta({ [key]: next });
  };

  const applyPreset = (preset: Preset) => {
    applyDelta(preset.args);
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    // Flush any pending debounced URL write so the share link reflects the latest state
    if (urlWriteTimerRef.current !== null) {
      window.clearTimeout(urlWriteTimerRef.current);
      urlWriteTimerRef.current = null;
      writeUrlState(cfgKey, values);
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = window.setTimeout(() => {
        setCopied(false);
        copiedTimerRef.current = null;
      }, 2000);
    } catch {
      /* clipboard access denied — silently skip */
    }
  };

  return (
    <div className={styles.playground}>
      <div className={styles.layout} style={{ minHeight: height }}>
        <div className={styles.controlsColumn}>
          {presets && presets.length > 0 && (
            <div className={styles.presets}>
              <div className={styles.controlsTitle}>Presets</div>
              <div className={styles.presetButtons}>
                {presets.map(p => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className={styles.presetButton}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <ControlsPanel argTypes={argTypes} values={values} onChange={handleChange} />
        </div>
        <div className={styles.previewColumn}>
          <iframe
            ref={iframeRef}
            src={initialSrc}
            title={title || `Component playground: ${story}`}
            className={styles.iframe}
            style={{ height }}
            loading="lazy"
          />
        </div>
      </div>
      <div className={styles.footer}>
        <button type="button" onClick={handleShare} className={styles.shareButton}>
          {copied ? 'Copied!' : 'Share configuration'}
        </button>
        <a
          href={buildOpenInStorybookUrl(story)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.openLink}
        >
          Open in Storybook →
        </a>
      </div>
    </div>
  );
}
