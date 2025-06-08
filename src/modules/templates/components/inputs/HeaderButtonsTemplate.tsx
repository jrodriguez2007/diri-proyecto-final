import React from "react";
import { Space, Input, Button } from "antd";
import { FormattedMessage } from "react-intl";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useTransform } from "@/hooks/useTransform";

interface HeaderButtonsProps {
  searchText: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showFilter?: boolean;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterClick?: () => void;
  onAddClick?: () => void;
}

export const HeaderButtonsTemplate: React.FC<HeaderButtonsProps> = ({
  searchText,
  searchPlaceholder,
  showSearch = true,
  showFilter = false,
  onSearchChange,
  onFilterClick,
  onAddClick,
}) => {
  const { t } = useTransform();

  // Si no llega placeholder, lo obtenemos aquí:
  const placeholder = searchPlaceholder ?? t("components.label.search");

  return (
    <Space direction="horizontal">
      {/* Input de búsqueda */}
      {showSearch && (
        <Input
          placeholder={placeholder}
          allowClear
          value={searchText}
          onChange={onSearchChange}
          prefix={<SearchOutlined />}
          style={{ width: "250px" }}
        />
      )}

      {/* Botón para aplicar un filtro adicional */}
      {showFilter && (
        <Button
          onClick={onFilterClick}
          icon={<FilterOutlined />}
          type="primary"
          className="bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent border-none shadow-none"
        />
      )}

      {/* Botón para agregar un nuevo registro */}
      <Button onClick={onAddClick} icon={<PlusOutlined />} type="primary">
        <FormattedMessage id="buttons.new" />
      </Button>
    </Space>
  );
};
