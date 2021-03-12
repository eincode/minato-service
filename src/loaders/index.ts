import { Express } from "express";
import { loadExpress } from "./ExpressLoader";
import { loadPrisma } from "./PrismaLoader";

async function loadApp(expressApp: Express) {
  const dbClient = await loadPrisma();
  console.log("Prisma Loaded");

  await loadExpress(expressApp, dbClient);
  console.log("Express Loaded");
}

export { loadApp };
