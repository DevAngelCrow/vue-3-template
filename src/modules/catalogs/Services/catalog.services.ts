import { ApiResponseGeneric } from '@/core/services/interfaces/apiResponseGeneric.interface';
import { httpClient } from '@/core/utils/httpClient';
import { paginateParams } from '@/core/services/interfaces/params.paginate.interface';

import { CountryResponse } from '../interfaces/country.response.interface';
import { CreateCountry } from '../interfaces/country.create.interface';
import { UpdateCountry } from '../interfaces/country.update.interface';
import { DepartmentResponse } from '../interfaces/deparments/department.response.interface';

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

export default {
  getAllCountries,
  createCountries,
  updateCountries,
  getAllDepartments,
};
