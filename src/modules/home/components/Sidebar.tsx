import React, { useMemo } from "react";
import {
  HomeOutlined,
  ShoppingOutlined,
  SwapOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { FormattedMessage } from "react-intl";
import { Link, useLocation } from "react-router-dom";

type MenuItem = Required<React.ComponentProps<typeof Menu>>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return { key, icon, children, label } as MenuItem;
}

export const Sidebar: React.FC = () => {
  const location = useLocation();
  // Leemos localStorage dentro del componente, en cada render:
  const currentUser = localStorage.getItem("idUsuario");

  // Creamos el array de items usando useMemo, para que sólo se reevalúe cuando cambie currentUser
  const items: MenuItem[] = useMemo(() => {
    const baseItems: MenuItem[] = [
      getItem(
        <Link to="/logistic/">
          <FormattedMessage id="app.menu.home" />
        </Link>,
        "/logistic/",
        <HomeOutlined />
      ),
    ];

    // Si el usuario es "jrodriguez", incluimos la ruta de Productos:
    if (currentUser === "jrodriguez") {
      baseItems.push(
        getItem(
          <Link to="/logistic/products">
            <FormattedMessage id="app.menu.products" />
          </Link>,
          "/logistic/products",
          <ShoppingOutlined />
        )
      );
    }

    // El resto de rutas siempre van:
    baseItems.push(
      getItem(
        <Link to="/logistic/inputs">
          <FormattedMessage id="app.menu.movements" />
        </Link>,
        "/logistic/inputs",
        <SwapOutlined />
      ),
      getItem(
        <Link to="/logistic/outputs">
          <FormattedMessage id="app.menu.outputs" />
        </Link>,
        "/logistic/outputs",
        <SwapOutlined />
      ),
      getItem(
        <Link to="/logistic/reports">
          <FormattedMessage id="app.menu.reports" />
        </Link>,
        "/logistic/reports",
        <BarChartOutlined />
      )
    );

    return baseItems;
  }, [currentUser]);

  return (
    <Menu mode="inline" selectedKeys={[location.pathname]} items={items} />
  );
};
