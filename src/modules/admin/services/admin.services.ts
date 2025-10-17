import { httpClient } from '@/core/utils/httpClient';
import { ApiResponseGeneric } from '@/core/services/interfaces/apiResponseGeneric.interface';
import { ApiPostResponse } from '@/core/services/apiPostResponse.interface';
import { paginateParams } from '@/core/services/interfaces/params.paginate.interface';

import { RoutesResponse } from '../interfaces/routes.response.interface';
import { RouteParentAutocomplete } from '../interfaces/route-parent-autocomplete-obj.interface';
import { RouteForm } from '../interfaces/route-form.interface';
import { PermissionsResponse } from '../interfaces/permissions/permissions.response.interface';
import { PermissionForm } from '../interfaces/permissions/permission.form.interface';
import { PermissionsCategoryResponse } from '../interfaces/permissions/permission.category.response.interface';

const getAllRoutes = async (
  params: paginateParams,
): Promise<ApiResponseGeneric<RoutesResponse>> => {
  const response = await httpClient.get<ApiResponseGeneric<RoutesResponse>>(
    'security/routes/list',
    params,
  );
  return response.data;
};

const getAllRoutesWithOutPaginate = async () => {
  const response = await httpClient.get<RouteParentAutocomplete>(
    'security/routes/list',
  );

  return response.data;
};

const addRoute = async (data: RouteForm) => {
  const response = await httpClient.post<ApiPostResponse>(
    'security/routes',
    data,
  );
  return response;
};

const editRoute = async (data: RouteForm) => {
  const response = await httpClient.put<ApiPostResponse>(
    `security/routes/${data.id}`,
    data,
  );
  return response;
};

const deleteRoute = async (id: number) => {
  const response = await httpClient.delete<ApiPostResponse>(
    `security/routes/${id}`,
  );
  return response;
};

const getPermissions = async (
  params: paginateParams,
): Promise<ApiResponseGeneric<PermissionsResponse>> => {
  const response = await httpClient.get<
    ApiResponseGeneric<PermissionsResponse>
  >('security/permissions/', params);
  return response.data;
};

const postPermission = async (data: PermissionForm) => {
  const response = await httpClient.post<ApiPostResponse>(
    'security/permissions/',
    data,
  );
  return response;
};

const putPermission = async (data: PermissionForm) => {
  const response = await httpClient.put<ApiPostResponse>(
    `secutiry/permissions/${data.id}`,
    data,
  );
  return response;
};

const deletePermission = async (id: number) => {
  const response = await httpClient.delete<ApiPostResponse>(
    `security/permissions/${id}`,
  );
  return response;
};

const getCategoryPermissions = async (params?: paginateParams) => {
  const response = await httpClient.get<
    ApiResponseGeneric<PermissionsCategoryResponse>
  >('security/category-permissions', params);
  return response.data;
};

export default {
  getAllRoutes,
  getAllRoutesWithOutPaginate,
  addRoute,
  editRoute,
  deleteRoute,
  getPermissions,
  postPermission,
  putPermission,
  deletePermission,
  getCategoryPermissions,
};
