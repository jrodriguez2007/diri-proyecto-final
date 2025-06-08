import React from 'react';
import { Button, Table } from 'antd';
import { useTransform } from '@/hooks/useTransform';
import { LogisticDetail } from '@/models/LogisticDetail';
import { useDetailColumns } from '../hooks/DetailColumns';
import { DeleteFilled } from '@ant-design/icons';

interface DetailComponentProps {
  detalle: LogisticDetail[];
  onRemove?: (lineaId: number) => void;
}

export const DetailComponent: React.FC<DetailComponentProps> = ({ detalle, onRemove }) => {
  const { t } = useTransform();

  // Columnas base
  const baseColumns = useDetailColumns();
  
  // Si me pasaron un callback onRemove, agrego la columna Acciones
  const columns = onRemove
    ? [
        ...baseColumns,
        {
          title: t('table.header.actions'),
          key: 'actions',
          width: 80,
          render: (_: any, record: LogisticDetail) => (
            <Button
              type="text"
              icon={<DeleteFilled />}
              onClick={() => onRemove(record.idLinea)}
            />
          ),
        },
      ]
    : baseColumns;  

  if (!detalle || detalle.length === 0) {
    return <p>{t('app.movements.inputs.label.noDetail')}</p>;
  }

//  const detailColumns = useDetailColumns();  

  return (
    <div style={{ marginBottom: '2rem', border: '1px solid #f0f0f0', padding: '1rem' }}>
      <h5>{t('app.movements.inputs.titleDetail')}</h5>
      <Table
        dataSource={detalle}
        columns={columns}
        rowKey="idLinea"
        pagination={false}
        size="small"
        tableLayout="auto"
        data-testid="detail-table"        
      />
    </div>
  );
};
