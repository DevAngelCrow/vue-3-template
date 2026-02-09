import { httpClient } from '@/core/utils/httpClient';
import { ApiResponseGeneric } from '@/core/services/interfaces/apiResponseGeneric.interface';
import { ApiPostResponse } from '@/core/services/apiPostResponse.interface';
import { paginateParams } from '@/core/services/interfaces/params.paginate.interface';

import { RoutesResponse } from '../interfaces/routes/routes.response.interface';
import { RouteParentAutocomplete } from '../interfaces/routes/route-parent-autocomplete-obj.interface';
import { RouteForm } from '../interfaces/routes/route-form.interface';
import { PermissionsResponse } from '../interfaces/permissions/permissions.response.interface';
import { PermissionForm } from '../interfaces/permissions/permission.form.interface';
import { PermissionsCategoryResponse } from '../interfaces/permissions/permission.category.response.interface';
import { CategoryPermissionForm } from '../interfaces/category-permissions/category-permission-form.interface';
import { RoleResponse } from '../interfaces/role/role.response.interface';
import { RoleForm } from '../interfaces/role/role.form.interface';
import { RouteResponseById } from '../interfaces/routes/route-by-id.response.interface';
import { RolByIdResponse } from '../interfaces/role/rol-by-id.response.interface';

const getAllRoutes = async (
  params: paginateParams,
): Promise<ApiResponseGeneric<RoutesResponse>> => {
  const response = await httpClient.get<ApiResponseGeneric<RoutesResponse>>(
    'security/routes/',
    params,
  );
  return response.data;
};

const getAllRoutesWithOutPaginate = async () => {
  const response =
    await httpClient.get<RouteParentAutocomplete>('security/routes/');

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

const getRoute = async (id: number) => {
  const response = await httpClient.get<ApiPostResponse<RouteResponseById>>(
    `security/routes/${id}`,
  );
  return response.data;
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

const putPermission = async (id: number, data: PermissionForm) => {
  const response = await httpClient.put<ApiPostResponse>(
    `security/permissions/${id}`,
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

const postCategoryPermission = async (data: CategoryPermissionForm) => {
  const response = await httpClient.post<ApiPostResponse>(
    `security/category-permissions`,
    data,
  );
  return response;
};
const putCategoryPermission = async (
  id: number,
  data: CategoryPermissionForm,
) => {
  const response = await httpClient.put<ApiPostResponse>(
    `security/category-permissions/${id}`,
    data,
  );
  return response;
};

const deleteCategoryPermission = async (id: number) => {
  const response = await httpClient.delete<ApiPostResponse>(
    `security/category-permissions/${id}`,
  );
  return response;
};

const getRole = async (params: paginateParams) => {
  const response = await httpClient.get<ApiResponseGeneric<RoleResponse>>(
    'security/role/',
    params,
  );
  return response.data;
};

const postRole = async (data: RoleForm) => {
  const response = await httpClient.post<ApiPostResponse>(
    'security/role',
    data,
  );
  return response;
};

const putRole = async (data: RoleForm) => {
  const response = await httpClient.put<ApiPostResponse>(
    `security/roles/${data.id}`,
    data,
  );
  return response;
};

const deleteRole = async (id: number) => {
  const response = await httpClient.delete<ApiPostResponse>(
    `security/roles/${id}`,
  );
  return response;
};

const getRol = async (id: number) => {
  const response = await httpClient.get<ApiPostResponse<RolByIdResponse>>(
    `security/role/${id}`,
  );
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
  postCategoryPermission,
  putCategoryPermission,
  deleteCategoryPermission,
  getRole,
  postRole,
  putRole,
  deleteRole,
  getRoute,
  getRol,
};
