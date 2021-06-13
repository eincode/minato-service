import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { auth } from "../middlewares/Auth";
import {
  deleteUserById,
  getAllUsers,
  getUserById,
} from "@/services/UserService";
import {
  deleteCompanyByUserId,
  getCompanyByUserId,
} from "@/services/CompanyService";
import { deleteProductByCompanyId } from "@/services/Product";
import { deletePersonInChargeById, getPersonInChargeByCompanyId } from "@/services/PersonInChargeService";

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
      const companyToDelete = await getCompanyByUserId(
        userToDelete.id,
        dbClient
      );
      const picToDelete = await getPersonInChargeByCompanyId(
        companyToDelete.id,
        dbClient
      );
      if (userToDelete) {
        const products = await deleteProductByCompanyId(
          companyToDelete?.id,
          dbClient
        );
        const pic = await deletePersonInChargeById(picToDelete?.id, dbClient)
        const company = await deleteCompanyByUserId(userToDelete.id, dbClient);
        const user = await deleteUserById(userToDelete.id, dbClient);
        return res.json({
          user,
          pic,
          company,
          products,
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
