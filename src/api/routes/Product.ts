import { PrismaClient } from ".prisma/client";
import { Router } from "express";

import {
  CreateProductRequestSchema,
  CreateProductResponse,
  DeleteProductByIdResponse,
  GetMyProductsResponse,
  GetProductsByCompanyIdResponse,
  UpdateProductRequestSchema,
  UpdateProductResponse,
} from "@/types/Product";
import { auth } from "../middlewares/Auth";
import {
  createProducts,
  deleteProductById,
  getProductsByCompanyId,
  updateProduct,
} from "@/services/Product";
import { getCompanyByUserId } from "@/services/CompanyService";

const route = Router();

export default (app: Router, dbClient: PrismaClient) => {
  app.use("/product", route);

  route.get("/me", auth, async (req, res, next) => {
    try {
      const company = await getCompanyByUserId(req.user._id, dbClient);
      const companyId = company.id || "";
      const products: GetMyProductsResponse = await getProductsByCompanyId(
        companyId,
        dbClient
      );
      return res.json(products);
    } catch (err) {
      next(err);
    }
  });

  route.post("/update", auth, async (req, res, next) => {
    const request = UpdateProductRequestSchema.check(req.body);
    const productId = req.query.productId as string;
    try {
      const result: UpdateProductResponse = await updateProduct(
        productId,
        request,
        dbClient
      );
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.post("/:companyId", auth, async (req, res, next) => {
    const request = CreateProductRequestSchema.check(req.body);
    const companyId = req.params.companyId;
    try {
      const result: CreateProductResponse = await createProducts(
        request,
        dbClient,
        companyId
      );
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/:companyId", auth, async (req, res, next) => {
    try {
      const products: GetProductsByCompanyIdResponse = await getProductsByCompanyId(
        req.params.companyId,
        dbClient
      );
      return res.json(products);
    } catch (err) {
      next(err);
    }
  });

  route.get("/delete/:productId", auth, async (req, res, next) => {
    try {
      const product: DeleteProductByIdResponse = await deleteProductById(req.params.productId, dbClient);
      return res.json(product);
    } catch (err) {
      next(err);
    }
  });
};
