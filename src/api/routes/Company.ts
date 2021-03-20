import { PrismaClient } from ".prisma/client";
import { Router } from "express";

import { CreateCompanyRequest, SaveCompanyRequest } from "@/types/Company";
import { auth } from "../middlewares/Auth";
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  getMyCompany,
  getSavedCompany,
  saveCompany,
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
      const result = await getMyCompany(req.user._id, dbClient);
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

  route.get("/all", auth, async (_, res, next) => {
    try {
      const result = await getAllCompanies(dbClient);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });
};
