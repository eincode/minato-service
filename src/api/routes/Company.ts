import { PrismaClient } from ".prisma/client";
import { Router } from "express";

import { CreateCompanyRequest } from "@/types/Company";
import { auth } from "../middlewares/Auth";
import { createCompany, getCompanyById } from "@/services/CompanyService";

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
};
