import { PrismaClient } from ".prisma/client";
import { Router } from "express";

import { CreateProductRequest } from "@/types/Product";
import { auth } from "../middlewares/Auth";
import {
  createProducts,
  getAllProducts,
  getProductsByCompanyId,
} from "@/services/Product";
import { getMyCompany } from "@/services/CompanyService";

const route = Router();

export default (app: Router, dbClient: PrismaClient) => {
  app.use("/product", route);

  route.get("/all", auth, async (_, res, next) => {
    try {
      const result = await getAllProducts(dbClient);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/me", auth, async (req, res, next) => {
    try {
      const company = await getMyCompany(req.user._id, dbClient);
      const products = await getProductsByCompanyId(company.id, dbClient);
      return res.json(products);
    } catch (err) {
      next(err);
    }
  });

  route.post("/:companyId", auth, async (req, res, next) => {
    const request = req.body as CreateProductRequest;
    const companyId = req.params.companyId;
    try {
      const result = await createProducts(request, dbClient, companyId);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/:companyId", auth, async (req, res, next) => {
    try {
      const products = await getProductsByCompanyId(
        req.params.companyId,
        dbClient
      );
      return res.json(products);
    } catch (err) {
      next(err);
    }
  });
};
