import { ColumnType } from 'antd/es/table';
import { LogisticDetail } from '@/models/LogisticDetail';
import { useTransform } from '@/hooks/useTransform';

export const useDetailColumns = (): ColumnType<LogisticDetail>[] => {
  
  const { t } = useTransform();
    
  return [
    {
      title: t('app.movements.inputs.detail.line'),
      dataIndex: 'idLinea',
      key: 'idLinea',
    },
    {
      title: t('app.movements.inputs.detail.code'),
      dataIndex: 'codigo',
      key: 'codigo',
    },
    {
      title: t('app.movements.inputs.detail.description'),
      dataIndex: 'descripcionExtendida',
      key: 'descripcionExtendida',
    },
    {
      title: t('app.movements.inputs.detail.brand'),
      dataIndex: 'marca',
      key: 'marca',
    },
    {
      title: t('app.movements.inputs.detail.model'),
      dataIndex: 'modelo',
      key: 'modelo',
    },
    {
      title: t('app.movements.inputs.detail.quantity'),
      dataIndex: 'cantidad',
      key: 'cantidad',
    },
    {
      title: t('app.movements.inputs.detail.unit'),
      dataIndex: 'unidad',
      key: 'unidad',
    },
  ];
}