import { ApiResponseGeneric } from '@/core/services/interfaces/apiResponseGeneric.interface';
import { httpClient } from '@/core/utils/httpClient';
import { paginateParams } from '@/core/services/interfaces/params.paginate.interface';
import { ApiPostResponse } from '@/core/services/apiPostResponse.interface';

import { CountryResponse } from '../interfaces/country.response.interface';
import { CreateCountry } from '../interfaces/country.create.interface';
import { UpdateCountry } from '../interfaces/country.update.interface';
import { DepartmentResponse } from '../interfaces/deparments/department.response.interface';
import { DepartmentForm } from '../interfaces/deparments/deparment.form.interface';

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
  params: paginateParams,
): Promise<ApiResponseGeneric<DepartmentResponse>> => {
  const response = await httpClient.get<ApiResponseGeneric<DepartmentResponse>>(
    'catalogs/departments/list',
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

export default {
  getAllCountries,
  createCountries,
  updateCountries,
  getAllDepartments,
  postDepartment,
  putDepartment,
};
