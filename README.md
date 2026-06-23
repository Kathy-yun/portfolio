# 个人作品集网站

前后端分离的全栈作品集网站，支持项目展示、联系表单、管理员登录与项目 CRUD 管理。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite 5 |
| 后端 | Fastify 5 + TypeScript |
| 数据库 | SQLite（Prisma ORM） |
| 认证 | JWT（jsonwebtoken） |
| 包管理 | pnpm workspace（monorepo） |

## 项目结构

```
web-project/
├── package.json                 # 根级 scripts，统一管理前后端
├── pnpm-workspace.yaml          # pnpm 工作区配置
├── CLAUDE.md                    # Claude Code 全局规则
│
├── frontend/                    # React 前端（端口 5173）
│   ├── index.html               # 入口 HTML
│   ├── vite.config.ts           # Vite 配置 + API 代理
│   ├── public/images/           # 静态图片资源
│   └── src/
│       ├── main.tsx             # React 入口
│       ├── App.tsx              # 路由配置 + 鉴权守卫
│       ├── index.css            # 全局样式（CSS 变量）
│       ├── contexts/
│       │   └── AuthContext.tsx   # 登录状态管理
│       ├── components/
│       │   ├── Header.tsx/css   # 导航栏（登录状态感知）
│       │   └── Footer.tsx/css   # 页脚
│       └── pages/
│           ├── Home.tsx/css           # 首页
│           ├── About.tsx/css          # 关于我
│           ├── Projects.tsx/css       # 项目列表
│           ├── ProjectDetail.tsx/css  # 项目详情
│           ├── Contact.tsx/css        # 联系表单
│           ├── Login.tsx/css          # 管理员登录
│           └── AdminProjects.tsx/css  # 项目管理（增删改查）
│
└── backend/                     # Fastify API（端口 3000）
    ├── .env                     # 环境变量（数据库、账号、JWT 密钥）
    ├── prisma/
    │   └── schema.prisma        # 数据库模型定义
    └── src/
        ├── app.ts               # 服务入口（CORS、路由注册、鉴权钩子）
        ├── prisma.ts            # Prisma 客户端单例
        ├── seed.ts              # 数据库种子脚本
        ├── routes/
        │   ├── api.ts           # 项目 CRUD + 联系表单 API
        │   └── auth.ts          # 登录 + token 验证 API
        └── repositories/
            ├── project.ts       # 项目数据访问层
            └── contact.ts       # 联系表单数据访问层
```

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装

```bash
# 克隆项目后安装依赖
pnpm install

# 初始化数据库
cd backend
npx prisma migrate dev
npx tsx src/seed.ts    # 写入示例数据（可选）
cd ..
```

### 启动开发服务器

```bash
# 同时启动前端 + 后端
pnpm dev

# 或分别启动
pnpm dev:frontend    # http://localhost:5173
pnpm dev:backend     # http://localhost:3000
```

### 构建

```bash
pnpm build
```

## 页面路由

| 路径 | 页面 | 需要登录 |
|---|---|---|
| `/` | 首页 | ❌ |
| `/about` | 关于我 | ❌ |
| `/projects` | 项目列表 | ❌ |
| `/projects/:id` | 项目详情 | ❌ |
| `/contact` | 联系表单 | ❌ |
| `/login` | 管理员登录 | ❌ |
| `/admin` | 项目管理 | ✅ |

## API 接口

### 认证

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/auth/login` | 登录，返回 JWT token |
| GET | `/api/auth/me` | 验证 token 是否有效 |

### 项目

| 方法 | 路径 | 说明 | 需要登录 |
|---|---|---|---|
| GET | `/api/projects` | 获取所有项目 | ❌ |
| GET | `/api/projects/:id` | 获取单个项目 | ❌ |
| POST | `/api/projects` | 创建项目 | ✅ |
| PUT | `/api/projects/:id` | 更新项目 | ✅ |
| DELETE | `/api/projects/:id` | 删除项目 | ✅ |

### 联系表单

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/contact` | 提交留言 |
| GET | `/api/contacts` | 获取所有留言 |

### 请求示例

```bash
# 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"<你的用户名>","password":"<你的密码>"}'

# 创建项目（需要 token）
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"项目名","description":"描述","tags":["React","TS"]}'
```

## 环境变量

编辑 `backend/.env`：

```env
DATABASE_URL="file:./dev.db"

ADMIN_USERNAME=<你的用户名>
ADMIN_PASSWORD=<你的密码>

JWT_SECRET=<你的密钥>
```

> 生产环境必须设置强密码和随机 JWT 密钥，切勿使用默认值。

## 开发规范

### 通用

- 包管理器：pnpm（不使用 npm/yarn）
- 语言：TypeScript 严格模式
- Git commit message 用中文

### 前端

- 函数式组件 + Hooks，不使用 class 组件
- CSS 文件与组件同目录
- 组件文件使用 PascalCase 命名

### 后端

- API 统一返回格式：`{ success: boolean, data?: T, error?: { code: string, message: string } }`
- 错误码使用 UPPER_SNAKE_CASE
- 数据库表名 snake_case 复数形式，主键自增，必带 created_at 和 updated_at
- 写操作需要 JWT 认证，读操作公开

## 后续优化项

### 功能完善

- [ ] 项目图片上传（替代手动输入 URL）
- [ ] 联系表单邮件通知（接入 Nodemailer / Resend）
- [ ] 留言管理后台（查看、删除留言）
- [ ] 分页加载（项目列表和留言列表）
- [ ] 项目搜索与标签筛选

### 用户体验

- [ ] 加载状态骨架屏（Skeleton）
- [ ] 表单提交 loading 状态与成功提示
- [ ] 404 页面
- [ ] 响应式优化（移动端手势、触控体验）
- [ ] 深色模式切换

### 安全加固

- [ ] 密码 bcrypt 加密存储（当前明文对比）
- [ ] API 请求频率限制（Rate Limiting）
- [ ] 输入内容 XSS 过滤
- [ ] CSRF 防护
- [ ] 管理员修改密码功能

### 工程化

- [ ] ESLint + Prettier 代码规范
- [ ] 单元测试（Vitest）
- [ ] CI/CD 流水线（GitHub Actions）
- [ ] Docker 容器化部署
- [ ] 生产环境 Nginx 反向代理配置
- [ ] 数据库备份策略

### 性能优化

- [ ] 前端代码分割（React.lazy + Suspense）
- [ ] 图片懒加载
- [ ] API 响应缓存（ETag / Cache-Control）
- [ ] 静态资源 CDN 部署
- [ ] 数据库索引优化

### 内容扩展

- [ ] 博客模块（Markdown 编辑器 + 文章管理）
- [ ] 标签系统（独立的标签表，多对多关系）
- [ ] 访客统计（页面浏览量、访客来源）
- [ ] SEO 优化（Meta 标签、Open Graph、Sitemap）

## License

MIT
