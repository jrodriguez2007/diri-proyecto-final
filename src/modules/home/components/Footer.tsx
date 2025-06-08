import React from 'react';
import { Layout, Typography } from 'antd';
import { useTransform } from '@/hooks/useTransform';
import '../styles/Footer.scss';

const { Text } = Typography;

export const Footer: React.FC = () => {
  const { t } = useTransform();
  const year = new Date().getFullYear();

  return (
    <Layout.Footer className="app-footer">
      <div className="app-footer__content">
        <Text>© {year} – {t('app.layout.footer.reservedRights')}</Text>
        <nav className="app-footer__nav">
          <a href="/privacy">{t('app.layout.footer.politics')}</a>
          <a href="/terms">{t('app.layout.footer.terms')}</a>
        </nav>
      </div>
    </Layout.Footer>
  );
};
