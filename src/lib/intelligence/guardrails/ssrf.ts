/**
 * SSRF / private-network guard.
 *
 * The ingestion engine fetches URLs it discovered from the open web. A page we
 * already trust can link to http://169.254.169.254/latest/meta-data/ (cloud
 * metadata) or to an internal admin host. Every outbound fetch must pass through
 * assertPublicHttpUrl() and the resolved address must be re-checked after DNS
 * resolution to defeat DNS rebinding.
 */

export class BlockedUrlError extends Error {
  constructor(message: string, readonly code: string) {
    super(message);
    this.name = 'BlockedUrlError';
  }
}

const BLOCKED_SCHEMES = new Set(['javascript:', 'data:', 'file:', 'blob:', 'ftp:', 'vbscript:']);

function isPrivateIPv4(ip: string): boolean {
  const p = ip.split('.').map(Number);
  if (p.length !== 4 || p.some((n) => !Number.isFinite(n) || n < 0 || n > 255)) return true;
  const [a, b] = p as [number, number, number, number];
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 127) return true; // loopback
  if (a === 0) return true; // 0.0.0.0/8
  if (a === 169 && b === 254) return true; // link-local + cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a >= 224) return true; // multicast + reserved
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const l = ip.toLowerCase();
  if (l === '::' || l === '::1') return true;
  if (l.startsWith('fe80')) return true; // link-local
  if (l.startsWith('fc') || l.startsWith('fd')) return true; // unique local
  // IPv4-mapped, e.g. ::ffff:127.0.0.1
  const mapped = l.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped?.[1] && isPrivateIPv4(mapped[1])) return true;
  return false;
}

export function isPrivateAddress(ip: string): boolean {
  if (ip.includes(':')) return isPrivateIPv6(ip);
  return isPrivateIPv4(ip);
}

export interface UrlCheckOptions {
  allowNonHttps?: boolean;
  extraBlockedHosts?: string[];
}

/**
 * Validate a URL before any request is made. Returns the normalised URL.
 * Throws BlockedUrlError when the URL must not be fetched.
 */
export function assertPublicHttpUrl(rawUrl: string, opts: UrlCheckOptions = {}): URL {
  let u: URL;
  try {
    u = new URL(rawUrl);
  } catch {
    throw new BlockedUrlError(`Unparseable URL: ${rawUrl}`, 'BAD_URL');
  }
  if (BLOCKED_SCHEMES.has(u.protocol)) throw new BlockedUrlError(`Blocked scheme ${u.protocol}`, 'BAD_SCHEME');
  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new BlockedUrlError(`Blocked scheme ${u.protocol}`, 'BAD_SCHEME');
  if (!opts.allowNonHttps && u.protocol === 'http:' && process.env.BEYOND_ALLOW_INSECURE_HTTP !== '1') {
    throw new BlockedUrlError('http:// disabled; set BEYOND_ALLOW_INSECURE_HTTP=1 for local testing', 'INSECURE');
  }
  const host = u.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (!host) throw new BlockedUrlError('Missing host', 'BAD_HOST');

  for (const bad of opts.extraBlockedHosts ?? []) {
    if (host === bad || host.endsWith(`.${bad}`)) throw new BlockedUrlError(`Host on blocklist: ${host}`, 'BLOCKLISTED');
  }
  if (host.endsWith('.internal') || host.endsWith('.local') || host.endsWith('.localhost')) {
    throw new BlockedUrlError(`Internal host: ${host}`, 'INTERNAL_HOST');
  }
  // Literal IP addresses.
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) && isPrivateIPv4(host)) {
    throw new BlockedUrlError(`Private IPv4 literal: ${host}`, 'PRIVATE_IP');
  }
  if (host.includes(':') && isPrivateIPv6(host)) {
    throw new BlockedUrlError(`Private IPv6 literal: ${host}`, 'PRIVATE_IP');
  }
  return u;
}

/**
 * Re-check the *resolved* address immediately before connecting. Call this from
 * the fetch adapter (in Node, via a custom `lookup` on the agent).
 */
export function assertResolvedAddress(ip: string): void {
  if (isPrivateAddress(ip)) throw new BlockedUrlError(`Resolved to private address ${ip}`, 'DNS_REBINDING');
}
