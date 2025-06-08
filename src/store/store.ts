import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from "@/modules/products/store";
import { brandsApi } from "@/modules/brands/store";
import { modelsApi } from "@/modules/modelos/store";
import { familiesApi } from "@/modules/families/store";
import { unitsApi } from "@/modules/units/store";
import { seriesApi } from "@/modules/series/store";
import { suppliersApi } from "@/modules/suppliers/store";
import { warehousesApi } from "@/modules/warehouses/store";
import { inputsApi } from "@/modules/movements/store";
import { outputsApi } from "@/modules/outputs/store";
import { usersApi } from "@/modules/auth/store";
import { reportsApi } from "@/modules/reports/store";

export const store = configureStore({
  reducer: {
    // Se agrega el reducer generado por el API slice de Roles de Autor.

    [productsApi.reducerPath]: productsApi.reducer,
    [brandsApi.reducerPath]: brandsApi.reducer,
    [modelsApi.reducerPath]: modelsApi.reducer,
    [familiesApi.reducerPath]: familiesApi.reducer,
    [unitsApi.reducerPath]: unitsApi.reducer,
    [seriesApi.reducerPath]: seriesApi.reducer,
    [suppliersApi.reducerPath]: suppliersApi.reducer,
    [warehousesApi.reducerPath]: warehousesApi.reducer,
    [inputsApi.reducerPath]: inputsApi.reducer,
    [outputsApi.reducerPath]: outputsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,

    
  },
  middleware: (getDefaultMiddleware) =>
    // Se concatena el middleware del API slice para que se gestionen peticiones y caché.
    getDefaultMiddleware().concat(
        
      productsApi.middleware,
      brandsApi.middleware,
      modelsApi.middleware,
      familiesApi.middleware,
      unitsApi.middleware,
      seriesApi.middleware,
      suppliersApi.middleware,
      warehousesApi.middleware,
      inputsApi.middleware,
      outputsApi.middleware,
      usersApi.middleware,
      reportsApi.middleware,
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;