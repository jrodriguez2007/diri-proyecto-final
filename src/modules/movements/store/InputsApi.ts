import { createCrudApi } from '@/store/BaseApiFactory';
import { GENERAL_API_BASE } from "@/api/Config";
import { Logistic } from "@/models/Logistic";

export const inputsApi = createCrudApi<Logistic>({
  entityNames: ['Input','Inputs'],
  reducerPath: 'inputsApi',
  tagType: 'Input',
  baseUrl: `${GENERAL_API_BASE}/logistica/`,

  // Agregamos el endpoint específico:
  extraEndpoints: (builder) => ({

    // GET MOVEMENTS (inputs)
    getAllMovementInputs: builder.query<Logistic[], { page: number; limit: number }>({
      // Construye la URL con los parámetros fijos + página dinámica
      query: ({ page, limit }) =>
            `GetAll?idDocumento=PE&idSerie=E001&pagina=${page}&limite=${limit}&orden=numero`,
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
              { type: 'Input' as const, id: 'LIST' },
            ]
          : [{ type: 'Input' as const, id: 'LIST' }],
    }),    

    // DELETE MOVEMENT (input)
    deleteMovementInput: builder.mutation<
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
      invalidatesTags: [{ type: 'Input' as const, id: 'LIST' }],
    }),   
      

  }),

});

export const {
  useLazyGetInputByIdQuery,
  useSearchInputsQuery,
  useCreateInputMutation,
  useUpdateInputMutation,
  useDeleteInputMutation,
  useUpdateStateInputMutation,

  useGetAllMovementInputsQuery,
  useDeleteMovementInputMutation
} = inputsApi;


