import { PrismaClient } from "@prisma/client";
import { Router } from "express";

import Auth from "./routes/Auth";
import Company from "./routes/Company";
import PersonInCharge from "./routes/PersonInCharge";
import Product from "./routes/Product";
import User from "./routes/User";
import Tracker from "./routes/Tracker";
import Admin from "./routes/Admin";
import Category from "./routes/Category";

export default (dbClient: PrismaClient) => {
  const app = Router();
  Auth(app, dbClient);
  Admin(app, dbClient);
  Category(app, dbClient);
  Company(app, dbClient);
  PersonInCharge(app, dbClient);
  Product(app, dbClient);
  Tracker(app, dbClient);
  User(app, dbClient);
  return app;
};
