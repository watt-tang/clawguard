# ClawGuard 登录注册部分管理员能力说明

本文档只针对当前系统中“登录注册与邀请码管理”这部分进行说明，不展开其他业务模块。

## 1. 当前管理员能力是什么

当前系统已经支持真实用户体系，并在数据库中区分：

- `admin`
- `user`

管理员能力当前主要通过**服务器侧脚本 + 数据库角色**实现，而不是通过前端后台页面实现。

也就是说：

- 普通用户：通过前端页面注册、登录
- 管理员：除了能像普通用户一样登录外，还可以通过服务器命令管理邀请码与管理员账号

## 2. admin 账号和普通用户有什么区别

### 数据层区别

数据库 `User` 表里：

- 管理员账号：`role = admin`
- 普通账号：`role = user`

### 当前实际能力区别

管理员当前可以做的事情：

- 创建管理员账号
- 重置或更新管理员账号信息
- 创建邀请码
- 查看邀请码列表
- 修改邀请码
- 禁用邀请码
- 查看邀请码使用记录
- 查看当前已有账号

普通用户当前只能：

- 使用邀请码注册
- 登录系统
- 使用登录后开放的业务功能

### 当前没有做的事情

当前版本**没有单独的管理员网页后台**，所以管理员能力不是在前端点按钮完成，而是通过服务器命令完成。

## 3. 当前登录注册体系是怎么实现的

### 注册

用户在前端提交：

- 用户名
- 密码
- 手机号
- 邀请码

后端会：

1. 校验用户名格式
2. 校验密码长度
3. 校验手机号格式
4. 校验邀请码是否存在
5. 校验邀请码是否启用
6. 校验邀请码是否过期
7. 校验邀请码是否超出最大次数
8. 创建用户
9. 消耗邀请码次数
10. 记录邀请码使用记录
11. 自动登录并返回 token

### 登录

用户在前端提交：

- 用户名
- 密码

后端会：

1. 查数据库里的用户
2. 校验密码哈希
3. 校验账号状态
4. 返回用户信息和 token

## 4. 管理员能执行的操作

以下操作都在服务器项目根目录执行：

```bash
cd /root/clawguard
```

### 4.1 创建或更新管理员账号

```bash
docker compose run --rm app npm run auth:create-admin -- --username admin --password '你的管理员密码' --phone 13800000000
```

作用：

- 如果管理员不存在，则创建
- 如果管理员已存在，则更新密码和手机号

理想结果：

- 返回 JSON
- 显示：
  - `username`
  - `role = admin`
  - `status = active`

## 5. 邀请码管理能力

### 5.1 查看邀请码列表

```bash
docker compose run --rm app npm run invite:list
```

作用：

- 查看系统中已有的邀请码
- 查看是否启用
- 查看使用次数
- 查看过期时间

重点字段含义：

- `code`：邀请码本体
- `maxUses`：最大使用次数
- `usedCount`：已使用次数
- `expiresAt`：过期时间
- `status`：是否启用

### 5.2 创建邀请码

```bash
docker compose run --rm app npm run invite:create -- --maxUses 5 --expiresAt 2026-12-31 --note 'server test invite'
```

作用：

- 创建一个随机邀请码
- 指定可使用次数和有效期

理想结果：

- 返回 JSON
- 包含：
  - `code`
  - `status = active`

### 5.3 创建固定邀请码

```bash
docker compose run --rm app npm run invite:create -- --code CLAWGUARD2026 --maxUses 10 --expiresAt 2026-12-31 --note 'manual code'
```

作用：

- 手工指定邀请码内容

### 5.4 修改邀请码

```bash
docker compose run --rm app npm run invite:update -- --code CLAWGUARD2026 --maxUses 20 --expiresAt 2027-01-31 --note 'updated invite'
```

作用：

- 修改最大使用次数
- 修改过期时间
- 修改备注

### 5.5 禁用邀请码

```bash
docker compose run --rm app npm run invite:disable -- --code CLAWGUARD2026
```

作用：

- 使某邀请码立即失效

理想结果：

- 返回 JSON
- `status = disabled`

### 5.6 查看邀请码使用记录

```bash
docker compose run --rm app npm run invite:usage -- --code CLAWGUARD2026
```

作用：

- 查看该邀请码被谁使用过
- 查看使用时间

理想结果：

- 返回邀请码详情
- `usages` 中包含用户和 `usedAt`

## 6. 怎么查看现有账号

当前项目里还没有专门的“列出所有账号”脚本，但可以直接通过数据库查看。

### 方法 1：在 MySQL 容器里直接查

```bash
docker compose exec mysql mysql -uroot -p -e "USE clawguard; SELECT id, username, phone, role, status, createdAt FROM User ORDER BY id ASC;"
```

执行后会提示你输入 MySQL root 密码。

如果你已经知道数据库账号密码，也可以直接在命令里写连接方式。

### 方法 2：如果 app 容器能正常访问数据库，也可用 Prisma 方式临时查询

当前系统还没有单独提供 `list-users` 脚本，所以现阶段推荐直接用数据库 SQL 查询最直观。

### 理想结果

应能看到类似字段：

- `id`
- `username`
- `phone`
- `role`
- `status`
- `createdAt`

这样你就能区分：

- 哪些是管理员
- 哪些是普通用户
- 哪些账号是否已启用

## 7. 管理员验证建议

建议你在每次改动后至少验证以下几点：

1. 管理员账号能登录
2. 可以创建邀请码
3. 前端能用该邀请码成功注册
4. 注册后邀请码 `usedCount` 增加
5. `invite:usage` 能看到使用记录
6. `User` 表中能看到新注册账号

## 8. 当前阶段的边界

当前管理员能力已经足够支撑比赛演示和实际使用，但有两个边界需要说明：

### 已经具备

- 真正的数据库角色区分
- 真正的邀请码管理能力
- 真正的注册/登录后端认证逻辑

### 还没有做

- 管理员前端后台页面
- 前端可视化账号管理
- 单独的“查看所有账号”后台页面

所以当前登录注册部分的管理员能力，应理解为：

**后端已经具备完整管理能力，执行入口是服务器命令，而不是网页管理台。**
