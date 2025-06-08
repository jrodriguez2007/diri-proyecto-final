import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Row, Col, Select, Space, Typography, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useTransform } from '@/hooks/useTransform';
import { useLanguage } from '@/hooks/useLanguage';
import logo from '@/assets/logo.png';
import '../styles/Navbar.scss';
import { LanguageSelector } from './LanguageComponent';

const { Header } = Layout;
const { Text } = Typography;

// const flagIcons: Record<string, React.ReactNode> = {
//   es: (
//     <img
//       src="https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/es.svg"
//       alt="ES"
//       className="w-5"
//     />
//   ),
//   en: (
//     <img
//       src="https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/gb.svg"
//       alt="EN"
//       className="w-5"
//     />
//   ),
// };

export const Navbar: React.FC = () => {
  const { t } = useTransform();
  const navigate = useNavigate();
  // const { locale, changeLanguage } = useLanguage();

  const clienteRaw = localStorage.getItem('cliente') || '';
  const nombreUsuario = clienteRaw;

  // const languageOptions = [
  //   { label: 'Español', value: 'es' },
  //   { label: 'English', value: 'en' },
  // ];

  const onLogout = () => {
    // Borra todas las claves relacionadas con la sesión
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('cliente');
    // redirige a /auth/login
    navigate('/auth/login');
  };

  return (
    <Header className="app-header" style={{ padding: '0 24px' }}>
      <Row align="middle" justify="space-between" style={{ height: '100%' }}>
        {/* Logo y título */}
        <Col>
          <Row align="middle" gutter={12}>
            <Col>
              <img src={logo} alt="Logo" height={32} className='logo-location' />
            </Col>
            <Col>
              <Text strong style={{ color: '#fff', fontSize: 18 }}>
                {t('app.layout.navbar.title')}
              </Text>
            </Col>
          </Row>
        </Col>

        {/* Selector de idioma, usuario y logout */}
        <Col>
          <Space size="middle" align="center">
            {/* <Select
              value={locale}
              onChange={changeLanguage}
              options={languageOptions}
              style={{ width: 120 }}
            /> */}
            <LanguageSelector />

            <Text style={{ color: '#fff' }}>
              <strong>{t('app.layout.navbar.user')}:</strong> {nombreUsuario}
            </Text>

            <Button
              type="text"
              icon={<LogoutOutlined style={{ color: '#fff', fontSize: 16 }} />}
              onClick={onLogout}
            />
          </Space>
        </Col>
      </Row>
    </Header>
  );
};
