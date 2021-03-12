type RegisterRequest = {
  email: string;
  password: string;
  confirmationPassword: string;
};

type LoginRequest = {
  email: string;
  password: string;
};

type User = {
  id: number;
  email: string;
};

type UserRole = "UNSPECIFIED" | "SELLER" | "BUYER";

type UpdateRoleRequest = {
  role: UserRole;
};

export type {
  RegisterRequest,
  LoginRequest,
  User,
  UserRole,
  UpdateRoleRequest,
};
