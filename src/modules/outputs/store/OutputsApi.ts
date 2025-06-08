import { createCrudApi } from '@/store/BaseApiFactory';
import { GENERAL_API_BASE } from "@/api/Config";
import { Logistic } from "@/models/Logistic";

export const outputsApi = createCrudApi<Logistic>({
  entityNames: ['Output','Outputs'],
  reducerPath: 'outputsApi',
  tagType: 'Output',
  baseUrl: `${GENERAL_API_BASE}/logistica/`,

  // Agregamos el endpoint específico:
  extraEndpoints: (builder) => ({

    // GET MOVEMENTS (inputs)
    getAllMovementOutputs: builder.query<Logistic[], { page: number; limit: number }>({
      // Construye la URL con los parámetros fijos + página dinámica
      query: ({ page, limit }) =>
            `GetAll?idDocumento=PS&idSerie=S001&pagina=${page}&limite=${limit}&orden=numero`,
      // Extrae el array real de la propiedad `response`
      transformResponse: (raw: {
        code: string;
        message: string;
        response: Logistic[];
      }) => raw.response,
      // Invalida la caché del tipo 'Logistic' lista
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Logistic' as const, id })),
              { type: 'Output' as const, id: 'LIST' },
            ]
          : [{ type: 'Output' as const, id: 'LIST' }],
    }),    

    // DELETE MOVEMENT (input)
    deleteMovementOutput: builder.mutation<
      void,
      { idDocumento: string; idSerie: string; numero: string }
    >({

      query: ({ idDocumento, idSerie, numero }) => {
        return {
          url: `Delete?idDocumento=${idDocumento}&idSerie=${idSerie}&numero=${numero}`,
          method: 'DELETE',
        };
      },      

      // No esperamos cuerpo de respuesta, así que omitimos transformResponse
      invalidatesTags: [{ type: 'Output' as const, id: 'LIST' }],
    }),   
      

  }),

});

export const {
  useLazyGetOutputByIdQuery,
  useSearchOutputsQuery,
  useCreateOutputMutation,
  useUpdateOutputMutation,
  useDeleteOutputMutation,
  useUpdateStateOutputMutation,

  useGetAllMovementOutputsQuery,
  useDeleteMovementOutputMutation
} = outputsApi;


