import { createCrudApi } from '@/store/BaseApiFactory';
import { GENERAL_API_BASE } from "@/api/Config";
import { Inventory } from "@/models/Inventory";

export const reportsApi = createCrudApi<Inventory>({
  entityNames: ['Report','Reports'],
  reducerPath: 'reportsApi',
  tagType: 'Report',
  baseUrl: `${GENERAL_API_BASE}/logistica/`,

  extraEndpoints: (builder) => ({

    getInventoryByIdWarehouse: builder.query<Inventory, number>({
      query: (idWarehouse) => `inventarioPorAlmacen?idAlmacen=${idWarehouse}`,
      transformResponse: (raw: { code: string; message: string; response: Inventory }) =>
        raw.response,
      providesTags: (result) =>
        result ? [{ type: 'Inventory' as const, id: result.id }] : [],
    }),

  }),  

});

export const {
  useGetAllReportsQuery,
  useLazyGetReportByIdQuery,
  useSearchReportsQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
  useDeleteReportMutation,
  useUpdateStateReportMutation,
  useLazyGetInventoryByIdWarehouseQuery,
} = reportsApi;


