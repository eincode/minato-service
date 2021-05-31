import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { auth } from "../middlewares/Auth";
import {
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserProductCategories,
  updateUserRole,
} from "@/services/UserService";
import { UpdateRoleRequest } from "@/types/User";
import {
  deleteCompanyByUserId,
  deleteSavedCompanyByPicId,
  getMyCompany,
} from "@/services/CompanyService";
import {
  deletePersonInChargeByUserId,
  getPersonInChargeByCompanyId,
} from "@/services/PersonInChargeService";
import { deleteProductByCompanyId } from "@/services/Product";

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

  route.get("/delete/:userId", auth, async (req, res, next) => {
    try {
      const userToDelete = await getUserById(req.params.userId, dbClient);
      const companyToDelete = await getMyCompany(userToDelete.id, dbClient);
      if (userToDelete) {
        const picToDelete = await getPersonInChargeByCompanyId(
          companyToDelete?.id,
          dbClient
        );
        const savedCompanies = await deleteSavedCompanyByPicId(
          picToDelete?.id,
          dbClient
        );
        const products = await deleteProductByCompanyId(
          companyToDelete?.id,
          dbClient
        );
        const pic = await deletePersonInChargeByUserId(
          userToDelete.id,
          dbClient
        );
        const company = await deleteCompanyByUserId(userToDelete.id, dbClient);
        const user = await deleteUserById(userToDelete.id, dbClient);
        return res.json({
          user,
          company,
          products,
          savedCompanies,
          pic,
        });
      }
      const error = new Error("User not found");
      error.name = "BadRequest";
      throw error;
    } catch (err) {
      next(err);
    }
  });
};
