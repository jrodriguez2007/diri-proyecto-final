// HomeLayout.tsx
import React, { useState } from "react";
import { Layout, theme } from "antd";
import { useLocation, useMatch } from "react-router-dom";
import { Navbar } from "../components/Navbar";
// – import { items } from "../components/Sidebar"; // ya no hace falta
import { Sidebar } from "../components/Sidebar"; // ahora importamos el componente
import { Footer } from "../components/Footer";
import "../styles/HomeLayout.scss";

const { Sider, Content } = Layout;
const { useToken } = theme;

interface HomeLayoutProps {
  children: React.ReactNode;
}

export const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  const [collapsed] = useState(false);
  const isAuthRoute = useMatch("/auth/*");
  const { token } = useToken();

  const location = useLocation();

  // Si es ruta de auth devolvemos sólo el contenido (sin Navbar ni Sidebar)
  if (isAuthRoute) return <>{children}</>;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* CABECERA */}
      <Navbar />

      <Layout>
        {/* BARRA LATERAL */}
        <Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
          width={200}
          style={{
            background: token.colorBgContainer,
            borderRight: "1px solid #f0f0f0",
          }}
        >
          {/* Mostramos el componente Sidebar (que internamente lee localStorage) */}
          <Sidebar />
        </Sider>

        {/* CONTENIDO PRINCIPAL */}
        <Layout style={{ padding: "24px" }}>
          <Content
            style={{
              margin: 0,
              minHeight: 280,
              background: token.colorBgContainer,
            }}
          >
            {children}
          </Content>
        </Layout>

        {/* PIE DE PÁGINA */}
        <Footer />
      </Layout>
    </Layout>
  );
};
