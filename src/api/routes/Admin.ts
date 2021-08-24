import {
  addCategory,
  addSubCategory,
  deleteCategory,
  deleteSubCategory,
} from "@/services/IndustryService";
import {
  AddCategoryRequestSchema,
  AddCategoryResponse,
  AddSubCategoryRequestSchema,
  AddSubCategoryResponse,
  DeleteCategoryResponse,
  DeleteSubCategoryResponse,
} from "@/types/Admin";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { auth } from "../middlewares/Auth";

const route = Router();

export default (app: Router, dbClient: PrismaClient) => {
  app.use("/admin", route);

  route.post("/category", auth, async (req, res, next) => {
    try {
      const category = AddCategoryRequestSchema.check(req.body);
      const result: AddCategoryResponse = await addCategory(category, dbClient);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  route.post("/sub-category", auth, async (req, res, next) => {
    try {
      const subCategory = AddSubCategoryRequestSchema.check(req.body);
      const result: AddSubCategoryResponse = await addSubCategory(
        subCategory,
        dbClient
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/category/delete/:categoryId", auth, async (req, res, next) => {
    const categoryId = req.params.categoryId;
    try {
      const result: DeleteCategoryResponse = await deleteCategory(
        categoryId,
        dbClient
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/sub-category/delete/:categoryId", auth, async (req, res, next) => {
    const categoryId = req.params.categoryId;
    try {
      const result: DeleteSubCategoryResponse = await deleteSubCategory(
        categoryId,
        dbClient
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  })
};
