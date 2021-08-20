import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { auth } from "../middlewares/Auth";
import {
  deleteUserById,
  getAllUsers,
  getUserById,
} from "@/services/UserService";
import { createError } from "@/utils/Utils";

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

  route.get("/all", auth, async (_, res, next) => {
    try {
      const result = await getAllUsers(dbClient);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/delete/:userId", auth, async (req, res, next) => {
    try {
      const userToDelete = await getUserById(req.params.userId, dbClient);
      if (userToDelete) {
        const user = await deleteUserById(userToDelete.id, dbClient);
        return res.json(user);
      }
      throw createError("BadRequest", "User not found");
    } catch (err) {
      next(err);
    }
  });
};
