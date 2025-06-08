import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Inventory } from '@/models/Inventory';

export function generateExcelReport(
    products: Inventory[],
    t: (id: string, values?: Record<string, any>) => string
): void {
  if (products.length === 0) {
    console.error("No se proporcionaron datos para generar el reporte");
    return;
  }
  
  const data = products.map(product => ({
    [t('app.reports.xls.header.warehouse')]: product.almacen,
    [t('app.reports.xls.header.date')]: formatDate(product.fechaActual),
    [t('app.reports.xls.header.code')]: product.codigoProducto,
    [t('app.reports.xls.header.product')]: product.descripcion,
    [t('app.reports.xls.header.brand')]: product.marca,
    [t('app.reports.xls.header.model')]: product.modelo,
    [t('app.reports.xls.header.stock')]: product.stock,
    [t('app.reports.xls.header.unit')]: product.unidad,    

  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reporte");

  // Genera un array buffer
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], {
    type: 'application/octet-stream',
  });
  saveAs(blob, 'inventario.xlsx');
}

function formatDate(raw: string | Date): string {
  const d = raw instanceof Date ? raw : new Date(raw);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}