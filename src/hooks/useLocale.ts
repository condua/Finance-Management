import { useTranslation } from 'react-i18next'
import { LocalizationContext } from '@/src/contexts/LocalizationContext'
import { useContext } from 'react'

export const useLocale = () => {
  const { languageCode, languageTag, currencyCode, changeCurrency, changeLanguageTag, changeLanguage } = useContext(LocalizationContext)
  const { t } = useTranslation()
  return { languageCode, languageTag, currencyCode, changeCurrency, changeLanguageTag, changeLanguage, t }
}
