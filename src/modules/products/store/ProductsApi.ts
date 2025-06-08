import { createCrudApi } from '@/store/BaseApiFactory';
import { GENERAL_API_BASE } from "@/api/Config";
import { Product } from "@/models/Product";

export const productsApi = createCrudApi<Product>({
  entityNames: ['Product','Products'],
  reducerPath: 'productsApi',
  tagType: 'Product',
  baseUrl: `${GENERAL_API_BASE}/productos/`,

  // Agregamos el endpoint específico:
  extraEndpoints: (builder) => ({

    getProductByCode: builder.query<Product, string>({
      query: (codigo) => `GetByCode?code=${encodeURIComponent(codigo)}`,
      transformResponse: (raw: { code: string; message: string; response: Product }) =>
        raw.response,
      providesTags: (result) =>
        result ? [{ type: 'Product' as const, id: result.id }] : [],
    }),

  }),

});

export const {
  useGetAllProductsQuery,
  useLazyGetProductByIdQuery,
  useSearchProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateStateProductMutation,
  useLazyGetProductByCodeQuery
} = productsApi;


