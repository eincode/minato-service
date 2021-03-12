import { PrismaClient } from "@prisma/client";
import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";

import config from "@/config";
import routes from "@/api";

async function loadExpress(app: Express, dbClient: PrismaClient) {
  app.get("/status", (_, res) => {
    res.json({ status: "OK" }).status(200).end();
  });

  app.head("/status", (_, res) => {
    res.status(200).end();
  });

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(morgan("dev"));

  app.use(cors());

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE");
      return res.status(200).json({});
    }

    next();
  });

  app.use("/static", express.static("img"));
  app.use(config.api.prefix, routes(dbClient));
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.log(err.name);
    if (err.name === "UnauthorizedError") {
      return res.status(401).json({ message: err.message });
    }
    if (err.name === "BadRequest") {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  });

  return app;
}

export { loadExpress };
