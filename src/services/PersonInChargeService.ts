import { PrismaClient } from ".prisma/client";
import { v4 as uuid } from "uuid";

import { CreatePersonInChargeRequest } from "@/types/PersonInCharge";
import { saveImage } from "@/utils/Utils";

async function createPersonInCharge(
  pic: CreatePersonInChargeRequest,
  dbClient: PrismaClient,
  companyId: string
) {
  const id = uuid();
  console.log(
    `Requesting createPersonInCharge with request ${JSON.stringify(pic)}`
  );
  const img = pic.img ? saveImage(pic.img, "PersonInCharge", id) : null;
  const result = await dbClient.personInCharge.create({
    data: {
      id,
      ...pic,
      img,
      company: {
        connect: {
          id: companyId,
        },
      },
    },
  });
  return result;
}

async function updatePersonInCharge(
  picId: string,
  pic: CreatePersonInChargeRequest,
  dbClient: PrismaClient
) {
  const img = pic.img ? saveImage(pic.img, "PersonInCharge", picId) : undefined;
  const editedPIC = await dbClient.personInCharge.update({
    where: {
      id: picId,
    },
    data: {
      ...pic,
      img,
    },
  });
  return editedPIC;
}

async function getPersonInChargeByCompanyId(
  companyId: string,
  dbClient: PrismaClient
) {
  const result = await dbClient.personInCharge.findFirst({
    where: {
      companyId: companyId,
    },
  });
  return result;
}

async function getAllPersonsInCharge(dbClient: PrismaClient) {
  const result = await dbClient.personInCharge.findMany({
    select: {
      id: true,
      companyId: true,
      name: true,
      nationality: true,
      email: true,
      phoneNumber: true,
      img: true,
    },
  });
  return result;
}

async function deleteAllPics(dbClient: PrismaClient) {
  const pics = await dbClient.personInCharge.deleteMany();
  return pics;
}

async function deletePersonInChargeById(
  picId: string | undefined,
  dbClient: PrismaClient
) {
  if (picId) {
    const pic = await dbClient.personInCharge.delete({
      where: {
        id: picId,
      },
    });
    if (pic) {
      return pic;
    }
    return null;
  }
  return null;
}

async function deletePersonInChargeByCompanyId(
  companyId: string | undefined,
  dbClient: PrismaClient
) {
  if (companyId) {
    const pic = await dbClient.personInCharge.deleteMany({
      where: {
        companyId,
      },
    });
    return pic;
  }
  return null;
}

export {
  createPersonInCharge,
  getPersonInChargeByCompanyId,
  getAllPersonsInCharge,
  updatePersonInCharge,
  deleteAllPics,
  deletePersonInChargeById,
  deletePersonInChargeByCompanyId,
};
