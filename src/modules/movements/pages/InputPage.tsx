import React, { useState, ChangeEvent, Suspense } from 'react';
import { Space } from 'antd';
import { FormattedMessage } from "react-intl";
import { ColumnType } from 'antd/es/table';
import { DeleteFilled } from '@ant-design/icons';
import dayjs from 'dayjs';

// Se importan las funciones de manejo (handlers) que se definieron en otro módulo (handlers.ts)
import { useGetAllMovementInputsQuery } from '../store';
import { ContentLayout } from '@/modules/home/layout/ContentLayout';
import { useTransform } from '@/hooks/useTransform';
import { PaginationTemplate, TableTemplate } from '@/modules/templates/components';
import { HeaderButtonsTemplate } from '@/modules/templates/components/inputs';
// Se importan tanto las columnas principales como los handlers (lógica de negocio) de roles
import { useInputColumns, useInputHandlers, useInputSearch } from '../hooks';
import { Logistic } from '@/models/Logistic';
import { DetailComponent } from '../components/DetailComponent';
import LoggerService from '@/providers/LoggerService';

const InputFormComponent = React.lazy(() => import('../components/InputFormComponent'));
const ConfirmDeleteModal = React.lazy(() => import('../components/ConfirmDeleteComponent'));

export const InputPage: React.FC = () => {
  const { t } = useTransform();

  // ---- Estados para la paginación ----
  const [pageSize, setPageSize] = useState<number>(10);
  // currentPage: número de la página actual.  
  const [currentPage, setCurrentPage] = useState(1);

  // ---- Estados para el formulario (crear/editar) ----
  const [isModalFormVisible, setIsModalFormVisible] = useState(false);
// formTitle: título que se muestra en el modal (puede cambiar entre "Crear" o "Editar").  
  const [formTitle, setFormTitle] = useState<string>(t('modules.form.create.title', {item: t('app.movements.inputs.title.singular').toLocaleLowerCase()}));
  // formInitialValues: valores iniciales para precargar el formulario en modo edición.  
  const [formInitialValues, setFormInitialValues] = useState<any>(null);
  // isEditMode: indica si el formulario se está utilizando en modo edición (true) o creación (false).  
  const [isEditMode, setIsEditMode] = useState(false);

  // ---- Estados para el proceso de eliminación ----
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  // selectedRecord: almacena el registro (Product) seleccionado para eliminar.  
  const [selectedRecord, setSelectedRecord] = useState<Logistic | null>(null);

  // ---- Estado para el texto de búsqueda ----
  const [searchText, setSearchText] = useState<string>('');  

  // ---- Consulta para obtener la lista de roles de autor ----
  const { data: prevAllRoles, error, isLoading } = useGetAllMovementInputsQuery(
    { page: 1, limit: 50 },
    //{ skip: searchText.trim() !== '' } // Ejecutar la consulta solo cuando searchText este vacío
  );

  const allInputs: Logistic[] = (prevAllRoles ?? []) as Logistic[];
  // Se usa el custom hook de búsqueda; si searchText está vacío, se skipea la consulta.
  const { data: searchResults } = useInputSearch(searchText, 0);

  // Si hay búsqueda, se muestran los resultados filtrados; de lo contrario se muestran todos los roles.
  const rolesData = allInputs.filter((p) =>
    p.responsable.toLowerCase().includes(searchText.toLowerCase()) ||
    p.documentoResponsable.includes(searchText.toLowerCase())
  );
  
 const sortedData = rolesData
   .slice() // para no mutar el original
   .sort((a, b) => {
     return dayjs(b.fechaDocumento).valueOf()
       - dayjs(a.fechaDocumento).valueOf();
   });

  // Se realiza la paginación local: se extrae el subconjunto de registros según la página y el tamaño actual.  
  // const paginatedData = (rolesData  ?? []).slice((currentPage - 1) * pageSize, currentPage * pageSize);
 const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);  

  // ---- Extracción de funciones del handler ----
  const {
    handleCreate,
    handleEdit,
    handleFormSubmit,
    handleDelete,
    confirmDelete,
    handleUpdateState,
    handleDeleteInput,
  } = useInputHandlers();


