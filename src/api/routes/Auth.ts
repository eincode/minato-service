import { PrismaClient } from "@prisma/client";
import { Router } from "express";

import {
  LoginRequestSchema,
  LoginResponse,
  RegisterRequestSchema,
  RegisterResponse,
} from "@/types/User";
import { adminLogin, login, signUp } from "@/services/AuthService";
import { auth } from "../middlewares/Auth";
import { deleteAllCompanies } from "@/services/CompanyService";
import { deleteAllPics } from "@/services/PersonInChargeService";
import { deleteAllProducts } from "@/services/Product";
import { deleteAllUsers } from "@/services/UserService";

const route = Router();

export default (app: Router, dbClient: PrismaClient) => {
  app.use("/auth", route);

  route.post("/register", async (req, res, next) => {
    try {
      const user = RegisterRequestSchema.check(req.body);
      const result: RegisterResponse = await signUp(user, dbClient);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  route.post("/login", async (req, res, next) => {
    try {
      const user = LoginRequestSchema.check(req.body);
      const result: LoginResponse = await login(user, dbClient);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  route.post("/admin-login", async (req, res, next) => {
    try {
      const user = LoginRequestSchema.check(req.body);
      const result: LoginResponse = await adminLogin(user);
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
      await deleteAllProducts(dbClient);
      await deleteAllPics(dbClient);
      await deleteAllCompanies(dbClient);
      await deleteAllUsers(dbClient);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  });
};
