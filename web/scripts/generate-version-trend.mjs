import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'data', 'mock');

const versions = [
  'v1.2.4','v1.2.3','v1.2.2','v1.2.1','v1.2.0',
  'v1.1.9','v1.1.8','v1.1.7','v1.1.6','v1.1.5',
  'v1.1.4','v1.1.3','v1.1.2','v1.1.1','v1.1.0',
  'v1.0.9','v1.0.8','v1.0.7','v1.0.6','v1.0.5',
];

const dates = [];
const baseDate = new Date('2025-09-14');
for (let i = 0; i < 181; i++) {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + i);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  dates.push(`${y}-${m}-${day}`);
}

const bases = [42000, 18000, 12000, 8000, 6000, 5000, 4200, 3800, 3200, 2800, 2200, 1800, 1400, 1100, 800, 600, 400, 300, 200, 100];

const versionData = {};
versions.forEach((v, vi) => {
  const base = bases[vi];
  const trend = vi < 5 ? 0.3 : -0.6; // newer versions grow, older decline
  versionData[v] = dates.map((_, i) => {
    const noise = Math.floor((Math.random() - 0.4) * base * 0.04);
    return Math.max(0, Math.floor(base + noise + i * trend));
  });
});

fs.writeFileSync(
  path.join(outDir, 'version-trend.json'),
  JSON.stringify({ dates, versions: versionData }, null, 2)
);
console.log('version-trend.json generated');
