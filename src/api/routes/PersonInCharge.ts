import { PrismaClient } from ".prisma/client";
import { getMyCompany } from "@/services/CompanyService";
import {
  createPersonInCharge,
  getAllPersonsInCharge,
  getPersonInChargeByCompanyId,
} from "@/services/PersonInChargeService";
import { CreatePersonInChargeRequest } from "@/types/PersonInCharge";
import { Router } from "express";

import { auth } from "../middlewares/Auth";

const route = Router();

export default (app: Router, dbClient: PrismaClient) => {
  app.use("/pic", route);

  route.get("/all", auth, async (_, res, next) => {
    try {
      const pics = await getAllPersonsInCharge(dbClient);
      return res.json(pics);
    } catch (err) {
      next(err);
    }
  });

  route.get("/me", auth, async (req, res, next) => {
    try {
      const company = await getMyCompany(req.user._id, dbClient);
      const pics = await getPersonInChargeByCompanyId(company.id, dbClient);
      return res.json(pics);
    } catch (err) {
      next(err);
    }
  });

  route.post("/:companyId", auth, async (req, res, next) => {
    const request = req.body as CreatePersonInChargeRequest;
    const companyId = req.params.companyId;
    try {
      const result = await createPersonInCharge(
        request,
        dbClient,
        req.user._id,
        companyId
      );
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/:companyId", auth, async (req, res, next) => {
    const companyId = req.params.companyId;
    try {
      const pics = await getPersonInChargeByCompanyId(companyId, dbClient);
      return res.json(pics);
    } catch (err) {
      next(err);
    }
  });
};
