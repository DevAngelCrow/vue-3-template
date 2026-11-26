import { ApiResponseGeneric } from '@/core/services/interfaces/apiResponseGeneric.interface';
import { httpClient } from '@/core/utils/httpClient';
import { paginateParams } from '@/core/services/interfaces/params.paginate.interface';
import { ApiPostResponse } from '@/core/services/apiPostResponse.interface';
import paramsGeneric from '@/core/services/interfaces/params.generic.interface';

import { CountryResponse } from '../interfaces/country.response.interface';
import { CreateCountry } from '../interfaces/country.create.interface';
import { UpdateCountry } from '../interfaces/country.update.interface';
import { GlobalStatusResponse } from '../interfaces/global-status/global-status.response.interface';
import { GlobalStatusForm } from '../interfaces/global-status/global-status.form.interface';
import { CategoryStatusResponse } from '../interfaces/category-status/category-status.response.interface';
import { CategoryStatusForm } from '../interfaces/category-status/category-status.form.interface';
import { DocumentTypeResponse } from '../interfaces/document-type/document-type.response.interface';
import { DocumentTypeForm } from '../interfaces/document-type/document-type.form.interface';
import { GenderResponse } from '../interfaces/gender/gender.response.interface';
import { GeographicDivisionTypeResponse } from '../interfaces/geographic-division-type/geographic-division-type.response.interface';
import { GeographicDivisionTypeForm } from '../interfaces/geographic-division-type/geographic-division-type.form.interface';
import { GeographicDivisionResponse } from '../interfaces/geographic-division/geographic-division.response.interface';
import { GeographicDivisionForm } from '../interfaces/geographic-division/geographic-division.form.interface';
import type { DocumentPrefixResponse } from '../interfaces/document-prefix/document-prefix.response.interface';
import type { DocumentPrefixForm } from '../interfaces/document-prefix/document-prefix.form.interface';

interface paramsFilter extends paginateParams {
  active?: boolean;
  filter_name?: string | null;
  filter?: string | null;
  status?: boolean | null;
  id_country?: string | null;
  id_category?: string | null;
  code_category?: string | null;
}

