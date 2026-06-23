import type { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !JWT_SECRET) {
  throw new Error(
    "缺少必需的环境变量：ADMIN_USERNAME、ADMIN_PASSWORD、JWT_SECRET"
  );
}

export async function authRoutes(app: FastifyInstance) {
  // 登录
  app.post("/login", async (req, reply) => {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return reply.status(401).send({
        success: false,
        error: { code: "INVALID_CREDENTIALS", message: "用户名或密码错误" },
      });
    }

    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });

    return reply.send({
      success: true,
      data: { token },
    });
  });

  // 验证 token
  app.get("/me", async (req, reply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return reply.status(401).send({
        success: false,
        error: { code: "UNAUTHORIZED", message: "未登录" },
      });
    }

    try {
      const token = authHeader.slice(7);
      jwt.verify(token, JWT_SECRET);
      return reply.send({ success: true, data: { role: "admin" } });
    } catch {
      return reply.status(401).send({
        success: false,
        error: { code: "TOKEN_EXPIRED", message: "登录已过期" },
      });
    }
  });
}
