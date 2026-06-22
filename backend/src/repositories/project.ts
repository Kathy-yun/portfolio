import prisma from "../prisma.js";

interface CreateProjectInput {
  title: string;
  description: string;
  image?: string;
  tags: string[];
  link?: string;
}

interface UpdateProjectInput {
  title?: string;
  description?: string;
  image?: string;
  tags?: string[];
  link?: string;
}

/** 创建项目 */
export async function createProject(data: CreateProjectInput) {
  const project = await prisma.project.create({
    data: {
      ...data,
      tags: JSON.stringify(data.tags),
    },
  });
  return formatProject(project);
}

/** 获取所有项目（按时间倒序） */
export async function getProjects() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
  return projects.map(formatProject);
}

/** 根据 ID 获取项目 */
export async function getProjectById(id: number) {
  const project = await prisma.project.findUnique({ where: { id } });
  return project ? formatProject(project) : null;
}

/** 更新项目 */
export async function updateProject(id: number, data: UpdateProjectInput) {
  const updateData: Record<string, unknown> = { ...data };
  if (data.tags) {
    updateData.tags = JSON.stringify(data.tags);
  }
  const project = await prisma.project.update({ where: { id }, data: updateData });
  return formatProject(project);
}

/** 删除项目 */
export async function deleteProject(id: number) {
  return prisma.project.delete({ where: { id } });
}

/** 格式化：tags 从 JSON 字符串转为数组 */
function formatProject(project: { tags: string; [key: string]: unknown }) {
  return {
    ...project,
    tags: JSON.parse(project.tags) as string[],
  };
}
