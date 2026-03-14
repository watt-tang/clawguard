/**
 * IP 地址脱敏工具
 * 保留首段和末段，中间两段替换为 *
 * 例：47.79.2.100 → 47.*.*.100
 */
export function maskIp(ip) {
  if (!ip || typeof ip !== 'string') return ip;
  const parts = ip.split('.');
  if (parts.length !== 4) return ip;
  return `${parts[0]}.*.*.${parts[3]}`;
}

/**
 * 字段脱敏：将任意字符串替换为遮码显示
 */
export function maskField(value) {
  if (!value) return '***';
  return '***';
}
