import adminServices from '@/core/services/index.services';

export function useAdmin() {
  const getRoutes = async () => {
    try {
      const response = await adminServices.getAllRoutes();
      console.log(response);
      if (response.statusCode === 200) {
        return response.data.items;
      }
      return [];
    } catch (error) {
      console.error('Error al obtener el listado de rutas', error);
    }
  };

  return {
    getRoutes,
  };
}
