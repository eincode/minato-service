import { getAllCategories } from "@/services/IndustryService";
import { GetAllCategoriesResponse } from "@/types/Category";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { auth } from "../middlewares/Auth";

const route = Router();

export default (app: Router, dbClient: PrismaClient) => {
  app.use("/category", route);

  route.get("/", auth, async (_req, res, next) => {
    try {
      const result: GetAllCategoriesResponse = await getAllCategories(dbClient);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });
};
