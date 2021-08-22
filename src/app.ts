import express from "express";
import fs from "fs";
import https from "https";

import { loadApp } from "@/loaders";
import config from "@/config";

async function startServer() {
  const app = express();

  if (config.nodeEnv === "production") {
    const key = fs.readFileSync("selfsigned.key");
    const cert = fs.readFileSync("selfsigned.crt");
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
  }

  await loadApp(app);
  app.listen(config.port);
  console.log("Server started at: ", config.port);
}

startServer();
