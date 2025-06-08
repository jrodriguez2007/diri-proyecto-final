import { createCrudApi } from '@/store/BaseApiFactory';
import { GENERAL_API_BASE } from "@/api/Config";
import { Person } from "@/models/Person";

export const suppliersApi = createCrudApi<Person>({
  entityNames: ['Supplier','Suppliers'],
  reducerPath: 'suppliersApi',
  tagType: 'Supplier',
  baseUrl: `${GENERAL_API_BASE}/proveedores/`,

  // Agregamos el endpoint específico:
  extraEndpoints: (builder) => ({

    // -------------- NUEVO ENDPOINT ----------------
    getPersonByDocument: builder.query<
      Person,
      { personType: string; documentNumber: string }
    >({
      query: ({ personType, documentNumber }) =>
        `../proveedores/GetByIdDocument?personType=${personType}&documentNumber=${documentNumber}`,
      // extraer solo el objeto `response`
      transformResponse: (raw: {
        code: string;
        message: string;
        response: Person;
        statusCode: number;
      }) => raw.response,
    }),  

  }),  

});

export const {
  useGetAllSuppliersQuery,
  useLazyGetSupplierByIdQuery,
  useSearchSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useUpdateStateSupplierMutation,
  useLazyGetPersonByDocumentQuery
} = suppliersApi;


