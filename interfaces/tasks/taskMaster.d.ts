import { Employer, Employee } from '../users';

export interface TaskMaster<InfoType = any, OptionType = any> {
  _id: string;
  meta: {
    title?: string;
    price?: number;
    employerId?: Employer;
    employerName?: string;
  };
  info?: InfoType;
  rawData?: {
    id: string;
    filename: string;
  }[];
  annotations?: AnnotationMaster<OptionType>[];
}

export interface AnnotationMaster<OptionType = any> {
  user: Employee;
  option: OptionType;
  valid: boolean;
  taskID: string;
  status: 'submitted' | 'verified' | 'rejected' | 'paid';
}
