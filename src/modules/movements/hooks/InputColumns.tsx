import { ColumnType } from 'antd/es/table';
import { Logistic } from '@/models/Logistic';
import { useTransform } from '@/hooks/useTransform';
import { Tag } from 'antd';

export const useInputColumns = (): ColumnType<Logistic>[] => {
  
  const { t } = useTransform();
    
  return [
      {
        title: t('app.movements.inputs.header.serie'),
        dataIndex: 'idSerie',
        key: 'idSerie',
      },      
      {
        title: t('app.movements.inputs.header.numero'),
        dataIndex: 'numero',
        key: 'numero',
        sorter: (a: Logistic, b: Logistic) => a.numero!.localeCompare(b.numero!),
      },

      {
        title: t('app.movements.inputs.header.fechaDocument'),
        dataIndex: 'fechaDocumento',
        key: 'fechaDocumento',
        render: (value: string) =>
          new Date(value).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),        
        sorter: (a: Logistic, b: Logistic) => a.fechaDocumento.localeCompare(b.fechaDocumento),
      },
      {
        title: t('app.movements.inputs.header.type'),
        dataIndex: 'tipoMovimiento',
        key: 'tipoMovimiento',
        sorter: (a: Logistic, b: Logistic) => a.tipoMovimiento!.localeCompare(b.tipoMovimiento!),
      },
      {
        title: t('app.movements.inputs.header.ruc'),
        dataIndex: 'documentoResponsable',
        key: 'documentoResponsable',
        sorter: (a: Logistic, b: Logistic) => a.documentoResponsable!.localeCompare(b.documentoResponsable!),
      },
      {
        title: t('app.movements.inputs.header.supplier'),
        dataIndex: 'responsable',
        key: 'responsable',
        sorter: (a: Logistic, b: Logistic) => a.responsable!.localeCompare(b.responsable!),
      },            
      {
        title: t('app.movements.inputs.header.status'),
        dataIndex: 'activo',
        key: 'activo',
        // render: (_: any, record: Logistic) => record.activo ? t('table.column.active') : t('table.column.inactive'),
        render: (_: any, record: Logistic) => {
                const isActive = record.activo;
                return (
                  <Tag color={isActive ? 'green' : 'volcano'}>
                    {isActive ? t('table.column.active') : t('table.column.inactive')}
                  </Tag>
                );
              },        
        sorter: (a: Logistic, b: Logistic) =>
            Number(a.activo) - Number(b.activo),
      }
  ];
}