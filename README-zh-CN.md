# ClawGuard：Claw 系列产品生态安全检测平台

[English](./README.md) | 简体中文

ClawGuard 是面向 Claw、OpenClaw 及 Skill 生态的全栈安全检测与治理平台。随着 OpenClaw 及其衍生产品的快速发展，公网暴露资产识别、Skill 后门投毒、漏洞情报分散和安全研究动态追踪等问题日益凸显。ClawGuard 从 Claw 系列产品网络空间测绘、Skill 检测、漏洞情报追踪与学术安全前沿等多个角度出发，构建集信息检索查询、风险检测、情报聚合和可视化展示于一体的综合安全平台。

平台围绕业务主题划分为五大版块：Claw 系列公网暴露监测、Skill 生态后门投毒治理、Claw 产品安全总览、OpenClaw 风险漏洞追踪和学术安全前沿。系统通过持续测绘、风险检测、漏洞追踪、情报聚合和态势展示，形成覆盖部署实例、Skill 资源、漏洞情报和研究动态的安全治理闭环。

## 功能概览

### Claw 系列公网暴露监测

面向 OpenClaw、GoClaw、IronClaw、PicoClaw、TinyClaw 和 ZeroClaw 等 Claw 系列产品，提供公网暴露实例、版本实例、地理分布、端口服务详情和历史趋势分析。平台结合 XMap 高速端口探测、ZGrab2 服务信息采集与多维指纹判定机制，实现对 Claw 系列公网暴露资产的自动化识别和持续监测。

### Skill 生态后门投毒治理

面向 Skill 生态中的后门投毒、越权读取、数据外传、代码执行、依赖链投毒和规则污染等风险，提供 Skill 风险查询、静态检测、批量扫描、危险样本复核和动态沙箱验证能力。平台聚合多个开源静态 Skill 扫描器，对公开 Skill 样本开展批量化安全初筛，并将高危样本送入动态沙箱进行行为验证。

### Claw 产品安全总览

作为 Claw 系列产品安全态势总览看板，平台从安全事件、风险告警、响应进度、攻击面结构和整体风险画像等维度，展示 Claw 生态的安全态势，为风险研判和治理决策提供统一入口。

### OpenClaw 风险漏洞追踪

持续聚合 GitHub Security Advisory、NVD CVE、官方公告和多源漏洞情报，展示 OpenClaw 相关漏洞、严重等级、CVSS 评分、修复版本、修复状态和快照信息。该模块支持漏洞风险追踪、修复进度观察和数据库快照管理。

### 学术安全前沿

聚合与 OpenClaw、Skill、Agent、Plugin 及相关方向有关的论文、预印本和安全研究动态，帮助研究人员快速检索生态安全研究进展，为漏洞分析、攻防研究和后续治理提供参考。

## 核心特色

### 周期性日级公网暴露资产持续扫描

平台将传统互联网资产探测扩展为面向 Agent 生态的长期观测能力。通过 XMap、ZGrab2 与多维指纹识别机制，对 OpenClaw 及其衍生产品的公网暴露实例进行持续扫描、入库和趋势分析。

### 版本级指纹库设计

针对 OpenClaw 公网暴露实例，平台利用前端构建产物中静态资源文件名与软件版本之间的稳定映射关系，构建双向索引版本指纹库，实现暴露实例的版本级归属确认。该机制能够辅助识别长期暴露的旧版本实例和潜在高风险部署。

### 聚合式静态 Skill 检测

平台通过适配层编排多个静态扫描器，对 Skill 描述文件、依赖配置、脚本逻辑、危险调用、外部载荷和可疑行为特征进行统一扫描，形成标准化风险标签、严重程度和证据报告。

### 轻量级动态沙箱 Skill 检测

动态沙箱扫描器在隔离环境中执行上传样本，观测运行过程行为，恢复行为链路，并输出可追溯、可解释、可复核的风险证据。该模块用于对高危 Skill 样本进行进一步验证，降低仅依赖静态规则带来的误判和漏判风险。

### 多源情报融合与可视化交互

平台将漏洞库、论文列表、公开安全情报、扫描结果和本地数据库进行统一建模与筛选，使用交互式地图、趋势图、统计卡片、风险列表和详情表格，将复杂安全数据转化为直观可读的可视化结果。

## 技术栈

- 前端：React 19、Vite 7、Tailwind CSS 4、ECharts 6、Lucide React、React Markdown
- 后端：Node.js ESM、Express 5、Prisma Client
- 数据库：MySQL 8.4
- 扫描与分析：Node.js 调度编排、Python 扫描器、ProvLoom 动态分析组件
- 部署：Docker Compose，应用容器同时提供前端静态页面和 `/api/*` 接口服务

## 仓库结构

```text
clawguard/
|-- Doc/                  # 项目文档、API 说明与数据需求
|-- docs/                 # 规划、过程记录与说明文档
|-- scanners/             # 多代 Skill 扫描器
|-- provloom/             # 动态沙箱和深度分析组件
|-- web/                  # 主 Web 应用
|   |-- src/              # React 前端
|   |-- server/           # Express API 服务
|   |-- shared/           # 前后端共享配置
|   |-- prisma/           # Prisma schema
|   `-- scripts/          # 数据导入、刷新、扫描和运维脚本
|-- Dockerfile            # 生产镜像构建文件
|-- docker-compose.yml    # app + mysql 服务编排
`-- DEPLOYMENT.md         # Docker 部署说明
```

