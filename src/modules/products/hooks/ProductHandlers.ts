import { 
  useLazyGetProductByIdQuery,    // Hook para obtener de forma lazy un rol por id.
  useSearchProductsQuery,        // Hook para realizar búsquedas.
  useCreateProductMutation,       // Hook para la mutación de creación.
  useUpdateProductMutation,       // Hook para la mutación de actualización.
  useDeleteProductMutation,       // Hook para la mutación de eliminación.
  useUpdateStateProductMutation   // Hook para la mutación de actualización de estado.
} from '../store';

import { useTransform } from '@/hooks/useTransform';
import { Product } from '@/models/Product';
import { EntityHandlers } from '@/hooks/EntityHandlersClass';

/**
 * Custom hook que crea y retorna una instancia configurada de EntityHandlers para RolAuthor.
 */
export function productHandlers() {
  // Se invocan los hooks de RTK Query para la entidad RolAuthor
  const [triggerGetProductById] = useLazyGetProductByIdQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateStateProduct] = useUpdateStateProductMutation();

  // Se define un objeto que agrupa las funciones requeridas por la clase EntityHandlers.
  const entityHooks: {
    triggerGetById: (id: string | number) => Promise<Product>;
    createEntity: (data: Partial<Product>) => Promise<Product>;
    updateEntity: (data: { id: string | number } & Partial<Product>) => Promise<Product>;
    deleteEntity: (id: string | number) => Promise<Product>;
    updateEntityState: (data: { id: string | number; currentState: any }) => Promise<Product>;
  } = {
    triggerGetById: (id: string | number) => triggerGetProductById(id).unwrap() as Promise<Product>,
    createEntity: (data: Partial<Product>) => createProduct(data).unwrap() as Promise<Product>,
    updateEntity: (data: { id: string | number } & Partial<Product>) => updateProduct(data).unwrap() as Promise<Product>,
    deleteEntity: (id: string | number) => deleteProduct(id).unwrap() as Promise<Product>,
    updateEntityState: (data: { id: string | number; currentState: boolean }) => updateStateProduct(data).unwrap() as Promise<Product>,
  };

  const { t } = useTransform();

  // Se crea la instancia de EntityHandlers pasando los hooks y los textos personalizables
  const entityHandler = new EntityHandlers<Product>(
    entityHooks,
    t('modules.form.create.title', {item: t('modules.products.label.title.singular')}), // Texto personalizable para creación.
    t('modules.form.edit.title', {item: t('modules.products.label.title.singular')}),  // Texto personalizable para edición.
  );

  return entityHandler;
}


/**
 * Custom hook para realizar búsquedas de roles de autor.
 * Recibe el texto de búsqueda y el número de página (por defecto 0, ya que asi funciona OOH4RIA)
 * y utiliza el hook generado para el endpoint Search.
 * Se utiliza la opción 'skip' para no ejecutar la consulta si el texto está vacío.
 */
export function useProductSearch(searchText: string, page: number = 0) {
  return useSearchProductsQuery(
    { search: searchText, page },
    { skip: searchText.trim() === '' }
  );
}
