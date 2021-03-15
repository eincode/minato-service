import { PrismaClient } from ".prisma/client";
import {
  createPersonInCharge,
  getPersonInChargeByCompanyId,
} from "@/services/PersonInChargeService";
import { CreatePersonInChargeRequest } from "@/types/PersonInCharge";
import { Router } from "express";

import { auth } from "../middlewares/Auth";

const route = Router();

export default (app: Router, dbClient: PrismaClient) => {
  app.use("/pic", route);

  route.post("/:companyId", auth, async (req, res, next) => {
    const request = req.body as CreatePersonInChargeRequest;
    const parsedCompanyId = parseInt(req.params.companyId);
    try {
      const result = await createPersonInCharge(
        request,
        dbClient,
        req.user._id,
        parsedCompanyId
      );
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  route.get("/:companyId", auth, async (req, res, next) => {
    try {
      const pics = await getPersonInChargeByCompanyId(
        req.params.companyId,
        dbClient
      );
      return res.json(pics);
    } catch (err) {
      next(err);
    }
  });
};
