import { PrismaClient } from ".prisma/client";
import { v4 as uuid } from "uuid";

import { CreatePersonInChargeRequest } from "@/types/PersonInCharge";
import { saveImage } from "@/utils/Utils";

async function createPersonInCharge(
  pic: CreatePersonInChargeRequest,
  dbClient: PrismaClient,
  userId: string,
  companyId: string
) {
  const id = uuid();
  const img = pic.img ? saveImage(pic.img, "PersonInCharge", id) : null;
  const picResult = await dbClient.personInCharge.create({
    data: {
      id,
      ...pic,
      img,
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
  companyId: string,
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

async function getAllPersonsInCharge(dbClient: PrismaClient) {
  const result = await dbClient.personInCharge.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      nationality: true,
      phone: true,
      companyId: true,
    },
  });
  return result;
}

export {
  createPersonInCharge,
  getPersonInChargeByCompanyId,
  getAllPersonsInCharge,
};
