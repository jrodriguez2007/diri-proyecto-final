import { createCrudApi } from '@/store/BaseApiFactory';
import { GENERAL_API_BASE } from "@/api/Config";
import { Family } from "@/models/Family";

export const familiesApi = createCrudApi<Family>({
  entityNames: ['Family','Families'],
  reducerPath: 'familiesApi',
  tagType: 'Family',
  baseUrl: `${GENERAL_API_BASE}/familias/`,

});

export const {
  useGetAllFamiliesQuery,
  useLazyGetFamilyByIdQuery,
  useSearchFamiliesQuery,
  useCreateFamilyMutation,
  useUpdateFamilyMutation,
  useDeleteFamilyMutation,
  useUpdateStateFamilyMutation
} = familiesApi;


