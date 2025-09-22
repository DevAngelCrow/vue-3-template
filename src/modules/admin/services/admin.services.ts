import { httpClient } from '@/core/utils/httpClient';
import { ApiResponseGeneric } from '@/core/services/interfaces/apiResponseGeneric.interface';

import { RoutesResponse } from '../interfaces/routes.response.interface';

const getAllRoutes = async (): Promise<ApiResponseGeneric<RoutesResponse>> => {
  const response = await httpClient.get<ApiResponseGeneric<RoutesResponse>>(
    'security/routes/list?page=1&per_page=10',
  );
  return response.data;
};

export default {
  getAllRoutes,
};
