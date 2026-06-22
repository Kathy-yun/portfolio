import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "./generated/prisma/client.js";

const adapter = new PrismaLibSql({ url: "file:dev.db" });
const prisma = new PrismaClient({ adapter });

const projects = [
  {
    title: "项目名称一",
    description: "简短描述这个项目的内容、你使用的技术栈以及你在其中承担的角色。",
    image: "/images/project1.jpg",
    tags: JSON.stringify(["HTML", "CSS", "JavaScript"]),
    link: "",
  },
  {
    title: "项目名称二",
    description: "简短描述这个项目的内容、你使用的技术栈以及你在其中承担的角色。",
    image: "/images/project2.jpg",
    tags: JSON.stringify(["React", "Node.js"]),
    link: "",
  },
  {
    title: "项目名称三",
    description: "简短描述这个项目的内容、你使用的技术栈以及你在其中承担的角色。",
    image: "/images/project3.jpg",
    tags: JSON.stringify(["Vue", "Firebase"]),
    link: "",
  },
];

async function seed() {
  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log(`已写入 ${projects.length} 个项目`);
  await prisma.$disconnect();
}

seed();
