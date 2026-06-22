# 后端

## 技术栈
- Fastify 框架（不使用 Express）
- TypeScript 严格模式
- Prisma ORM + SQLite 数据库
- 端口 3000

## 项目结构
- src/routes/ — 路由定义，只做参数解析和响应构造
- src/repositories/ — 数据访问层，封装 Prisma 调用
- src/schemas/ — Zod 验证 schema，与路由一一对应
- src/prisma.ts — Prisma 客户端单例
- prisma/schema.prisma — 数据库模型定义

## 关键约定
- API 统一返回格式：{ success: boolean, data?: T, error?: { code: string, message: string } }
- 错误码使用 UPPER_SNAKE_CASE，如 ORDER_NOT_FOUND
- 数据库表名 snake_case 复数形式，主键自增，必带 created_at 和 updated_at

## 常用命令
pnpm dev           # 启动开发服务器，端口 3000
pnpm build         # TypeScript 编译
npx prisma studio  # 打开数据库可视化管理界面
npx prisma migrate dev --name xxx  # 创建数据库迁移
