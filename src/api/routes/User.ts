import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { auth } from "../middlewares/Auth";
import { getUserById } from "@/services/UserService";
import { GetMyUserResponse } from "@/types/User";

const route = Router();

export default (app: Router, dbClient: PrismaClient) => {
  app.use("/users", route);

  route.get("/me", auth, async (req, res, next) => {
    try {
      const user: GetMyUserResponse = await getUserById(req.user._id, dbClient);
      return res.json(user);
    } catch (err) {
      next(err);
    }
  });
};
