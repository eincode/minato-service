import { Company, SavedCompany } from "./Company";
import { User } from "./User";

type CreatePersonInChargeRequest = {
  name: string;
  nationality: string;
  email: string;
  phone: string;
  img?: string;
};

type PersonInCharge = CreatePersonInChargeRequest & {
  id: number;
  company: Company;
  companyId: number;
  savedCompany: Array<SavedCompany>;
  user: User;
  userId: number;
};

export type { CreatePersonInChargeRequest, PersonInCharge };
