import express from "express";

import { loadApp } from "@/loaders";
import config from "@/config";

async function startServer() {
  const app = express();

  await loadApp(app);

  app.listen(config.port);
  console.log("Server started at: ", config.port);
}

startServer();
