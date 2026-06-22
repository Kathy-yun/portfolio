# 项目概述

个人作品集网站，前后端分离架构。

## 目录结构
- frontend/ — React 18 前端，Vite 5 构建，端口 5173
- backend/ — Fastify API 服务器，端口 3000

## 通用约定
- 包管理器：pnpm（不使用 npm/yarn）
- 语言：TypeScript 严格模式
- 代码缩进：2 空格
- Git commit message 用中文

## 常用命令
pnpm dev             # 同时启动前端和后端开发服务器
pnpm dev:frontend    # 仅启动前端
pnpm dev:backend     # 仅启动后端
pnpm build           # 构建前端产物 + 编译后端
