import { PrismaClient } from ".prisma/client";
import { v4 as uuid } from "uuid";

import { CreateCompanyRequest } from "@/types/Company";
import { createError, saveImage } from "@/utils/Utils";
import { getPersonInChargeByCompanyId } from "./PersonInChargeService";

async function createCompany(
  company: CreateCompanyRequest,
  dbClient: PrismaClient,
  userId: string
) {
  const id = uuid();
  const img = company.img ? saveImage(company.img, "Company", id) : null;
  const companyResult = await dbClient.company.create({
    data: {
      id,
      ...company,
      img,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return companyResult;
}

async function getMyCompany(userId: string, dbClient: PrismaClient) {
  const company = await dbClient.company.findFirst({
    where: {
      userId: userId,
    },
  });
  return company;
}

async function getCompanyById(companyId: string, dbClient: PrismaClient) {
  const company = await dbClient.company.findUnique({
    where: {
      id: companyId,
    },
  });
  if (company) {
    return company;
  }

  const error = new Error("Company Not Found");
  error.name = "BadRequest";
  throw error;
}

async function saveCompany(
  companyId: string,
  dbClient: PrismaClient,
  userId: string
) {
  const company = await getMyCompany(userId, dbClient);
  if (!company) {
    throw createError("BadRequest", "Please create a company first");
  }
  const personInChargeQuery = await getPersonInChargeByCompanyId(
    company.id,
    dbClient
  );
  const personInCharge = personInChargeQuery[0];
  const savedCompany = await dbClient.savedCompany.upsert({
    where: {
      personInChargeId: personInCharge.id,
    },
    update: {
      companies: {
        connect: {
          id: companyId,
        },
      },
    },
    create: {
      companies: {
        connect: {
          id: companyId,
        },
      },
      personInCharge: {
        connect: {
          id: personInCharge.id,
        },
      },
    },
  });
  return savedCompany;
}

async function getSavedCompany(userId: string, dbClient: PrismaClient) {
  const pic = await dbClient.personInCharge.findFirst({
    where: {
      userId: userId,
    },
  });
  if (!pic) {
    throw createError(
      "BadRequest",
      "Person In Charge not found in the company"
    );
  }
  const savedCompanies = await dbClient.savedCompany.findFirst({
    where: {
      personInChargeId: pic.id,
    },
    include: {
      companies: true,
    },
  });
  return savedCompanies;
}

async function getAllCompanies(dbClient: PrismaClient) {
  const companies = await dbClient.company.findMany({
    select: {
      address: true,
      country: true,
      name: true,
      email: true,
      id: true,
      userId: true,
      type: true,
    },
  });
  return companies;
}

export {
  createCompany,
  getCompanyById,
  saveCompany,
  getSavedCompany,
  getMyCompany,
  getAllCompanies,
};
