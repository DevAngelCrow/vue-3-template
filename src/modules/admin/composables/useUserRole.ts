import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { reactive, ref } from 'vue';

import { TableHeaders } from '@/core/interfaces';
import { /*useAlertStore,*/ useLoaderStore } from '@/core/store';
import catalogServices from '@/modules/catalogs/Services/catalog.services';

import { RoleStatus } from '../interfaces/role/role.status.response.interface';
import { UserRoleStatus } from '../interfaces/user-role/user-role.status.response.interface';
import { UserRoleResponse } from '../interfaces/user-role/user-role.response.interface';
import adminServices from '../services/admin.services';

export function useUserRole() {
  const {
    //errors,
    defineField,
    //handleSubmit,
    //validateField,
    //resetForm,
    //resetField,
    //setFieldError,
    //setFieldValue,
  } = useForm({
    validationSchema: yup.object({
      id: yup.number().typeError('El campo id debe ser de tipo entero'),
      user_name: yup
        .string()
        .required('El nombre del rol es requerido')
        .min(3, 'El nombre de tener al menos 3 caracteres')
        .max(150, 'El nombre debe tener máximo 150 caracteres'),
      status: yup
        .mixed<UserRoleStatus>()
        .required('El campo del estado del rol es requerido'),
      is_validated: yup.array(),
      email: yup
        .string()
        .email('El correo electrónico no es válido')
        .required('El correo electrónico es requerido'),
      //phone: yup.string().required('El número de teléfono es requerido'),
    }),
  });

  const headers = ref<TableHeaders[]>([
    {
      field: 'id',
      header: 'No.',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
    {
      field: 'user_name',
      header: 'Nombre',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
    {
      field: 'Validado',
      header: 'is_validated',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
    {
      field: 'email',
      header: 'Correo Electrónico',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
    {
      field: 'status',
      header: 'Estado',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
    {
      field: 'acciones',
      header: 'Acciones',
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
    },
  ]);

  const headersRole = ref<TableHeaders[]>([
    {
      field: 'state',
      header: `Seleccion`,
      sortable: false,
      alignHeaders: 'center',
      alignItems: 'center',
      width: 15,
    },
    {
      field: 'name',
      header: 'Nombre',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
    {
      field: 'description',
      header: 'Descripción',
      sortable: false,
      alignHeaders: 'start',
      alignItems: 'start',
    },
  ]);

  const user = ref<UserRoleResponse[] | undefined>([]);
  const pagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });
  const rolePagination = reactive({
    page: 1,
    per_page: 10,
    total_items: 0,
  });
  const roleList = ref<
    {
      id: number;
      name: string;
      description: string;
      active: boolean;
    }[]
  >([]);
  const { startLoading, finishLoading } = useLoaderStore();
  //const alert = useAlertStore();

  const [id, idAttrs] = defineField('id');
  const [user_name, userNameAttrs] = defineField('name');
  const [email, emailAttrs] = defineField('description');
  const [status, statusAttrs] = defineField('status');
  const [role, roleAttrs] = defineField('permissions_ids');

  const filter_name = ref<string | null>(null);
  const globalStatus = ref<RoleStatus[]>([]);
  const filter_name_role = ref<string | null>(null);

  const getStatus = async () => {
    try {
      startLoading();
      const filter = {
        page: undefined,
        per_page: undefined,
        table_header: 'mnt_role',
      };
      const response = await catalogServices.getGlobalStatus(filter);
      if (response.statusCode === 200) {
        if (Array.isArray(response.data)) {
          globalStatus.value = response.data;
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      finishLoading();
    }
  };
  const getRole = async () => {
    try {
      startLoading();
      const filter = {
        page: rolePagination.page,
        per_page: rolePagination.per_page,
        filter: filter_name.value,
      };
      const response = await adminServices.getRole(filter);
      if (response.statusCode === 200) {
        role.value = response.data.data;
        rolePagination.page = response.data.current_page;
        rolePagination.per_page = response.data.per_page;
        rolePagination.total_items = response.data.total_items;
      }
    } catch (error) {
      console.error(error);
    } finally {
      finishLoading();
    }
  };

  return {
    headers,
    headersRole,
    user,
    pagination,
    rolePagination,
    roleList,
    id,
    idAttrs,
    user_name,
    userNameAttrs,
    email,
    emailAttrs,
    status,
    statusAttrs,
    role,
    roleAttrs,
    filter_name,
    globalStatus,
    filter_name_role,
    getStatus,
    getRole,
  };
}
