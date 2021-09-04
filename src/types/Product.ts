import * as t from "runtypes";
import { CategorySchema } from "./Category";

const ProductSchema = t.Record({
  id: t.String,
  companyId: t.String,
  category: CategorySchema,
  name: t.String,
  description: t.String,
  img: t.Array(t.String),
  isHalal: t.Boolean,
  minimumOrderQuantity: t.String,
});

export type Product = t.Static<typeof ProductSchema>;

const ProductMutationRequestSchema = t.Record({
  category: t.String,
  name: t.String,
  description: t.String,
  isHalal: t.Boolean,
  minimumOrderQuantity: t.String,
  img: t.Array(t.String),
});

export type ProductMutationRequest = t.Static<
  typeof ProductMutationRequestSchema
>;

const CreateProductRequestSchema = t.Record({
  products: t.Array(ProductMutationRequestSchema),
});

export type CreateProductRequest = t.Static<typeof CreateProductRequestSchema>;

const CreateProductResponseSchema = t.Record({
  count: t.Number,
});

export type CreateProductResponse = t.Static<
  typeof CreateProductResponseSchema
>;

const UpdateProductRequestSchema = ProductMutationRequestSchema;

export type UpdateProductRequest = t.Static<typeof UpdateProductRequestSchema>;

const UpdateProductResponseSchema = ProductSchema;

export type UpdateProductResponse = t.Static<
  typeof UpdateProductResponseSchema
>;

const GetMyProductsResponseSchema = t.Array(ProductSchema);

export type GetMyProductsResponse = t.Static<
  typeof GetMyProductsResponseSchema
>;

const GetProductsByCompanyIdResponseSchema = t.Array(ProductSchema);

export type GetProductsByCompanyIdResponse = t.Static<
  typeof GetProductsByCompanyIdResponseSchema
>;

const GetAllProductsResponseSchema = t.Array(ProductSchema);

export type GetAllProductsResponse = t.Static<
  typeof GetAllProductsResponseSchema
>;

const DeleteProductByIdResponseSchema = ProductSchema;

export type DeleteProductByIdResponse = t.Static<
  typeof DeleteProductByIdResponseSchema
>;

export {
  ProductSchema,
  ProductMutationRequestSchema,
  CreateProductRequestSchema,
  CreateProductResponseSchema,
  UpdateProductRequestSchema,
  UpdateProductResponseSchema,
  GetMyProductsResponseSchema,
  GetProductsByCompanyIdResponseSchema,
  GetAllProductsResponseSchema,
  DeleteProductByIdResponseSchema,
};
