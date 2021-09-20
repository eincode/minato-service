import { PrismaClient } from ".prisma/client";
import { v4 as uuid } from "uuid";

import { CreateCompanyRequest, UpdateCompanyRequest } from "@/types/Company";
import { createError, saveImage } from "@/utils/Utils";
import { deleteProductByCompanyId } from "./Product";
import { deletePersonInChargeByCompanyId } from "./PersonInChargeService";

async function createCompany(
  company: CreateCompanyRequest,
  dbClient: PrismaClient,
  userId: string
) {
  const id = uuid();
  console.log(
    `Requesting createCompany with request ${JSON.stringify(company)}`
  );
  const img = company.img ? saveImage(company.img, "Company", id) : null;
  const result = await dbClient.company.create({
    data: {
      id,
      ...company,
      user: {
        connect: {
          id: userId,
        },
      },
      typeOfIndustry: {
        connect: {
          id: company.typeOfIndustry,
        },
      },
      img,
      buyingCategories: {
        connect:
          company.buyingCategories?.map((category) => ({ id: category })) ??
          undefined,
      },
      requestAsBuyer: company.requestAsBuyer
        ? {
            create: {
              id: uuid(),
              ...company.requestAsBuyer,
            },
          }
        : undefined,
      requestAsSeller: company.requestAsSeller
        ? {
            create: {
              id: uuid(),
              ...company.requestAsSeller,
            },
          }
        : undefined,
    },
    include: {
      typeOfIndustry: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      productCategories: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      buyingCategories: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      requestAsBuyer: {
        select: {
          destinationPort: true,
          other: true,
          paymentMethod: true,
          productName: true,
        },
      },
      requestAsSeller: {
        select: {
          request: true,
        },
      },
      product: {
        select: {
          id: true,
          companyId: true,
          category: true,
          name: true,
          description: true,
          img: true,
          isHalal: true,
          minimumOrderQuantity: true,
        },
      },
    },
  });
  return result;
}

async function updateCompany(
  companyId: string,
  company: UpdateCompanyRequest,
  dbClient: PrismaClient
) {
  const img = company.img
    ? saveImage(company.img, "Company", companyId)
    : undefined;
  const requestAsBuyer = await dbClient.buyerRequest.findFirst({
    where: {
      companyId,
    },
  });
  const requestAsSeller = await dbClient.buyerRequest.findFirst({
    where: {
      companyId,
    },
  });
  const editedCompany = await dbClient.company.update({
    where: {
      id: companyId,
    },
    data: {
      ...company,
      buyingCategories: {
        connect:
          company.buyingCategories?.map((category) => ({
            id: category,
          })) ?? [],
      },
      requestAsBuyer: company.requestAsBuyer
        ? {
            upsert: {
              create: {
                id: uuid(),
                ...company.requestAsBuyer,
              },
              update: {
                id: requestAsBuyer?.id,
                ...company.requestAsBuyer,
              },
            },
          }
        : undefined,
      requestAsSeller: company.requestAsSeller
        ? {
            upsert: {
              create: {
                id: uuid(),
                ...company.requestAsSeller,
              },
              update: {
                id: requestAsSeller?.id,
                ...company.requestAsSeller,
              },
            },
          }
        : undefined,
      img,
    },
    include: {
      typeOfIndustry: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      productCategories: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      buyingCategories: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      requestAsSeller: {
        select: {
          request: true,
        },
      },
      requestAsBuyer: {
        select: {
          destinationPort: true,
          other: true,
          paymentMethod: true,
          productName: true,
        },
      },
      product: {
        select: {
          id: true,
          companyId: true,
          category: true,
          name: true,
          description: true,
          img: true,
          isHalal: true,
          minimumOrderQuantity: true,
        },
      },
    },
  });
  return editedCompany;
}

