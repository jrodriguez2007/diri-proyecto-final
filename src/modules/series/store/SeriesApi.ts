import { createCrudApi } from '@/store/BaseApiFactory';
import { GENERAL_API_BASE } from "@/api/Config";
import { Serie } from "@/models/Serie";

export const seriesApi = createCrudApi<Serie>({
  entityNames: ['Serie','Series'],
  reducerPath: 'seriesApi',
  tagType: 'Serie',
  baseUrl: `${GENERAL_API_BASE}/series/`,

  // Agregamos el endpoint específico:
  extraEndpoints: (builder) => ({
    getSeriesByIdDocument: builder.query<Serie[], string>({
      query: (id) => `GetSeriesByIdDocument/${id}`,
      transformResponse: (rawResult: { code: string; message: string; response: Serie[] }) => {
        return rawResult.response;
      },          
      providesTags: [{ type: 'Serie', id: 'LIST' }],
    }),

  }),  

});

export const {
    useGetSeriesByIdDocumentQuery
} = seriesApi;


