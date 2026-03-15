import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface PlatformInfo {
  key: string;
  label: string;
  match: string; // substring to match in asset filename
}

interface AssetInfo {
  platform: PlatformInfo;
  url: string;
  size: number;
  name: string;
}

interface ReleaseData {
  version: string;
  assets: AssetInfo[];
}

interface GitHubDownloadProps {
  /** GitHub repo in "owner/name" format */
  repo: string;
  /** Platform definitions to match against release assets */
  platforms: PlatformInfo[];
  /** App name for aria-labels (defaults to repo name) */
  appName?: string;
}

const BRIDGE_PLATFORMS: PlatformInfo[] = [
  { key: 'mac-arm', label: 'macOS (Apple Silicon)', match: 'aarch64-apple-darwin.dmg' },
  { key: 'mac-intel', label: 'macOS (Intel)', match: 'x86_64-apple-darwin.dmg' },
  { key: 'windows', label: 'Windows', match: 'x86_64-windows.msi' },
  { key: 'linux', label: 'Linux', match: 'x86_64-linux.AppImage' },
];

const GIGE_PLATFORMS: PlatformInfo[] = [
  { key: 'mac', label: 'macOS (Apple Silicon)', match: '.dmg' },
];

/** Pre-configured download component for HyperStudy Bridge */
export function BridgeDownload(): JSX.Element {
  return (
    <GitHubDownload
      repo="hyperstudyio/hyperstudy-bridge"
      platforms={BRIDGE_PLATFORMS}
      appName="HyperStudy Bridge"
    />
  );
}

/** Pre-configured download component for GigE Virtual Camera */
export function GigEDownload(): JSX.Element {
  return (
    <GitHubDownload
      repo="hyperstudyio/hyperstudy-gige"
      platforms={GIGE_PLATFORMS}
      appName="GigE Virtual Camera"
    />
  );
}

function detectPlatform(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Mac')) return 'mac-arm'; // Default to Apple Silicon
  if (ua.includes('Win')) return 'windows';
  if (ua.includes('Linux') && !ua.includes('Android')) return 'linux';
  return 'unknown';
}

function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

function getExtension(filename: string): string {
  if (filename.endsWith('.AppImage')) return 'APPIMAGE';
  const ext = filename.split('.').pop() || '';
  return ext.toUpperCase();
}

function cacheKey(repo: string): string {
  return `gh-release-${repo}`;
}

function getCachedRelease(repo: string): ReleaseData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(cacheKey(repo));
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL_MS) {
      // Don't remove — the 304 branch needs to re-read and refresh the TTL
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCachedRelease(repo: string, data: ReleaseData): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(
      cacheKey(repo),
      JSON.stringify({ data, timestamp: Date.now() }),
    );
  } catch {
    // sessionStorage may be full or unavailable
  }
}

function parseRelease(json: any, platforms: PlatformInfo[]): ReleaseData | null {
  if (!json?.tag_name || !Array.isArray(json.assets)) return null;

  const assets: AssetInfo[] = [];
  for (const platform of platforms) {
    const match = json.assets.find(
      (a: any) => a.name?.includes(platform.match),
    );
    if (match) {
      assets.push({
        platform,
        url: match.browser_download_url,
        size: match.size,
        name: match.name,
      });
    }
  }

  return { version: json.tag_name, assets };
}

export default function GitHubDownload({
  repo,
  platforms,
  appName,
}: GitHubDownloadProps): JSX.Element {
  const [release, setRelease] = useState<ReleaseData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detectedPlatform, setDetectedPlatform] = useState('unknown');

  const apiUrl = `https://api.github.com/repos/${repo}/releases/latest`;
  const releasesPage = `https://github.com/${repo}/releases/latest`;
  const key = cacheKey(repo);
  const label = appName || repo.split('/').pop() || repo;

  useEffect(() => {
    setDetectedPlatform(detectPlatform());

    const cached = getCachedRelease(repo);
    if (cached) {
      setRelease(cached);
      setLoading(false);
      return;
    }

    async function fetchRelease() {
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
      };
      if (typeof window !== 'undefined') {
        const etag = sessionStorage.getItem(key + '-etag');
        if (etag) headers['If-None-Match'] = etag;
      }

      const res = await fetch(apiUrl, { headers });

      if (res.status === 304) {
        const raw = sessionStorage.getItem(key);
        if (raw) {
          const { data } = JSON.parse(raw);
          setCachedRelease(repo, data);
          return data as ReleaseData;
        }
        throw new Error('Cache missing after 304');
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const etag = res.headers.get('ETag');
      if (etag && typeof window !== 'undefined') {
        sessionStorage.setItem(key + '-etag', etag);
      }

      const json = await res.json();
      const data = parseRelease(json, platforms);
      if (!data) throw new Error('Invalid release data');
      setCachedRelease(repo, data);
      return data;
    }

    fetchRelease()
      .then((data) => {
        setRelease(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>Loading latest release info...</div>
    );
  }

  if (error || !release) {
    return (
      <div className={styles.fallback}>
        <p>Download the latest release from GitHub:</p>
        <a
          href={releasesPage}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.fallbackLink}
        >
          View Releases on GitHub
        </a>
      </div>
    );
  }

  const isSingleAsset = release.assets.length === 1;

  return (
    <div className={styles.container}>
      <span className={styles.versionBadge}>Latest: {release.version}</span>
      <div className={isSingleAsset ? styles.single : styles.grid}>
        {release.assets.map((asset) => {
          const isRecommended =
            asset.platform.key === detectedPlatform ||
            (asset.platform.key === 'mac' && detectedPlatform === 'mac-arm');
          return (
            <a
              key={asset.platform.key}
              href={asset.url}
              className={`${styles.card} ${isRecommended ? styles.recommended : ''}`}
              aria-label={`Download ${label} for ${asset.platform.label}`}
            >
              {isRecommended && !isSingleAsset && (
                <span className={styles.recommendedLabel}>
                  Recommended for you
                </span>
              )}
              <span className={styles.platformName}>
                {asset.platform.label}
              </span>
              <span className={styles.fileInfo}>
                {getExtension(asset.name)}
                {' · '}
                {formatSize(asset.size)}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