async function getCompanyByUserId(userId: string, dbClient: PrismaClient) {
  const company = await dbClient.company.findFirst({
    where: {
      userId,
    },
    include: {
      typeOfIndustry: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      productCategories: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      buyingCategories: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      requestAsBuyer: {
        select: {
          destinationPort: true,
          other: true,
          paymentMethod: true,
          productName: true,
        },
      },
      requestAsSeller: {
        select: {
          request: true,
        },
      },
      product: {
        select: {
          id: true,
          companyId: true,
          category: true,
          name: true,
          description: true,
          img: true,
          isHalal: true,
          minimumOrderQuantity: true,
        },
      },
    },
  });
  if (company) {
    return company;
  }
  throw createError("BadRequest", "Company doesn't exist");
}

async function getCompanyById(companyId: string, dbClient: PrismaClient) {
  const company = await dbClient.company.findUnique({
    where: {
      id: companyId,
    },
    include: {
      typeOfIndustry: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      productCategories: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      buyingCategories: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      requestAsSeller: {
        select: {
          request: true,
        },
      },
      requestAsBuyer: {
        select: {
          destinationPort: true,
          other: true,
          paymentMethod: true,
          productName: true,
        },
      },
      product: {
        select: {
          id: true,
          companyId: true,
          category: true,
          name: true,
          description: true,
          img: true,
          isHalal: true,
          minimumOrderQuantity: true,
        },
      },
    },
  });
  if (!company) {
    throw createError("BadRequest", "Company not found");
  }
  return company;
}

async function saveCompany(
  companyId: string,
  dbClient: PrismaClient,
  userId: string
) {
  const result = await dbClient.user.update({
    where: {
      id: userId,
    },
    data: {
      savedCompanies: {
        connect: {
          id: companyId,
        },
      },
    },
  });
  if (result) {
    return { message: "success" };
  } else {
    throw createError("BadRequest", "Company not found");
  }
}

async function getSavedCompany(userId: string, dbClient: PrismaClient) {
  const user = await dbClient.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      savedCompanies: {
        include: {
          typeOfIndustry: {
            select: {
              id: true,
              en: true,
              jp: true,
            },
          },
          productCategories: {
            select: {
              id: true,
              en: true,
              jp: true,
            },
          },
          buyingCategories: {
            select: {
              id: true,
              en: true,
              jp: true,
            },
          },
          requestAsBuyer: {
            select: {
              destinationPort: true,
              other: true,
              paymentMethod: true,
              productName: true,
            },
          },
          requestAsSeller: {
            select: {
              request: true,
            },
          },
          product: {
            select: {
              id: true,
              companyId: true,
              category: true,
              name: true,
              description: true,
              img: true,
              isHalal: true,
              minimumOrderQuantity: true,
            },
          },
        },
      },
    },
  });
  if (!user) {
    throw createError("BadRequest", "User not found");
  }
  return user.savedCompanies;
}

async function getAllCompanies(dbClient: PrismaClient) {
  const companies = await dbClient.company.findMany({
    include: {
      typeOfIndustry: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      productCategories: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      buyingCategories: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      requestAsBuyer: {
        select: {
          destinationPort: true,
          other: true,
          paymentMethod: true,
          productName: true,
        },
      },
      requestAsSeller: {
        select: {
          request: true,
        },
      },
      product: {
        select: {
          id: true,
          companyId: true,
          category: true,
          name: true,
          description: true,
          img: true,
          isHalal: true,
          minimumOrderQuantity: true,
        },
      },
    },
  });
  return companies;
}

async function getBuyerCompaniesByCategories(
  categories: Array<string>,
  dbClient: PrismaClient
) {
  const companies = await dbClient.company.findMany({
    where: {
      buyingCategories: {
        some: {
          id: {
            in: categories,
          },
        },
      },
    },
    include: {
      requestAsBuyer: {
        select: {
          destinationPort: true,
          other: true,
          paymentMethod: true,
          productName: true,
        },
      },
      requestAsSeller: {
        select: {
          request: true,
        },
      },
      product: true,
    },
  });
  return companies;
}

