import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { auth } from "../middlewares/Auth";
import {
  getAllUsers,
  getUserById,
  updateUserProductCategories,
  updateUserRole,
} from "@/services/UserService";
import { UpdateRoleRequest } from "@/types/User";

const route = Router();

export default (app: Router, dbClient: PrismaClient) => {
  app.use("/users", route);

  route.get("/me", auth, async (req, res, next) => {
    try {
      const user = await getUserById(req.user._id, dbClient);
      return res.json(user);
    } catch (err) {
      next(err);
    }
  });

  route.post("/update-role", auth, async (req, res, next) => {
    const request = req.body as UpdateRoleRequest;
    try {
      const userId = req.user?._id ?? 0;
      const result = await updateUserRole(
        userId.toString(),
        request.role,
        dbClient
      );
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.post("/update-categories", auth, async (req, res, next) => {
    const request = req.body.categories as Array<string>;
    try {
      const userId = req.user._id;
      const result = await updateUserProductCategories(
        userId,
        request,
        dbClient
      );
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/all", auth, async (_, res, next) => {
    try {
      const result = await getAllUsers(dbClient);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });
};
