import { ColumnType } from 'antd/es/table';
import { Product } from '@/models/Product';
import { useTransform } from '@/hooks/useTransform';
import { Tag } from 'antd';

export const useProductColumns = (): ColumnType<Product>[] => {
  
  const { t } = useTransform();
    
  return [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        sorter: (a: Product, b: Product) => a.id - b.id,
      },
      {
        title: t('app.products.header.code'),
        dataIndex: 'codigo',
        key: 'codigo',
        sorter: (a: Product, b: Product) => a.codigo.localeCompare(b.codigo),
      },      
      {
        title: t('app.products.header.description'),
        dataIndex: 'descripcion',
        key: 'descripcion',
        sorter: (a: Product, b: Product) => a.descripcion.localeCompare(b.descripcion),
      },

      {
        title: t('app.products.header.unit'),
        dataIndex: 'unidad',
        key: 'unidad',
        sorter: (a: Product, b: Product) => a.unidad!.localeCompare(b.unidad!),
      },
      {
        title: t('app.products.header.family'),
        dataIndex: 'familia',
        key: 'familia',
        sorter: (a: Product, b: Product) => a.familia!.localeCompare(b.familia!),
      },
      {
        title: t('app.products.header.brand'),
        dataIndex: 'marca',
        key: 'marca',
        sorter: (a: Product, b: Product) => a.marca!.localeCompare(b.marca!),
      },
      {
        title: t('app.products.header.model'),
        dataIndex: 'modelo',
        key: 'modelo',
        sorter: (a: Product, b: Product) => a.modelo!.localeCompare(b.modelo!),
      },            
      {
        title: t('app.products.header.active'),
        dataIndex: 'activo',
        key: 'activo',
        render: (_: any, record: Product) => {
                const isActive = record.activo;
                return (
                  <Tag color={isActive ? 'green' : 'volcano'}>
                    {isActive ? t('table.column.active') : t('table.column.inactive')}
                  </Tag>
                );
              },        
        // render: (_: any, record: Product) => record.activo ? t('table.column.active') : t('table.column.inactive'),
        sorter: (a: Product, b: Product) =>
            Number(a.activo) - Number(b.activo),
      }
  ];
}