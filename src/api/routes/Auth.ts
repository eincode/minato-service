import { PrismaClient } from "@prisma/client";
import { Router } from "express";

import { LoginRequest, RegisterRequest } from "@/types/User";
import { login, signUp } from "@/services/AuthService";
import { auth } from "../middlewares/Auth";
import { deleteAllCompanies } from "@/services/CompanyService";
import { deleteAllPics } from "@/services/PersonInChargeService";
import { deleteAllProducts } from "@/services/Product";
import { deleteAllUsers } from "@/services/UserService";

const route = Router();

export default (app: Router, dbClient: PrismaClient) => {
  app.use("/auth", route);

  route.post("/register", async (req, res, next) => {
    const user = req.body as RegisterRequest;
    try {
      const result = await signUp(user, dbClient);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  route.post("/login", async (req, res, next) => {
    const user = req.body as LoginRequest;
    try {
      const result = await login(user, dbClient);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/me", auth, async (req, res) => {
    res.json(req.user);
  });

  route.get("/delete-all-data", async (_, res, next) => {
    try {
      const result = Promise.all([
        deleteAllCompanies(dbClient),
        deleteAllPics(dbClient),
        deleteAllProducts(dbClient),
        deleteAllUsers(dbClient),
      ]);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });
};
