# ClawGuard 登录注册与邀请码 MVP 实施路线

## 目标

本次改造目标是把当前前端演示级登录注册，升级为可用于比赛展示的后端真实认证方案，并引入后端管理的邀请码系统。

本期范围：

- 做真实登录/注册
- 做普通邀请码注册
- 邀请码支持次数限制、有效期、禁用
- 管理能力通过服务器脚本执行
- 前端继续沿用现有登录/注册弹窗

本期暂不做：

- 评委专用邀请码
- 管理员可视化管理页面
- 复杂权限后台

后续扩展时，可以在当前方案上补：

- 评委专用邀请码
- 邀请码分类字段
- 管理员后台页面
- 更细的审计日志

## 当前项目现状

当前仓库中：

- 登录/注册弹窗位于 `web/src/App.jsx`
- 认证逻辑位于 `web/src/hooks/useAuth.js`
- 用户与会话当前保存在浏览器 `localStorage/sessionStorage`
- 邀请码当前写死在 `web/src/config.js`
- 后端 API 入口位于 `web/server/index.mjs`
- 数据访问使用 Prisma，schema 位于 `web/prisma/schema.prisma`

这意味着现在的登录注册更接近前端演示逻辑，不适合继续叠加邀请码管理能力。邀请码、用户、权限边界都应改为后端控制。

## 目标架构

推荐采用以下结构：

- 前端：负责登录/注册表单、错误提示、当前用户状态展示
- 后端 API：负责注册、登录、登出、获取当前用户
- 数据库：存储用户、邀请码、邀请码使用记录
- 服务器脚本：负责创建邀请码、查看邀请码、修改邀请码、禁用邀请码

整体职责边界：

- 前端不再保存用户库
- 前端不再校验邀请码真伪
- 后端统一校验邀请码可用性
- 管理员能力先不做页面，通过终端脚本执行

## 数据模型设计

### 1. User

建议新增 `User` 表，字段如下：

- `id`: 主键
- `username`: 唯一用户名
- `passwordHash`: 密码哈希
- `phone`: 唯一手机号
- `role`: `admin` / `user`
- `status`: `active` / `disabled`
- `createdAt`
- `updatedAt`

说明：

- 密码必须保存哈希，不保存明文
- `role` 先保留，即使当前不做管理员网页，后续也可扩展
- `status` 可用于停用账号

### 2. InviteCode

建议新增 `InviteCode` 表，字段如下：

- `id`: 主键
- `code`: 唯一邀请码字符串
- `maxUses`: 最大可使用次数
- `usedCount`: 已使用次数
- `expiresAt`: 过期时间，可为空
- `status`: `active` / `disabled`
- `note`: 备注
- `createdBy`: 创建人标记，可为空
- `createdAt`
- `updatedAt`

说明：

- 当前先不做评委专用邀请码，因此本期可以不加 `type`
- `expiresAt` 允许为空，表示永不过期
- `usedCount` 由后端注册逻辑维护

### 3. InviteUsage

建议新增 `InviteUsage` 表，字段如下：

- `id`: 主键
- `inviteCodeId`: 关联邀请码
- `userId`: 关联用户
- `usedAt`

说明：

- 这张表用于记录谁用过哪个邀请码
- 对比赛展示很有帮助，能证明邀请码可审计

## 后端服务拆分

建议新增两个服务文件：

- `web/server/services/authService.mjs`
- `web/server/services/inviteService.mjs`

### authService 建议职责

- `registerUser`
- `loginUser`
- `logoutUser`
- `getCurrentUser`
- `hashPassword`
- `verifyPassword`

### inviteService 建议职责

- `createInviteCode`
- `listInviteCodes`
- `getInviteCodeByCode`
- `updateInviteCode`
- `disableInviteCode`
- `validateInviteCodeForRegistration`
- `consumeInviteCodeForUser`

注册流程建议放事务：

1. 校验用户名、密码、手机号
2. 查询邀请码
3. 校验状态、过期时间、剩余次数
4. 创建用户
5. 邀请码 `usedCount + 1`
6. 写入 `InviteUsage`

