import { Country } from './country.interface';
import { District } from './district.interface';
import { DocumentType } from './documentType.interface';
import { Gender } from './gender.interface';
import { MaritalStatus } from './maritalStatus.interface';

export interface CatalogsData {
  countries: Country[];
  districts: District[];
  genders: Gender[];
  documentTypes: DocumentType[];
  maritalStatuses: MaritalStatus[];
}

export interface ApiResponseCatalogs {
  statusCode: number;
  data: CatalogsData;
  message: string;
  timestamp: string;
}
