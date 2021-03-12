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

export type { RegisterRequest, LoginRequest, User };
