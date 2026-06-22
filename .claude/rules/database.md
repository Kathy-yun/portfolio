---
description: Prisma schema 定义规范、数据库迁移流程、seed 脚本规则
globs:
  - "backend/prisma/**"
  - "backend/src/prisma.ts"
  - "backend/src/seed.ts"
  - "backend/src/repositories/**/*.ts"
---

# 数据库迁移规范

## Prisma Schema 规范

- 数据模型定义在 `backend/prisma/schema.prisma`
- 表名使用 `@@map("snake_case 复数")` 映射，字段名 camelCase 映射到 snake_case：
  ```prisma
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  ```
- 每张表必带 `id`（自增主键）、`createdAt`、`updatedAt` 三个字段
- 存储数组/复杂结构时使用 `String` 字段 + JSON 序列化（参考 Project.tags）

## 迁移流程

修改 schema 后必须按以下步骤操作：
```bash
cd backend
npx prisma migrate dev --name 描述性名称   # 生成迁移 + 更新客户端
```

- 迁移文件由 Prisma 自动生成，禁止手动修改 `prisma/migrations/` 下的文件
- 迁移名称使用 snake_case，简要描述变更内容：`add_user_avatar`, `fix_project_tags`
- 每次迁移只做一件事，不要在一个迁移中同时新增表和修改字段

## Seed 脚本

- 种子数据定义在 `backend/src/seed.ts`
- 新增模型时同步更新 seed 脚本，提供示例数据
- seed 脚本必须幂等：重复执行不会产生重复数据

## Prisma Client 使用

- 全局单例在 `backend/src/prisma.ts`，所有 repository 从这里导入
- 禁止在其他文件中 `new PrismaClient()`
- Prisma 生成代码在 `src/generated/`，禁止手动修改
