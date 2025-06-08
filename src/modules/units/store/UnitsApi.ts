import { createCrudApi } from '@/store/BaseApiFactory';
import { GENERAL_API_BASE } from "@/api/Config";
import { Unit } from "@/models/Unit";

export const unitsApi = createCrudApi<Unit>({
  entityNames: ['Unit','Units'],
  reducerPath: 'unitsApi',
  tagType: 'Unit',
  baseUrl: `${GENERAL_API_BASE}/unidades/`,

});

export const {
  useGetAllUnitsQuery,
  useLazyGetUnitByIdQuery,
  useSearchUnitsQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
  useUpdateStateUnitMutation
} = unitsApi;


