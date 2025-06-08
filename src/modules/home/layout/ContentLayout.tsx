import React from 'react';
import { Layout } from 'antd';

const { Header, Content } = Layout;

interface ContentLayoutProps {
  title: React.ReactNode;
  headerExtras?: React.ReactNode; // Componentes adicionales para el Header
  children: React.ReactNode; // Contenido principal
}

export const ContentLayout: React.FC<ContentLayoutProps> = ({ title, headerExtras, children }) => {
  return (
    <Layout style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <Header
        style={{
          background: 'transparent',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          padding: '16px',
        }}
      >
        <div>{title}</div>
        <div>{headerExtras}</div>
      </Header>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start', 
          minHeight: '100vh', 
          padding: '20px',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          margin: '20px',
          overflow: 'hidden', 
          boxSizing: 'border-box', 
        }}
      >
        <div style={{ width: '100%' }}>{children}</div>
      </Content>
    </Layout>
  );
};