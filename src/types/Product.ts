import { Company } from "./Company";

type ProductRequest = {
  category: string;
  name: string;
  description: string;
  img?: Array<string>;
  isHalal: boolean;
  minimumOrderQuantity: string;
};

type CreateProductRequest = {
  products: Array<ProductRequest>;
};

type Product = CreateProductRequest & {
  id: number;
  company: Company;
  companyId: number;
};

export type { CreateProductRequest, Product, ProductRequest };
