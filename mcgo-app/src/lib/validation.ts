const ROOM_ID_RE = /^[a-zA-Z0-9_-]{3,20}$/;
const HOSTNAME_RE = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export function sanitizeRoomId(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20);
}

/** Validate room ID. Returns i18n key or null. */
export function validateRoomId(roomId: string): string | null {
  const trimmed = roomId.trim();
  if (!trimmed) return 'validation.roomIdEmpty';
  if (trimmed.length < 3) return 'validation.roomIdShort';
  if (trimmed.length > 20) return 'validation.roomIdLong';
  if (!ROOM_ID_RE.test(trimmed)) return 'validation.roomIdInvalid';
  return null;
}

/** Validate port number. Returns i18n key or null. */
export function validatePort(port: number): string | null {
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return 'validation.portRange';
  }
  return null;
}

/** Normalize pasted server address into bare hostname. */
export function normalizeServerAddress(raw: string): string {
  let value = raw.trim();
  if (!value) return '';

  // strip protocol
  value = value.replace(/^https?:\/\//i, '');
  // strip path / query / fragment
  value = value.split(/[/?#]/)[0] ?? value;
  // strip trailing port if user pasted host:port
  value = value.replace(/:(\d+)$/, '');
  // strip trailing dots / spaces
  value = value.replace(/\.+$/, '').trim().toLowerCase();
  return value;
}

/** Validate server address. Returns i18n key or null. */
export function validateServerAddress(address: string): string | null {
  const host = normalizeServerAddress(address);
  if (!host) return 'validation.addressEmpty';
  if (!HOSTNAME_RE.test(host) && !host.endsWith('.lat') && !host.includes('.')) {
    return 'validation.addressInvalid';
  }
  if (host.includes(' ') || host.includes('/')) {
    return 'validation.addressPath';
  }
  return null;
}

export function buildHostname(roomId: string, domain = 'cloudplay.lat'): string {
  return `${roomId.trim()}.${domain}`;
}
