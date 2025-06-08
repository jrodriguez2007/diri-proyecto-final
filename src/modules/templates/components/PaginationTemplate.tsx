import React, { useState } from "react";
import { Pagination } from "antd";
import { useTransform } from "@/hooks/useTransform";
// import '../styles/PaginationStyles.css'; // Importa los estilos CSS necesarios

// Interfaz para la Paginacion de Ant Design
interface PaginationTemplateProps {
  total: number;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  onPageChange?: (data: { currentPage: number; pageSize: number }) => void;
}

export const PaginationTemplate: React.FC<PaginationTemplateProps> = ({
  total,
  pageSizeOptions = [5, 10, 20, 50],
  defaultPageSize = 1,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const { t } = useTransform();

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
    if (onPageChange) {
      onPageChange({ currentPage: page, pageSize: size || pageSize });
    }
  };

  return (
    <div>
      <Pagination
        align="center"
        current={currentPage}
        total={total}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        showSizeChanger
        onChange={handlePageChange}
        locale={{ items_per_page: t("components.pagination.locale") }}
      />
    </div>
  );
};
