import { CreatePersonInChargeRequest, PersonInCharge } from "./PersonInCharge";
import { CreateProductRequest, Product } from "./Product";
import { User } from "./User";

type CreateCompanyRequest = {
  country: string;
  name: string;
  type: string;
  address: string;
  website: string;
  email: string;
  phone: string;
  category: string;
  request: string;
  img?: string;
};

type CompleteProfileRequest = {
  company: CreateCompanyRequest;
  personInCharge: CreatePersonInChargeRequest;
  products: CreateProductRequest;
};

type SaveCompanyRequest = {
  companyId: number;
};

type Company = CreateCompanyRequest & {
  id: number;
  user: User;
  userId: number;
  createdAt: string;
  personInCharge: PersonInCharge;
  products: Array<Product>;
  savedCompany: Array<SavedCompany>;
};

type SavedCompany = {
  id: number;
  personInCharge: PersonInCharge;
  personInChargeId: number;
  companies: Array<Company>;
};

export type {
  Company,
  CompleteProfileRequest,
  CreateCompanyRequest,
  SaveCompanyRequest,
  SavedCompany,
};
