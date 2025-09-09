import { httpClient } from '../utils/httpClient';
import { ApiResponseGeneric } from './interfaces/apiResponseGeneric.interface';
import { Country } from './interfaces/auth/country.interface';
import { District } from './interfaces/auth/district.interface';
import { DocumentType } from './interfaces/auth/documentType.interface';
import { Gender } from './interfaces/auth/gender.interface';
//import { GetAllDistrictResponse } from "./interfaces/auth/getAllDistrictsResponse.interface";
//import { GetAllDocumentTypeResponse } from "./interfaces/auth/getAllDocumentTypeResponse.interface";
//import { GetAllGenderResponse } from "./interfaces/auth/getAllGendersResponse.interface";
import { MaritalStatus } from './interfaces/auth/maritalStatus.interface';
//import { GetAllNationalitiesResponse } from "./interfaces/auth/getAllNationalitiesResponse.interface";

const getMaritalStatus = async (): Promise<
  ApiResponseGeneric<MaritalStatus>
> => {
  const response = await httpClient.get<ApiResponseGeneric<MaritalStatus>>(
    'catalogs/marital-status',
  );

  return response.data;
};

const getGenders = async (): Promise<ApiResponseGeneric<Gender>> => {
  const response = await httpClient.get<ApiResponseGeneric<Gender>>(
    'profile/genders?page=1&per_page=10',
  );
  return response.data;
};

const getCountriesNationalities = async (): Promise<
  ApiResponseGeneric<Country>
> => {
  const response = await httpClient.get<ApiResponseGeneric<Country>>(
    'profile/countries?page=1&per_page=10',
  );
  return response.data;
};

const getDistricts = async (): Promise<ApiResponseGeneric<District>> => {
  const response = await httpClient.get<ApiResponseGeneric<District>>(
    'profile/districts?page=1&per_page=10',
  );
  return response.data;
};

const getDocumentTypes = async (): Promise<
  ApiResponseGeneric<DocumentType>
> => {
  const response = await httpClient.get<ApiResponseGeneric<DocumentType>>(
    'profile/documentType?page=1&per_page=10',
  );
  return response.data;
};

export default {
  getMaritalStatus,
  getGenders,
  getCountriesNationalities,
  getDistricts,
  getDocumentTypes,
};
