import { PrismaClient } from ".prisma/client";
import { Router } from "express";

import { CreateProductRequest } from "@/types/Product";
import { auth } from "../middlewares/Auth";
import { createProducts, getProductsByCompanyId } from "@/services/Product";

const route = Router();

export default (app: Router, dbClient: PrismaClient) => {
  app.use("/product", route);

  route.post("/:companyId", auth, async (req, res, next) => {
    const request = req.body as CreateProductRequest;
    const parsedCompanyId = parseInt(req.params.companyId);
    try {
      const result = await createProducts(request, dbClient, parsedCompanyId);
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
