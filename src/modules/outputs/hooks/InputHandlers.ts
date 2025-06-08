import { 
  useLazyGetOutputByIdQuery,
  useSearchOutputsQuery,
  useCreateOutputMutation,
  useUpdateOutputMutation,
  useDeleteOutputMutation,
  useUpdateStateOutputMutation,

  useDeleteMovementOutputMutation
} from '../store';

import { useTransform } from '@/hooks/useTransform';
import { Logistic } from '@/models/Logistic';
import { EntityHandlers } from '@/hooks/EntityHandlersClass';

/**
 * Custom hook que crea y retorna una instancia configurada de EntityHandlers para RolAuthor.
 */
export function useInputHandlers() {
  // Se invocan los hooks de RTK Query para la entidad RolAuthor
  const [triggerGetInputById] = useLazyGetOutputByIdQuery();
  const [createInput] = useCreateOutputMutation();
  const [updateInput] = useUpdateOutputMutation();
  const [deleteInput] = useDeleteOutputMutation(); // recibe { idDocumento, idSerie, numero }
  const [updateStateInput] = useUpdateStateOutputMutation();
  const [deleteMovementInput] = useDeleteMovementOutputMutation();

  // Se define un objeto que agrupa las funciones requeridas por la clase EntityHandlers.
  const entityHooks: {
    triggerGetById: (id: string | number) => Promise<Logistic>;
    createEntity: (data: Partial<Logistic>) => Promise<Logistic>;
    updateEntity: (data: { id: string | number } & Partial<Logistic>) => Promise<Logistic>;
    deleteEntity: (id: string | number) => Promise<Logistic>;
    updateEntityState: (data: { id: string | number; currentState: any }) => Promise<Logistic>;
  } = {
    triggerGetById: (id: string | number) => triggerGetInputById(id).unwrap() as Promise<Logistic>,
    createEntity: (data: Partial<Logistic>) => createInput(data).unwrap() as Promise<Logistic>,
    updateEntity: (data: { id: string | number } & Partial<Logistic>) => updateInput(data).unwrap() as Promise<Logistic>,
    deleteEntity: (id: string | number) => deleteInput(id).unwrap() as Promise<Logistic>,
    updateEntityState: (data: { id: string | number; currentState: boolean }) => updateStateInput(data).unwrap() as Promise<Logistic>,
  };

  const { t } = useTransform();

  // Se crea la instancia de EntityHandlers pasando los hooks y los textos personalizables
  const entityHandler = new EntityHandlers<Logistic>(
    entityHooks,
    t('modules.form.create.title', {item: t('modules.outputs.label.title.singular')}), // Texto personalizable para creación.
    t('modules.form.edit.title', {item: t('modules.outputs.label.title.singular')}),  // Texto personalizable para edición.
  );

  const handleDeleteInput = async (
    idDocumento: string,
    idSerie: string,
    numero: string,
    onFinally?: () => void
  ) => {
    
    try {
      await deleteMovementInput({ idDocumento, idSerie, numero }).unwrap();
    } finally {
      onFinally?.();
    }
  };  

  // return entityHandler;
  return {
    ...entityHandler,
    // sobreescribimos sólo el método de borrado:
    handleDeleteInput,
  };  
}




/**
 * Custom hook para realizar búsquedas de roles de autor.
 * Recibe el texto de búsqueda y el número de página (por defecto 0, ya que asi funciona OOH4RIA)
 * y utiliza el hook generado para el endpoint Search.
 * Se utiliza la opción 'skip' para no ejecutar la consulta si el texto está vacío.
 */
export function useInputSearch(searchText: string, page: number = 0) {
  return useSearchOutputsQuery(
    { search: searchText, page },
    { skip: searchText.trim() === '' }
  );
}
