import type { FastifyInstance, FastifyRequest } from "fastify";
import { createContact, getContacts } from "../repositories/contact.js";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../repositories/project.js";

/** 检查是否为管理员 */
function requireAdmin(req: FastifyRequest) {
  return (req as any).adminUser?.role === "admin";
}

export async function apiRoutes(app: FastifyInstance) {
  // ========== 项目 CRUD ==========

  // 获取所有项目（公开）
  app.get("/projects", async (_req, reply) => {
    const projects = await getProjects();
    return reply.send({ success: true, data: projects });
  });

  // 获取单个项目详情（公开）
  app.get("/projects/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const project = await getProjectById(Number(id));
    if (!project) {
      return reply.status(404).send({
        success: false,
        error: { code: "PROJECT_NOT_FOUND", message: "项目不存在" },
      });
    }
    return reply.send({ success: true, data: project });
  });

  // 创建项目（需要管理员）
  app.post("/projects", async (req, reply) => {
    if (!requireAdmin(req)) {
      return reply.status(403).send({
        success: false,
        error: { code: "FORBIDDEN", message: "需要管理员权限" },
      });
    }
    const body = req.body as {
      title: string;
      description: string;
      image?: string;
      tags: string[];
      link?: string;
    };
    const project = await createProject(body);
    return reply.status(201).send({ success: true, data: project });
  });

  // 更新项目（需要管理员）
  app.put("/projects/:id", async (req, reply) => {
    if (!requireAdmin(req)) {
      return reply.status(403).send({
        success: false,
        error: { code: "FORBIDDEN", message: "需要管理员权限" },
      });
    }
    const { id } = req.params as { id: string };
    const body = req.body as {
      title?: string;
      description?: string;
      image?: string;
      tags?: string[];
      link?: string;
    };
    try {
      const project = await updateProject(Number(id), body);
      return reply.send({ success: true, data: project });
    } catch {
      return reply.status(404).send({
        success: false,
        error: { code: "PROJECT_NOT_FOUND", message: "项目不存在" },
      });
    }
  });

  // 删除项目（需要管理员）
  app.delete("/projects/:id", async (req, reply) => {
    if (!requireAdmin(req)) {
      return reply.status(403).send({
        success: false,
        error: { code: "FORBIDDEN", message: "需要管理员权限" },
      });
    }
    const { id } = req.params as { id: string };
    try {
      await deleteProject(Number(id));
      return reply.send({ success: true, data: { message: "删除成功" } });
    } catch {
      return reply.status(404).send({
        success: false,
        error: { code: "PROJECT_NOT_FOUND", message: "项目不存在" },
      });
    }
  });

  // ========== 联系表单 ==========

  // 提交联系表单（公开）
  app.post("/contact", async (req, reply) => {
    const body = req.body as { name: string; email: string; message: string };
    const contact = await createContact(body);
    console.log("已保存留言，ID:", contact.id);
    return reply.send({
      success: true,
      data: { message: "感谢你的留言！", id: contact.id },
    });
  });

  // 获取所有留言（公开）
  app.get("/contacts", async (_req, reply) => {
    const contacts = await getContacts();
    return reply.send({ success: true, data: contacts });
  });
}