// Función para manejar el cambio de paginación.
// Recibe un objeto con currentPage y pageSize y actualiza los estados correspondientes.
const handlePaginationChange = ({ currentPage, pageSize }: { currentPage: number, pageSize: number }) => {
  setCurrentPage(currentPage);
  setPageSize(pageSize);
};  


  // ---- Handler para el cambio en el textbox de búsqueda ----
  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    // Reiniciamos la paginación al buscar
    setCurrentPage(1);
  };  

  // ---- Función para el envío del formulario ----
  const onSubmit = (values: any) => {
    handleFormSubmit(values, isEditMode, formInitialValues)
      .then((response) => {
        const msg = isEditMode
          ? 'Movimiento de ingreso actualizado: '
          : 'Movimiento de ingreso creado: ';
        LoggerService.info(`${msg} ${JSON.stringify(response, null, 2)}`);
      })
      .catch((error) => {
        const msg = isEditMode
          ? 'Error al actualizar movimiento de ingreso: ' 
          : 'Error al crear movimiento de ingreso: ';
        LoggerService.error(`${msg} ${JSON.stringify(error, null, 2)}`);
      });
    // Se cierra el modal del formulario tras el envío.
    setIsModalFormVisible(false);
  };

  // ---- Tabla: Columnas ---
  const inputColumns = useInputColumns();
  // ---- Tabla: Acciones ---
  const actionColumnTable: ColumnType<Logistic>[] = [
    {
      title: t('table.header.actions'),
      key: 'acciones',
      render: (_: unknown, record: Logistic) => (
        <Space size="middle">
          <DeleteFilled onClick={() => handleDelete(record, setSelectedRecord, setIsModalDeleteVisible)} />
        </Space>
      ),
    },
  ];    

  // ---- Confirmación de Eliminación
  const handleConfirmDelete = () => {
    if (!selectedRecord) return;
    
    LoggerService.info('Confirmación de eliminación del movimiento de entrada');
      
    handleDeleteInput(
      selectedRecord.idDocumento,
      selectedRecord.idSerie,
      selectedRecord.numero!,
      () => {
        setIsModalDeleteVisible(false);
        setSelectedRecord(null);
      }
    );
  };  

  return (

    <ContentLayout 
      title={<FormattedMessage id="app.movements.inputs.title" />}
      headerExtras={
      <HeaderButtonsTemplate
        searchText={searchText}
        searchPlaceholder={t(
          'modules.form.placeholder.search',
          {
            item: t('app.movements.inputs.title').toLocaleLowerCase()
          }
        )}
        onSearchChange={onSearchChange}
        onFilterClick={() => console.log('Botón filtro presionado')}
        onAddClick={() => handleCreate(setIsEditMode, setFormTitle, setFormInitialValues, setIsModalFormVisible)}
      />}
    >

      <>
          {/* Contenido: Inicio */}

          {/* Se muestran mensajes de carga o error en caso de que la consulta falle */}
          {isLoading && <p><FormattedMessage id="message.loading" /></p>}
          {error && <p><FormattedMessage id="error.data" /></p>}

          {/* Si se obtuvieron datos (lista no vacía), se renderizan la tabla y la paginación */}
          {rolesData  && rolesData .length > 0 && (
            <>
              <TableTemplate 
                data={paginatedData} 
                columns={[...inputColumns, ...actionColumnTable]}    
                expandable={{
                  // Cuando expandas, renderiza el detalle
                  expandedRowRender: (record) => (
                    <DetailComponent detalle={record.detalle} />
                  ),
                  // Sólo permitimos expandir si hay detalle
                  rowExpandable: (record) =>
                    Array.isArray(record.detalle) && record.detalle.length > 0,
                }}                              
              />

              <PaginationTemplate 
                total={rolesData.length}
                pageSizeOptions={[5,10]}
                defaultPageSize={pageSize} 
                onPageChange={handlePaginationChange}
              />

              {/* Detalle de cada movimiento */}
              {/* {paginatedData.map(item => (
                <DetailComponent
                  key={item.id}
                  detalle={item.detalle}
                />
              ))} */}

            </>
          )}

          {/* FormComponent es el componente modal que contiene el formulario para crear o editar.
          Se le pasan los estados de visibilidad, título, valores iniciales y los handlers onSubmit y onCancel */}
          <Suspense fallback={<div>Cargando formulario…</div>}>
            {isModalFormVisible && (
              <InputFormComponent 
                visible={isModalFormVisible} 
                title={formTitle} 
                initialValues={formInitialValues} 
                onSubmit={onSubmit} 
                onCancel={() => setIsModalFormVisible(false)}
              />
            )}
          </Suspense>

          {/* Modal para confirmar la eliminación de un registro.
          Se muestra al usuario para confirmar la acción, y se invoca confirmDelete al hacer clic en "Eliminar". */}
          <Suspense fallback={null}>
            {isModalDeleteVisible && selectedRecord && (
              <ConfirmDeleteModal
                visible={isModalDeleteVisible}
                record={selectedRecord}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                  setIsModalDeleteVisible(false);
                  setSelectedRecord(null);
                }}
              />
            )}
          </Suspense>          


        {/* Contenido: Fin */}

      </>
          
    </ContentLayout>

  );
};
