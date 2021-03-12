import { LoginRequest, RegisterRequest } from "@/types/User";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import config from "@/config";
import { UserRole } from "@/types/User";

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

async function comparePassword(candidatePassword: string, password: string) {
  const isMatch = await bcrypt.compare(candidatePassword, password);
  return isMatch;
}

async function signUp(user: RegisterRequest, dbClient: PrismaClient) {
  if (user.password !== user.confirmationPassword) {
    throw new Error("Password mismatch!");
  }

  const hashedPassword = await hashPassword(user.password);
  console.log(hashedPassword);
  await dbClient.user.create({
    data: {
      email: user.email,
      password: hashedPassword,
    },
  });

  return { email: user.email };
}

async function login(req: LoginRequest, dbClient: PrismaClient) {
  const user = await dbClient.user.findUnique({
    where: {
      email: req.email,
    },
  });
  if (!user) {
    throw new Error("User not exist!");
  }

  const isPasswordMatched = await comparePassword(req.password, user.password);
  if (isPasswordMatched) {
    const token = generateToken(user);
    return { accessToken: token };
  } else {
    const error = new Error("Wrong password");
    error.name = "BadRequest";
    throw error;
  }
}

async function getUserById(id: string, dbClient: PrismaClient) {
  const user = await dbClient.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!user) {
    const error = new Error("User not exist");
    error.name = "BadRequest";
    throw error;
  }
  return {
    id: user.id,
    email: user.email,
  };
}

async function updateUserRole(
  userId: string,
  role: UserRole,
  dbClient: PrismaClient
) {
  const user = await dbClient.user.update({
    where: {
      id: parseInt(userId),
    },
    data: {
      role: role,
    },
  });
  return user;
}

export { signUp, login, getUserById, updateUserRole };
