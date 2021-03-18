import { PrismaClient } from ".prisma/client";
import { v4 as uuid } from "uuid";

import { CreateProductRequest } from "@/types/Product";
import { injectKeyToArray, saveImage } from "@/utils/Utils";

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
  const productsWithImg = injectedProductWithCompanyId.map((product) => {
    const id = uuid();
    const img = product.img ? saveImage(product.img, "Product", id) : null;
    return {
      id,
      ...product,
      img,
    };
  });
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

export { createProducts, getProductsByCompanyId };
