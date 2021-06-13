import { PrismaClient } from ".prisma/client";
import { Router } from "express";

import { CreateCompanyRequest, SaveCompanyRequest } from "@/types/Company";
import { auth } from "../middlewares/Auth";
import {
  createCompany,
  getAllCompanies,
  getBuyerCompaniesByCategories,
  getCompanyById,
  getCompanyByUserId,
  getSavedCompany,
  getSellerCompaniesByCategories,
  saveCompany,
  updateCompany,
} from "@/services/CompanyService";

const route = Router();

export default (app: Router, dbClient: PrismaClient) => {
  app.use("/company", route);

  route.post("/", auth, async (req, res, next) => {
    const request = req.body as CreateCompanyRequest;
    try {
      const result = await createCompany(request, dbClient, req.user._id);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.post("/update", auth, async (req, res, next) => {
    const request = req.body as CreateCompanyRequest;
    const companyId = req.query.companyId as string;
    try {
      const result = await updateCompany(companyId, request, dbClient);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/", auth, async (req, res, next) => {
    const id = req.query.id as string;
    try {
      const result = await getCompanyById(id, dbClient);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/me", auth, async (req, res, next) => {
    try {
      const result = await getCompanyByUserId(req.user._id, dbClient);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.post("/save", auth, async (req, res, next) => {
    const request = req.body as SaveCompanyRequest;
    try {
      const result = await saveCompany(
        request.companyId,
        dbClient,
        req.user._id
      );
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/saved", auth, async (req, res, next) => {
    try {
      const result = await getSavedCompany(req.user._id, dbClient);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/home/seller", auth, async (req, res, next) => {
    const userId = req.user._id;
    try {
      const userCompany = await getCompanyByUserId(userId, dbClient);
      const categories = userCompany.productCategories;
      const companies = await getBuyerCompaniesByCategories(
        categories,
        dbClient
      );
      const result = companies.filter(
        (company) => company.id !== userCompany.id
      );
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/home/buyer", auth, async (req, res, next) => {
    const userId = req.user._id;
    try {
      const userCompany = await getCompanyByUserId(userId, dbClient);
      const categories = userCompany.buyingCategories;
      const companies = await getSellerCompaniesByCategories(
        categories,
        dbClient
      );
      const result = companies.filter(
        (company) => company.id !== userCompany.id
      );
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/all", auth, async (_, res, next) => {
    try {
      const result = await getAllCompanies(dbClient);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });
};