async function getSellerCompaniesByCategories(
  categories: Array<string>,
  dbClient: PrismaClient
) {
  const companies = await dbClient.company.findMany({
    where: {
      productCategories: {
        some: {
          id: {
            in: categories,
          },
        },
      },
    },
    include: {
      requestAsBuyer: {
        select: {
          destinationPort: true,
          other: true,
          paymentMethod: true,
          productName: true,
        },
      },
      requestAsSeller: {
        select: {
          request: true,
        },
      },
      product: true,
    },
  });
  return companies;
}

async function getSellerCompanies(dbClient: PrismaClient) {
  const companies = await dbClient.company.findMany({
    where: {
      productCategories: {
        every: {},
      },
    },
    include: {
      typeOfIndustry: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      productCategories: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      buyingCategories: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      requestAsBuyer: {
        select: {
          destinationPort: true,
          other: true,
          paymentMethod: true,
          productName: true,
        },
      },
      requestAsSeller: {
        select: {
          request: true,
        },
      },
      product: {
        select: {
          id: true,
          companyId: true,
          category: true,
          name: true,
          description: true,
          img: true,
          isHalal: true,
          minimumOrderQuantity: true,
        },
      },
    },
  });
  return companies;
}

async function getBuyerCompanies(dbClient: PrismaClient) {
  const companies = await dbClient.company.findMany({
    where: {
      buyingCategories: {
        every: {},
      },
    },
    include: {
      typeOfIndustry: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      productCategories: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      buyingCategories: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
      requestAsBuyer: {
        select: {
          destinationPort: true,
          other: true,
          paymentMethod: true,
          productName: true,
        },
      },
      requestAsSeller: {
        select: {
          request: true,
        },
      },
      product: {
        select: {
          id: true,
          companyId: true,
          category: true,
          name: true,
          description: true,
          img: true,
          isHalal: true,
          minimumOrderQuantity: true,
        },
      },
    },
  });
  return companies;
}

async function deleteAllCompanies(dbClient: PrismaClient) {
  await dbClient.sellerRequest.deleteMany();
  await dbClient.buyerRequest.deleteMany();
  const companies = await dbClient.company.deleteMany();
  return companies;
}

async function deleteCompanyByUserId(userId: string, dbClient: PrismaClient) {
  const companyToDelete = await dbClient.company.findFirst({
    where: {
      userId,
    },
  });
  if (companyToDelete) {
    await deleteProductByCompanyId(companyToDelete.id, dbClient);
    await deletePersonInChargeByCompanyId(companyToDelete.id, dbClient);
    await dbClient.sellerRequest.deleteMany({
      where: {
        companyId: companyToDelete.id,
      },
    });
    await dbClient.buyerRequest.deleteMany({
      where: {
        companyId: companyToDelete.id,
      },
    });
    const company = await dbClient.company.delete({
      where: {
        id: companyToDelete?.id,
      },
    });
    return company;
  }
  return null;
}

async function deleteCompanyById(companyId: string, dbClient: PrismaClient) {
  await dbClient.sellerRequest.deleteMany({
    where: {
      companyId,
    },
  });
  await dbClient.buyerRequest.deleteMany({
    where: {
      companyId,
    },
  });
  const company = await dbClient.company.delete({
    where: {
      id: companyId,
    },
  });
  if (company) {
    return company;
  }
  return null;
}

export {
  createCompany,
  getCompanyByUserId,
  getCompanyById,
  saveCompany,
  getSavedCompany,
  getAllCompanies,
  getBuyerCompaniesByCategories,
  getSellerCompaniesByCategories,
  updateCompany,
  deleteAllCompanies,
  deleteCompanyByUserId,
  deleteCompanyById,
  getSellerCompanies,
  getBuyerCompanies,
};
