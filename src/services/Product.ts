import { PrismaClient } from ".prisma/client";

import { CreateProductRequest } from "@/types/Product";
import { injectKeyToArray } from "@/utils/Utils";

async function createProducts(
  products: CreateProductRequest,
  dbClient: PrismaClient,
  companyId: number
) {
  const injectedProductWithCompanyId = injectKeyToArray(
    "companyId",
    companyId,
    products
  );
  const productsResult = await dbClient.product.createMany({
    data: injectedProductWithCompanyId,
  });
  return productsResult;
}

async function getProductsByCompanyId(
  companyId: string,
  dbClient: PrismaClient
) {
  const parsedCompanyId = parseInt(companyId);
  const products = await dbClient.product.findMany({
    where: {
      companyId: parsedCompanyId,
    },
  });
  return products;
}

export { createProducts, getProductsByCompanyId };
