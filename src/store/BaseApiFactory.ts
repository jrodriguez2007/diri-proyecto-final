import { fetchBaseQuery, createApi, BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query/react';

/**
 * Define la interfaz básica para una entidad que posea al menos un identificador numérico.
 */
interface Entity {
    id: number | string;
}

  /**
 * Opciones de configuración para la fábrica de APIs CRUD.
 *
 * @property entityNames - Tupla que contiene el nombre en singular y plural de la entidad (por ejemplo, ['Author', 'Authors']).
 * @property reducerPath - Ruta del reducer en el store de Redux (por ejemplo, 'authorsApi').
 * @property tagType - Tipo de etiqueta utilizado por RTK Query para el manejo de caché (por ejemplo, 'Author').
 * @property baseUrl - URL base para la API de la entidad.
 * @property extraEndpoints - Función opcional que permite agregar endpoints personalizados además de los CRUD básicos.
 */
interface BaseApiFactoryOptions<T> {
  entityNames: [string, string];   // Ejemplo: ['Author','Authors'] // singular, plural
  reducerPath: string;  // Ejemplo: 'authorsApi'
  tagType: string;      // Ejemplo: 'Author'
  baseUrl: string;
  
// Función opcional que recibe el builder tipado y retorna endpoints adicionales.
  extraEndpoints?: (builder: EndpointBuilder<BaseQueryFn, string, string>) => Record<string, any>;
}

/**
 * Función fábrica que crea una API CRUD genérica usando RTK Query.
 * Esta función centraliza la creación de endpoints básicos para operaciones CRUD
 * (Obtener todos, obtener por ID, búsqueda, creación, actualización, eliminación y actualización de estado),
 * y además permite agregar endpoints adicionales si es requerido.
 *
 */
export function createCrudApi<T extends Entity>({ 
    entityNames, 
    reducerPath, 
    tagType, 
    baseUrl,
    extraEndpoints
 }: BaseApiFactoryOptions<T>) {

  // Desestructura los nombres: el primero (singular) y el segundo (plural)
  const [entitySingular, entityPlural] = entityNames;

  // Configuración base para realizar peticiones HTTP (incluye inyección de token en headers)
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Se obtiene el token almacenado en localStorage y se agrega al header Authorization, si existe
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `${token}`);
      return headers;
    },
  });

  // Se crea la API utilizando createApi de RTK Query
  return createApi({
    reducerPath,      // Nombre único para el reducer en Redux
    baseQuery,        // Función base para realizar las peticiones
    tagTypes: [tagType],    // Se define un array de tagTypes para el manejo de la caché y revalidación
    endpoints: (builder) => {

      // Endpoints CRUD generales:
      // Se definen los endpoints básicos CRUD utilizando el "builder"
      const endpoints: Record<string, any> = {
        /**
         * Endpoint para obtener todos los registros (paginado).
         * Genera un hook llamado useGetAll{entityPlural}Query.
         */
        [`getAll${entityPlural}`]: builder.query<T[], { page: number; limit: number }>({
          // La función query construye la URL para obtener los datos según página y límite
          //query: ({ page, limit }) => `GetAll?page=${page}&limit=${limit}`,
          query: ({ page, limit }) => {
            const url = `GetAll?page=${page}&limit=${limit}`;
            return url;
          },
          transformResponse: (rawResult: { code: string; message: string; response: T[] }) => {
            return rawResult.response;
          },          
          // Define las etiquetas que se usan para invalidar la caché cuando hay cambios
          providesTags: (result) =>
            result
              ? [...result.map(({ id }: any) => ({ type: tagType, id })), { type: tagType, id: 'LIST' }]
              : [{ type: tagType, id: 'LIST' }],
          // Tiempo en segundos que los datos se mantienen en caché si no se usan
          keepUnusedDataFor: 60,
        }),

        /**
         * Endpoint para obtener un registro individual por su ID.
         * Genera un hook llamado useGet{entitySingular}ByIdQuery.
         */        
        [`get${entitySingular}ById`]: builder.query<T, number>({
          query: (id) => `GetById/${id}`,
          transformResponse: (rawResult: { code: string; message: string; response: T }) => {
            return rawResult.response;
          },          
          providesTags: (result, error, id) => [{ type: tagType, id }],
        }),

        /**
         * Endpoint para buscar registros de la entidad.
         * Genera un hook llamado useSearch{entityPlural}Query.
         */        
        [`search${entityPlural}`]: builder.query<T[], { search: string; page: number }>({
          query: ({ search, page }) => `Search?search=${encodeURIComponent(search)}&page=${page}`,
          transformResponse: (raw: {
            code: string;
            message: string;
            response: T[];
          }) => raw.response,          
          providesTags: (result) =>
            result
              ? [...result.map(({ id }: any) => ({ type: tagType, id })), { type: tagType, id: 'LIST' }]
              : [{ type: tagType, id: 'LIST' }],
        }),

        /**
         * Endpoint para crear un registro nuevo.
         * Genera un hook llamado useCreate{entitySingular}Mutation.
         * Se espera un objeto que sea parcialmente del tipo T, pudiendo incluir propiedades adicionales.
         */        
        [`create${entitySingular}`]: builder.mutation<T, Partial<T> & Record<string, any>>({
          query: (body) => {
            const idUsuarioRegistro = localStorage.getItem('idUsuario') || '';
            return {
              url: 'Create',
              method: 'POST',
              body: { ...body, idUsuarioRegistro },
            };
          },
          transformResponse: (raw: {
            code: string;
            message: string;
            response: T;
          }) => raw.response,          
          invalidatesTags: [{ type: tagType, id: 'LIST' }],
        }),

        /**
         * Endpoint para actualizar un registro existente.
         * Genera un hook llamado useUpdate{entitySingular}Mutation.
         * Se espera un objeto que sea parcialmente del tipo T y que incluya el ID.
         */        
        [`update${entitySingular}`]: builder.mutation<T, Partial<T> & { id: number }>({
          query: ({ id, ...body }) => {
            const idUsuarioEdicion = localStorage.getItem('idUsuario') || '';
            const fechaEdicion = new Date().toISOString();
          
            return {
              url: `Update?id=${id}`,
              method: 'PUT',
              body: { ...body, idUsuarioEdicion, fechaEdicion },
            };
          },
          transformResponse: (raw: {
            code: string;
            message: string;
            response: T;
          }) => raw.response,          
          invalidatesTags: [{ type: tagType, id: 'LIST' }],
        }),

        /**
         * Endpoint para eliminar un registro.
         * Genera un hook llamado useDelete{entitySingular}Mutation.
         * Se espera el ID del registro a eliminar.
         */        
        [`delete${entitySingular}`]: builder.mutation<{ success: boolean; id: number }, number>({
          query: (id) => ({
            url: `Delete?id=${id}`,
            method: 'DELETE',
          }),
          transformResponse: (raw: {
            code: string;
            message: string;
            response: { success: boolean; id: number };
          }) => raw.response,          
          invalidatesTags: [{ type: tagType, id: 'LIST' }],
        }),

        /**
         * Endpoint para actualizar el estado (activar/desactivar) de un registro.
         * Genera un hook llamado useUpdateState{entitySingular}Mutation.
         */        
        [`updateState${entitySingular}`]: builder.mutation<T, { id: number; currentState: boolean }>({
          query: ({ id, currentState }) => {
            const idUsuarioEdicion = localStorage.getItem('idUsuario') || '';
            const fechaEdicion = new Date().toISOString();
            return {
              url: `UpdateState?id=${id}`,
              method: 'PUT',
              body: {
                estado: !currentState,
                idUsuarioEdicion,
                fechaEdicion,
              },
            };
          },
          transformResponse: (raw: {
            code: string;
            message: string;
            response: T;
          }) => raw.response,          
          invalidatesTags: [{ type: tagType, id: 'LIST' }],
        }),
      };

      // Si se han definido endpoints adicionales, se combinan con los definidos anteriormente.
      if (extraEndpoints) {
        Object.assign(endpoints, extraEndpoints(builder));
      }

      // Se retorna el objeto que contiene todos los endpoints para que RTK Query genere los hooks correspondientes.      
      return endpoints;
    },
  });

}
