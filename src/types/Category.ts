import * as t from "runtypes";

const CategorySchema = t.Record({
  id: t.String,
  en: t.String,
  jp: t.String,
});

export type Category = t.Static<typeof CategorySchema>;

const GetAllCategoriesResponseSchema = t.Array(
  CategorySchema.extend({
    subCategories: t.Array(CategorySchema),
  })
);

export type GetAllCategoriesResponse = t.Static<
  typeof GetAllCategoriesResponseSchema
>;

const GetSubCategoriesByCategoryIdResponseSchema = t.Array(CategorySchema);

export type GetSubCategoriesByCategoryIdResponse = t.Static<
  typeof GetSubCategoriesByCategoryIdResponseSchema
>;

export {
  CategorySchema,
  GetAllCategoriesResponseSchema,
  GetSubCategoriesByCategoryIdResponseSchema,
};
