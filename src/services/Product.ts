import { PrismaClient } from ".prisma/client";
import { v4 as uuid } from "uuid";

import {
  CreateProductRequest,
  ProductMutationRequest,
  UpdateProductRequest,
} from "@/types/Product";
import { injectKeyToArray, saveMultipleImages } from "@/utils/Utils";

async function createProducts(
  products: CreateProductRequest,
  dbClient: PrismaClient,
  companyId: string
) {
  console.log(
    `Requesting createProducts with request ${JSON.stringify(
      products
    )} and company id ${companyId}`
  );
  const productCategories = products.products.map(
    (product) => product.category
  );
  const injectedProductWithCompanyId = injectKeyToArray(
    "companyId",
    companyId,
    products.products
  );
  const productsWithImg = injectedProductWithCompanyId.map(
    (product: ProductMutationRequest & { companyId: string }) => {
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
    data: productsWithImg.map((product) => {
      return {
        companyId: product.companyId,
        description: product.description,
        id: product.id,
        isHalal: product.isHalal,
        minimumOrderQuantity: product.minimumOrderQuantity,
        name: product.name,
        img: product.img,
        industrySubCategoryId: product.category,
      };
    }),
  });
  const company = await dbClient.company.findUnique({
    where: {
      id: companyId,
    },
    include: {
      productCategories: true,
    },
  });
  if (company) {
    const existingProductCategories = company.productCategories.map(
      (category) => category.id
    );
    const mergedProductCategories = existingProductCategories.concat(
      productCategories
    );
    await dbClient.company.update({
      where: {
        id: companyId,
      },
      data: {
        productCategories: {
          connect: mergedProductCategories.map((category) => ({
            id: category,
          })),
        },
      },
    });
  }
  return productsResult;
}

async function updateProduct(
  productId: string,
  product: UpdateProductRequest,
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
      category: {
        connect: {
          id: product.category,
        },
      },
      img,
    },
    include: {
      category: true,
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
    include: {
      category: true,
    },
  });
  return products;
}

async function getAllProducts(dbClient: PrismaClient) {
  const products = await dbClient.product.findMany({
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
    include: {
      category: true,
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
