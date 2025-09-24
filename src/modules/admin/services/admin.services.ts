import { httpClient } from '@/core/utils/httpClient';
import { ApiResponseGeneric } from '@/core/services/interfaces/auth/apiResponseGeneric.interface';
import { paginateParams } from '@/core/services/interfaces/params.paginate.interface';

import { RoutesResponse } from '../interfaces/routes.response.interface';
import { RouteParentAutocomplete } from '../interfaces/route-parent-autocomplete-obj.interface';

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

export default {
  getAllRoutes,
  getAllRoutesWithOutPaginate,
};
