import { PrismaClient } from "@prisma/client";
import { Router } from "express";

import Auth from "./routes/Auth";
import User from "./routes/User";

export default (dbClient: PrismaClient) => {
  const app = Router();
  Auth(app, dbClient);
  User(app, dbClient);

  return app;
};
