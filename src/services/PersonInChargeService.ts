import { PrismaClient } from ".prisma/client";
import { CreatePersonInChargeRequest } from "@/types/PersonInCharge";

async function createPersonInCharge(
  pic: CreatePersonInChargeRequest,
  dbClient: PrismaClient,
  userId: number,
  companyId: number
) {
  const picResult = await dbClient.personInCharge.create({
    data: {
      ...pic,
      company: {
        connect: {
          id: companyId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return picResult;
}

async function getPersonInChargeByCompanyId(
  companyId: number,
  dbClient: PrismaClient
) {
  const result = await dbClient.personInCharge.findMany({
    where: {
      companyId: companyId,
    },
  });
  if (result) {
    return result;
  }

  const error = new Error("Company not found or PIC not exist");
  error.name = "BadRequest";
  throw error;
}

export { createPersonInCharge, getPersonInChargeByCompanyId };
