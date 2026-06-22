---
description: 项目分层架构约束、依赖方向规则，适用于所有 TypeScript 源码文件
globs:
  - "frontend/src/**/*.tsx"
  - "frontend/src/**/*.ts"
  - "backend/src/**/*.ts"
  - "backend/prisma/**"
---

# 架构约束

## 分层职责（严格遵守，不可越层）

```
frontend/                 # 前端：UI 渲染 + 用户交互
  src/
    components/           # 通用 UI 组件（不含业务逻辑）
    pages/                # 页面组件（与路由一一对应，可含业务逻辑）
    contexts/             # React Context 状态管理

backend/                  # 后端：API 服务
  src/
    routes/               # 路由层：参数解析、鉴权检查、响应构造
    repositories/         # 数据访问层：封装所有 Prisma 调用
    prisma.ts             # Prisma 客户端单例
  prisma/
    schema.prisma         # 数据模型定义
    migrations/           # 数据库迁移文件（自动生成，禁止手动修改）
```

## 依赖方向（单向，禁止反向）

```
routes → repositories → prisma.ts → @prisma/client
pages → components → contexts
pages → fetch("/api/...")   # 前端只通过 HTTP 调用后端
```

- routes 层禁止直接操作 `prisma` 客户端，必须通过 repositories
- repositories 层禁止引用 routes 或 app.ts
- 前端禁止直接访问后端文件，只通过 `/api/*` 接口通信

## 路由注册规则

新增路由模块必须在 `backend/src/app.ts` 中显式注册，指定 prefix：
```typescript
app.register(newRoutes, { prefix: "/api/xxx" });
```

## Context 管理规则

新增全局状态必须创建独立 Context 文件放在 `src/contexts/`，在 `App.tsx` 中统一包裹。
 ---

  ## TypeScript 约定

  - 所有函数参数和返回值必须有类型注解（显式或可推导）
  - 禁止使用 `any`，确实不确定类型时用 `unknown` + 类型守卫
  - 接口定义放在使用它的文件顶部，不单独建 types 文件（除非跨模块共享）
  - 路由参数使用 `as` 断言时必须注释说明原因

  ## 注释要求

  - 每个导出函数必须有 `/** JSDoc */` 注释，说明功能
  - 复杂业务逻辑（如 `formatProject` 的 JSON 转换）必须注释说明原因
  - 路由 handler 中的鉴权检查用行内注释标注 `// 需要管理员`
  - 禁止写无意义注释（如 `// 获取数据`）

  ## 代码组织

  - 每个文件职责单一，不超过 150 行（超出则拆分）
  - import 顺序：第三方库 → 本地模块 → 样式文件，组间空行
  - 函数定义顺序：导出函数在前，内部辅助函数在后

  ---

  ## 前端组件规范

  ### Props 定义

  组件接收 props 时必须定义 TypeScript interface：
  ```typescript
  interface ProjectCardProps {
    project: Project;
    onEdit?: (id: number) => void;
  }
  ```
  简单场景（如 `{ children: ReactNode }`）可内联，不需要单独 interface。

  ### 数据获取

  - 统一使用 `fetch` API，路径以 `/api/` 开头（Vite 代理到后端）
  - 请求放在 `useEffect` 中，处理 loading 和 error 状态
  - 判断成功用 `data.success`，不要用 `res.ok`

  ### 状态管理

  - 组件内状态：`useState`
  - 跨组件共享状态：Context（放在 `src/contexts/`）
  - 禁止引入 Redux、Zustand 等外部状态库（当前规模不需要）

  ### 路由守卫

  受保护路由使用 `ProtectedRoute` 包裹（已在 App.tsx 定义），新增需鉴权的页面直接复用：
  ```tsx
  <Route path="/admin/xxx" element={<ProtectedRoute><XxxPage /></ProtectedRoute>} />
  ```
