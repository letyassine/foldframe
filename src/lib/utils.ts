export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

const LOCAL_HOSTS =
  /^(localhost|127\.\d+\.\d+\.\d+|0\.0\.0\.0|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+|\[[0-9a-f:]+\]|[a-z0-9-]+\.local)(:\d+)?(\/|$)/i;
const PROTOCOL = /^([a-z][a-z0-9+.-]*):\/\//i;

/**
 * Turns whatever a developer pastes into a safe http(s) URL.
 * `localhost:5173` becomes `http://localhost:5173`, everything else
 * defaults to https. Non-http protocols are rejected.
 */
export function normalizeUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value || /\s/.test(value)) return null;

  const protocol = value.match(PROTOCOL);
  if (protocol && !/^https?$/i.test(protocol[1])) return null;

  const isLocal = LOCAL_HOSTS.test(value);
  const withProtocol =
    protocol ? value : `${isLocal ? "http" : "https"}://${value}`;

  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    if (!parsed.hostname) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}


export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
