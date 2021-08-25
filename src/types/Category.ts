import * as t from "runtypes";

const SubCategorySchema = t.Record({
  id: t.String,
  en: t.String,
  jp: t.String,
});

export type SubCategory = t.Static<typeof SubCategorySchema>;

const CategorySchema = t.Record({
  id: t.String,
  en: t.String,
  jp: t.String,
  subCategories: t.Array(SubCategorySchema),
});

export type Category = t.Static<typeof CategorySchema>;

const GetAllCategoriesResponseSchema = t.Array(CategorySchema);

export type GetAllCategoriesResponse = t.Static<
  typeof GetAllCategoriesResponseSchema
>;

export { SubCategorySchema, CategorySchema, GetAllCategoriesResponseSchema };
