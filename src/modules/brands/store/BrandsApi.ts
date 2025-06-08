import { createCrudApi } from '@/store/BaseApiFactory';
import { GENERAL_API_BASE } from "@/api/Config";
import { Brand } from "@/models/Brand";

export const brandsApi = createCrudApi<Brand>({
  entityNames: ['Brand','Brands'],
  reducerPath: 'brandsApi',
  tagType: 'Brand',
  baseUrl: `${GENERAL_API_BASE}/marcas/`,

  // Agregamos el endpoint específico:
//   extraEndpoints: (builder) => ({
//     getRolesAuthorSummary: builder.query<{ total: number; active: number }, void>({
//       query: () => 'Summary',  // Suponiendo que el endpoint para el resumen es 'Summary'
//       providesTags: [{ type: 'Brand', id: 'SUMMARY' }],
//     }),
//   }),

});

export const {
  useGetAllBrandsQuery,
  useLazyGetBrandByIdQuery,
  useSearchBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useUpdateStateBrandMutation
} = brandsApi;


