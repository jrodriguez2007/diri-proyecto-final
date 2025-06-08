import { LanguageContext } from "@/providers/LanguageProvider";
import { useContext } from "react";

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (context == undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
};