运行时数据、缓存、日志和备份不应提交到代码仓库。除非有明确原因并经过审查，不要提交 `data/`、`db/`、`logs/`、`runtime-cache/`、`backups/`、`web/node_modules/`、`web/dist/` 和 `web/generated/` 等目录中的生成内容。

## 环境要求

- Node.js 22 或兼容版本
- npm
- MySQL 8.4 或 Docker Compose
- Python 3，用于扫描器和动态分析流程
- Docker，用于生产部署和动态沙箱相关工作流

## 环境变量

根目录 `.env` 用于 Docker Compose 部署；`web/.env` 或 `web/.env.local` 可用于本地开发。不要提交真实密钥、生产数据库连接字符串或本地凭据。

常见配置如下：

```env
MYSQL_ROOT_PASSWORD=change-me
DATABASE_URL=mysql://root:change-me@mysql:3306/clawguard
API_PORT=8787
VITE_ADMIN_DEFAULT_API_KEY=
PROVLOOM_LLM_API_KEY=
GEOLITE2_CITY_DB=/app/web/geoip/GeoLite2-City.mmdb
GEOLITE2_ASN_DB=/app/web/geoip/GeoLite2-ASN.mmdb
OPENCLAW_RISK_CACHE_DIR=/app/runtime-cache/openclaw-risk
SECURITY_RESEARCH_CACHE_DIR=/app/runtime-cache/security-research
SKILL_DYNAMIC_CONCURRENCY_LIMIT=30
```

本地开发时，请将 `DATABASE_URL` 设置为可访问的 MySQL 实例。

## 本地开发

进入 Web 应用目录并安装依赖：

```bash
cd web
npm install
```

启动前端与 API 服务：

```bash
npm run dev
```

常用命令：

```bash
npm run dev:web        # 启动 Vite 前端
npm run dev:api        # 启动 Express API
npm run db:generate    # 生成 Prisma Client
npm run db:push        # 将 Prisma schema 变更同步到数据库
npm run build          # 构建生产版前端
npm run start          # 启动生产版 Express 服务
```

默认端口：

```text
Vite 前端：5173
API / 生产应用：8787
```

## Docker 部署

准备根目录 `.env` 后启动服务：

```bash
docker compose up -d --build
```

访问应用：

```text
http://<server-host>:8787
```

常用运维命令：

```bash
docker compose ps
docker compose logs -f app
docker compose logs -f mysql
```

`db/clawguard.sql` 仅会在 `mysql_data` 数据卷为空时导入。若需要从零重新导入数据库：

```bash
docker compose down -v
docker compose up -d --build
```

请谨慎使用 `down -v`，该命令会删除当前 MySQL 数据卷。

## 数据刷新与维护脚本

以下命令通常在 `web/` 目录下执行，用于维护暴露面数据、风险漏洞数据和研究前沿数据：

```bash
npm run generate:data
npm run generate:version-trend
npm run download:geo
npm run db:import:exposure
npm run db:import:product
npm run db:rebuild:agg
npm run risk:refresh
npm run research:refresh
```

Skill 治理相关脚本：

```bash
npm run skill:scan:static
npm run skill:rescan:risky
npm run skill:rescan:progress
npm run skill:export:dangerous
```

这些脚本可能读取或生成数据、缓存和日志文件。提交前请检查 Git 状态，避免误提交运行时数据或扫描产物。

## API 概览

### 健康检查与认证

```text
GET  /api/health
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### 暴露面监测

```text
GET /api/exposure/stats
GET /api/exposure/world-distribution
GET /api/exposure/china-distribution
GET /api/exposure/trend
GET /api/exposure/version-trend
GET /api/exposure/list
```

### 风险与研究聚合

```text
GET  /api/openclaw-risk/overview
GET  /api/openclaw-risk/issues
POST /api/openclaw-risk/refresh
GET  /api/security-research/overview
GET  /api/security-research/papers
POST /api/security-research/refresh
```

### Skill 治理

```text
GET  /api/skill/intelligence/overview
GET  /api/skill/search
POST /api/skill/scan
GET  /api/skill/scan/status
GET  /api/skill/dynamic-sandbox/capacity
POST /api/skill/dynamic-sandbox
```

## 提交规范

提交前建议执行：

```bash
git status --short
git diff --check
git diff --stat
```

建议只提交源代码、配置文件、文档以及必要的脚本或迁移文件。不要提交：

- `.env`、`.env.local` 或任何真实密钥
- `data/`、`runtime-cache/`、`logs/`、`backups/`、`web/public/data/` 下的运行时数据
- 未经确认需要入库的数据库 dump
- 构建产物、依赖目录、临时文件、扫描器输出、导出的 CSV 文件或日志

## 相关文档

- `DEPLOYMENT.md`：Docker 部署说明
- `Doc/`：项目架构、技术路线、API 和前端数据需求说明
- `db/README.md`：数据库初始化与数据导入说明

## 项目成果与定位

ClawGuard 面向 OpenClaw 全生态安全治理需求，构建从资产发现、版本识别、风险检测、漏洞追踪到态势展示的系统化解决方案。平台以用户友好的安全监测界面，增强 Claw 系列产品在快速演进生态中的资产感知能力、风险识别能力与持续治理能力，为 OpenClaw 生态安全研究和长期治理提供支撑。