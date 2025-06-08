import React, { useEffect, useState } from 'react';
import { Select, Button, Typography, Form, Alert } from 'antd';

import { useTransform } from "@/hooks/useTransform";
import { useGetAllWarehousesQuery } from "@/modules/warehouses/store";
import { useLazyGetInventoryByIdWarehouseQuery } from '../store';
import { generatePDFReport, generateExcelReport } from '../hooks';
import { Inventory } from '@/models/Inventory';
import { Warehouse } from '@/models/Warehouse';
import LoggerService from '@/providers/LoggerService';

const { Title } = Typography;
const { Option } = Select;

export const ReportPage: React.FC = () => {
  const { t } = useTransform();

  // Estado local para el almacén seleccionado y mensajes de error
  const [selectedWarehouse, setSelectedWarehouse] = useState<number>(0);
  const [warehouseError, setWarehouseError] = useState<string>('');  

  // Cargar lista de almacenes
  const { data: warehousesData = [], isLoading: loadingWarehouses } = useGetAllWarehousesQuery(
    { page: 0, limit: 50 },
    { skip: false }
  );  
  const warehouses = warehousesData as Warehouse[]; 

  // Hook lazy para obtener inventario por almacén
  const [fetchInventory, { data: inventory, isFetching }] =
    useLazyGetInventoryByIdWarehouseQuery();

  // Cada vez que cambie warehouse, limpiar error
  useEffect(() => {
    if (selectedWarehouse !== 0) {
      setWarehouseError('');
    }
  }, [selectedWarehouse]);

  // Validación simple
  const validarAlmacen = (): boolean => {
    if (selectedWarehouse === 0) {
      setWarehouseError(t('app.reports.validations.idAlmacen') || t('app.reports.label.warehouse'));
      return false;
    }
    return true;
  };
  
  // Generar PDF
  const procesarPDF = async () => {
    if (!validarAlmacen()) return;
    try {
      const inv = await fetchInventory(selectedWarehouse).unwrap();
      generatePDFReport(inv as Inventory[], t);
      LoggerService.info('Generación exitosa de reporte en PDF');
    } catch (err) {
      LoggerService.error('Error al generar PDF');
      console.error('Error al generar PDF:', err);
    }
  };
  
  // Generar Excel
  const procesarExcel = async () => {
    if (!validarAlmacen()) return;
    try {
      const inv = await fetchInventory(selectedWarehouse).unwrap();
      generateExcelReport(inv as Inventory[], t);
      LoggerService.info('Generación exitosa de reporte en Excel');
    } catch (err) {
      LoggerService.error('Error al generar Excel');
      console.error('Error al generar Excel:', err);
    }
  };  

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>{t('app.reports.title')}</Title>

      <Form layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item label={t('app.reports.label.warehouse')}>
          <Select
            style={{ width: 200 }}
            placeholder={t('app.reports.select.warehouse')}
            value={selectedWarehouse || undefined}
            onChange={value => setSelectedWarehouse(value)}
            loading={loadingWarehouses}
          >
            {warehouses.map(w => (
              <Option key={w.id} value={w.id}>
                {w.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={procesarPDF} loading={isFetching}>
            {t('app.reports.buttons.pdf')}
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="default" onClick={procesarExcel} loading={isFetching}>
            {t('app.reports.buttons.xls')}
          </Button>
        </Form.Item>
      </Form>

      {warehouseError && (
        <Alert
          type="error"
          message={warehouseError}
          style={{ marginBottom: 16 }}
        />
      )}
    </div>
  );
};