步骤 4 到 6 应该在 Prisma transaction 中完成，避免并发时超发邀请码。

## 认证 API 设计

建议在 `web/server/index.mjs` 中新增以下接口：

### `POST /api/auth/register`

请求体：

- `username`
- `password`
- `phone`
- `inviteCode`

处理逻辑：

- 校验字段格式
- 校验邀请码
- 创建用户
- 消耗邀请码
- 返回当前登录用户信息

### `POST /api/auth/login`

请求体：

- `username`
- `password`

处理逻辑：

- 查询用户
- 校验密码
- 校验用户状态
- 返回当前登录用户信息

### `POST /api/auth/logout`

处理逻辑：

- 清除当前登录态

### `GET /api/auth/me`

处理逻辑：

- 返回当前会话对应的用户
- 用于前端刷新后恢复登录态

## 登录态方案

为了尽快完成 MVP，推荐先走简单方案：

- 后端登录成功后返回 token
- 前端把 token 存在 `sessionStorage`
- 前端请求受保护接口时带上 token

说明：

- 这比当前“前端保存整个用户库”的方案安全得多
- 实现成本低于完整 cookie-session
- 后续若要产品化，可再切换为 HttpOnly Cookie

本期重点是：

- 用户必须来自数据库
- 密码必须后端校验
- 邀请码必须后端校验

## 前端改造点

### `web/src/hooks/useAuth.js`

需要从当前本地认证逻辑，改成 API 调用逻辑：

- `login()` 调 `/api/auth/login`
- `register()` 调 `/api/auth/register`
- `logout()` 调 `/api/auth/logout`
- 初始化时调用 `/api/auth/me`

需要删除的旧逻辑：

- 本地 `USERS_KEY`
- 前端注册写入 `localStorage`
- 前端邀请码比对
- 前端密码校验作为最终依据

### `web/src/App.jsx`

现有登录/注册弹窗可以保留，主要修改为：

- 继续展示用户名、密码、手机号、邀请码输入框
- 调用新的 `useAuth`
- 展示后端返回的错误信息

### `web/src/config.js`

移除当前前端写死的邀请码配置：

- 删除 `REGISTER_INVITE_CODE`

保留与认证无关的现有配置。

## 管理能力执行方式

本期不做管理员网页，管理员管理通过服务器脚本执行。

建议新增以下脚本：

- `web/server/scripts/create-invite.mjs`
- `web/server/scripts/list-invites.mjs`
- `web/server/scripts/update-invite.mjs`
- `web/server/scripts/disable-invite.mjs`
- 可选：`web/server/scripts/show-invite-usage.mjs`

### 1. create-invite

作用：

- 创建随机邀请码
- 或创建指定邀请码

建议支持参数：

- `--code`
- `--maxUses`
- `--expiresAt`
- `--note`
- `--createdBy`

使用场景：

- 生成普通注册邀请码
- 内部演示时手工发码

### 2. list-invites

作用：

- 查看邀请码列表
- 查看状态
- 查看已使用次数
- 查看过期时间

### 3. update-invite

作用：

- 修改 `maxUses`
- 修改 `expiresAt`
- 修改 `note`
- 必要时恢复为 `active`

### 4. disable-invite

作用：

- 禁用某个邀请码
- 被禁用的邀请码不可再用于注册

### 5. show-invite-usage

作用：

- 查询某个邀请码被哪些用户使用
- 查看使用时间

## 推荐实施顺序

### 第 1 步：补 Prisma 表

先在 `web/prisma/schema.prisma` 中新增：

- `User`
- `InviteCode`
- `InviteUsage`

### 第 2 步：做后端服务层

新增：

- `authService.mjs`
- `inviteService.mjs`

优先把注册、登录、邀请码消耗逻辑跑通。

### 第 3 步：补 auth API

在 `web/server/index.mjs` 中新增：

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### 第 4 步：前端切换到真实接口

改 `web/src/hooks/useAuth.js`，去掉本地用户库逻辑。

