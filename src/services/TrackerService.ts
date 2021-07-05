import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { getUserById } from "./UserService";

async function track(userId: string, dbClient: PrismaClient, endpoint: string) {
  const id = uuid();
  const user = await getUserById(userId, dbClient);
  const result = await dbClient.tracker.create({
    data: {
      id,
      endpoint,
      time: new Date(),
      email: user.email,
    },
  });
  return result;
}

async function getAllTracks(dbClient: PrismaClient) {
  const result = await dbClient.tracker.findMany({
    orderBy: {
      time: "desc",
    },
  });
  return result;
}

export { track, getAllTracks };
