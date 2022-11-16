import { ICustomer } from "./CustomerModel";

export interface ICvModel {
  name: string;
  jobTitle: string;
  email: string;
  address: string;
  description?: string;
  jobHistory: IHistory[];
  eduction: IHistory[];
  experiance: string[];
  courses: ICourse[];
  confirmed?: boolean;
  sent?: boolean;
  logo?: string;
  customer?: ICustomer;
  applicant?: string;
}

export interface IHistory {
  from?: string;
  to?: string;
  title?: string;
  name?: string;
  active?: any;
}

export interface ICourse {
  name: string;
  description?: string;
}
