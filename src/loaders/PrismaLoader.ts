import { PrismaClient } from "@prisma/client";

function loadPrisma() {
  const prisma = new PrismaClient();
  return prisma;
}

export { loadPrisma };