### 第 5 步：做邀请码管理脚本

优先实现：

- 创建
- 列表
- 禁用

修改与使用记录查询可以稍后补齐。

### 第 6 步：联调测试

按以下顺序验证：

1. 创建普通邀请码
2. 用户通过邀请码注册
3. 注册成功后邀请码次数减少
4. 超过次数后注册失败
5. 过期邀请码注册失败
6. 禁用邀请码注册失败
7. 正常登录成功
8. 错误密码登录失败

## 数据库在服务器上的处理方式

你的数据库在服务器上，这并不会阻碍方案实施，但要明确改库动作在哪里执行。

### 推荐做法

本项目当前 `web/package.json` 已经存在：

- `npm run db:generate`
- `npm run db:push`

这说明当前仓库更接近 `schema.prisma` 驱动数据库结构，而不是完整 migration 文件驱动。

对于本次 MVP，推荐采用：

- 本地修改 `schema.prisma`
- 提交代码
- 到服务器上拉取代码
- 在服务器上执行 Prisma 同步数据库结构

### 推荐流程

1. 在本地修改 `web/prisma/schema.prisma`
2. 本地执行 `npm run db:generate`，确认 Prisma Client 正常生成
3. 将代码推到服务器
4. 在服务器项目目录下执行：

```bash
cd clawguard/web
npm install
npm run db:generate
npm run db:push
```

5. 再启动或重启后端服务

### 为什么建议在服务器上执行 `db:push`

因为你的 `DATABASE_URL` 指向服务器数据库，最稳妥的方式就是在服务器环境里直接连它执行结构同步。

这样可以避免：

- 本地无法访问服务器数据库
- 本地网络与服务器网络配置不一致
- 误把测试库和正式库搞混

### 执行前一定要做的事

在首次改动数据库结构前，先备份数据库。

如果是 MySQL，至少要做一次导出备份。尤其是当前服务器数据库已经有现存业务数据时，这一步不要跳过。

### 本期建议

本期为了快速推进，使用 `db:push` 即可。

如果后续进入更正式的部署阶段，再切换到：

- 本地开发库使用 `prisma migrate dev`
- 服务器使用 `prisma migrate deploy`

这样会更规范，但不是本次比赛 MVP 的首要任务。

## 环境变量建议

建议补充或确认以下环境变量：

- `DATABASE_URL`
- `AUTH_TOKEN_SECRET`
- `DEFAULT_ADMIN_USERNAME`
- `DEFAULT_ADMIN_PASSWORD`

说明：

- `AUTH_TOKEN_SECRET` 用于签发 token
- 默认管理员账号建议通过种子脚本或初始化脚本创建
- 管理邀请码的脚本本身不依赖前端页面

## 风险与注意点

### 1. 不要继续前端校验邀请码作为最终依据

前端可以做“非空校验”，但邀请码是否可用必须以后端为准。

### 2. 密码不能明文入库

必须使用哈希，例如 bcrypt 或 Node `crypto` 的安全方案。

### 3. 邀请码消耗要用事务

否则多用户并发注册时，可能超出 `maxUses`。

### 4. 禁用用户和禁用邀请码要分开

用户被禁用，不代表邀请码失效；邀请码失效，也不影响已注册用户。

### 5. 先做普通邀请码闭环，不急着扩展评委码

本期先把普通邀请码系统做扎实，后续再在 `InviteCode` 上加 `type = judge` 即可扩展。

## 本期交付定义

做到以下几点，就算本期完成：

- 用户可通过邀请码完成注册
- 用户可通过真实后端接口登录
- 邀请码支持次数上限
- 邀请码支持过期时间
- 邀请码支持禁用
- 管理员可通过服务器脚本管理邀请码
- 邀请码使用记录可查询

## 后续扩展方向

后续如需要补评委专用邀请码，建议在 `InviteCode` 上增加：

- `type`: `normal` / `judge`

然后在创建脚本中支持：

- `--type judge`

并在展示或审计时单独标记即可。当前数据库设计保留了足够扩展空间，不会推倒重来。
