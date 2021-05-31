import { PrismaClient, Role } from ".prisma/client";
import { v4 as uuid } from "uuid";

import { CreateCompanyRequest } from "@/types/Company";
import { createError, saveImage } from "@/utils/Utils";
import { getPersonInChargeByCompanyId } from "./PersonInChargeService";
import { getProductCategoriesByCompanyId } from "./Product";

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

async function updateCompany(
  companyId: string,
  company: CreateCompanyRequest,
  dbClient: PrismaClient
) {
  const img = company.img
    ? saveImage(company.img, "Company", companyId)
    : undefined;
  const editedCompany = await dbClient.company.update({
    where: {
      id: companyId,
    },
    data: {
      ...company,
      img,
    },
  });
  return editedCompany;
}

async function getCompanyByUserId(userId: string, dbClient: PrismaClient) {
  const company = await dbClient.company.findFirst({
    where: {
      userId,
    },
  });
  return company;
}

async function getMyCompany(userId: string, dbClient: PrismaClient) {
  const company = await dbClient.company.findFirst({
    where: {
      userId: userId,
    },
    select: {
      id: true,
    },
  });
  if (company) {
    const result = await getCompanyById(company.id, dbClient);
    return result;
  }
  throw createError("BadRequest", "Please create a company first");
}

async function getCompanyById(companyId: string, dbClient: PrismaClient) {
  const userCompany = await dbClient.user.findFirst({
    where: {
      company: {
        id: companyId,
      },
    },
  });
  const company = await dbClient.company.findUnique({
    where: {
      id: companyId,
    },
  });
  if (userCompany?.role === "SELLER") {
    const category = await getProductCategoriesByCompanyId(companyId, dbClient);
    const filteredCategories: Array<string> = [];
    category.forEach((category) => {
      const isCategoryExist = filteredCategories.find(
        (categoryFiltered) => categoryFiltered === category
      );
      if (!isCategoryExist) {
        filteredCategories.push(category);
      }
    });
    return {
      ...company,
      category: filteredCategories,
    };
  }
  if (company) {
    return {
      ...company,
      category: userCompany?.productCategory,
    };
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
  const myCompanyId = company.id || "";
  const personInChargeQuery = await getPersonInChargeByCompanyId(
    myCompanyId,
    dbClient
  );
  const personInCharge = personInChargeQuery;
  if (!personInCharge) {
    throw createError("BadRequest", "Please create person in charge first");
  }
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

async function getAllCompaniesRaw(dbClient: PrismaClient) {
  const companies = await dbClient.company.findMany();
  return companies;
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

async function getBuyerCompaniesByCategories(
  categories: Array<string>,
  dbClient: PrismaClient
) {
  const companies = await dbClient.user.findMany({
    where: {
      productCategory: {
        hasSome: categories,
      },
    },
    select: {
      company: true,
    },
  });
  const flattenedCompanies = companies
    .map((company) => company.company)
    .filter((company) => {
      if (company) {
        return true;
      }
      return false;
    });
  return flattenedCompanies;
}

async function getCompaniesByUserRole(role: Role, dbClient: PrismaClient) {
  const companies = await dbClient.company.findMany({
    where: {
      user: {
        role: role,
      },
    },
  });
  return companies;
}

async function deleteAllCompanies(dbClient: PrismaClient) {
  const companies = await dbClient.company.deleteMany();
  return companies;
}

async function deleteCompanyByUserId(
  userId: string | undefined,
  dbClient: PrismaClient
) {
  if (userId) {
    const companyToDelete = await dbClient.company.findFirst({
      where: {
        userId,
      },
    });
    if (companyToDelete) {
      const company = await dbClient.company.delete({
        where: {
          id: companyToDelete?.id,
        },
      });
      return company;
    }
    return null;
  }
  return null;
}

async function deleteSavedCompanyByPicId(
  picId: string | undefined,
  dbClient: PrismaClient
) {
  if (picId) {
    const savedCompanies = await dbClient.savedCompany.deleteMany({
      where: {
        personInChargeId: picId,
      },
    });
    return savedCompanies;
  }
  return [];
}

export {
  createCompany,
  getCompanyByUserId,
  getCompanyById,
  saveCompany,
  getSavedCompany,
  getMyCompany,
  getAllCompanies,
  getAllCompaniesRaw,
  getBuyerCompaniesByCategories,
  getCompaniesByUserRole,
  updateCompany,
  deleteAllCompanies,
  deleteCompanyByUserId,
  deleteSavedCompanyByPicId,
};
