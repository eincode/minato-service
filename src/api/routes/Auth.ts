import { PrismaClient } from "@prisma/client";
import { Router } from "express";

import {
  LoginRequestSchema,
  LoginResponse,
  RegisterRequestSchema,
  RegisterResponse,
} from "@/types/User";
import { login, signUp } from "@/services/AuthService";
import { auth } from "../middlewares/Auth";

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

  route.get("/me", auth, async (req, res) => {
    res.json(req.user);
  });
};
