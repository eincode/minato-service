import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

async function track(userId: string, dbClient: PrismaClient, endpoint: string) {
  const id = uuid();
  const result = await dbClient.tracker.create({
    data: {
      id,
      endpoint,
      time: new Date(),
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return result;
}

async function getAllTracks(dbClient: PrismaClient) {
  const result = await dbClient.tracker.findMany({
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });
  return result;
}

export { track, getAllTracks };
