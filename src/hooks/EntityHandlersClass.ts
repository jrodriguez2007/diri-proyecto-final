import LoggerService from '@/providers/LoggerService';

export class EntityHandlers<T> {
  private triggerGetById: (id: string | number) => Promise<T>;
  private createEntity: (data: Partial<T>) => Promise<T>;
  private updateEntity: (data: { id: string | number } & Partial<T>) => Promise<T>;
  private deleteEntity: (id: string | number) => Promise<T>;
  private updateEntityState?: (data: { id: string | number; currentState: boolean; usuario?: string }) => Promise<T>;

  // Variables para textos personalizables
  private createLabel: string;
  private editLabel: string;

  constructor(
    hooks: {
      triggerGetById: (id: string | number) => Promise<T>;
      createEntity: (data: Partial<T>) => Promise<T>;
      updateEntity: (data: { id: string | number } & Partial<T>) => Promise<T>;
      deleteEntity: (id: string | number) => Promise<T>;
      updateEntityState?: (data: { id: string | number; currentState: boolean; usuario?: string }) => Promise<T>;
    },
    createLabel: string = 'Crear nuevo registro',
    editLabel: string = 'Editar registro'
  ) {
    this.triggerGetById = hooks.triggerGetById;
    this.createEntity = hooks.createEntity;
    this.updateEntity = hooks.updateEntity;
    this.deleteEntity = hooks.deleteEntity;
    this.updateEntityState = hooks.updateEntityState;

    this.createLabel = createLabel;
    this.editLabel = editLabel;
  }

  // Método público que expone la funcionalidad de triggerGetById.
  public getById = (id: string | number): Promise<T> => {
    return this.triggerGetById(id);
  };  

  // Métodos definidos como arrow functions para mantener el contexto de la instancia.

  handleCreate = (
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>,
    setFormTitle: React.Dispatch<React.SetStateAction<string>>,
    setFormInitialValues: React.Dispatch<React.SetStateAction<any>>,
    setIsModalFormVisible: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setIsEditMode(false);
    setFormTitle(this.createLabel);
    setFormInitialValues(null);
    setIsModalFormVisible(true);
  };

  handleEdit = (
    record: T & { id: string | number },
    setFormInitialValues: React.Dispatch<React.SetStateAction<any>>,
    setIsModalFormVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setFormTitle: React.Dispatch<React.SetStateAction<string>>,
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setIsEditMode(true);
    setFormTitle(this.editLabel);
    this.triggerGetById(record.id)
      .then((data: T) => {
        setFormInitialValues(data);
        setIsModalFormVisible(true);
      })
      .catch((error: any) => {
        LoggerService.error(`Error al obtener el registro por id: ${JSON.stringify(error)}`)
        setFormInitialValues(record);
        setIsModalFormVisible(true);
      });
  };

  handleFormSubmit = (
    values: any,
    isEditMode: boolean,
    formInitialValues: any
  ) => {
    if (isEditMode) {
      return this.updateEntity({ id: formInitialValues.id, ...values });
    } else {
      return this.createEntity(values);
    }
  };

  handleDelete = (
    record: T & { id: string | number },
    setSelectedRecord: React.Dispatch<React.SetStateAction<(T & { id: string | number }) | null>>,
    setIsModalDeleteVisible: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setSelectedRecord(record);
    setIsModalDeleteVisible(true);
  };

  confirmDelete = (
    selectedRecord: (T & { id: string | number }) | null,
    setIsModalDeleteVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedRecord: React.Dispatch<React.SetStateAction<(T & { id: string | number }) | null>>
  ) => {
    if (selectedRecord) {
      return this.deleteEntity(selectedRecord.id)
        .finally(() => {
          setIsModalDeleteVisible(false);
          setSelectedRecord(null);
        });
    }
  };

  handleUpdateState = (record: T & { id: string | number; estado?: boolean; usuario?: string }) => {
    
    const currentState = (record.estado ?? false);
    if (this.updateEntityState) {
      return this.updateEntityState({ id: record.id, currentState: currentState, usuario: record.usuario }).catch((error: any) =>
        LoggerService.error(`Error al actualizar estado: ${JSON.stringify(error)}`)
      );
    }
  };

  
}
