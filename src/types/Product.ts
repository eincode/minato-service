import { Company } from "./Company";

type CreateProductRequest = Array<{
  category: string;
  name: string;
  description: string;
  img?: string;
  isHalal: boolean;
  minimumOrderQuantity: string;
}>;

type Product = CreateProductRequest & {
  id: number;
  company: Company;
  companyId: number;
};

export type { CreateProductRequest, Product };
