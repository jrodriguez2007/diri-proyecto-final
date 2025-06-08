import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from "antd";

import { store } from "@/store/store";
import { BuildProvidersTree } from "@/providers/BuildProvidersTree";
import { LanguageProvider } from "@/providers/LanguageProvider";
import loggerService from '@/providers/LoggerService';
import App from '@/App'

import "@/index.css";
import "@ant-design/v5-patch-for-react-19";

const level = (import.meta.env.VITE_APP_LOG_LEVEL as
  | "debug"
  | "info"
  | "warn"
  | "error") || "debug";
loggerService.setLevel(level);

// Primer mensaje
loggerService.info(`⚙️  Arrancando la app con LogLevel=${level}`);

const AppProvider = BuildProvidersTree([
  [LanguageProvider],
  [Provider, { store }],
  [BrowserRouter],
  [ConfigProvider],
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
)
