import { CreatePersonInChargeRequest, PersonInCharge } from "./PersonInCharge";
import { CreateProductRequest, Product } from "./Product";
import { User } from "./User";

type CreateCompanyRequest = {
  country: string;
  name: string;
  typeOfIndustry: string;
  address: string;
  website: string;
  email: string;
  phoneNumber: string;
  img?: string;
  productCategories: Array<string>;
  requestAsBuyer: {
    productName: string;
    destinationPort: string;
    paymentMethod: string;
    other: string;
  };
  requestAsSeller: {
    request: string;
  };
};

type CompleteProfileRequest = {
  company: CreateCompanyRequest;
  personInCharge: CreatePersonInChargeRequest;
  products: CreateProductRequest;
};

type SaveCompanyRequest = {
  companyId: string;
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