const getAllCountries = async (
  params?: paramsGeneric,
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

const updateCountries = async (id: string, data: UpdateCountry) => {
  const response = await httpClient.put(`catalogs/countries/${id}`, data);
  return response;
};
const changeStatusCountry = async (id: string) => {
  const response = await httpClient.patch(`catalogs/countries/${id}`);
  return response;
};

const getGlobalStatus = async (
  params?: paginateParams | paramsFilter,
): Promise<ApiResponseGeneric<GlobalStatusResponse>> => {
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

const putGlobalStatus = async (id: string, data: GlobalStatusForm) => {
  const response = await httpClient.put<ApiPostResponse>(
    `catalogs/global-statuses/${id}`,
    data,
  );
  return response;
};

const toggleGlobalStatus = async (id: string) => {
  const response = await httpClient.patch<ApiPostResponse>(
    `catalogs/global-statuses/${id}`,
  );

  return response;
};

const getAllCategoryStatuses = async (
  params?: paramsGeneric,
): Promise<ApiResponseGeneric<CategoryStatusResponse>> => {
  const response = await httpClient.get<
    ApiResponseGeneric<CategoryStatusResponse>
  >('catalogs/categories-status', params);
  return response.data;
};

const postCategoryStatus = async (data: CategoryStatusForm) => {
  const response = await httpClient.post<ApiPostResponse>(
    'catalogs/categories-status',
    data,
  );
  return response;
};

const putCategoryStatus = async (id: string, data: CategoryStatusForm) => {
  const response = await httpClient.put<ApiPostResponse>(
    `catalogs/categories-status/${id}`,
    data,
  );
  return response;
};

const patchCategoryStatus = async (id: string) => {
  const response = await httpClient.patch<ApiPostResponse>(
    `catalogs/categories-status/${id}`,
  );
  return response;
};
const getDocumentTypes = async (
  params?: paginateParams | paramsFilter,
): Promise<ApiResponseGeneric<DocumentTypeResponse>> => {
  const response = await httpClient.get<
    ApiResponseGeneric<DocumentTypeResponse>
  >('profile/document-types', params);
  return response.data;
};

const postDocumentType = async (data: DocumentTypeForm) => {
  const response = await httpClient.post<ApiPostResponse>(
    'profile/document-types',
    data,
  );
  return response;
};

const putDocumentType = async (id: string, data: DocumentTypeForm) => {
  const response = await httpClient.put<ApiPostResponse>(
    `profile/document-types/${id}`,
    data,
  );
  return response;
};

const toggleDocumentType = async (id: string) => {
  const response = await httpClient.patch<ApiPostResponse>(
    `profile/document-types/${id}`,
  );
  return response;
};

const getGenders = async (
  params?: paginateParams | paramsFilter,
): Promise<ApiResponseGeneric<GenderResponse>> => {
  const response = await httpClient.get<ApiResponseGeneric<GenderResponse>>(
    'catalogs/genders',
    params,
  );
  return response.data;
};

interface GeographicDivisionTypeParams {
  page?: number;
  per_page?: number;
  filter?: string | null;
  active?: boolean | null;
  id_country?: string | null;
}

const getAllGeographicDivisionTypes = async (
  params?: GeographicDivisionTypeParams,
): Promise<ApiResponseGeneric<GeographicDivisionTypeResponse>> => {
  const response = await httpClient.get<
    ApiResponseGeneric<GeographicDivisionTypeResponse>
  >('catalogs/geographic-division-types', params);
  return response.data;
};

const getGeographicDivisionTypeById = async (
  id: string,
): Promise<{
  data: GeographicDivisionTypeResponse;
  statusCode: number;
  message: string;
}> => {
  const response = await httpClient.get<{
    data: GeographicDivisionTypeResponse;
    statusCode: number;
    message: string;
  }>(`catalogs/geographic-division-types/${id}`);
  return response.data;
};

const postGeographicDivisionType = async (data: GeographicDivisionTypeForm) => {
  const response = await httpClient.post<ApiPostResponse>(
    'catalogs/geographic-division-types',
    data,
  );
  return response;
};

const putGeographicDivisionType = async (
  id: string,
  data: GeographicDivisionTypeForm,
) => {
  const response = await httpClient.put<ApiPostResponse>(
    `catalogs/geographic-division-types/${id}`,
    data,
  );
  return response;
};

const patchGeographicDivisionType = async (id: string) => {
  const response = await httpClient.patch<ApiPostResponse>(
    `catalogs/geographic-division-types/${id}`,
  );
  return response;
};

interface GeographicDivisionParams {
  page?: number;
  per_page?: number;
  filter?: string | null;
  active?: boolean | null;
  id_country?: string | null;
  id_parent?: string | null;
  id_type?: string | null;
  limit?: number;
}

const getAllGeographicDivisions = async (
  params?: GeographicDivisionParams,
): Promise<ApiResponseGeneric<GeographicDivisionResponse>> => {
  const response = await httpClient.get<
    ApiResponseGeneric<GeographicDivisionResponse>
  >('catalogs/geographic-divisions', params);
  return response.data;
};

const getAllGeographicDivisionsCursor = async (
  params?: GeographicDivisionParams,
): Promise<ApiResponseGeneric<GeographicDivisionResponse>> => {
  const response = await httpClient.get<
    ApiResponseGeneric<GeographicDivisionResponse>
  >('catalogs/geographic-divisions/cursor', params);
  return response.data;
};

const getGeographicDivisionById = async (
  id: string,
): Promise<{
  data: GeographicDivisionResponse;
  statusCode: number;
  message: string;
}> => {
  const response = await httpClient.get<{
    data: GeographicDivisionResponse;
    statusCode: number;
    message: string;
  }>(`catalogs/geographic-divisions/${id}`);
  return response.data;
};

const postGeographicDivision = async (data: GeographicDivisionForm) => {
  const response = await httpClient.post<ApiPostResponse>(
    'catalogs/geographic-divisions',
    data,
  );
  return response;
};

const putGeographicDivision = async (
  id: string,
  data: GeographicDivisionForm,
) => {
  const response = await httpClient.put<ApiPostResponse>(
    `catalogs/geographic-divisions/${id}`,
    data,
  );
  return response;
};

const patchGeographicDivision = async (id: string) => {
  const response = await httpClient.patch<ApiPostResponse>(
    `catalogs/geographic-divisions/${id}`,
  );
  return response;
};

const getDocumentPrefixes = async (): Promise<DocumentPrefixResponse[]> => {
  const response = await httpClient.get<
    ApiPostResponse<DocumentPrefixResponse[]>
  >('catalogs/document-prefixes');
  return response.data.data;
};

const getDocumentPrefixByCode = async (
  code: string,
): Promise<DocumentPrefixResponse> => {
  const response = await httpClient.get<
    ApiPostResponse<DocumentPrefixResponse>
  >(`catalogs/document-prefixes/${code}`);
  return response.data.data;
};

const postDocumentPrefix = async (data: DocumentPrefixForm) => {
  const response = await httpClient.post<
    ApiPostResponse<DocumentPrefixResponse>
  >('catalogs/document-prefixes', data);
  return response;
};

const putDocumentPrefix = async (
  id: string,
  data: Partial<DocumentPrefixForm>,
) => {
  const response = await httpClient.put<
    ApiPostResponse<DocumentPrefixResponse>
  >(`catalogs/document-prefixes/${id}`, data);
  return response;
};

const patchDocumentPrefix = async (id: string) => {
  const response = await httpClient.patch<
    ApiPostResponse<DocumentPrefixResponse>
  >(`catalogs/document-prefixes/${id}/status`);
  return response;
};

export default {
  getAllCountries,
  createCountries,
  updateCountries,
  changeStatusCountry,
  getGlobalStatus,
  postGlobalStatus,
  putGlobalStatus,
  toggleGlobalStatus,
  getAllCategoryStatuses,
  postCategoryStatus,
  putCategoryStatus,
  patchCategoryStatus,
  getDocumentTypes,
  postDocumentType,
  putDocumentType,
  toggleDocumentType,
  getGenders,
  getAllGeographicDivisionTypes,
  getGeographicDivisionTypeById,
  postGeographicDivisionType,
  putGeographicDivisionType,
  patchGeographicDivisionType,
  getAllGeographicDivisions,
  getAllGeographicDivisionsCursor,
  getGeographicDivisionById,
  postGeographicDivision,
  putGeographicDivision,
  patchGeographicDivision,
  getDocumentPrefixes,
  getDocumentPrefixByCode,
  postDocumentPrefix,
  putDocumentPrefix,
  patchDocumentPrefix,
};
