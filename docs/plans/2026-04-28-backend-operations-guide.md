# ClawGuard 后端操作文档

本文档面向服务器运维与项目成员，整理当前登录注册与邀请码系统上线后的常用后端操作命令。

默认服务器项目路径：

```bash
cd /root/clawguard
```

默认通过 Docker Compose 管理服务。

## 1. 基础约定

当前主要服务：

- `mysql`：数据库服务
- `app`：Node/Express 应用服务

当前常见端口：

- `8787`：后端服务对外端口

常见执行前置：

```bash
cd /root/clawguard
```

## 2. 常用状态查看

### 查看容器状态

```bash
docker compose ps
```

理想结果：

- `mysql` 为 `healthy` 或 `Up`
- `app` 为 `Up`

### 查看 app 日志

```bash
docker compose logs -f app
```

理想结果：

- 出现监听日志
- 没有 Prisma 连接错误
- 没有认证模块报错

### 查看 mysql 日志

```bash
docker compose logs -f mysql
```

## 3. 代码更新与重建

### 拉取最新代码

```bash
git pull
```

### 重建 app 镜像

```bash
docker compose build app
```

### 重新启动 app

```bash
docker compose up -d app
```

### 重建并启动 app

```bash
docker compose up -d --build app
```

## 4. 数据库相关操作

### 生成 Prisma Client

```bash
docker compose run --rm app npm run db:generate
```

理想结果：

- 输出 `Generated Prisma Client`

### 同步数据库结构

```bash
docker compose run --rm app npm exec -- prisma db push --accept-data-loss
```

理想结果：

- 输出 `Your database is now in sync with your Prisma schema`

说明：

- 当 `schema.prisma` 变更后，需要执行这一步
- 当前登录注册与邀请码系统依赖 `User`、`InviteCode`、`InviteUsage` 三张表

## 5. 健康检查与接口验证

### 健康检查

```bash
curl http://127.0.0.1:8787/api/health
```

理想结果：

```json
{"ok":true,...}
```

### 验证管理员登录

```bash
curl -X POST http://127.0.0.1:8787/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"你的管理员密码"}'
```

理想结果：

- 返回 `ok: true`
- 返回 `user`
- 返回 `token`

## 6. 管理员账号操作

### 创建或更新管理员账号

```bash
docker compose run --rm app npm run auth:create-admin -- --username admin --password '你的管理员密码' --phone 13800000000
```

理想结果：

- 返回 JSON
- 包含：
  - `username`
  - `role = admin`
  - `status = active`

说明：

- 如果该用户名已存在，则会更新密码和手机号
- 如果不存在，则会新建管理员

## 7. 邀请码操作

### 查看邀请码列表

```bash
docker compose run --rm app npm run invite:list
```

用途：

- 查看当前所有邀请码
- 检查是否可用
- 查看使用次数

理想结果：

- 返回 JSON 数组
- 每个邀请码包含：
  - `code`
  - `maxUses`
  - `usedCount`
  - `expiresAt`
  - `status`

### 创建邀请码

```bash
docker compose run --rm app npm run invite:create -- --maxUses 5 --expiresAt 2026-12-31 --note 'server test invite'
```

理想结果：

- 返回 JSON
- 包含：
  - `code`
  - `status = active`
  - `maxUses = 5`

### 创建指定邀请码

```bash
docker compose run --rm app npm run invite:create -- --code CLAWGUARD2026 --maxUses 10 --expiresAt 2026-12-31 --note 'manual code'
```

适用场景：

- 需要发固定邀请码时使用

### 修改邀请码

```bash
docker compose run --rm app npm run invite:update -- --code CLAWGUARD2026 --maxUses 20 --expiresAt 2027-01-31 --note 'updated invite'
```

可修改内容：

- 最大使用次数
- 过期时间
- 备注
- 状态

### 禁用邀请码

```bash
docker compose run --rm app npm run invite:disable -- --code CLAWGUARD2026
```

理想结果：

- 返回 JSON
- `status = disabled`

### 查看某个邀请码使用记录

```bash
docker compose run --rm app npm run invite:usage -- --code CLAWGUARD2026
```

用途：

- 查看该邀请码被哪些用户使用过
- 查看使用时间

理想结果：

- 返回邀请码详情
- `usages` 中包含用户信息和 `usedAt`

## 8. 注册与邀请码验证建议

完成邀请码创建后，建议按以下顺序验证：

1. 打开前端页面
2. 用新邀请码注册一个全新用户
3. 注册成功后自动登录
4. 再次执行：

```bash
docker compose run --rm app npm run invite:list
```

理想结果：

- 对应邀请码 `usedCount + 1`

5. 再执行：

```bash
docker compose run --rm app npm run invite:usage -- --code '邀请码'
```

理想结果：

- 出现新注册用户的使用记录

## 9. 备份操作

### 备份代码

```bash
mkdir -p backups
TS=$(date +%F_%H%M%S)
tar --exclude='./backups' \
    --exclude='./.git' \
    --exclude='./web/node_modules' \
    --exclude='./web/dist' \
    --exclude='./runtime-cache' \
    -czf ./backups/code_backup_${TS}.tar.gz .
ls -lh ./backups/code_backup_${TS}.tar.gz
```

### 备份 MySQL 数据卷

```bash
VOL=$(docker volume ls --format '{{.Name}}' | grep '_mysql_data$')
echo "$VOL"
docker run --rm \
  -v "$VOL":/volume \
  -v "$(pwd)/backups":/backup \
  alpine sh -lc 'cd /volume && tar czf /backup/mysql_volume_$(date +%F_%H%M%S).tgz .'
ls -lh backups
```

说明：

- 当 root 密码不确定、无法使用 `mysqldump` 时，卷级备份是最稳的方案

## 10. 完整上线顺序建议

推荐上线顺序：

1. `git pull`
2. `docker compose build app`
3. `docker compose run --rm app npm run db:generate`
4. `docker compose run --rm app npm exec -- prisma db push --accept-data-loss`
5. `docker compose run --rm app npm run auth:create-admin -- --username admin --password '你的管理员密码' --phone 13800000000`
6. `docker compose run --rm app npm run invite:create -- --maxUses 5 --expiresAt 2026-12-31 --note 'server test invite'`
7. `docker compose up -d app`
8. `docker compose logs -f app`
9. `curl http://127.0.0.1:8787/api/health`
10. `curl /api/auth/login`
11. 前端页面注册测试

## 11. 常见问题

### 认证请求失败

优先检查：

- `app` 容器是否已更新到最新代码
- `/api/auth/login` 是否可通过 `curl` 正常返回
- 前端是否已经使用最新构建

### 邀请码注册失败

优先检查：

- 邀请码是否存在
- 邀请码是否 `active`
- 是否已经过期
- `usedCount` 是否已经达到 `maxUses`

### `db push` 失败

优先检查：

- `.env` 中 `DATABASE_URL` 是否正确
- `mysql` 容器是否正常
- 当前数据库账号是否有建表/改表权限

## 12. 当前系统事实总结

- 登录注册已经是真实后端认证
- 邀请码系统已经数据库化
- 管理员能力当前主要通过服务器脚本实现
- 动态沙箱等受限功能已开始依赖真实登录态
- 当前最核心的运维动作是：更新代码、同步 schema、创建管理员、管理邀请码
