import { getAllTracks } from "@/services/TrackerService";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";

import { auth } from "../middlewares/Auth";

const route = Router();

export default (app: Router, dbClient: PrismaClient) => {
  app.use("/tracker", route);

  route.get("/all", auth, async (_, res, next) => {
    try {
      const result = await getAllTracks(dbClient);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });
};
