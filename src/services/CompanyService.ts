import { PrismaClient } from ".prisma/client";
import { CreateCompanyRequest } from "@/types/Company";

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

async function getCompanyById(companyId: string, dbClient: PrismaClient) {
  const parsedCompanyId = parseInt(companyId);
  const company = await dbClient.company.findUnique({
    where: {
      id: parsedCompanyId,
    },
  });
  console.log("QUERY RESULT", company);
  if (company) {
    return company;
  }

  const error = new Error("Company Not Found");
  error.name = "BadRequest";
  throw error;
}

export { createCompany, getCompanyById };
