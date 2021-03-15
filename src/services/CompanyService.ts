import { PrismaClient } from ".prisma/client";
import { CreateCompanyRequest } from "@/types/Company";
import { createError } from "@/utils/Utils";
import { getPersonInChargeByCompanyId } from "./PersonInChargeService";

async function createCompany(
  company: CreateCompanyRequest,
  dbClient: PrismaClient,
  userId: number
) {
  const companyResult = await dbClient.company.create({
    data: {
      ...company,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return companyResult;
}

async function getMyCompany(userId: number, dbClient: PrismaClient) {
  const company = await dbClient.company.findFirst({
    where: {
      userId: userId,
    },
  });
  return company;
}

async function getCompanyById(companyId: string, dbClient: PrismaClient) {
  const parsedCompanyId = parseInt(companyId);
  const company = await dbClient.company.findUnique({
    where: {
      id: parsedCompanyId,
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
  companyId: number,
  dbClient: PrismaClient,
  userId: number
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

async function getSavedCompany(userId: number, dbClient: PrismaClient) {
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

export {
  createCompany,
  getCompanyById,
  saveCompany,
  getSavedCompany,
  getMyCompany,
};
