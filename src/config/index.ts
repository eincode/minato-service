import dotenv from "dotenv";

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

export default {
  port: parseInt(process.env.PORT || "8080", 10),
  databaseUrl: process.env.DATABASE_URL,
  api: {
    prefix: "/api",
  },
  jwtSecret: process.env.JWT_SECRET || "",
  jwtAlgorithm: process.env.JWT_ALGO || "",
  saltFactor: process.env.SALT_WORK_FACTOR || "0",
};
