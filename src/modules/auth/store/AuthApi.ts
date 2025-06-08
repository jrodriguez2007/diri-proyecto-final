import { createCrudApi } from '@/store/BaseApiFactory';
import { GENERAL_API_BASE } from "@/api/Config";
import { User } from "@/models/User";

export interface LoginResponse {
  code: string;
  message: string;
  response: User | null;
  statusCode: number;
}

interface Credentials {
  usuario: string;
  contrasena: string;
}

export const usersApi = createCrudApi<User>({
  entityNames: ['User','Users'],
  reducerPath: 'usersApi',
  tagType: 'User',
  baseUrl: `${GENERAL_API_BASE}/usuarios/`,

  // Agregamos el endpoint específico:
  extraEndpoints: (builder) => ({

    login: builder.mutation<LoginResponse, Credentials>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
    }),

  }),

});

export const {
  useLoginMutation,
} = usersApi;


