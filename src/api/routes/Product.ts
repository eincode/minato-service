import { PrismaClient } from ".prisma/client";
import { Router } from "express";

import { CreateProductRequest, ProductRequest } from "@/types/Product";
import { auth } from "../middlewares/Auth";
import {
  createProducts,
  getAllProducts,
  getProductsByCompanyId,
  updateProduct,
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
      const companyId = company.id || "";
      const products = await getProductsByCompanyId(companyId, dbClient);
      return res.json(products);
    } catch (err) {
      next(err);
    }
  });

  route.post("/update", auth, async (req, res, next) => {
    const request = req.body as ProductRequest;
    const productId = req.query.productId as string;
    try {
      const result = await updateProduct(productId, request, dbClient);
      return res.json(result);
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
