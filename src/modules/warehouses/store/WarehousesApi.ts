import { createCrudApi } from '@/store/BaseApiFactory';
import { GENERAL_API_BASE } from "@/api/Config";
import { Warehouse } from "@/models/Warehouse";

export const warehousesApi = createCrudApi<Warehouse>({
  entityNames: ['Warehouse','Warehouses'],
  reducerPath: 'warehousesApi',
  tagType: 'Warehouse',
  baseUrl: `${GENERAL_API_BASE}/almacenes/`,

});

export const {
  useGetAllWarehousesQuery,
  useLazyGetWarehouseByIdQuery,
  useSearchWarehousesQuery,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
  useUpdateStateWarehouseMutation
} = warehousesApi;


