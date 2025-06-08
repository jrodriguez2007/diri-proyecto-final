import enMessages from "@/lang/en.json";
import esMessages from "@/lang/es.json";
import { createContext, ReactNode, useState } from "react";
import { IntlProvider } from "react-intl";

interface LanguageContextProps {
  locale: string;
  messages: Record<string, string>;
  changeLanguage: (lang: string) => void;
}
const messagesMap: { [key: string]: Record<string, string> } = {
  en: enMessages,
  es: esMessages,
};

export const LanguageContext = createContext<LanguageContextProps>({
  locale: "en",
  messages: enMessages,
  changeLanguage: () => {},
});

interface LanguageProviderProps {
  children: ReactNode;
  storageKey: string;
}
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  storageKey = "vite-locale",
}) => {
  const initialLocale = navigator.language.startsWith("es") ? "es" : "en";
  const [locale, setLocale] = useState<string>(
    () => localStorage.getItem(storageKey) || initialLocale
  );

  const value = {
    locale,
    messages: messagesMap[locale],
    changeLanguage: (locale: string) => {
      localStorage.setItem(storageKey, locale);
      setLocale(locale);
    },
  };

  return (
    <LanguageContext.Provider value={value}>
      <IntlProvider locale={value.locale} messages={value.messages}>
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};
