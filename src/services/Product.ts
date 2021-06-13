import { PrismaClient } from ".prisma/client";
import { v4 as uuid } from "uuid";

import { CreateProductRequest, ProductRequest } from "@/types/Product";
import { injectKeyToArray, saveMultipleImages } from "@/utils/Utils";

async function createProducts(
  products: CreateProductRequest,
  dbClient: PrismaClient,
  companyId: string
) {
  const productCategories = products.products.map(
    (product) => product.category
  );
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
  const company = await dbClient.company.findUnique({
    where: {
      id: companyId,
    },
  });
  if (company) {
    const mergedCategories = new Set([
      ...company.productCategories,
      ...productCategories,
    ]);
    await dbClient.company.update({
      where: {
        id: companyId,
      },
      data: {
        productCategories: Array.from(mergedCategories),
      },
    });
  }
  return productsResult;
}

async function updateProduct(
  productId: string,
  product: ProductRequest,
  dbClient: PrismaClient
) {
  const img = product.img
    ? saveMultipleImages(product.img, "Product")
    : undefined;
  const editedProduct = await dbClient.product.update({
    where: {
      id: productId,
    },
    data: {
      ...product,
      img,
    },
  });

  return editedProduct;
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

async function deleteAllProducts(dbClient: PrismaClient) {
  const products = await dbClient.product.deleteMany();
  return products;
}

async function deleteProductById(productId: string, dbClient: PrismaClient) {
  const product = await dbClient.product.delete({
    where: {
      id: productId,
    },
  });
  return product;
}

async function deleteProductByCompanyId(
  companyId: string | undefined,
  dbClient: PrismaClient
) {
  if (companyId) {
    const products = await dbClient.product.deleteMany({
      where: {
        companyId,
      },
    });
    return products;
  }
  return [];
}

export {
  createProducts,
  getProductsByCompanyId,
  getAllProducts,
  updateProduct,
  deleteAllProducts,
  deleteProductById,
  deleteProductByCompanyId,
};
