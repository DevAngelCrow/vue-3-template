import { ApiResponseGeneric } from '@/core/services/interfaces/apiResponseGeneric.interface';
import { httpClient } from '@/core/utils/httpClient';
import { paginateParams } from '@/core/services/interfaces/params.paginate.interface';
import { ApiPostResponse } from '@/core/services/apiPostResponse.interface';

import { CountryResponse } from '../interfaces/country.response.interface';
import { CreateCountry } from '../interfaces/country.create.interface';
import { UpdateCountry } from '../interfaces/country.update.interface';
import { DepartmentResponse } from '../interfaces/deparments/department.response.interface';
import { DepartmentForm } from '../interfaces/deparments/deparment.form.interface';
import { MunicipalityResponse } from '../interfaces/municipalities/municipality.response.interface';
import { MunicipalityForm } from '../interfaces/municipalities/municipality.form.interface';
import { DistrictResponse } from '../interfaces/districts/district.response.interface';
import { DistrictForm } from '../interfaces/districts/district.form.interface';
import { GlobalStatusResponse } from '../interfaces/global-status/global-status.response.interface';
import { GlobalStatusForm } from '../interfaces/global-status/global-status.form.interface';

const getAllCountries = async (
  params?: paginateParams,
): Promise<ApiResponseGeneric<CountryResponse>> => {
  const response = await httpClient.get<ApiResponseGeneric<CountryResponse>>(
    'catalogs/countries',
    params,
  );
  return response.data;
};

const createCountries = async (data: CreateCountry) => {
  const response = await httpClient.post('catalogs/countries', data);
  return response;
};

const updateCountries = async (data: UpdateCountry) => {
  const response = await httpClient.put(`catalogs/countries/${data.id}`, data);
  return response;
};

const getAllDepartments = async (
  params?: paginateParams,
): Promise<ApiResponseGeneric<DepartmentResponse>> => {
  const response = await httpClient.get<ApiResponseGeneric<DepartmentResponse>>(
    'catalogs/departments',
    params,
  );
  return response.data;
};

const postDepartment = async (data: DepartmentForm) => {
  const response = await httpClient.post<ApiPostResponse>(
    'catalogs/departments/',
    data,
  );
  return response;
};

const putDepartment = async (data: DepartmentForm) => {
  const response = await httpClient.put<ApiPostResponse>(
    `catalogs/departments/${data.id}`,
    data,
  );
  return response;
};

const deleteDepartment = async (id: number) => {
  const response = await httpClient.delete<ApiPostResponse>(
    `catalogs/departments/${id}`,
  );
  return response;
};

const getMunicipalities = async (params?: paginateParams) => {
  const response = await httpClient.get<
    ApiResponseGeneric<MunicipalityResponse>
  >('catalogs/municipalities', params);
  return response.data;
};

const postMunicipality = async (data: MunicipalityForm) => {
  const response = await httpClient.post<ApiPostResponse>(
    'catalogs/municipalities/',
    data,
  );
  return response;
};

const putMunicipality = async (data: MunicipalityForm) => {
  const response = await httpClient.put<ApiPostResponse>(
    `catalogs/municipalities/${data.id}`,
    data,
  );

  return response;
};

const deleteMunicipality = async (id: number) => {
  const response = await httpClient.delete<ApiPostResponse>(
    `catalogs/municipalities/${id}`,
  );
  return response;
};

const getDistricts = async (params: paginateParams) => {
  const response = await httpClient.get<ApiResponseGeneric<DistrictResponse>>(
    'catalogs/districts',
    params,
  );
  return response.data;
};

const postDistrict = async (data: DistrictForm) => {
  const response = await httpClient.post<ApiPostResponse>(
    'catalogs/districts/',
    data,
  );
  return response;
};

const putDistrict = async (data: DistrictForm) => {
  const response = await httpClient.put<ApiPostResponse>(
    `catalogs/districts/${data.id}`,
    data,
  );

  return response;
};

const deleteDistrict = async (id: number) => {
  const response = await httpClient.delete<ApiPostResponse>(
    `catalogs/districts/${id}`,
  );
  return response;
};

const getGlobalStatus = async (params?: paginateParams) => {
  const response = await httpClient.get<
    ApiResponseGeneric<GlobalStatusResponse>
  >('catalogs/global-statuses/', params);
  return response.data;
};

const postGlobalStatus = async (data: GlobalStatusForm) => {
  const response = await httpClient.post<ApiPostResponse>(
    'catalogs/global-statuses/',
    data,
  );
  return response;
};

const putGlobalStatus = async (data: GlobalStatusForm) => {
  const response = await httpClient.put<ApiPostResponse>(
    `catalogs/global-statuses/${data.id}`,
    data,
  );
  return response;
};

const deleteGlobalStatus = async (id: number) => {
  const response = await httpClient.delete<ApiPostResponse>(
    `catalogs/global-statuses/${id}`,
  );

  return response;
};

export default {
  getAllCountries,
  createCountries,
  updateCountries,
  getAllDepartments,
  postDepartment,
  putDepartment,
  deleteDepartment,
  getMunicipalities,
  postMunicipality,
  putMunicipality,
  deleteMunicipality,
  getDistricts,
  postDistrict,
  putDistrict,
  deleteDistrict,
  getGlobalStatus,
  postGlobalStatus,
  putGlobalStatus,
  deleteGlobalStatus,
};
