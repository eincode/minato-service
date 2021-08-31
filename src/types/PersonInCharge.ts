import * as t from "runtypes";

const PersonInChargeSchema = t.Record({
  id: t.String,
  companyId: t.String,
  name: t.String,
  nationality: t.String,
  email: t.String,
  phoneNumber: t.String,
  img: t.String.optional(),
});

export type PersonInCharge = t.Static<typeof PersonInChargeSchema>;

const CreatePersonInChargeRequestSchema = t.Record({
  name: t.String,
  nationality: t.String,
  email: t.String,
  phoneNumber: t.String,
  img: t.String.optional(),
});

export type CreatePersonInChargeRequest = t.Static<
  typeof CreatePersonInChargeRequestSchema
>;

const CreatePersonInChargeResponseSchema = PersonInChargeSchema;

export type CreatePersonInCharegeResponse = t.Static<
  typeof CreatePersonInChargeResponseSchema
>;

const UpdatePersonInChargeRequestSchema = CreatePersonInChargeRequestSchema;

export type UpdatePersonInChargeRequest = t.Static<
  typeof UpdatePersonInChargeRequestSchema
>;

const UpdatePersonInChargeResponseSchema = PersonInChargeSchema;

export type UpdatePersonInChargeResponse = t.Static<
  typeof UpdatePersonInChargeResponseSchema
>;

const GetMyPersonInChargeResponseSchema = PersonInChargeSchema;

export type GetMyPersonInChargeResponse = t.Static<
  typeof GetMyPersonInChargeResponseSchema
>;

const GetPersonInChargeByCompanyIdResponseSchema = PersonInChargeSchema;

export type GetPersonInChargeByCompanyIdResponse = t.Static<
  typeof GetPersonInChargeByCompanyIdResponseSchema
>;

export {
  PersonInChargeSchema,
  CreatePersonInChargeRequestSchema,
  CreatePersonInChargeResponseSchema,
  UpdatePersonInChargeRequestSchema,
  UpdatePersonInChargeResponseSchema,
  GetMyPersonInChargeResponseSchema,
  GetPersonInChargeByCompanyIdResponseSchema,
};
