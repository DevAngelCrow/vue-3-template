import { httpClient } from '@/core/utils/httpClient';
import { ApiResponseGeneric } from '@/core/services/interfaces/apiResponseGeneric.interface';
import { ApiPostResponse } from '@/core/services/apiPostResponse.interface';
import { paginateParams } from '@/core/services/interfaces/params.paginate.interface';

import { RoutesResponse } from '../interfaces/routes.response.interface';
import { RouteParentAutocomplete } from '../interfaces/route-parent-autocomplete-obj.interface';
import { RouteForm } from '../interfaces/route-form.interface';

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

export default {
  getAllRoutes,
  getAllRoutesWithOutPaginate,
  addRoute,
  editRoute,
  deleteRoute,
};
