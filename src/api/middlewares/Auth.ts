import jwt from "express-jwt";
import config from "@/config";
import { Request } from "express";

function getTokenFromHeader(req: Request) {
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Token") ||
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}

const auth = jwt({
  secret: config.jwtSecret,
  algorithms: [config.jwtAlgorithm],
  userProperty: "user",
  getToken: getTokenFromHeader,
});

export { auth };
