import * as t from "runtypes";

const RegisterRequestSchema = t.Record({
  email: t.String,
  password: t.String,
  confirmationPassword: t.String,
});

export type RegisterRequest = t.Static<typeof RegisterRequestSchema>;

const RegisterResponseSchema = t.Record({
  email: t.String,
  accessToken: t.String,
});

export type RegisterResponse = t.Static<typeof RegisterResponseSchema>;

const LoginRequestSchema = t.Record({
  email: t.String,
  password: t.String,
});

export type LoginRequest = t.Static<typeof LoginRequestSchema>;

const LoginResponseSchema = t.Record({
  accessToken: t.String,
  isProfileComplete: t.Boolean,
});

export type LoginResponse = t.Static<typeof LoginResponseSchema>;

const UserSchema = t.Record({
  id: t.String,
  email: t.String,
});

export type User = t.Static<typeof UserSchema>;

const GetMyUserResponseSchema = UserSchema;

export type GetMyUserResponse = t.Static<typeof GetMyUserResponseSchema>;

const GetAllUserResponseSchema = t.Array(UserSchema);

export type GetAllUserResponse = t.Static<typeof GetAllUserResponseSchema>;

const DeleteUserResponseSchema = UserSchema.Or(t.Null);

export type DeleteUserResponse = t.Static<typeof DeleteUserResponseSchema>;

const GetUserByIdResponseSchema = UserSchema.Or(t.Null);

export type GetUserByIdResponse = t.Static<typeof GetUserByIdResponseSchema>;

export {
  RegisterRequestSchema,
  RegisterResponseSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  UserSchema,
  GetAllUserResponseSchema,
  DeleteUserResponseSchema,
  GetUserByIdResponseSchema,
};
