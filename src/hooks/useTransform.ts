import { PrimitiveType, useIntl } from "react-intl"

export const useTransform = () => {
  const intl = useIntl()

  return {
    t: (id: string, values?: Record<string,PrimitiveType>) => intl.formatMessage({id, defaultMessage: "Traducción no encontrada"}, values) 
  }
}