import * as t from "runtypes";
import { CategorySchema } from "./Category";
import { ProductSchema } from "./Product";

const BuyerRequestSchema = t.Record({
  productName: t.String,
  destinationPort: t.String,
  paymentMethod: t.String,
  other: t.String,
});

export type BuyerRequest = t.Static<typeof BuyerRequestSchema>;

const SellerRequestSchema = t.Record({
  request: t.String,
});

export type SellerRequest = t.Static<typeof SellerRequestSchema>;

const CompanySchema = t.Record({
  id: t.String,
  userId: t.String,
  country: t.String,
  name: t.String,
  typeOfIndustry: CategorySchema,
  address: t.String,
  website: t.String,
  email: t.String,
  phoneNumber: t.String,
  img: t.String.Or(t.Null),
  product: t.Array(ProductSchema),
  productCategories: t.Array(CategorySchema),
  buyingCategories: t.Array(CategorySchema),
  requestAsBuyer: BuyerRequestSchema.Or(t.Null),
  requestAsSeller: SellerRequestSchema.Or(t.Null),
});

export type Company = t.Static<typeof CompanySchema>;

const CreateCompanyRequestSchema = t.Record({
  country: t.String,
  name: t.String,
  typeOfIndustry: t.String,
  address: t.String,
  website: t.String,
  email: t.String,
  phoneNumber: t.String,
  img: t.String.optional(),
  buyingCategories: t.Array(t.String).optional(),
  requestAsBuyer: BuyerRequestSchema.optional(),
  requestAsSeller: SellerRequestSchema.optional(),
});

export type CreateCompanyRequest = t.Static<typeof CreateCompanyRequestSchema>;

const CreateCompanyResponseSchema = CompanySchema;

export type CreateCompanyResponse = t.Static<
  typeof CreateCompanyResponseSchema
>;

const UpdateCompanyRequestSchema = t.Record({
  country: t.String.optional(),
  name: t.String.optional(),
  address: t.String.optional(),
  website: t.String.optional(),
  email: t.String.optional(),
  phoneNumber: t.String.optional(),
  img: t.String.optional(),
});

export type UpdateCompanyRequest = t.Static<typeof UpdateCompanyRequestSchema>;

const UpdateCompanyResponseSchema = CompanySchema;

export type UpdateCompanyResponse = t.Static<
  typeof UpdateCompanyResponseSchema
>;

const GetMyCompanyResponseSchema = CompanySchema;

export type GetMyCompanyResponse = t.Static<typeof GetMyCompanyResponseSchema>;

const GetCompanyByIdResponseSchema = CompanySchema;

export type GetCompanyByIdResponse = t.Static<
  typeof GetCompanyByIdResponseSchema
>;

const SaveCompanyRequestSchema = t.Record({
  companyId: t.String,
});

export type SaveCompanyRequest = t.Static<typeof SaveCompanyRequestSchema>;

const SaveCompanyResponseSchema = t.Record({
  message: t.String,
});

export type SaveCompanyResponse = t.Static<typeof SaveCompanyResponseSchema>;

const GetSavedCompaniesResponseSchema = t.Array(CompanySchema);

export type GetSavedCompaniesResponse = t.Static<
  typeof GetSavedCompaniesResponseSchema
>;

const GetAllCompaniesResponseSchema = t.Array(CompanySchema);

export type GetAllCompaniesResponse = t.Static<
  typeof GetAllCompaniesResponseSchema
>;

const GetBuyerCompaniesResponseSchema = t.Array(CompanySchema);

export type GetBuyerCompaniesResponse = t.Static<
  typeof GetBuyerCompaniesResponseSchema
>;

const GetSellerCompaniesResponseSchema = t.Array(CompanySchema);

export type GetSellerCompaniesResponse = t.Static<
  typeof GetSellerCompaniesResponseSchema
>;

export {
  BuyerRequestSchema,
  SellerRequestSchema,
  CompanySchema,
  CreateCompanyRequestSchema,
  CreateCompanyResponseSchema,
  UpdateCompanyRequestSchema,
  UpdateCompanyResponseSchema,
  SaveCompanyRequestSchema,
  SaveCompanyResponseSchema,
  GetSavedCompaniesResponseSchema,
  GetMyCompanyResponseSchema,
  GetCompanyByIdResponseSchema,
  GetAllCompaniesResponseSchema,
  GetBuyerCompaniesResponseSchema,
  GetSellerCompaniesResponseSchema,
};
