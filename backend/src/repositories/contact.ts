import prisma from "../prisma.js";

interface CreateContactInput {
  name: string;
  email: string;
  message: string;
}

/** 创建一条留言 */
export async function createContact(data: CreateContactInput) {
  return prisma.contact.create({ data });
}

/** 获取所有留言（按时间倒序） */
export async function getContacts() {
  return prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });
}
