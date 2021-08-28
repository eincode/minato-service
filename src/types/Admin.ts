import * as t from "runtypes";

const AddCategoryRequestSchema = t.Record({
  en: t.String.withConstraint((en) => en.length > 0),
  jp: t.String.withConstraint((jp) => jp.length > 0),
});

export type AddCategoryRequest = t.Static<typeof AddCategoryRequestSchema>;

const AddCategoryResponseSchema = t.Record({
  id: t.String,
  en: t.String,
  jp: t.String,
});

export type AddCategoryResponse = t.Static<typeof AddCategoryResponseSchema>;

const AddSubCategoryRequestSchema = t.Record({
  parentCategoryId: t.String,
  en: t.String.withConstraint((en) => en.length > 0),
  jp: t.String.withConstraint((jp) => jp.length > 0),
});

export type AddSubCategoryRequest = t.Static<
  typeof AddSubCategoryRequestSchema
>;

const AddSubCategoryResponseSchema = t.Record({
  id: t.String,
  en: t.String,
  jp: t.String,
});

export type AddSubCategoryResponse = t.Static<
  typeof AddSubCategoryResponseSchema
>;

const DeleteCategoryResponseSchema = t.Record({
  id: t.String,
  en: t.String,
  jp: t.String,
});

export type DeleteCategoryResponse = t.Static<
  typeof DeleteCategoryResponseSchema
>;

const DeleteSubCategoryResponseSchema = t.Record({
  id: t.String,
  en: t.String,
  jp: t.String,
});

export type DeleteSubCategoryResponse = t.Static<
  typeof DeleteSubCategoryResponseSchema
>;

export {
  AddCategoryRequestSchema,
  AddCategoryResponseSchema,
  AddSubCategoryRequestSchema,
  AddSubCategoryResponseSchema,
  DeleteCategoryResponseSchema,
  DeleteSubCategoryResponseSchema,
};
