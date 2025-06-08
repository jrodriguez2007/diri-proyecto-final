import { createCrudApi } from '@/store/BaseApiFactory';
import { GENERAL_API_BASE } from "@/api/Config";
import { Modelo } from "@/models/Modelo";

export const modelsApi = createCrudApi<Modelo>({
  entityNames: ['Model','Models'],
  reducerPath: 'modelsApi',
  tagType: 'Model',
  baseUrl: `${GENERAL_API_BASE}/modelos/`,

  // Agregamos el endpoint específico:
  extraEndpoints: (builder) => ({
    getModelsByIdBrand: builder.query<Modelo[], number>({
      query: (id) => `GetByIdModel/${id}`,
      transformResponse: (rawResult: { code: string; message: string; response: Modelo[] }) => {
        return rawResult.response;
      },          
      providesTags: [{ type: 'Model', id: 'LIST' }],
    }),

  }),

});

export const {
  useGetAllModelsQuery,
  useLazyGetModelByIdQuery,
  useSearchModelsQuery,
  useCreateModelMutation,
  useUpdateModelMutation,
  useDeleteModelMutation,
  useUpdateStateModelMutation,
  useGetModelsByIdBrandQuery
} = modelsApi;


