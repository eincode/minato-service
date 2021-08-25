import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { AddCategoryRequest, AddSubCategoryRequest } from "@/types/Admin";

async function addCategory(
  category: AddCategoryRequest,
  dbClient: PrismaClient
) {
  const result = await dbClient.industryCategory.create({
    data: { id: uuid(), ...category },
  });
  return result;
}

async function addSubCategory(
  subCategory: AddSubCategoryRequest,
  dbClient: PrismaClient
) {
  const result = await dbClient.industrySubCategory.create({
    data: {
      id: uuid(),
      en: subCategory.en,
      jp: subCategory.jp,
      parent: {
        connect: {
          id: subCategory.parentCategoryId,
        },
      },
    },
  });
  return result;
}

async function deleteCategory(categoryId: string, dbClient: PrismaClient) {
  await dbClient.industrySubCategory.deleteMany({
    where: {
      parentCategoryId: categoryId,
    },
  });
  const result = await dbClient.industryCategory.delete({
    where: {
      id: categoryId,
    },
  });
  return result;
}

async function deleteSubCategory(categoryId: string, dbClient: PrismaClient) {
  const result = await dbClient.industrySubCategory.delete({
    where: {
      id: categoryId,
    },
  });
  return result;
}

async function getAllCategories(dbClient: PrismaClient) {
  const result = await dbClient.industryCategory.findMany({
    include: {
      subCategories: {
        select: {
          id: true,
          en: true,
          jp: true,
        },
      },
    },
  });
  return result;
}

export {
  addCategory,
  addSubCategory,
  deleteCategory,
  deleteSubCategory,
  getAllCategories,
};
