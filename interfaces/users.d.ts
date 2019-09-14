import { AnnotationMaster } from './tasks/taskMaster';

export interface Employee {
  username: string;
  displayName: string;
  password: string;
  annotations: AnnotationMaster[];
}

export interface Employer {
  username: string;
  displayName: string;
  password: string;
}
