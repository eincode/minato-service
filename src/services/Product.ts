import { PrismaClient } from ".prisma/client";
import { v4 as uuid } from "uuid";

import { CreateProductRequest, ProductRequest } from "@/types/Product";
import { injectKeyToArray, saveMultipleImages } from "@/utils/Utils";

async function createProducts(
  products: CreateProductRequest,
  dbClient: PrismaClient,
  companyId: string
) {
  const injectedProductWithCompanyId = injectKeyToArray(
    "companyId",
    companyId,
    products
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

export { createProducts, getProductsByCompanyId, getAllProducts };
