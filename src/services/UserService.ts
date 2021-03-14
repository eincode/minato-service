import { UserRole } from "@/types/User";
import { PrismaClient } from "@prisma/client";

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
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

export { getUserById, updateUserRole };
