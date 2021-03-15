import { PrismaClient } from "@prisma/client";
import { Router } from "express";

import Auth from "./routes/Auth";
import Company from "./routes/Company";
import PersonInCharge from "./routes/PersonInCharge";
import User from "./routes/User";

export default (dbClient: PrismaClient) => {
  const app = Router();
  Auth(app, dbClient);
  User(app, dbClient);
  Company(app, dbClient);
  PersonInCharge(app, dbClient);
  return app;
};
