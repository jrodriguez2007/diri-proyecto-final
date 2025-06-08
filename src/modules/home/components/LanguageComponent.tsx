import React from 'react'
import { Select } from 'antd'
import { FormattedMessage } from 'react-intl'
import { DownOutlined } from '@ant-design/icons'
import { useLanguage } from '@/hooks/useLanguage'

import styles from '../styles/Selector.scss'

const LANGUAGES = [
  { code: 'es', messageId: 'spanish', flagUrl: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/es.svg' },
  { code: 'en', messageId: 'english', flagUrl: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/gb.svg' },
]

const LanguageOption: React.FC<{ flagUrl: string; label: React.ReactNode }> = React.memo(
  ({ flagUrl, label }) => (
    <span className="inline-flex items-center gap-2">
      <img src={flagUrl} alt="" width={20} height={15} />
      {label}
    </span>
  )
)

export const LanguageSelector: React.FC = () => {
  const { locale, changeLanguage } = useLanguage()

  const options = React.useMemo(
    () =>
      LANGUAGES.map(({ code, messageId, flagUrl }) => ({
        value: code,
        label: (
          <LanguageOption
            flagUrl={flagUrl}
            label={<FormattedMessage id={messageId} />}
          />
        ),
      })),
    []
  )

  return (
    <Select
      className="selector"
      value={locale}
      onChange={changeLanguage}
      options={options}
      optionLabelProp="label"          // ← muestra el label custom también cuando está seleccionado
      suffixIcon={<DownOutlined style={{ verticalAlign: 'middle' }} />}
      // className="inline-flex items-center" // ← alinea bandera+texto+icono
      style={{ minWidth: 140 }}
      dropdownStyle={{ minWidth: 140 }}
    />
  )
}
