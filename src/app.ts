import express from "express";

import { loadApp } from "@/loaders";
import config from "@/config";
import fs from "fs";
import https from "https";

async function startServer() {
  const key = fs.readFileSync("src/certificate/server.key");
  const cert = fs.readFileSync("src/certificate/server.cert");
  const app = express();

  await loadApp(app);
  https
    .createServer(
      {
        key: key,
        cert: cert,
      },
      app
    )
    .listen(config.httpsPort);
  console.log("HTTPS server started at: ", config.httpsPort);
  app.listen(config.port);
  console.log("Server started at: ", config.port);
}

startServer();
