import Fastify from "fastify";
import jwt from "jsonwebtoken";
import { apiRoutes } from "./routes/api.js";
import { authRoutes } from "./routes/auth.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("缺少必需的环境变量：JWT_SECRET");
}

const app = Fastify({ logger: true });

// CORS 支持前端开发服务器
await app.register(import("@fastify/cors"), {
  origin: true,
});

// 认证路由（无需鉴权）
app.register(authRoutes, { prefix: "/api/auth" });

// API 路由（写操作需要鉴权）
app.register(apiRoutes, { prefix: "/api" });

// 鉴权装饰器：用于路由内手动调用
app.decorateRequest("adminUser", null);
app.addHook("onRequest", async (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.slice(7);
      (req as any).adminUser = jwt.verify(token, JWT_SECRET);
    } catch {
      // token 无效，忽略
    }
  }
});

// 健康检查
app.get("/health", async () => {
  return { status: "ok" };
});

// 启动
const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("API server running at http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
