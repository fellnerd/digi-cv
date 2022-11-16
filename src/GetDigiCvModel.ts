import { ICustomer } from "./CustomerModel";
import { ICourse, IHistory } from "./CvModel";

export interface Creator {
  identifier: string;
  name: string;
}

export interface Reseller {
  identifier: string;
  name: string;
}

export interface Branche {
  identifier: string;
  name: string;
}

export interface Phase {
  identifier: string;
  name: string;
}

export interface State {
  id: string;
  name: string;
  value: string;
}

export interface Applicant {
  identifier: string;
  creator: Creator;
  reseller: Reseller;
  resource_pool: any[];
  name: string;
  email: string;
  zip: string;
  phone: string;
  expertice: string;
  education: string;
  driver_license: string;
  position: string;
  branche: Branche;
  icon: string;
  phase: Phase;
  state: State;
  priority: number;
  availability: string;
  accepted: boolean;
  meeting_planned: boolean;
  date: Date;
  note: string;
}

export interface Creator2 {
  identifier: string;
  name: string;
}

export interface Reseller2 {
  identifier: string;
  name: string;
}

export interface Applicant2 {
  identifier: string;
  name: string;
}

export interface Digicv {
  identifier: string;
  creator: Creator2;
  reseller: Reseller2;
  resource_pool: any[];
  child_resources: any[];
  manual_actions: any[];
  name: string;
  email: string;
  jobTitle: string;
  address: string;
  description: string;
  jobHistory: IHistory[];
  experiance: string;
  courses: ICourse[];
  eduction: IHistory[];
  applicant: Applicant2;
}

export interface IDigiCVResponse {
  applicant: Applicant;
  digicv: Digicv;
  customer: ICustomer;
}
