import { LocationQueryValue } from 'vue-router';

import { httpClient } from '../utils/httpClient';
import { ApiResponseGeneric } from './interfaces/auth/apiResponseGeneric.interface';
import { Country } from './interfaces/auth/country.interface';
import { District } from './interfaces/auth/district.interface';
import { DocumentType } from './interfaces/auth/documentType.interface';
import { Gender } from './interfaces/auth/gender.interface';
//import { GetAllDistrictResponse } from "./interfaces/auth/getAllDistrictsResponse.interface";
//import { GetAllDocumentTypeResponse } from "./interfaces/auth/getAllDocumentTypeResponse.interface";
//import { GetAllGenderResponse } from "./interfaces/auth/getAllGendersResponse.interface";
import { MaritalStatus } from './interfaces/auth/maritalStatus.interface';
import { ApiResponseMenu } from './interfaces/auth/apiResponseMenu.interface';
import { Menu } from '../interfaces/userState.store.interface';
import { Login } from './interfaces/auth/login.interface';
import { ApiResponseLogin } from './interfaces/auth/apiResponseLogin.interface';
import { ApiResponseLogout } from './interfaces/auth/apiResponseLogout.interface';
// import { ApiResponseMenu } from './interfaces/auth/apiResponseMenu.interface';

// import { Menu } from './interfaces/auth/menu.interface';
//import { PostSignUp } from './interfaces/auth/postSignUp.interface';
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
    'catalogs/genders?page=1&per_page=10',
  );
  return response.data;
};

const getCountriesNationalities = async (): Promise<
  ApiResponseGeneric<Country>
> => {
  const response = await httpClient.get<ApiResponseGeneric<Country>>(
    'catalogs/countries?page=1&per_page=10',
  );
  return response.data;
};

const getDistricts = async (): Promise<ApiResponseGeneric<District>> => {
  const response = await httpClient.get<ApiResponseGeneric<District>>(
    'catalogs/districts?page=1&per_page=10',
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

const signUp = async (data: FormData) => {
  const response = await httpClient.post('auth/sign-up', data);
  return response;
};

const login = async (data: Login): Promise<ApiResponseLogin> => {
  const response = await httpClient.post<ApiResponseLogin>('auth/login', data);
  return response.data;
};

const logout = async () => {
  const response = await httpClient.post<ApiResponseLogout>('auth/logout');
  return response.data;
};

const verifyEmail = async (url: LocationQueryValue[] | undefined | string) => {
  let urlFormatedString = url?.toString();
  let response;
  if (url === null || url === undefined) {
    urlFormatedString = '';
  }
  if (Array.isArray(url)) {
    urlFormatedString = url.find(value => value !== null) || '';
  }
  if (urlFormatedString) {
    response = await httpClient.get(urlFormatedString);
  }
  return response;
};

const getMenu = async (): Promise<ApiResponseMenu<Menu[]>> => {
  const response =
    await httpClient.get<ApiResponseMenu<Menu[]>>('security/menu/');
  return response.data;
};

export default {
  getMaritalStatus,
  getGenders,
  getCountriesNationalities,
  getDistricts,
  getDocumentTypes,
  signUp,
  verifyEmail,
  getMenu,
  login,
  logout,
};
