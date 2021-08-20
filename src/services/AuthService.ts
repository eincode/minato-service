import { LoginRequest, RegisterRequest } from "@/types/User";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

import config from "@/config";
import { createError } from "@/utils/Utils";

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(parseInt(config.saltFactor));
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

function generateToken(user: User) {
  return jwt.sign(
    {
      _id: user.id,
      email: user.email,
    },
    config.jwtSecret
  );
}

function generateAdminToken() {
  return jwt.sign(
    {
      _id: "admin",
      email: "admin@admin.com",
    },
    config.jwtSecret
  );
}

async function comparePassword(candidatePassword: string, password: string) {
  const isMatch = await bcrypt.compare(candidatePassword, password);
  return isMatch;
}

async function signUp(user: RegisterRequest, dbClient: PrismaClient) {
  if (user.password !== user.confirmationPassword) {
    throw createError("BadRequest", "Password mismatch!");
  }

  const isUserExist = await dbClient.user.findUnique({
    where: {
      email: user.email,
    },
  });
  if (isUserExist) {
    throw createError("BadRequest", "Email already exists! Please log in");
  }

  if (user.password.length < 6) {
    throw createError(
      "BadRequest",
      "Password is too short, use at least 6 character password"
    );
  }

  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(user.email)) {
    throw createError("BadRequest", "Invalid email");
  }

  const hashedPassword = await hashPassword(user.password);
  const id = uuid();
  const createdUser = await dbClient.user.create({
    data: {
      id,
      email: user.email,
      password: hashedPassword,
    },
  });

  return { email: user.email, accessToken: generateToken(createdUser) };
}

async function login(req: LoginRequest, dbClient: PrismaClient) {
  const user = await dbClient.user.findUnique({
    where: {
      email: req.email,
    },
  });
  if (!user) {
    throw createError("BadRequest", "User doesn't exists!");
  }

  const isPasswordMatched = await comparePassword(req.password, user.password);
  if (isPasswordMatched) {
    const token = generateToken(user);
    return { accessToken: token };
  } else {
    throw createError("BadRequest", "Wrong username and password combination!");
  }
}

async function adminLogin(req: LoginRequest) {
  if (req.email === "admin@admin.com" && req.password === "akuPadamu") {
    const token = generateAdminToken();
    return { accessToken: token };
  } else {
    throw createError("BadRequest", "Wrong credentials");
  }
}

export { signUp, login, adminLogin };
