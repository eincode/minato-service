import { PrismaClient } from ".prisma/client";
import { Router } from "express";

import {
  CreateCompanyRequestSchema,
  CreateCompanyResponse,
  GetBuyerCompaniesResponse,
  GetCompanyByIdResponse,
  GetMyCompanyResponse,
  GetSavedCompaniesResponse,
  GetSellerCompaniesResponse,
  SaveCompanyRequestSchema,
  SaveCompanyResponse,
  UpdateCompanyRequestSchema,
  UpdateCompanyResponse,
} from "@/types/Company";
import { auth } from "../middlewares/Auth";
import {
  createCompany,
  getBuyerCompanies,
  // getBuyerCompaniesByCategories,
  getCompanyById,
  getCompanyByUserId,
  getSavedCompany,
  getSellerCompanies,
  // getSellerCompaniesByCategories,
  saveCompany,
  updateCompany,
} from "@/services/CompanyService";
import { createError } from "@/utils/Utils";
import { track } from "@/services/TrackerService";

const route = Router();

export default (app: Router, dbClient: PrismaClient) => {
  app.use("/company", route);

  route.post("/", auth, async (req, res, next) => {
    const request = CreateCompanyRequestSchema.check(req.body);
    try {
      const result: CreateCompanyResponse = await createCompany(
        request,
        dbClient,
        req.user._id
      );
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.post("/update", auth, async (req, res, next) => {
    const request = UpdateCompanyRequestSchema.check(req.body);
    const companyId = req.query.companyId as string;
    try {
      const result: UpdateCompanyResponse = await updateCompany(
        companyId,
        request,
        dbClient
      );
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/", auth, async (req, res, next) => {
    const id = req.query.id as string;
    try {
      const result: GetCompanyByIdResponse = await getCompanyById(id, dbClient);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/me", auth, async (req, res, next) => {
    try {
      const result: GetMyCompanyResponse = await getCompanyByUserId(
        req.user._id,
        dbClient
      );
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.post("/save", auth, async (req, res, next) => {
    const request = SaveCompanyRequestSchema.check(req.body);
    try {
      const result: SaveCompanyResponse = await saveCompany(
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
      const result: GetSavedCompaniesResponse = await getSavedCompany(
        req.user._id,
        dbClient
      );
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
      if (categories.length === 0) {
        throw createError("BadRequest", "You have not setup seller account");
      }
      track(userId, dbClient, "/home/seller");
      // Temporary, reuse after data is populated
      // const companies = await getBuyerCompaniesByCategories(
      //   categories,
      //   dbClient
      // );
      const companies = await getBuyerCompanies(dbClient);
      const result: GetBuyerCompaniesResponse = companies.filter(
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
      if (categories.length === 0) {
        throw createError("BadRequest", "You have not setup buyer account");
      }
      // Temporary, reuse after data is populated
      // const companies = await getSellerCompaniesByCategories(
      //   categories,
      //   dbClient
      // );
      track(userId, dbClient, "/home/buyer");
      const companies = await getSellerCompanies(dbClient);
      const result: GetSellerCompaniesResponse = companies.filter(
        (company) => company.id !== userCompany.id
      );
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });
};
