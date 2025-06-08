import React from 'react';
import { Table, } from 'antd';
import type { ColumnType, TableProps } from 'antd/es/table';

// Props para TableTemplate
interface TableTemplateProps<T> {
  data: T[]; // Datos a mostrar en la tabla. el Json de OOH4RIA, por ejemplo
  columns: ColumnType<T>[];
  expandable?: TableProps<T>['expandable'];
}

export const TableTemplate = <T extends object>({
  data,
  columns,
  expandable

}: TableTemplateProps<T>): React.ReactElement => {
  // Add action column logic

  // Combine passed columns with action colum

  return (
    <Table<T>
      rowKey="id"
      columns={columns}
      dataSource={data}
      expandable={expandable}
      rowClassName={(_, index) => (index % 2 === 0 ? 'bg-gray-100' : 'bg-white')}
      pagination={false}
    />
  );
};

