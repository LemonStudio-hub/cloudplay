const ROOM_ID_RE = /^[a-zA-Z0-9_-]{3,20}$/;
const HOSTNAME_RE = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export function sanitizeRoomId(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20);
}

export function validateRoomId(roomId: string): string | null {
  const trimmed = roomId.trim();
  if (!trimmed) return '请输入房间 ID';
  if (trimmed.length < 3) return '房间 ID 至少 3 个字符';
  if (trimmed.length > 20) return '房间 ID 最多 20 个字符';
  if (!ROOM_ID_RE.test(trimmed)) return '仅支持字母、数字、下划线和连字符';
  return null;
}

export function validatePort(port: number): string | null {
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return '端口范围需在 1–65535';
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
  // keep multi-label hostnames; only strip numeric port
  value = value.replace(/:(\d+)$/, '');
  // strip trailing dots / spaces
  value = value.replace(/\.+$/, '').trim().toLowerCase();
  return value;
}

export function validateServerAddress(address: string): string | null {
  const host = normalizeServerAddress(address);
  if (!host) return '请输入服务器地址';
  if (!HOSTNAME_RE.test(host) && !host.endsWith('.lat') && !host.includes('.')) {
    return '地址格式不正确，例如 room.cloudplay.lat';
  }
  if (host.includes(' ') || host.includes('/')) {
    return '地址不能包含空格或路径';
  }
  return null;
}

export function buildHostname(roomId: string, domain = 'cloudplay.lat'): string {
  return `${roomId.trim()}.${domain}`;
}
