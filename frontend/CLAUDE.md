# 前端

## 技术栈
- React 18 + TypeScript（严格模式）
- Vite 5 构建工具
- React Router 7 路由
- 端口 5173

## 项目结构
- src/pages/ — 页面组件，与路由一一对应
- src/components/ — 可复用组件
- src/assets/ — 静态资源（图片、字体等）

## 关键约定
- 函数式组件 + Hooks，不使用 class 组件
- CSS 文件与组件同目录
- 组件文件使用 PascalCase 命名

## 常用命令
pnpm dev           # 启动开发服务器，端口 5173
pnpm build         # Vite 构建生产产物
