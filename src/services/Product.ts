import { Company, PrismaClient } from ".prisma/client";
import { v4 as uuid } from "uuid";

import { CreateProductRequest, ProductRequest } from "@/types/Product";
import { injectKeyToArray, saveMultipleImages } from "@/utils/Utils";
import { getAllCompaniesRaw } from "./CompanyService";

async function createProducts(
  products: CreateProductRequest,
  dbClient: PrismaClient,
  companyId: string
) {
  const injectedProductWithCompanyId = injectKeyToArray(
    "companyId",
    companyId,
    products.products
  );
  const productsWithImg = injectedProductWithCompanyId.map(
    (product: ProductRequest & { companyId: string }) => {
      const id = uuid();
      const img = product.img
        ? saveMultipleImages(product.img, "Product")
        : undefined;
      return {
        id,
        ...product,
        img,
      };
    }
  );
  const productsResult = await dbClient.product.createMany({
    data: productsWithImg,
  });
  return productsResult;
}

async function getProductsByCompanyId(
  companyId: string,
  dbClient: PrismaClient
) {
  const products = await dbClient.product.findMany({
    where: {
      companyId,
    },
  });
  return products;
}

async function getCompanyByProductCategory(
  companyId: string,
  category: Array<string>,
  dbClient: PrismaClient
) {
  if (category.length > 0) {
    const filters = category.map((category) => ({
      category: category,
    }));
    const products = await dbClient.product.findMany({
      where: {
        OR: filters,
      },
      include: {
        company: true,
      },
    });
    const companies = products.map((product) => product.company);
    const filteredCompanies: Company[] = [];
    companies.forEach((company) => {
      const isCompanyExist = filteredCompanies.find(
        (companyRaw) => companyRaw.id === company.id
      );
      if (!isCompanyExist && company.id !== companyId) {
        filteredCompanies.push(company);
      }
    });
    if (filteredCompanies.length < 3) {
      const result = await getAllCompaniesRaw(dbClient);
      const filteredResult = result.filter(
        (company) => company.id !== companyId
      );
      return filteredResult;
    }
    return filteredCompanies;
  } else {
    const result = await getAllCompaniesRaw(dbClient);
    const filteredResult = result.filter((company) => company.id !== companyId);
    return filteredResult;
  }
}

async function getAllProducts(dbClient: PrismaClient) {
  const products = await dbClient.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      isHalal: true,
      minimumOrderQuantity: true,
      companyId: true,
    },
  });
  return products;
}

async function getProductCategoriesByCompanyId(
  companyId: string,
  dbClient: PrismaClient
) {
  const products = await dbClient.product.findMany({
    where: {
      companyId,
    },
    select: {
      category: true,
    },
  });
  const productCategories = products.map((product) => product.category);
  return productCategories;
}

export {
  createProducts,
  getProductsByCompanyId,
  getAllProducts,
  getCompanyByProductCategory,
  getProductCategoriesByCompanyId,
};
