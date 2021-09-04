import { adminLogin } from "@/services/AuthService";
import { getAllCompanies } from "@/services/CompanyService";
import {
  addCategory,
  addSubCategory,
  deleteCategory,
  deleteSubCategory,
} from "@/services/IndustryService";
import { getAllPersonsInCharge } from "@/services/PersonInChargeService";
import { getAllProducts } from "@/services/Product";
import { deleteUserById, getAllUsers, getUserById } from "@/services/UserService";
import {
  AddCategoryRequestSchema,
  AddCategoryResponse,
  AddSubCategoryRequestSchema,
  AddSubCategoryResponse,
  DeleteCategoryResponse,
  DeleteSubCategoryResponse,
} from "@/types/Admin";
import { GetAllCompaniesResponse } from "@/types/Company";
import { GetAllPersonInChargeResponse } from "@/types/PersonInCharge";
import { GetAllProductsResponse } from "@/types/Product";
import { DeleteUserResponse, GetAllUserResponse, LoginRequestSchema, LoginResponse } from "@/types/User";
import { createError } from "@/utils/Utils";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { auth } from "../middlewares/Auth";

const route = Router();

export default (app: Router, dbClient: PrismaClient) => {
  app.use("/admin", route);

  route.post("/admin-login", async (req, res, next) => {
    try {
      const user = LoginRequestSchema.check(req.body);
      const result: LoginResponse = await adminLogin(user);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

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

  route.get(
    "/sub-category/delete/:categoryId",
    auth,
    async (req, res, next) => {
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
    }
  );

  route.get("/company/all", auth, async (_, res, next) => {
    try {
      const result: GetAllCompaniesResponse = await getAllCompanies(dbClient);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/product/all", auth, async (_, res, next) => {
    try {
      const result: GetAllProductsResponse = await getAllProducts(dbClient);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/pic//all", auth, async (_, res, next) => {
    try {
      const pics: GetAllPersonInChargeResponse = await getAllPersonsInCharge(
        dbClient
      );
      return res.json(pics);
    } catch (err) {
      next(err);
    }
  });

  route.get("/users//all", auth, async (_, res, next) => {
    try {
      const result: GetAllUserResponse = await getAllUsers(dbClient);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/users/delete/:userId", auth, async (req, res, next) => {
    try {
      const userToDelete = await getUserById(req.params.userId, dbClient);
      if (userToDelete) {
        const user: DeleteUserResponse = await deleteUserById(userToDelete.id, dbClient);
        return res.json(user);
      }
      throw createError("BadRequest", "User not found");
    } catch (err) {
      next(err);
    }
  });
};
