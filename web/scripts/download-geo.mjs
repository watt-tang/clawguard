/**
 * 地图 GeoJSON 数据下载脚本
 *
 * 来源：ECharts 官方测试数据（apache/echarts GitHub 仓库，Apache 2.0 许可）
 * 目标：public/data/geo/world.json  &  public/data/geo/china.json
 *
 * 如文件已存在则跳过下载。
 * 运行：node scripts/download-geo.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const geoDir = path.join(projectRoot, 'public', 'data', 'geo');

// GeoJSON 源地址（Apache 许可，公开可用数据）
// 注：此 URL 仅供下载脚本使用，不出现在任何前端组件中
const GEO_SOURCES = [
  {
    name: 'world.json',
    url: 'https://raw.githubusercontent.com/apache/echarts/master/test/data/map/json/world.json',
  },
  {
    // echarts v4 内置中国省级地图数据（jsDelivr CDN 中国可访问）
    name: 'china.json',
    url: 'https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/china.json',
  },
];

fs.mkdirSync(geoDir, { recursive: true });

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath)) {
      console.log(`  ✓ 已存在，跳过：${path.basename(destPath)}`);
      return resolve();
    }

    console.log(`  ↓ 下载：${path.basename(destPath)} ...`);
    const file = fs.createWriteStream(destPath);

    const req = https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(destPath);
        download(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        reject(new Error(`HTTP ${res.statusCode}: ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    });

    req.on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

console.log('地图 GeoJSON 数据检查/下载...');

Promise.all(
  GEO_SOURCES.map((s) => download(s.url, path.join(geoDir, s.name)))
)
  .then(() => console.log('完成。'))
  .catch((err) => {
    console.warn(`\n⚠ 地图数据下载失败：${err.message}`);
    console.warn('地图功能将显示错误提示，其余图表不受影响。');
    console.warn('可手动将 world.json / china.json 放入 public/data/geo/ 目录。\n');
  });
