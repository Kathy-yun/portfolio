---
description: 后端 Fastify API 设计规范，包括响应格式、错误码、路由和数据访问层规则
globs:
  - "backend/src/**/*.ts"
---

# 后端 API 设计规范

## 统一响应格式

所有接口必须返回以下格式，禁止返回裸数据：
```typescript
// 成功
{ success: true, data: T }

// 失败
{ success: false, error: { code: "ERROR_CODE", message: "用户可读描述" } }
```

## 错误码规范

- 使用 UPPER_SNAKE_CASE：`PROJECT_NOT_FOUND`, `INVALID_CREDENTIALS`
- 错误码必须是英文，message 可以是中文
- 常用错误码复用已有定义，新增时先检查是否已有同类

现有错误码参考：
| 错误码 | HTTP 状态码 | 含义 |
|--------|------------|------|
| `FORBIDDEN` | 403 | 需要管理员权限 |
| `UNAUTHORIZED` | 401 | 未登录 |
| `TOKEN_EXPIRED` | 401 | token 过期 |
| `INVALID_CREDENTIALS` | 401 | 用户名密码错误 |
| `PROJECT_NOT_FOUND` | 404 | 项目不存在 |

## 路由定义

- 一个路由模块导出一个 async 函数，接收 `FastifyInstance`
- 路由文件放在 `src/routes/`，在 `app.ts` 中注册并指定 prefix
- 鉴权逻辑在路由内部用 `requireAdmin(req)` 检查，不使用中间件全局拦截

## 数据访问

- 路由层禁止直接调用 `prisma`，必须通过 `src/repositories/` 封装
- Repository 函数命名：`动词 + 名词`，如 `createProject`, `getProjectById`, `deleteProject`
- 输入参数定义 interface 放在 repository 文件顶部

## 请求体类型

路由中解析请求体时使用 `as` 断言定义结构：
```typescript
const body = req.body as { title: string; description: string; tags: string[] };
```
后续如引入 Zod，迁移到 `src/schemas/` 统一验证。
