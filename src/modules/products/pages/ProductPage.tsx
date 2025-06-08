import React, { useState, ChangeEvent, Suspense } from 'react';
import { Space } from 'antd';
import { FormattedMessage } from "react-intl";
import { ColumnType } from 'antd/es/table';
import { EditFilled, DeleteFilled } from '@ant-design/icons';

// Se importan las funciones de manejo (handlers) que se definieron en otro módulo (handlers.ts)
import { useGetAllProductsQuery } from '../store';
import { ContentLayout } from '@/modules/home/layout/ContentLayout';
import { useTransform } from '@/hooks/useTransform';
import { PaginationTemplate, TableTemplate } from '@/modules/templates/components';
import { HeaderButtonsTemplate } from '@/modules/templates/components/inputs';
// Se importan tanto las columnas principales como los handlers (lógica de negocio) de roles
import { useProductColumns, productHandlers, useProductSearch } from '../hooks';
import { Product } from '@/models/Product';
import LoggerService from '@/providers/LoggerService';

const FormComponent = React.lazy(() => import('../components/FormComponent'));
const ConfirmDeleteModal = React.lazy(() => import('../components/ConfirmDeleteComponent'));

export const ProductPage: React.FC = () => {
  const { t } = useTransform();

  // ---- Estados para la paginación ----
  const [pageSize, setPageSize] = useState<number>(10);
  // currentPage: número de la página actual.  
  const [currentPage, setCurrentPage] = useState(1);

  // ---- Estados para el formulario (crear/editar) ----
  const [isModalFormVisible, setIsModalFormVisible] = useState(false);
// formTitle: título que se muestra en el modal (puede cambiar entre "Crear" o "Editar").  
  const [formTitle, setFormTitle] = useState<string>(t('modules.form.create.title', {item: t('app.products.title.singular').toLocaleLowerCase()}));
  // formInitialValues: valores iniciales para precargar el formulario en modo edición.  
  const [formInitialValues, setFormInitialValues] = useState<any>(null);
  // isEditMode: indica si el formulario se está utilizando en modo edición (true) o creación (false).  
  const [isEditMode, setIsEditMode] = useState(false);

  // ---- Estados para el proceso de eliminación ----
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  // selectedRecord: almacena el registro (Product) seleccionado para eliminar.  
  const [selectedRecord, setSelectedRecord] = useState<Product | null>(null);

  // ---- Estado para el texto de búsqueda ----
  const [searchText, setSearchText] = useState<string>('');  

  // ---- Consulta para obtener la lista de roles de autor ----
  const { data: prevAllProducts, error, isLoading } = useGetAllProductsQuery(
    { page: 1, limit: 50 },
    // { skip: searchText.trim() !== '' } // Ejecutar la consulta solo cuando searchText este vacío
  );
  const allProducts: Product[] = (prevAllProducts ?? []) as Product[];

  // Se usa el custom hook de búsqueda; si searchText está vacío, se skipea la consulta.
  const { data: searchResults } = useProductSearch(searchText, 0);

  // Si hay búsqueda, se muestran los resultados filtrados; de lo contrario se muestran todos los roles.
  // const rolesData: Product[] | undefined =
  // searchText.trim() !== '' ? (searchResults as Product[]) : (allRoles as Product[]);

 // Filtrado en cliente: por descripción (case-insensitive)
 const rolesData = allProducts.filter((p) =>
  p.descripcion.toLowerCase().includes(searchText.toLowerCase())
);
  
  // Se realiza la paginación local: se extrae el subconjunto de registros según la página y el tamaño actual.  
  const paginatedData = (rolesData  ?? []).slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // ---- Extracción de funciones del handler ----
  const {
    handleCreate,
    handleEdit,
    handleFormSubmit,
    handleDelete,
    confirmDelete,
    handleUpdateState,
  } = productHandlers();


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
          ? 'Producto actualizado: '
          : 'Producto creado: ';
        LoggerService.info(`${msg} ${JSON.stringify(response, null, 2)}`);          
      })
      .catch((error) => {
        const msg = isEditMode
          ? 'Error al actualizar producto: ' 
          : 'Error al crear producto: ';
        LoggerService.error(`${msg} ${JSON.stringify(error, null, 2)}`);          
      });
    // Se cierra el modal del formulario tras el envío.
    setIsModalFormVisible(false);
  };

  // ---- Tabla: Columnas ---
  const productColumns = useProductColumns();
  // ---- Tabla: Acciones ---
  const actionColumnTable: ColumnType<Product>[] = [
    {
      title: t('table.header.actions'),
      key: 'acciones',
      render: (_: unknown, record: Product) => (
        <Space size="middle">
          <EditFilled onClick={() => handleEdit( record, setFormInitialValues, setIsModalFormVisible, setFormTitle, setIsEditMode)}
          />
          <DeleteFilled onClick={() => handleDelete(record, setSelectedRecord, setIsModalDeleteVisible)}
          />
        </Space>
      ),
    },
  ];    

  return (

    <ContentLayout 
      title={<FormattedMessage id="app.products.title" />}
      headerExtras={
      <HeaderButtonsTemplate
        searchText={searchText}
        searchPlaceholder={t(
          'modules.form.placeholder.search',
          {
            item: t('app.products.title').toLocaleLowerCase()
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
                columns={[...productColumns, ...actionColumnTable]}    
              />

              <PaginationTemplate 
                total={rolesData.length}
                pageSizeOptions={[5,10]}
                defaultPageSize={pageSize} 
                onPageChange={handlePaginationChange}
              />
            </>
          )}

          {/* FormComponent es el componente modal que contiene el formulario para crear o editar.
          Se le pasan los estados de visibilidad, título, valores iniciales y los handlers onSubmit y onCancel */}
          <Suspense fallback={<div>Cargando formulario…</div>}>
            {isModalFormVisible && (
              <FormComponent 
                visible={isModalFormVisible}
                title={formTitle}
                initialValues={formInitialValues}
                onSubmit={onSubmit}
                onCancel={() => setIsModalFormVisible(false)}
              />
            )}
          </Suspense>

          {/* Modal Confirmación Eliminación */}
          <Suspense fallback={null}>
            {isModalDeleteVisible && selectedRecord && (
              <ConfirmDeleteModal
                visible={isModalDeleteVisible}
                record={selectedRecord}
                onConfirm={() => {
                  confirmDelete(selectedRecord, setIsModalDeleteVisible, setSelectedRecord);
                  LoggerService.info('Confirmación de eliminación del producto');
                }}
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
