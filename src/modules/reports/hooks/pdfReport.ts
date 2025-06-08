import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import dayjs from 'dayjs';
import { Inventory } from "@/models/Inventory";

export function generatePDFReport(
    products: Inventory[],
    t: (id: string, values?: Record<string, any>) => string 
): void {

  if (products.length === 0) {
    console.error("No se proporcionaron datos para generar el reporte");
    return;
  }

  const doc = new jsPDF();

  // Se extrae el nombre del almacén y la fecha del primer registro
  const firstProduct = products[0];
  const title = t("app.reports.pdf.title", { item: firstProduct.almacen.toUpperCase() });
  //const fecha = new Date(firstProduct.fechaActual);
  const fecha = dayjs(firstProduct.fechaActual);  
  //const fechaStr = fecha.toLocaleDateString();
  const fechaStr = fecha.format("DD/MM/YYYY"); 
  const dateLabel = t("app.reports.pdf.date", { date: fechaStr });

  // Título centrado
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.text(title, pageWidth / 2, 15, { align: "center" });

  // Fecha (alineada a la izquierda)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  //doc.text(`Fecha: ${fechaStr}`, 10, 25);
  doc.text(dateLabel, 10, 25);

  // Definición de columnas con posición y ancho
  const totalWidth = 200; // ancho total de la tabla (se puede ajustar)
  const columns = [
    { header: t("app.reports.pdf.header.code"), key: "codigoProducto", x: 10, width: 20 },
    { header: t("app.reports.pdf.header.product"), key: "descripcion", x: 30, width: 70 },
    { header: t("app.reports.pdf.header.brand"), key: "marca", x: 105, width: 20 },
    { header: t("app.reports.pdf.header.model"), key: "modelo", x: 130, width: 30 },
    { header: t("app.reports.pdf.header.stock"), key: "stock", x: 165, width: 15 },
    { header: t("app.reports.pdf.header.unit"), key: "unidad", x: 185, width: 30 },    
  ];

  // Parámetros para la cabecera
  const headerStartY = 35;
  const lineHeight = 4; // altura aproximada por línea
  // Se baja la cabecera un poco para centrarla verticalmente en base a la segunda línea
  const headerOffset = headerStartY + lineHeight / 2;

  // Impresión de las cabeceras en mayúsculas y en negrita
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  columns.forEach(col => {
    // Se ajusta el texto al ancho de la columna
    const wrapped = doc.splitTextToSize(col.header, col.width);
    // Se fuerza que sean 2 líneas: si solo hay una, se agrega una línea vacía
    const lines = wrapped.length === 1 ? [wrapped[0], ""] : wrapped.slice(0, 2);
    // Se imprimen, usando headerOffset para centrar verticalmente con base en la segunda línea
    doc.text(lines[0].toUpperCase(), col.x, headerOffset);
    doc.text(lines[1].toUpperCase(), col.x, headerOffset + lineHeight);
  });

  // Líneas horizontales sobre y debajo de la cabecera
  const headerTop = headerOffset - 6;
  const headerBottom = headerOffset + 4.5;
  doc.setLineWidth(0.5);
  doc.line(10, headerTop, totalWidth, headerTop);
  doc.line(10, headerBottom, totalWidth, headerBottom);

  // Función para imprimir celdas ajustadas al ancho
  const printCell = (text: string, x: number, y: number, cellWidth: number): number => {
    const lines = doc.splitTextToSize(text, cellWidth);
    lines.forEach((line: any, i: any) => {
      doc.text(line, x, y + (lineHeight * i));
    });
    return lines.length;
  };

  // Se imprime el contenido de la tabla
  let currentY = headerBottom + 4; // iniciar debajo de las cabeceras con un pequeño margen
  doc.setFont("helvetica", 'normal');

  products.forEach((product, rowIndex) => {
    // Para cada celda se calcula cuántas líneas ocupa y se determina la altura de la fila
    const cellValues = {
      codigoProducto: product.codigoProducto.toString(),
      descripcion: product.descripcion,
      marca: product.marca,
      modelo: product.modelo,
      stock: product.stock.toString(),
      unidad: product.unidad
    };

    const lineCounts = columns.map(col => {
      const text = cellValues[col.key as keyof typeof cellValues];
      return doc.splitTextToSize(text, col.width).length;
    });
    const maxLines = Math.max(...lineCounts);

    // Imprimir cada celda
    columns.forEach(col => {
      const text = cellValues[col.key as keyof typeof cellValues];
      printCell(text, col.x, currentY, col.width);
    });

    // Se aumenta la posición vertical según el número máximo de líneas en la fila
    currentY += maxLines * lineHeight;

    // Agregar nueva página si se supera el límite (se considera un margen inferior de 20)
    if (currentY > 280 && rowIndex !== products.length - 1) {
      doc.addPage();
      currentY = 20;
    }
  });

  // Descarga el PDF generado
  //doc.save("inventario.pdf");
  const pdfBlob = doc.output("blob");
  saveAs(pdfBlob, "inventario.pdf");
}