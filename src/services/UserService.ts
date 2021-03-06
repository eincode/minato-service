import { createError } from "@/utils/Utils";
import { PrismaClient } from "@prisma/client";
import { deleteCompanyByUserId } from "./CompanyService";

async function getUserById(id: string, dbClient: PrismaClient) {
  const user = await dbClient.user.findUnique({
    where: {
      id,
    },
  });
  if (user) {
    return {
      id: user.id,
      email: user.email,
    };
  }
  throw createError("BadRequest", "User not exist");
}

async function getAllUsers(dbClient: PrismaClient) {
  const users = await dbClient.user.findMany({
    select: {
      id: true,
      email: true,
    },
  });
  return users;
}

async function deleteAllUsers(dbClient: PrismaClient) {
  const users = await dbClient.user.deleteMany();
  return users;
}

async function deleteUserById(userId: string, dbClient: PrismaClient) {
  await deleteCompanyByUserId(userId, dbClient);
  const user = await dbClient.user.delete({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
    },
  });
  if (user) {
    return user;
  }
  return null;
}

export { getUserById, getAllUsers, deleteAllUsers, deleteUserById };
